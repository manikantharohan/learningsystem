import { db } from '../../config/database';

export interface Subject {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    is_published: boolean;
    total_duration_seconds: number;
    category: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    estimated_hours: number;
    instructor: string | null;
    tags: string[] | null;
    is_featured: boolean;
    created_at: Date;
}

export interface Section {
    id: string;
    subject_id: string;
    title: string;
    order_index: number;
    videos: Video[];
}

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

export interface SubjectTree extends Subject {
    sections: Section[];
    video_count: number;
}

export interface SubjectFilters {
    category?: string;
    difficulty?: string;
    search?: string;
    featured?: boolean;
}

// Get all unique categories
export const getCategories = async (): Promise<string[]> => {
    const results = await db.query<{ category: string }>(
        'SELECT DISTINCT category FROM subjects WHERE is_published = TRUE ORDER BY category'
    );
    return results.map(r => r.category);
};

// Get all subjects with optional filtering
export const getAllSubjects = async (filters?: SubjectFilters, onlyPublished: boolean = true): Promise<Subject[]> => {
    let query = 'SELECT * FROM subjects';
    const params: any[] = [];
    const conditions: string[] = [];

    if (onlyPublished) {
        conditions.push('is_published = TRUE');
    }

    if (filters) {
        if (filters.category) {
            conditions.push('category = ?');
            params.push(filters.category);
        }
        if (filters.difficulty) {
            conditions.push('difficulty_level = ?');
            params.push(filters.difficulty);
        }
        if (filters.search) {
            conditions.push('(title LIKE ? OR description LIKE ? OR instructor LIKE ?)');
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        if (filters.featured) {
            conditions.push('is_featured = TRUE');
        }
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY is_featured DESC, created_at DESC';

    return db.query<Subject>(query, params);
};

// Get featured subjects
export const getFeaturedSubjects = async (): Promise<Subject[]> => {
    return db.query<Subject>(
        'SELECT * FROM subjects WHERE is_published = TRUE AND is_featured = TRUE ORDER BY created_at DESC LIMIT 6'
    );
};

export const getSubjectById = async (id: string): Promise<Subject | null> => {
    return db.queryOne<Subject>('SELECT * FROM subjects WHERE id = ?', [id]);
};

export const getSubjectBySlug = async (slug: string): Promise<Subject | null> => {
    return db.queryOne<Subject>('SELECT * FROM subjects WHERE slug = ? AND is_published = TRUE', [slug]);
};

export const getSubjectTree = async (subjectId: string): Promise<SubjectTree | null> => {
    const subject = await getSubjectById(subjectId);
    if (!subject) return null;

    const sections = await db.query<Section>(
        'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC',
        [subjectId]
    );

    const sectionsWithVideos: Section[] = [];
    let totalVideos = 0;
    
    for (const section of sections) {
        const videos = await db.query<Video>(
            'SELECT * FROM videos WHERE section_id = ? ORDER BY order_index ASC',
            [section.id]
        );
        totalVideos += videos.length;
        
        sectionsWithVideos.push({
            ...section,
            videos
        });
    }

    return {
        ...subject,
        sections: sectionsWithVideos,
        video_count: totalVideos
    };
};

export const getSubjectTreeBySlug = async (slug: string): Promise<SubjectTree | null> => {
    const subject = await getSubjectBySlug(slug);
    if (!subject) return null;
    return getSubjectTree(subject.id);
};

export const isUserEnrolled = async (userId: string, subjectId: string): Promise<boolean> => {
    const enrollment = await db.queryOne(
        'SELECT id FROM enrollments WHERE user_id = ? AND subject_id = ?',
        [userId, subjectId]
    );
    return !!enrollment;
};

export const enrollUser = async (userId: string, subjectId: string): Promise<void> => {
    const alreadyEnrolled = await isUserEnrolled(userId, subjectId);
    if (alreadyEnrolled) {
        throw Object.assign(new Error('Already enrolled in this course'), { statusCode: 409 });
    }

    await db.query(
        'INSERT INTO enrollments (user_id, subject_id) VALUES (?, ?)',
        [userId, subjectId]
    );
};

export const getUserEnrollments = async (userId: string): Promise<Subject[]> => {
    return db.query<Subject>(`
        SELECT s.* FROM subjects s
        INNER JOIN enrollments e ON s.id = e.subject_id
        WHERE e.user_id = ? AND s.is_published = TRUE
        ORDER BY e.created_at DESC
    `, [userId]);
};

// Get enrolled subjects with progress
export const getUserEnrollmentsWithProgress = async (userId: string): Promise<any[]> => {
    return db.query(`
        SELECT 
            s.*,
            MAX(e.created_at) as enrolled_at,
            COUNT(DISTINCT v.id) as total_videos,
            COUNT(DISTINCT CASE WHEN vp.is_completed = 1 THEN v.id END) as completed_videos,
            COALESCE(SUM(vp.last_position_seconds), 0) as total_progress_seconds
        FROM subjects s
        INNER JOIN enrollments e ON s.id = e.subject_id
        LEFT JOIN sections sec ON s.id = sec.subject_id
        LEFT JOIN videos v ON sec.id = v.section_id
        LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
        WHERE e.user_id = ? AND s.is_published = TRUE
        GROUP BY s.id
        ORDER BY enrolled_at DESC
    `, [userId, userId]);
};

// Get continue learning subjects (recently watched)
export const getContinueLearning = async (userId: string, limit: number = 5): Promise<any[]> => {
    return db.query(`
        SELECT 
            s.*,
            v.id as last_video_id,
            v.title as last_video_title,
            v.youtube_video_id,
            vp.last_position_seconds,
            vp.is_completed,
            MAX(vp.updated_at) as last_watched
        FROM subjects s
        INNER JOIN enrollments e ON s.id = e.subject_id
        INNER JOIN sections sec ON s.id = sec.subject_id
        INNER JOIN videos v ON sec.id = v.section_id
        INNER JOIN video_progress vp ON v.id = vp.video_id
        WHERE vp.user_id = ? AND s.is_published = TRUE
        GROUP BY s.id
        ORDER BY last_watched DESC
        LIMIT ?
    `, [userId, limit]);
};

// Get subject statistics
export const getSubjectStats = async (subjectId: string, userId?: string): Promise<any> => {
    const stats = await db.queryOne(`
        SELECT 
            COUNT(DISTINCT v.id) as total_videos,
            COALESCE(SUM(v.duration_seconds), 0) as total_duration_seconds,
            COUNT(DISTINCT sec.id) as total_sections
        FROM subjects s
        LEFT JOIN sections sec ON s.id = sec.subject_id
        LEFT JOIN videos v ON sec.id = v.section_id
        WHERE s.id = ?
        GROUP BY s.id
    `, [subjectId]);

    if (userId && stats) {
        const progress = await db.queryOne(`
            SELECT 
                COUNT(DISTINCT CASE WHEN vp.is_completed = 1 THEN v.id END) as completed_videos,
                COALESCE(SUM(vp.last_position_seconds), 0) as watched_seconds
            FROM videos v
            INNER JOIN sections sec ON v.section_id = sec.id
            LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
            WHERE sec.subject_id = ?
        `, [userId, subjectId]);

        return { ...stats, ...progress };
    }

    return stats;
};
