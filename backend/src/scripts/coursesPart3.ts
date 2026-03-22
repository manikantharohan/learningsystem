// Developer Tools and Advanced courses
const devToolsAndAdvancedCourses = [
    // ==================== DEVELOPER TOOLS ====================
    {
        title: 'Git and GitHub Complete Guide',
        slug: 'git-github-complete',
        description: 'Master Git version control and GitHub collaboration. Learn branching, merging, pull requests, and collaborative development workflows.',
        category: 'Developer Tools',
        difficulty: 'beginner' as const,
        estimated_hours: 15,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/RGOj5yH7evE/maxresdefault.jpg',
        tags: ['Git', 'GitHub', 'Version Control', 'Collaboration'],
        is_featured: true,
        sections: [
            {
                title: 'Git Basics',
                videos: [
                    { title: 'Git and GitHub Full Course', description: 'Complete Git tutorial', youtube_url: 'https://www.youtube.com/watch?v=RGOj5yH7evE', youtube_video_id: 'RGOj5yH7evE', duration_seconds: 10800 },
                    { title: 'What is Git', description: 'Introduction to version control', youtube_url: 'https://www.youtube.com/watch?v=USjZcfj8yxE', youtube_video_id: 'USjZcfj8yxE', duration_seconds: 480 },
                    { title: 'Git Basics', description: 'init, add, commit', youtube_url: 'https://www.youtube.com/watch?v=HVsySz-h9r4', youtube_video_id: 'HVsySz-h9r4', duration_seconds: 600 }
                ]
            },
            {
                title: 'Branching and Merging',
                videos: [
                    { title: 'Git Branching', description: 'Creating and managing branches', youtube_url: 'https://www.youtube.com/watch?v=QV0kVNvkMxc', youtube_video_id: 'QV0kVNvkMxc', duration_seconds: 720 },
                    { title: 'Merging Branches', description: 'Combining work', youtube_url: 'https://www.youtube.com/watch?v=KDUtjZHIx44', youtube_video_id: 'KDUtjZHIx44', duration_seconds: 600 },
                    { title: 'Resolving Conflicts', description: 'Handling merge conflicts', youtube_url: 'https://www.youtube.com/watch?v=JtIX3HXSQeU', youtube_video_id: 'JtIX3HXSQeU', duration_seconds: 480 }
                ]
            },
            {
                title: 'GitHub Collaboration',
                videos: [
                    { title: 'Pull Requests', description: 'Code review workflow', youtube_url: 'https://www.youtube.com/watch?v=8lGpHWkjNkA', youtube_video_id: '8lGpHWkjNkA', duration_seconds: 720 },
                    { title: 'Fork and Clone', description: 'Open source workflow', youtube_url: 'https://www.youtube.com/watch?v=HbSjyU2vfao', youtube_video_id: 'HbSjyU2vfao', duration_seconds: 540 },
                    { title: 'GitHub Actions', description: 'CI/CD basics', youtube_url: 'https://www.youtube.com/watch?v=R8_veQiY0jI', youtube_video_id: 'R8_veQiY0jI', duration_seconds: 900 }
                ]
            }
        ]
    },
    {
        title: 'Linux Basics for Developers',
        slug: 'linux-basics',
        description: 'Learn essential Linux commands and concepts for software development. Terminal basics, file system, permissions, and shell scripting.',
        category: 'Developer Tools',
        difficulty: 'beginner' as const,
        estimated_hours: 20,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/sWbUDq4S6Y8/maxresdefault.jpg',
        tags: ['Linux', 'Terminal', 'Shell', 'DevOps'],
        is_featured: false,
        sections: [
            {
                title: 'Linux Fundamentals',
                videos: [
                    { title: 'Linux Full Course', description: 'Complete Linux tutorial', youtube_url: 'https://www.youtube.com/watch?v=sWbUDq4S6Y8', youtube_video_id: 'sWbUDq4S6Y8', duration_seconds: 14400 },
                    { title: 'Introduction to Linux', description: 'What is Linux', youtube_url: 'https://www.youtube.com/watch?v=hXgN2FDdVTg', youtube_video_id: 'hXgN2FDdVTg', duration_seconds: 600 },
                    { title: 'File System', description: 'Linux directory structure', youtube_url: 'https://www.youtube.com/watch?v=HIXzJ3Rj9NQ', youtube_video_id: 'HIXzJ3Rj9NQ', duration_seconds: 720 }
                ]
            },
            {
                title: 'Command Line',
                videos: [
                    { title: 'Basic Commands', description: 'Essential Linux commands', youtube_url: 'https://www.youtube.com/watch?v=gd7BXuUQ91w', youtube_video_id: 'gd7BXuUQ91w', duration_seconds: 900 },
                    { title: 'File Operations', description: 'cp, mv, rm, and more', youtube_url: 'https://www.youtube.com/watch?v=AFt6Uq5UxuA', youtube_video_id: 'AFt6Uq5UxuA', duration_seconds: 600 },
                    { title: 'Permissions', description: 'chmod and chown', youtube_url: 'https://www.youtube.com/watch?v=5iN76W5s1Rk', youtube_video_id: '5iN76W5s1Rk', duration_seconds: 480 }
                ]
            },
            {
                title: 'Shell Scripting',
                videos: [
                    { title: 'Bash Scripting', description: 'Writing shell scripts', youtube_url: 'https://www.youtube.com/watch?v=e7BufAVwPoc', youtube_video_id: 'e7BufAVwPoc', duration_seconds: 3600 },
                    { title: 'Variables and Loops', description: 'Script logic', youtube_url: 'https://www.youtube.com/watch?v=e7BufAVwPoc', youtube_video_id: 'e7BufAVwPoc', duration_seconds: 720 },
                    { title: 'Automation', description: 'Automating tasks', youtube_url: 'https://www.youtube.com/watch?v=e7BufAVwPoc', youtube_video_id: 'e7BufAVwPoc', duration_seconds: 600 }
                ]
            }
        ]
    },
    {
        title: 'APIs and HTTP Basics',
        slug: 'apis-http-basics',
        description: 'Understand how APIs work. Learn HTTP protocol, REST principles, API authentication, and how to consume and build APIs.',
        category: 'Developer Tools',
        difficulty: 'beginner' as const,
        estimated_hours: 12,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/GZvSYJDk-ws/maxresdefault.jpg',
        tags: ['API', 'HTTP', 'REST', 'Backend'],
        is_featured: false,
        sections: [
            {
                title: 'HTTP Protocol',
                videos: [
                    { title: 'HTTP Full Course', description: 'Complete HTTP tutorial', youtube_url: 'https://www.youtube.com/watch?v=iYM2zFP3Zn8', youtube_video_id: 'iYM2zFP3Zn8', duration_seconds: 3600 },
                    { title: 'HTTP Methods', description: 'GET, POST, PUT, DELETE', youtube_url: 'https://www.youtube.com/watch?v=gu-VsYZBWrI', youtube_video_id: 'gu-VsYZBWrI', duration_seconds: 600 },
                    { title: 'Status Codes', description: 'Understanding responses', youtube_url: 'https://www.youtube.com/watch?v=VLH3fmQW8Gw', youtube_video_id: 'VLH3fmQW8Gw', duration_seconds: 480 }
                ]
            },
            {
                title: 'REST APIs',
                videos: [
                    { title: 'REST API Tutorial', description: 'REST principles', youtube_url: 'https://www.youtube.com/watch?v=SLwpqD8n3d0', youtube_video_id: 'SLwpqD8n3d0', duration_seconds: 5400 },
                    { title: 'API Design', description: 'Designing REST APIs', youtube_url: 'https://www.youtube.com/watch?v=FGVLf6IjfQE', youtube_video_id: 'FGVLf6IjfQE', duration_seconds: 720 },
                    { title: 'Authentication', description: 'API security', youtube_url: 'https://www.youtube.com/watch?v=501jX_YkSm8', youtube_video_id: '501jX_YkSm8', duration_seconds: 600 }
                ]
            },
            {
                title: 'Consuming APIs',
                videos: [
                    { title: 'Fetch API', description: 'Making requests in JS', youtube_url: 'https://www.youtube.com/watch?v=cuEtnrL9-H0', youtube_video_id: 'cuEtnrL9-H0', duration_seconds: 720 },
                    { title: 'Axios', description: 'HTTP client library', youtube_url: 'https://www.youtube.com/watch?v=6Ly2QvDqxdI', youtube_video_id: '6Ly2QvDqxdI', duration_seconds: 600 },
                    { title: 'Postman', description: 'API testing tool', youtube_url: 'https://www.youtube.com/watch?v=VywxIQPkX0Y', youtube_video_id: 'VywxIQPkX0Y', duration_seconds: 1800 }
                ]
            }
        ]
    },

    // ==================== ADVANCED & CAREER ====================
    {
        title: 'System Design Fundamentals',
        slug: 'system-design-fundamentals',
        description: 'Learn system design concepts for technical interviews. Scalability, load balancing, caching, database design, and distributed systems.',
        category: 'Advanced & Career',
        difficulty: 'advanced' as const,
        estimated_hours: 25,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/i7twT3f2Oks/maxresdefault.jpg',
        tags: ['System Design', 'Scalability', 'Architecture', 'Interview'],
        is_featured: true,
        sections: [
            {
                title: 'System Design Basics',
                videos: [
                    { title: 'System Design Full Course', description: 'Complete system design', youtube_url: 'https://www.youtube.com/watch?v=i7twT3f2Oks', youtube_video_id: 'i7twT3f2Oks', duration_seconds: 10800 },
                    { title: 'Scalability', description: 'Horizontal vs vertical scaling', youtube_url: 'https://www.youtube.com/watch?v=-p9n4G2f1Ro', youtube_video_id: '-p9n4G2f1Ro', duration_seconds: 720 },
                    { title: 'Load Balancing', description: 'Distributing traffic', youtube_url: 'https://www.youtube.com/watch?v=galcA6Y5moI', youtube_video_id: 'galcA6Y5moI', duration_seconds: 600 }
                ]
            },
            {
                title: 'Core Components',
                videos: [
                    { title: 'Caching', description: 'Cache strategies', youtube_url: 'https://www.youtube.com/watch?v=UTPt6Y8HRYg', youtube_video_id: 'UTPt6Y8HRYg', duration_seconds: 540 },
                    { title: 'Database Scaling', description: 'Sharding and replication', youtube_url: 'https://www.youtube.com/watch?v=5lU2o9WbSvo', youtube_video_id: '5lU2o9WbSvo', duration_seconds: 720 },
                    { title: 'Message Queues', description: 'Asynchronous processing', youtube_url: 'https://www.youtube.com/watch?v=xErwDaOcGgs', youtube_video_id: 'xErwDaOcGgs', duration_seconds: 600 }
                ]
            },
            {
                title: 'Design Problems',
                videos: [
                    { title: 'Design URL Shortener', description: 'TinyURL design', youtube_url: 'https://www.youtube.com/watch?v=fMZMmV0ZPjI', youtube_video_id: 'fMZMmV0ZPjI', duration_seconds: 1200 },
                    { title: 'Design Chat System', description: 'WhatsApp-like design', youtube_url: 'https://www.youtube.com/watch?v=0rIsAD2nZxY', youtube_video_id: '0rIsAD2nZxY', duration_seconds: 1500 },
                    { title: 'Design Video Streaming', description: 'YouTube-like design', youtube_url: 'https://www.youtube.com/watch?v=jPKTo1iGQiE', youtube_video_id: 'jPKTo1iGQiE', duration_seconds: 1320 }
                ]
            }
        ]
    },
    {
        title: 'Coding Interview Preparation',
        slug: 'coding-interview-preparation',
        description: 'Prepare for coding interviews with common patterns, problem-solving strategies, and practice problems from top tech companies.',
        category: 'Advanced & Career',
        difficulty: 'advanced' as const,
        estimated_hours: 40,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/D_hg7F4DmCs/maxresdefault.jpg',
        tags: ['Interview', 'LeetCode', 'Problem Solving', 'FAANG'],
        is_featured: true,
        sections: [
            {
                title: 'Interview Patterns',
                videos: [
                    { title: 'Coding Interview Full Course', description: 'Complete interview prep', youtube_url: 'https://www.youtube.com/watch?v=D_hg7F4DmCs', youtube_video_id: 'D_hg7F4DmCs', duration_seconds: 14400 },
                    { title: 'Two Pointers', description: 'Common pattern', youtube_url: 'https://www.youtube.com/watch?v=9UtInRVqQac', youtube_video_id: '9UtInRVqQac', duration_seconds: 720 },
                    { title: 'Sliding Window', description: 'Subarray problems', youtube_url: 'https://www.youtube.com/watch?v=MK-NZ4iN2sE', youtube_video_id: 'MK-NZ4iN2sE', duration_seconds: 840 }
                ]
            },
            {
                title: 'Common Problems',
                videos: [
                    { title: 'Array Problems', description: 'Common array questions', youtube_url: 'https://www.youtube.com/watch?v=4q7VO6I8rLw', youtube_video_id: '4q7VO6I8rLw', duration_seconds: 1200 },
                    { title: 'String Problems', description: 'String manipulation', youtube_url: 'https://www.youtube.com/watch?v=4q7VO6I8rLw', youtube_video_id: '4q7VO6I8rLw', duration_seconds: 900 },
                    { title: 'Tree Problems', description: 'Binary tree questions', youtube_url: 'https://www.youtube.com/watch?v=4q7VO6I8rLw', youtube_video_id: '4q7VO6I8rLw', duration_seconds: 1080 }
                ]
            },
            {
                title: 'Mock Interviews',
                videos: [
                    { title: 'Google Interview', description: 'Mock interview example', youtube_url: 'https://www.youtube.com/watch?v=XKu_SEDAykw', youtube_video_id: 'XKu_SEDAykw', duration_seconds: 1800 },
                    { title: 'Amazon Interview', description: 'Leadership principles', youtube_url: 'https://www.youtube.com/watch?v=4q7VO6I8rLw', youtube_video_id: '4q7VO6I8rLw', duration_seconds: 1500 },
                    { title: 'Behavioral Questions', description: 'Non-technical questions', youtube_url: 'https://www.youtube.com/watch?v=4q7VO6I8rLw', youtube_video_id: '4q7VO6I8rLw', duration_seconds: 900 }
                ]
            }
        ]
    },
    {
        title: 'Object-Oriented Design Principles',
        slug: 'oop-design-principles',
        description: 'Master OOP design principles including SOLID, design patterns, and clean architecture. Write maintainable and scalable code.',
        category: 'Advanced & Career',
        difficulty: 'intermediate' as const,
        estimated_hours: 20,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/pTB30aXS77U/maxresdefault.jpg',
        tags: ['OOP', 'SOLID', 'Design Patterns', 'Clean Code'],
        is_featured: false,
        sections: [
            {
                title: 'SOLID Principles',
                videos: [
                    { title: 'SOLID Principles', description: 'All 5 principles explained', youtube_url: 'https://www.youtube.com/watch?v=pTB30aXS77U', youtube_video_id: 'pTB30aXS77U', duration_seconds: 3600 },
                    { title: 'Single Responsibility', description: 'SRP principle', youtube_url: 'https://www.youtube.com/watch?v=pTB30aXS77U', youtube_video_id: 'pTB30aXS77U', duration_seconds: 600 },
                    { title: 'Open/Closed Principle', description: 'OCP principle', youtube_url: 'https://www.youtube.com/watch?v=pTB30aXS77U', youtube_video_id: 'pTB30aXS77U', duration_seconds: 540 }
                ]
            },
            {
                title: 'Design Patterns',
                videos: [
                    { title: 'Design Patterns Overview', description: 'Common patterns', youtube_url: 'https://www.youtube.com/watch?v=NU_1StN5Tkk', youtube_video_id: 'NU_1StN5Tkk', duration_seconds: 7200 },
                    { title: 'Factory Pattern', description: 'Creational pattern', youtube_url: 'https://www.youtube.com/watch?v=NU_1StN5Tkk', youtube_video_id: 'NU_1StN5Tkk', duration_seconds: 600 },
                    { title: 'Singleton Pattern', description: 'Single instance pattern', youtube_url: 'https://www.youtube.com/watch?v=NU_1StN5Tkk', youtube_video_id: 'NU_1StN5Tkk', duration_seconds: 480 }
                ]
            },
            {
                title: 'Clean Architecture',
                videos: [
                    { title: 'Clean Architecture', description: 'Architecture principles', youtube_url: 'https://www.youtube.com/watch?v=CQnH6TTzOQc', youtube_video_id: 'CQnH6TTzOQc', duration_seconds: 1800 },
                    { title: 'Dependency Injection', description: 'DI pattern', youtube_url: 'https://www.youtube.com/watch?v=CQnH6TTzOQc', youtube_video_id: 'CQnH6TTzOQc', duration_seconds: 720 },
                    { title: 'Layered Architecture', description: 'Separation of concerns', youtube_url: 'https://www.youtube.com/watch?v=CQnH6TTzOQc', youtube_video_id: 'CQnH6TTzOQc', duration_seconds: 600 }
                ]
            }
        ]
    }
];

export { devToolsAndAdvancedCourses };
