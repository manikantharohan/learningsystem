import pool from '../config/database';

const fixVideos = async () => {
    try {
        console.log('Fixing broken video data...');

        // Fix 1: Update thumbnail URLs from vi= to vi/ format
        const [subjects] = await pool.execute(
            'SELECT id, thumbnail_url FROM subjects WHERE thumbnail_url LIKE "%vi=%"'
        );
        
        for (const subject of subjects as any[]) {
            const fixedUrl = subject.thumbnail_url.replace('/vi=', '/vi/');
            await pool.execute(
                'UPDATE subjects SET thumbnail_url = ? WHERE id = ?',
                [fixedUrl, subject.id]
            );
            console.log(`Fixed thumbnail URL for subject ${subject.id}`);
        }

        // Fix 2: Replace DBMS course video (5Sf7WgQz0xY) with working alternative (kBdlM6hNDAE)
        // First, get the DBMS subject ID
        const [dbmsSubjects] = await pool.execute(
            'SELECT id FROM subjects WHERE slug = ?',
            ['dbms-complete']
        );
        
        if ((dbmsSubjects as any[]).length > 0) {
            const dbmsSubjectId = (dbmsSubjects as any[])[0].id;
            
            // Update subject thumbnail and instructor
            await pool.execute(
                'UPDATE subjects SET thumbnail_url = ?, instructor = ? WHERE id = ?',
                ['https://i.ytimg.com/vi/kBdlM6hNDAE/maxresdefault.jpg', 'Gate Smashers', dbmsSubjectId]
            );
            console.log('Updated DBMS course thumbnail and instructor');

            // Get sections for this subject
            const [sections] = await pool.execute(
                'SELECT id, title FROM sections WHERE subject_id = ?',
                [dbmsSubjectId]
            );

            for (const section of sections as any[]) {
                // Get videos in this section
                const [videos] = await pool.execute(
                    'SELECT id, youtube_video_id FROM videos WHERE section_id = ?',
                    [section.id]
                );

                for (const video of videos as any[]) {
                    // Replace the main DBMS video
                    if (video.youtube_video_id === '5Sf7WgQz0xY') {
                        await pool.execute(
                            'UPDATE videos SET youtube_video_id = ?, youtube_url = ?, title = ?, description = ? WHERE id = ?',
                            ['kBdlM6hNDAE', 'https://www.youtube.com/watch?v=kBdlM6hNDAE', 'DBMS Full Course', 'Complete DBMS tutorial by Gate Smashers', video.id]
                        );
                        console.log(`Replaced video ${video.id} with working alternative`);
                    }
                }
            }
        }

        console.log('Video fixes completed successfully!');
    } catch (error) {
        console.error('Failed to fix videos:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

fixVideos();
