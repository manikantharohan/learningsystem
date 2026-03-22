import { db } from '../../config/database';

export interface VideoProgress {
    id: string;
    user_id: string;
    video_id: string;
    last_position_seconds: number;
    is_completed: boolean;
    completed_at: Date | null;
}

export interface SubjectProgress {
    subjectId: string;
    totalVideos: number;
    completedVideos: number;
    progressPercentage: number;
    totalTimeSpent: number;
}

export const getVideoProgress = async (
    userId: string, 
    videoId: string
): Promise<VideoProgress | null> => {
    return db.queryOne<VideoProgress>(
        'SELECT * FROM video_progress WHERE user_id = ? AND video_id = ?',
        [userId, videoId]
    );
};

export const updateVideoProgress = async (
    userId: string,
    videoId: string,
    data: {
        lastPositionSeconds?: number;
        isCompleted?: boolean;
    }
): Promise<VideoProgress> => {
    const existing = await getVideoProgress(userId, videoId);

    if (existing) {
        // Update existing progress
        const updates: string[] = [];
        const values: any[] = [];

        if (data.lastPositionSeconds !== undefined) {
            updates.push('last_position_seconds = ?');
            values.push(data.lastPositionSeconds);
        }

        if (data.isCompleted !== undefined && data.isCompleted && !existing.is_completed) {
            updates.push('is_completed = ?');
            values.push(true);
            updates.push('completed_at = ?');
            values.push(new Date());
        }

        if (updates.length > 0) {
            values.push(userId);
            values.push(videoId);
            await db.query(
                `UPDATE video_progress SET ${updates.join(', ')} WHERE user_id = ? AND video_id = ?`,
                values
            );
        }
    } else {
        // Create new progress
        await db.query(
            `INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed, completed_at) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                userId, 
                videoId, 
                data.lastPositionSeconds || 0,
                data.isCompleted || false,
                data.isCompleted ? new Date() : null
            ]
        );
    }

    const progress = await getVideoProgress(userId, videoId);
    if (!progress) {
        throw new Error('Failed to update progress');
    }
    return progress;
};

export const getSubjectProgress = async (
    userId: string,
    subjectId: string
): Promise<SubjectProgress> => {
    // Get total videos in subject
    const totalResult = await db.queryOne<{ count: number }>(`
        SELECT COUNT(v.id) as count 
        FROM videos v
        INNER JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ?
    `, [subjectId]);

    const totalVideos = totalResult?.count || 0;

    // Get completed videos
    const completedResult = await db.queryOne<{ count: number }>(`
        SELECT COUNT(vp.id) as count 
        FROM video_progress vp
        INNER JOIN videos v ON vp.video_id = v.id
        INNER JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ? AND vp.user_id = ? AND vp.is_completed = TRUE
    `, [subjectId, userId]);

    const completedVideos = completedResult?.count || 0;

    // Get total time spent
    const timeResult = await db.queryOne<{ total: number }>(`
        SELECT COALESCE(SUM(last_position_seconds), 0) as total 
        FROM video_progress vp
        INNER JOIN videos v ON vp.video_id = v.id
        INNER JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ? AND vp.user_id = ?
    `, [subjectId, userId]);

    const totalTimeSpent = timeResult?.total || 0;

    return {
        subjectId,
        totalVideos,
        completedVideos,
        progressPercentage: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
        totalTimeSpent
    };
};

export const getLastWatchedVideo = async (
    userId: string,
    subjectId: string
): Promise<{ videoId: string; position: number } | null> => {
    const result = await db.queryOne<{ video_id: string; last_position_seconds: number }>(`
        SELECT vp.video_id, vp.last_position_seconds
        FROM video_progress vp
        INNER JOIN videos v ON vp.video_id = v.id
        INNER JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ? AND vp.user_id = ?
        ORDER BY vp.updated_at DESC
        LIMIT 1
    `, [subjectId, userId]);

    if (!result) return null;

    return {
        videoId: result.video_id,
        position: result.last_position_seconds
    };
};

export const getAllSubjectProgress = async (userId: string): Promise<SubjectProgress[]> => {
    const subjects = await db.query<{ id: string }>(
        'SELECT s.id FROM subjects s INNER JOIN enrollments e ON s.id = e.subject_id WHERE e.user_id = ?',
        [userId]
    );

    const progressPromises = subjects.map(s => getSubjectProgress(userId, s.id));
    return Promise.all(progressPromises);
};
