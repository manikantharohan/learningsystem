import pool from '../config/database';
import { hashPassword } from '../utils/password';
import { additionalCourses } from './coursesPart2';
import { devToolsAndAdvancedCourses } from './coursesPart3';

// Programming Fundamentals courses
const programmingCourses = [
    {
        title: 'C Programming for Beginners',
        slug: 'c-programming-beginners',
        description: 'Master C programming from scratch. Learn pointers, memory management, data structures, and build a strong foundation for your programming career.',
        category: 'Programming Fundamentals',
        difficulty: 'beginner' as const,
        estimated_hours: 40,
        instructor: 'Neso Academy',
        thumbnail_url: 'https://i.ytimg.com/vi/KJgsSFOSQv0/maxresdefault.jpg',
        tags: ['C', 'Programming', 'Beginner', 'Memory Management'],
        is_featured: true,
        sections: [
            {
                title: 'Introduction to C',
                videos: [
                    { title: 'Introduction to C Programming', description: 'Overview of C language and its importance', youtube_url: 'https://www.youtube.com/watch?v=KJgsSFOSQv0', youtube_video_id: 'KJgsSFOSQv0', duration_seconds: 600 },
                    { title: 'Installing C Compiler', description: 'Set up your development environment', youtube_url: 'https://www.youtube.com/watch?v=66mEQzWJ4Ns', youtube_video_id: '66mEQzWJ4Ns', duration_seconds: 480 },
                    { title: 'First C Program', description: 'Write and run your first C program', youtube_url: 'https://www.youtube.com/watch?v=An7bW8l0epA', youtube_video_id: 'An7bW8l0epA', duration_seconds: 720 }
                ]
            },
            {
                title: 'Variables and Data Types',
                videos: [
                    { title: 'Variables in C', description: 'Understanding variables and naming conventions', youtube_url: 'https://www.youtube.com/watch?v=7L2Xf8Tx1OQ', youtube_video_id: '7L2Xf8Tx1OQ', duration_seconds: 540 },
                    { title: 'Data Types in C', description: 'int, float, char, and more', youtube_url: 'https://www.youtube.com/watch?v=77iJdP8Z6FM', youtube_video_id: '77iJdP8Z6FM', duration_seconds: 660 },
                    { title: 'Type Casting', description: 'Converting between data types', youtube_url: 'https://www.youtube.com/watch?v=0N8RB2QfyPs', youtube_video_id: '0N8RB2QfyPs', duration_seconds: 480 }
                ]
            },
            {
                title: 'Control Structures',
                videos: [
                    { title: 'If Else Statements', description: 'Conditional logic in C', youtube_url: 'https://www.youtube.com/watch?v=8XpT1HkE8dM', youtube_video_id: '8XpT1HkE8dM', duration_seconds: 720 },
                    { title: 'Switch Case', description: 'Multiple condition handling', youtube_url: 'https://www.youtube.com/watch?v=8yQhP3q8F6M', youtube_video_id: '8yQhP3q8F6M', duration_seconds: 540 },
                    { title: 'Loops in C', description: 'For, While, Do-While loops', youtube_url: 'https://www.youtube.com/watch?v=1bO-hGkUPhU', youtube_video_id: '1bO-hGkUPhU', duration_seconds: 900 }
                ]
            },
            {
                title: 'Functions',
                videos: [
                    { title: 'Introduction to Functions', description: 'Creating and using functions', youtube_url: 'https://www.youtube.com/watch?v=xEzL5wqVyaA', youtube_video_id: 'xEzL5wqVyaA', duration_seconds: 780 },
                    { title: 'Function Arguments', description: 'Passing values to functions', youtube_url: 'https://www.youtube.com/watch?v=2J5jzFvNCZg', youtube_video_id: '2J5jzFvNCZg', duration_seconds: 660 },
                    { title: 'Recursion', description: 'Functions calling themselves', youtube_url: 'https://www.youtube.com/watch?v=kepBmgvWNDw', youtube_video_id: 'kepBmgvWNDw', duration_seconds: 720 }
                ]
            },
            {
                title: 'Pointers and Memory',
                videos: [
                    { title: 'Introduction to Pointers', description: 'Understanding memory addresses', youtube_url: 'https://www.youtube.com/watch?v=h-HBKuM0LvI', youtube_video_id: 'h-HBKuM0LvI', duration_seconds: 840 },
                    { title: 'Pointer Arithmetic', description: 'Working with pointer operations', youtube_url: 'https://www.youtube.com/watch?v=kZgnD5MmX6k', youtube_video_id: 'kZgnD5MmX6k', duration_seconds: 720 },
                    { title: 'Dynamic Memory Allocation', description: 'malloc, calloc, realloc, free', youtube_url: 'https://www.youtube.com/watch?v=xDVC3wKjEJs', youtube_video_id: 'xDVC3wKjEJs', duration_seconds: 900 }
                ]
            }
        ]
    },
    {
        title: 'C++ Programming Complete Course',
        slug: 'cpp-programming-complete',
        description: 'Learn C++ from basics to advanced concepts including OOP, STL, templates, and modern C++ features. Perfect for competitive programming and software development.',
        category: 'Programming Fundamentals',
        difficulty: 'intermediate' as const,
        estimated_hours: 50,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/vLnPwxZdW4Y/maxresdefault.jpg',
        tags: ['C++', 'OOP', 'STL', 'Templates'],
        is_featured: true,
        sections: [
            {
                title: 'C++ Basics',
                videos: [
                    { title: 'Introduction to C++', description: 'Getting started with C++', youtube_url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y', youtube_video_id: 'vLnPwxZdW4Y', duration_seconds: 1800 },
                    { title: 'Variables and Data Types', description: 'C++ data types and variables', youtube_url: 'https://www.youtube.com/watch?v=0RTQMp0eVwE', youtube_video_id: '0RTQMp0eVwE', duration_seconds: 720 },
                    { title: 'Input and Output', description: 'cin and cout in C++', youtube_url: 'https://www.youtube.com/watch?v=0RTQMp0eVwE', youtube_video_id: '0RTQMp0eVwE', duration_seconds: 540 }
                ]
            },
            {
                title: 'Object-Oriented Programming',
                videos: [
                    { title: 'Classes and Objects', description: 'Introduction to OOP concepts', youtube_url: 'https://www.youtube.com/watch?v=2BPylN1G3KU', youtube_video_id: '2BPylN1G3KU', duration_seconds: 1200 },
                    { title: 'Constructors and Destructors', description: 'Object initialization and cleanup', youtube_url: 'https://www.youtube.com/watch?v=oB2NwGj2EYE', youtube_video_id: 'oB2NwGj2EYE', duration_seconds: 900 },
                    { title: 'Inheritance', description: 'Deriving classes from base classes', youtube_url: 'https://www.youtube.com/watch?v=HfEoC1V4KZw', youtube_video_id: 'HfEoC1V4KZw', duration_seconds: 1080 },
                    { title: 'Polymorphism', description: 'Virtual functions and overriding', youtube_url: 'https://www.youtube.com/watch?v=UUdGb9Fi4Gs', youtube_video_id: 'UUdGb9Fi4Gs', duration_seconds: 960 }
                ]
            },
            {
                title: 'Standard Template Library',
                videos: [
                    { title: 'STL Overview', description: 'Introduction to the STL', youtube_url: 'https://www.youtube.com/watch?v=PFoNYHxqfjk', youtube_video_id: 'PFoNYHxqfjk', duration_seconds: 900 },
                    { title: 'Vectors', description: 'Dynamic arrays in C++', youtube_url: 'https://www.youtube.com/watch?v=9FsHpe3J3cY', youtube_video_id: '9FsHpe3J3cY', duration_seconds: 720 },
                    { title: 'Maps and Sets', description: 'Associative containers', youtube_url: 'https://www.youtube.com/watch?v=J8D4hQh5qTk', youtube_video_id: 'J8D4hQh5qTk', duration_seconds: 840 }
                ]
            }
        ]
    },
    {
        title: 'Java Programming Masterclass',
        slug: 'java-programming-masterclass',
        description: 'Complete Java programming course covering core Java, OOP concepts, collections, exception handling, and file I/O. Build enterprise-ready applications.',
        category: 'Programming Fundamentals',
        difficulty: 'beginner' as const,
        estimated_hours: 60,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/A74TOXvh3ac/maxresdefault.jpg',
        tags: ['Java', 'OOP', 'Enterprise', 'Backend'],
        is_featured: true,
        sections: [
            {
                title: 'Java Fundamentals',
                videos: [
                    { title: 'Introduction to Java', description: 'Getting started with Java', youtube_url: 'https://www.youtube.com/watch?v=A74TOXvh3ac', youtube_video_id: 'A74TOXvh3ac', duration_seconds: 3600 },
                    { title: 'Variables and Data Types', description: 'Java primitive types and references', youtube_url: 'https://www.youtube.com/watch?v=eIrMbAQYS34', youtube_video_id: 'eIrMbAQYS34', duration_seconds: 900 },
                    { title: 'Operators and Expressions', description: 'Arithmetic, logical, and comparison operators', youtube_url: 'https://www.youtube.com/watch?v=eIrMbAQYS34', youtube_video_id: 'eIrMbAQYS34', duration_seconds: 720 }
                ]
            },
            {
                title: 'Object-Oriented Programming in Java',
                videos: [
                    { title: 'Classes and Objects', description: 'Creating Java classes', youtube_url: 'https://www.youtube.com/watch?v=5hWyTFrjJco', youtube_video_id: '5hWyTFrjJco', duration_seconds: 1080 },
                    { title: 'Methods and Parameters', description: 'Defining and calling methods', youtube_url: 'https://www.youtube.com/watch?v=GE5PNu78WJk', youtube_video_id: 'GE5PNu78WJk', duration_seconds: 900 },
                    { title: 'Inheritance', description: 'Extending classes in Java', youtube_url: 'https://www.youtube.com/watch?v=IjvS-g5dQSM', youtube_video_id: 'IjvS-g5dQSM', duration_seconds: 1020 },
                    { title: 'Interfaces', description: 'Implementing interfaces', youtube_url: 'https://www.youtube.com/watch?v=UePH4fJ2uII', youtube_video_id: 'UePH4fJ2uII', duration_seconds: 960 }
                ]
            },
            {
                title: 'Collections Framework',
                videos: [
                    { title: 'ArrayList', description: 'Dynamic arrays in Java', youtube_url: 'https://www.youtube.com/watch?v=0i1kE6uKJt8', youtube_video_id: '0i1kE6uKJt8', duration_seconds: 720 },
                    { title: 'HashMap', description: 'Key-value pairs', youtube_url: 'https://www.youtube.com/watch?v=H62Jfv1DJlU', youtube_video_id: 'H62Jfv1DJlU', duration_seconds: 780 },
                    { title: 'HashSet', description: 'Unique elements collection', youtube_url: 'https://www.youtube.com/watch?v=H62Jfv1DJlU', youtube_video_id: 'H62Jfv1DJlU', duration_seconds: 660 }
                ]
            }
        ]
    },
    {
        title: 'Python Programming Complete Course',
        slug: 'python-programming-complete',
        description: 'Learn Python from scratch to advanced level. Master Python for data science, web development, automation, and more. Perfect for beginners and professionals.',
        category: 'Programming Fundamentals',
        difficulty: 'beginner' as const,
        estimated_hours: 45,
        instructor: 'Programming with Mosh',
        thumbnail_url: 'https://i.ytimg.com/vi/_uQrJ0TkZlc/maxresdefault.jpg',
        tags: ['Python', 'Beginner', 'Data Science', 'Automation'],
        is_featured: true,
        sections: [
            {
                title: 'Python Basics',
                videos: [
                    { title: 'Python Tutorial for Beginners', description: 'Complete Python course', youtube_url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', youtube_video_id: '_uQrJ0TkZlc', duration_seconds: 7200 },
                    { title: 'Variables and Data Types', description: 'Python variables explained', youtube_url: 'https://www.youtube.com/watch?v=cQT33yu9pY8', youtube_video_id: 'cQT33yu9pY8', duration_seconds: 900 },
                    { title: 'Strings in Python', description: 'Working with text data', youtube_url: 'https://www.youtube.com/watch?v=k9TUPpGtY54', youtube_video_id: 'k9TUPpGtY54', duration_seconds: 840 }
                ]
            },
            {
                title: 'Control Flow',
                videos: [
                    { title: 'If Statements', description: 'Conditional logic', youtube_url: 'https://www.youtube.com/watch?v=Zvh5GM4xMwA', youtube_video_id: 'Zvh5GM4xMwA', duration_seconds: 600 },
                    { title: 'Loops in Python', description: 'For and while loops', youtube_url: 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ', youtube_video_id: '6iF8Xb7Z3wQ', duration_seconds: 900 },
                    { title: 'Functions', description: 'Creating reusable code', youtube_url: 'https://www.youtube.com/watch?v=9Os0o3wzS_I', youtube_video_id: '9Os0o3wzS_I', duration_seconds: 1080 }
                ]
            },
            {
                title: 'Data Structures',
                videos: [
                    { title: 'Lists in Python', description: 'Working with lists', youtube_url: 'https://www.youtube.com/watch?v=ohCDWZgNIU0', youtube_video_id: 'ohCDWZgNIU0', duration_seconds: 720 },
                    { title: 'Dictionaries', description: 'Key-value pairs', youtube_url: 'https://www.youtube.com/watch?v=XCcpzWs-CI4', youtube_video_id: 'XCcpzWs-CI4', duration_seconds: 780 },
                    { title: 'Tuples and Sets', description: 'Immutable and unique collections', youtube_url: 'https://www.youtube.com/watch?v=XCcpzWs-CI4', youtube_video_id: 'XCcpzWs-CI4', duration_seconds: 660 }
                ]
            },
            {
                title: 'Object-Oriented Programming',
                videos: [
                    { title: 'Classes and Objects', description: 'OOP fundamentals in Python', youtube_url: 'https://www.youtube.com/watch?v=JeznW_7DlB0', youtube_video_id: 'JeznW_7DlB0', duration_seconds: 1200 },
                    { title: 'Inheritance', description: 'Extending classes', youtube_url: 'https://www.youtube.com/watch?v=Cn7g6S52bJA', youtube_video_id: 'Cn7g6S52bJA', duration_seconds: 900 },
                    { title: 'Encapsulation', description: 'Data hiding in Python', youtube_url: 'https://www.youtube.com/watch?v=we7D9qVfJas', youtube_video_id: 'we7D9qVfJas', duration_seconds: 720 }
                ]
            }
        ]
    },
    {
        title: 'JavaScript Complete Course',
        slug: 'javascript-complete-course',
        description: 'Master JavaScript from basics to advanced concepts. Learn ES6+, async programming, DOM manipulation, and build interactive web applications.',
        category: 'Programming Fundamentals',
        difficulty: 'beginner' as const,
        estimated_hours: 35,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
        tags: ['JavaScript', 'ES6', 'Web Development', 'Frontend'],
        is_featured: true,
        sections: [
            {
                title: 'JavaScript Fundamentals',
                videos: [
                    { title: 'JavaScript Tutorial for Beginners', description: 'Full JavaScript course', youtube_url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', youtube_video_id: 'PkZNo7MFNFg', duration_seconds: 10800 },
                    { title: 'Variables: var, let, const', description: 'Declaring variables in JS', youtube_url: 'https://www.youtube.com/watch?v=XgSjoHgyrek', youtube_video_id: 'XgSjoHgyrek', duration_seconds: 600 },
                    { title: 'Data Types', description: 'JavaScript data types', youtube_url: 'https://www.youtube.com/watch?v=Um5Cd7ZxLmw', youtube_video_id: 'Um5Cd7ZxLmw', duration_seconds: 540 }
                ]
            },
            {
                title: 'Functions and Scope',
                videos: [
                    { title: 'Functions in JavaScript', description: 'Creating and calling functions', youtube_url: 'https://www.youtube.com/watch?v=N8ap4kz8Mgs', youtube_video_id: 'N8ap4kz8Mgs', duration_seconds: 900 },
                    { title: 'Arrow Functions', description: 'ES6 arrow function syntax', youtube_url: 'https://www.youtube.com/watch?v=h33Srr5J9nY', youtube_video_id: 'h33Srr5J9nY', duration_seconds: 480 },
                    { title: 'Closures', description: 'Understanding closures', youtube_url: 'https://www.youtube.com/watch?v=1JsJx1x35c0', youtube_video_id: '1JsJx1x35c0', duration_seconds: 720 }
                ]
            },
            {
                title: 'Async JavaScript',
                videos: [
                    { title: 'Promises', description: 'Working with Promises', youtube_url: 'https://www.youtube.com/watch?v=DHvZLI7Db8E', youtube_video_id: 'DHvZLI7Db8E', duration_seconds: 840 },
                    { title: 'Async/Await', description: 'Modern async programming', youtube_url: 'https://www.youtube.com/watch?v=V_Kr9OSfDeU', youtube_video_id: 'V_Kr9OSfDeU', duration_seconds: 720 },
                    { title: 'Fetch API', description: 'Making HTTP requests', youtube_url: 'https://www.youtube.com/watch?v=cuEtnrL9-H0', youtube_video_id: 'cuEtnrL9-H0', duration_seconds: 660 }
                ]
            }
        ]
    }
];

// Combine all courses
const allCourses = [...programmingCourses, ...additionalCourses, ...devToolsAndAdvancedCourses];

const seedData = async () => {
    try {
        console.log('Seeding database...');

        // Create demo user
        const hashedPassword = await hashPassword('password123');
        await pool.execute(
            `INSERT IGNORE INTO users (id, email, password_hash, name) 
             VALUES (UUID(), 'demo@example.com', ?, 'Demo User')`,
            [hashedPassword]
        );

        // Insert all courses
        for (const course of allCourses) {
            console.log(`Processing course: ${course.title}`);
            
            // Insert subject
            await pool.execute(
                `INSERT IGNORE INTO subjects (id, title, slug, description, thumbnail_url, is_published, category, difficulty_level, estimated_hours, instructor, tags, is_featured) 
                 VALUES (UUID(), ?, ?, ?, ?, TRUE, ?, ?, ?, ?, ?, ?)`,
                [course.title, course.slug, course.description, course.thumbnail_url, course.category, course.difficulty, course.estimated_hours, course.instructor, JSON.stringify(course.tags), course.is_featured]
            );

            // Get subject ID
            const [subjects] = await pool.execute(
                'SELECT id FROM subjects WHERE slug = ?',
                [course.slug]
            );
            const subjectId = (subjects as any[])[0]?.id;

            if (!subjectId) continue;

            // Insert sections
            for (let sectionIndex = 0; sectionIndex < course.sections.length; sectionIndex++) {
                const section = course.sections[sectionIndex];
                
                await pool.execute(
                    `INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES (UUID(), ?, ?, ?)`,
                    [subjectId, section.title, sectionIndex]
                );

                // Get section ID
                const [sections] = await pool.execute(
                    'SELECT id FROM sections WHERE subject_id = ? AND title = ?',
                    [subjectId, section.title]
                );
                const sectionId = (sections as any[])[0]?.id;

                if (!sectionId) continue;

                // Insert videos
                for (let videoIndex = 0; videoIndex < section.videos.length; videoIndex++) {
                    const video = section.videos[videoIndex];
                    
                    await pool.execute(
                        `INSERT IGNORE INTO videos (id, section_id, title, description, youtube_url, youtube_video_id, order_index, duration_seconds) 
                         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)`,
                        [sectionId, video.title, video.description, video.youtube_url, video.youtube_video_id, videoIndex, video.duration_seconds]
                    );
                }
            }
        }

        // Create achievements
        await pool.execute(`
            INSERT IGNORE INTO achievements (id, name, description, icon_url, xp_reward, requirement_type, requirement_value) VALUES
            (UUID(), 'First Steps', 'Complete your first video', 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', 10, 'videos_completed', 1),
            (UUID(), 'Getting Started', 'Complete 5 videos', 'https://cdn-icons-png.flaticon.com/512/3135/3135773.png', 50, 'videos_completed', 5),
            (UUID(), 'Dedicated Learner', 'Complete 25 videos', 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png', 200, 'videos_completed', 25),
            (UUID(), 'Course Graduate', 'Complete your first course', 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png', 100, 'courses_completed', 1),
            (UUID(), 'XP Hunter', 'Earn 500 XP', 'https://cdn-icons-png.flaticon.com/512/3135/3135823.png', 0, 'xp_total', 500),
            (UUID(), 'XP Master', 'Earn 2000 XP', 'https://cdn-icons-png.flaticon.com/512/3135/3135836.png', 0, 'xp_total', 2000)
        `);

        console.log('Database seeded successfully!');
        console.log(`Total courses: ${allCourses.length}`);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

seedData();
