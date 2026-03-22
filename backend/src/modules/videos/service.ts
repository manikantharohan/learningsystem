import { db } from '../../config/database';

export interface Video {
    id: string;
    section_id: string;
    title: string;
    description: string | null;
    youtube_url: string;
    youtube_video_id: string;
    order_index: number;
    duration_seconds: number;
}

export interface VideoWithProgress extends Video {
    is_completed: boolean;
    last_position_seconds: number;
    is_locked: boolean;
}

export const getVideoById = async (id: string): Promise<Video | null> => {
    return db.queryOne<Video>('SELECT * FROM videos WHERE id = ?', [id]);
};

export const getVideoWithContext = async (
    videoId: string, 
    userId?: string
): Promise<{ video: Video; nextVideo: Video | null; prevVideo: Video | null } | null> => {
    const video = await getVideoById(videoId);
    if (!video) return null;

    // Get next video in sequence
    const nextVideo = await db.queryOne<Video>(`
        SELECT v.* FROM videos v
        INNER JOIN sections s ON v.section_id = s.id
        WHERE s.id = ? AND v.order_index > ?
        ORDER BY v.order_index ASC
        LIMIT 1
    `, [video.section_id, video.order_index]);

    // If no next video in same section, check next section
    let nextVideoResult = nextVideo;
    if (!nextVideoResult) {
        const section = await db.queryOne<{ subject_id: string; order_index: number }>(
            'SELECT subject_id, order_index FROM sections WHERE id = ?',
            [video.section_id]
        );
        
        if (section) {
            const nextSectionVideo = await db.queryOne<Video>(`
                SELECT v.* FROM videos v
                INNER JOIN sections s ON v.section_id = s.id
                WHERE s.subject_id = ? AND s.order_index > ?
                ORDER BY s.order_index ASC, v.order_index ASC
                LIMIT 1
            `, [section.subject_id, section.order_index]);
            
            nextVideoResult = nextSectionVideo;
        }
    }

    // Get previous video in sequence
    const prevVideo = await db.queryOne<Video>(`
        SELECT v.* FROM videos v
        INNER JOIN sections s ON v.section_id = s.id
        WHERE s.id = ? AND v.order_index < ?
        ORDER BY v.order_index DESC
        LIMIT 1
    `, [video.section_id, video.order_index]);

    let prevVideoResult = prevVideo;
    if (!prevVideoResult) {
        const section = await db.queryOne<{ subject_id: string; order_index: number }>(
            'SELECT subject_id, order_index FROM sections WHERE id = ?',
            [video.section_id]
        );
        
        if (section) {
            const prevSectionVideo = await db.queryOne<Video>(`
                SELECT v.* FROM videos v
                INNER JOIN sections s ON v.section_id = s.id
                WHERE s.subject_id = ? AND s.order_index < ?
                ORDER BY s.order_index DESC, v.order_index DESC
                LIMIT 1
            `, [section.subject_id, section.order_index]);
            
            prevVideoResult = prevSectionVideo;
        }
    }

    return {
        video,
        nextVideo: nextVideoResult,
        prevVideo: prevVideoResult
    };
};

export const checkVideoLockStatus = async (
    videoId: string, 
    userId: string
): Promise<{ isLocked: boolean; reason?: string }> => {
    const video = await getVideoById(videoId);
    if (!video) {
        return { isLocked: true, reason: 'Video not found' };
    }

    // Get the first video of the course
    const section = await db.queryOne<{ subject_id: string }>(
        'SELECT subject_id FROM sections WHERE id = ?',
        [video.section_id]
    );

    if (!section) {
        return { isLocked: true, reason: 'Section not found' };
    }

    const firstVideo = await db.queryOne<Video>(`
        SELECT v.* FROM videos v
        INNER JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ?
        ORDER BY s.order_index ASC, v.order_index ASC
        LIMIT 1
    `, [section.subject_id]);

    // First video is always unlocked
    if (firstVideo && firstVideo.id === videoId) {
        return { isLocked: false };
    }

    // Get previous video
    const prevVideo = await db.queryOne<Video>(`
        SELECT v.* FROM videos v
        INNER JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ? AND (
            (s.order_index < (SELECT order_index FROM sections WHERE id = ?)) OR
            (s.order_index = (SELECT order_index FROM sections WHERE id = ?) AND v.order_index < ?)
        )
        ORDER BY s.order_index DESC, v.order_index DESC
        LIMIT 1
    `, [section.subject_id, video.section_id, video.section_id, video.order_index]);

    if (!prevVideo) {
        return { isLocked: false };
    }

    // Check if previous video is completed
    const progress = await db.queryOne<{ is_completed: boolean }>(
        'SELECT is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
        [userId, prevVideo.id]
    );

    if (!progress || !progress.is_completed) {
        return { 
            isLocked: true, 
            reason: `Complete "${prevVideo.title}" to unlock this lesson` 
        };
    }

    return { isLocked: false };
};
