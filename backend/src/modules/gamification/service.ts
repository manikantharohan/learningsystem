import { db } from '../../config/database';

export interface UserXP {
    total_xp: number;
    current_level: number;
    level_title: string;
}

export interface UserStreak {
    current_streak: number;
    longest_streak: number;
    last_activity_date: Date | null;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
    xp_reward: number;
    requirement_type: string;
    requirement_value: number;
    unlocked_at?: Date;
}

// Level thresholds
const LEVELS = [
    { level: 1, title: 'Beginner', xpRequired: 0 },
    { level: 2, title: 'Novice', xpRequired: 100 },
    { level: 3, title: 'Apprentice', xpRequired: 300 },
    { level: 4, title: 'Intermediate', xpRequired: 600 },
    { level: 5, title: 'Advanced', xpRequired: 1000 },
    { level: 6, title: 'Expert', xpRequired: 1500 },
    { level: 7, title: 'Master', xpRequired: 2200 },
    { level: 8, title: 'Grandmaster', xpRequired: 3000 },
];

// XP rewards
const XP_REWARDS = {
    VIDEO_COMPLETED: 50,
    SECTION_COMPLETED: 100,
    COURSE_COMPLETED: 500,
    DAILY_STREAK: 20,
    PERFECT_QUIZ: 30,
};

export const getUserXP = async (userId: string): Promise<UserXP> => {
    const result = await db.queryOne<UserXP>(
        'SELECT total_xp, current_level, level_title FROM user_xp WHERE user_id = ?',
        [userId]
    );

    if (!result) {
        await db.query('INSERT INTO user_xp (user_id) VALUES (?)', [userId]);
        return { total_xp: 0, current_level: 1, level_title: 'Beginner' };
    }

    return result;
};

export const addXP = async (userId: string, amount: number, reason: string): Promise<UserXP> => {
    const currentXP = await getUserXP(userId);
    const newTotalXP = currentXP.total_xp + amount;

    // Calculate new level
    let newLevel = currentXP.current_level;
    let newTitle = currentXP.level_title;

    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (newTotalXP >= LEVELS[i].xpRequired) {
            newLevel = LEVELS[i].level;
            newTitle = LEVELS[i].title;
            break;
        }
    }

    await db.query(
        'UPDATE user_xp SET total_xp = ?, current_level = ?, level_title = ? WHERE user_id = ?',
        [newTotalXP, newLevel, newTitle, userId]
    );

    return {
        total_xp: newTotalXP,
        current_level: newLevel,
        level_title: newTitle,
    };
};

export const getUserStreak = async (userId: string): Promise<UserStreak> => {
    const result = await db.queryOne<UserStreak>(
        'SELECT current_streak, longest_streak, last_activity_date FROM user_streaks WHERE user_id = ?',
        [userId]
    );

    if (!result) {
        await db.query('INSERT INTO user_streaks (user_id) VALUES (?)', [userId]);
        return { current_streak: 0, longest_streak: 0, last_activity_date: null };
    }

    return result;
};

export const updateStreak = async (userId: string): Promise<UserStreak> => {
    const streak = await getUserStreak(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = streak.current_streak;
    let newLongest = streak.longest_streak;

    if (streak.last_activity_date) {
        const lastDate = new Date(streak.last_activity_date);
        lastDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            newStreak += 1;
        } else if (diffDays > 1) {
            // Streak broken
            newStreak = 1;
        }
        // If diffDays === 0, same day, don't update
    } else {
        newStreak = 1;
    }

    if (newStreak > newLongest) {
        newLongest = newStreak;
    }

    await db.query(
        'UPDATE user_streaks SET current_streak = ?, longest_streak = ?, last_activity_date = ? WHERE user_id = ?',
        [newStreak, newLongest, today, userId]
    );

    // Award XP for streak milestones
    if (newStreak > streak.current_streak && newStreak % 7 === 0) {
        await addXP(userId, XP_REWARDS.DAILY_STREAK * 2, `Weekly streak: ${newStreak} days`);
    }

    return {
        current_streak: newStreak,
        longest_streak: newLongest,
        last_activity_date: today,
    };
};

export const getAchievements = async (userId: string): Promise<Achievement[]> => {
    const achievements = await db.query<Achievement>(`
        SELECT a.*, ua.unlocked_at 
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
        ORDER BY a.xp_reward DESC
    `, [userId]);

    return achievements;
};

export const checkAndUnlockAchievements = async (userId: string): Promise<Achievement[]> => {
    const unlocked: Achievement[] = [];

    // Get user stats
    const xp = await getUserXP(userId);
    const completedVideos = await db.queryOne<{ count: number }>(
        'SELECT COUNT(*) as count FROM video_progress WHERE user_id = ? AND is_completed = TRUE',
        [userId]
    );
    const completedCourses = await db.queryOne<{ count: number }>(`
        SELECT COUNT(DISTINCT s.subject_id) as count 
        FROM video_progress vp
        INNER JOIN videos v ON vp.video_id = v.id
        INNER JOIN sections s ON v.section_id = s.id
        WHERE vp.user_id = ? AND vp.is_completed = TRUE
        GROUP BY s.subject_id
        HAVING COUNT(vp.id) = (SELECT COUNT(*) FROM videos v2 INNER JOIN sections s2 ON v2.section_id = s2.id WHERE s2.subject_id = s.subject_id)
    `, [userId]);

    // Check achievements
    const achievements = await db.query<Achievement>('SELECT * FROM achievements');

    for (const achievement of achievements) {
        const alreadyUnlocked = await db.queryOne(
            'SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
            [userId, achievement.id]
        );

        if (alreadyUnlocked) continue;

        let shouldUnlock = false;

        switch (achievement.requirement_type) {
            case 'xp_total':
                shouldUnlock = xp.total_xp >= achievement.requirement_value;
                break;
            case 'videos_completed':
                shouldUnlock = (completedVideos?.count || 0) >= achievement.requirement_value;
                break;
            case 'courses_completed':
                shouldUnlock = (completedCourses?.count || 0) >= achievement.requirement_value;
                break;
        }

        if (shouldUnlock) {
            await db.query(
                'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                [userId, achievement.id]
            );
            await addXP(userId, achievement.xp_reward, `Achievement unlocked: ${achievement.name}`);
            unlocked.push(achievement);
        }
    }

    return unlocked;
};

export const getGamificationProfile = async (userId: string) => {
    const [xp, streak, achievements] = await Promise.all([
        getUserXP(userId),
        getUserStreak(userId),
        getAchievements(userId),
    ]);

    // Calculate next level XP
    const currentLevelIndex = LEVELS.findIndex(l => l.level === xp.current_level);
    const nextLevel = LEVELS[currentLevelIndex + 1];
    const xpToNextLevel = nextLevel ? nextLevel.xpRequired - xp.total_xp : 0;

    return {
        xp,
        streak,
        achievements,
        xpToNextLevel,
        nextLevel: nextLevel || null,
    };
};

export const awardVideoCompletionXP = async (userId: string): Promise<void> => {
    await addXP(userId, XP_REWARDS.VIDEO_COMPLETED, 'Video completed');
    await updateStreak(userId);
    await checkAndUnlockAchievements(userId);
};

export { XP_REWARDS, LEVELS };
