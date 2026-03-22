// Additional courses - Web Development, CS Core, Developer Tools, Advanced
const additionalCourses = [
    // ==================== WEB DEVELOPMENT ====================
    {
        title: 'HTML & CSS Complete Course',
        slug: 'html-css-complete',
        description: 'Learn HTML5 and CSS3 from scratch. Build beautiful, responsive websites with modern CSS techniques including Flexbox and Grid.',
        category: 'Web Development',
        difficulty: 'beginner' as const,
        estimated_hours: 25,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/pQN-pnXPaVg/maxresdefault.jpg',
        tags: ['HTML', 'CSS', 'Frontend', 'Responsive'],
        is_featured: true,
        sections: [
            {
                title: 'HTML Fundamentals',
                videos: [
                    { title: 'HTML Full Course', description: 'Complete HTML tutorial', youtube_url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', youtube_video_id: 'pQN-pnXPaVg', duration_seconds: 7200 },
                    { title: 'HTML Document Structure', description: 'Understanding HTML structure', youtube_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', youtube_video_id: 'UB1O30fR-EE', duration_seconds: 600 },
                    { title: 'HTML Forms', description: 'Creating web forms', youtube_url: 'https://www.youtube.com/watch?v=fNcJuPIY2GA', youtube_video_id: 'fNcJuPIY2GA', duration_seconds: 900 }
                ]
            },
            {
                title: 'CSS Fundamentals',
                videos: [
                    { title: 'CSS Full Course', description: 'Complete CSS tutorial', youtube_url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', youtube_video_id: '1Rs2ND1ryYc', duration_seconds: 5400 },
                    { title: 'CSS Selectors', description: 'Targeting elements', youtube_url: 'https://www.youtube.com/watch?v=l1mER1bV0N0', youtube_video_id: 'l1mER1bV0N0', duration_seconds: 720 },
                    { title: 'CSS Box Model', description: 'Understanding spacing', youtube_url: 'https://www.youtube.com/watch?v=rIO5326FgPE', youtube_video_id: 'rIO5326FgPE', duration_seconds: 600 }
                ]
            },
            {
                title: 'Modern CSS Layouts',
                videos: [
                    { title: 'CSS Flexbox', description: 'Flexible box layouts', youtube_url: 'https://www.youtube.com/watch?v=fYq5PXgSsbE', youtube_video_id: 'fYq5PXgSsbE', duration_seconds: 1200 },
                    { title: 'CSS Grid', description: 'Grid-based layouts', youtube_url: 'https://www.youtube.com/watch?v=EFafSYg-PkI', youtube_video_id: 'EFafSYg-PkI', duration_seconds: 1320 },
                    { title: 'Responsive Design', description: 'Mobile-first approach', youtube_url: 'https://www.youtube.com/watch?v=srvUrKjTDsE', youtube_video_id: 'srvUrKjTDsE', duration_seconds: 900 }
                ]
            }
        ]
    },
    {
        title: 'React - Complete Guide',
        slug: 'react-complete-guide',
        description: 'Master React.js from fundamentals to advanced patterns. Learn hooks, context, state management, and build modern single-page applications.',
        category: 'Web Development',
        difficulty: 'intermediate' as const,
        estimated_hours: 40,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg',
        tags: ['React', 'JavaScript', 'Frontend', 'SPA'],
        is_featured: true,
        sections: [
            {
                title: 'React Fundamentals',
                videos: [
                    { title: 'React Course for Beginners', description: 'Full React tutorial', youtube_url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', youtube_video_id: 'bMknfKXIFA8', duration_seconds: 10800 },
                    { title: 'JSX Basics', description: 'Writing JSX syntax', youtube_url: 'https://www.youtube.com/watch?v=7fPXI_MnBOY', youtube_video_id: '7fPXI_MnBOY', duration_seconds: 600 },
                    { title: 'Components', description: 'Creating React components', youtube_url: 'https://www.youtube.com/watch?v=ln8IhUuSxlI', youtube_video_id: 'ln8IhUuSxlI', duration_seconds: 720 }
                ]
            },
            {
                title: 'React Hooks',
                videos: [
                    { title: 'useState Hook', description: 'Managing state with hooks', youtube_url: 'https://www.youtube.com/watch?v=4pO-HcG2igk', youtube_video_id: '4pO-HcG2igk', duration_seconds: 720 },
                    { title: 'useEffect Hook', description: 'Side effects in React', youtube_url: 'https://www.youtube.com/watch?v=g0OxG8AaJFM', youtube_video_id: 'g0OxG8AaJFM', duration_seconds: 840 },
                    { title: 'Custom Hooks', description: 'Creating reusable hooks', youtube_url: 'https://www.youtube.com/watch?v=TH9VfdNQyvc', youtube_video_id: 'TH9VfdNQyvc', duration_seconds: 900 }
                ]
            },
            {
                title: 'State Management',
                videos: [
                    { title: 'Context API', description: 'Global state management', youtube_url: 'https://www.youtube.com/watch?v=5LrDIWkP_Bc', youtube_video_id: '5LrDIWkP_Bc', duration_seconds: 960 },
                    { title: 'useReducer', description: 'Complex state logic', youtube_url: 'https://www.youtube.com/watch?v=kK_Wqx3RZmk', youtube_video_id: 'kK_Wqx3RZmk', duration_seconds: 780 },
                    { title: 'Redux Basics', description: 'Redux for React', youtube_url: 'https://www.youtube.com/watch?v=CVpUuw9Xj4k', youtube_video_id: 'CVpUuw9Xj4k', duration_seconds: 1200 }
                ]
            }
        ]
    },
    {
        title: 'Node.js Complete Course',
        slug: 'nodejs-complete-course',
        description: 'Learn Node.js from basics to building scalable backend applications. Master Express.js, REST APIs, authentication, and database integration.',
        category: 'Web Development',
        difficulty: 'intermediate' as const,
        estimated_hours: 35,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/Oe421EPjeBE/maxresdefault.jpg',
        tags: ['Node.js', 'Backend', 'Express', 'API'],
        is_featured: true,
        sections: [
            {
                title: 'Node.js Fundamentals',
                videos: [
                    { title: 'Node.js Full Course', description: 'Complete Node.js tutorial', youtube_url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', youtube_video_id: 'Oe421EPjeBE', duration_seconds: 10800 },
                    { title: 'Node.js Basics', description: 'Introduction to Node.js', youtube_url: 'https://www.youtube.com/watch?v=ENrzD9HAZK4', youtube_video_id: 'ENrzD9HAZK4', duration_seconds: 900 },
                    { title: 'NPM Package Manager', description: 'Managing dependencies', youtube_url: 'https://www.youtube.com/watch?v=P3aKRdUyr0s', youtube_video_id: 'P3aKRdUyr0s', duration_seconds: 720 }
                ]
            },
            {
                title: 'Express.js Framework',
                videos: [
                    { title: 'Express.js Tutorial', description: 'Building web servers', youtube_url: 'https://www.youtube.com/watch?v=L72fhGm1tf8', youtube_video_id: 'L72fhGm1tf8', duration_seconds: 3600 },
                    { title: 'Routing in Express', description: 'Handling routes', youtube_url: 'https://www.youtube.com/watch?v=fgTGADljAeg', youtube_video_id: 'fgTGADljAeg', duration_seconds: 600 },
                    { title: 'Middleware', description: 'Express middleware pattern', youtube_url: 'https://www.youtube.com/watch?v=9HOlhUGB6yQ', youtube_video_id: '9HOlhUGB6yQ', duration_seconds: 720 }
                ]
            },
            {
                title: 'REST API Development',
                videos: [
                    { title: 'Building REST APIs', description: 'RESTful API design', youtube_url: 'https://www.youtube.com/watch?v=fgTGADljAeg', youtube_video_id: 'fgTGADljAeg', duration_seconds: 1800 },
                    { title: 'CRUD Operations', description: 'Create, Read, Update, Delete', youtube_url: 'https://www.youtube.com/watch?v=wg2kTosKzPs', youtube_video_id: 'wg2kTosKzPs', duration_seconds: 1200 },
                    { title: 'Error Handling', description: 'Proper error responses', youtube_url: 'https://www.youtube.com/watch?v=DyqVqaf1eMM', youtube_video_id: 'DyqVqaf1eMM', duration_seconds: 600 }
                ]
            }
        ]
    },
    {
        title: 'Full Stack Web Development',
        slug: 'full-stack-web-development',
        description: 'Become a full stack developer. Learn frontend and backend technologies, build complete web applications from database to deployment.',
        category: 'Web Development',
        difficulty: 'advanced' as const,
        estimated_hours: 80,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/nu_pCVPKzTk/maxresdefault.jpg',
        tags: ['Full Stack', 'MERN', 'Web Development', 'Project'],
        is_featured: true,
        sections: [
            {
                title: 'Full Stack Fundamentals',
                videos: [
                    { title: 'Full Stack Web Development Course', description: 'Complete full stack tutorial', youtube_url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk', youtube_video_id: 'nu_pCVPKzTk', duration_seconds: 14400 },
                    { title: 'Frontend vs Backend', description: 'Understanding the stack', youtube_url: 'https://www.youtube.com/watch?v=FQdaUf95s5I', youtube_video_id: 'FQdaUf95s5I', duration_seconds: 600 },
                    { title: 'Project Setup', description: 'Setting up development environment', youtube_url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', youtube_video_id: 'w7ejDZ8SWv8', duration_seconds: 900 }
                ]
            },
            {
                title: 'MERN Stack Project',
                videos: [
                    { title: 'MERN Stack Tutorial', description: 'MongoDB, Express, React, Node', youtube_url: 'https://www.youtube.com/watch?v=-0exw-9YJBo', youtube_video_id: '-0exw-9YJBo', duration_seconds: 7200 },
                    { title: 'Database Design', description: 'MongoDB schema design', youtube_url: 'https://www.youtube.com/watch?v=ofme2o29ngU', youtube_video_id: 'ofme2o29ngU', duration_seconds: 900 },
                    { title: 'API Integration', description: 'Connecting frontend to backend', youtube_url: 'https://www.youtube.com/watch?v=ZGymN8a7svQ', youtube_video_id: 'ZGymN8a7svQ', duration_seconds: 1080 }
                ]
            },
            {
                title: 'Deployment',
                videos: [
                    { title: 'Deploying Web Applications', description: 'Production deployment', youtube_url: 'https://www.youtube.com/watch?v=mgfigaZrZjo', youtube_video_id: 'mgfigaZrZjo', duration_seconds: 1200 },
                    { title: 'CI/CD Pipeline', description: 'Automated deployment', youtube_url: 'https://www.youtube.com/watch?v=ScUKe3vC1SQ', youtube_video_id: 'ScUKe3vC1SQ', duration_seconds: 900 },
                    { title: 'Performance Optimization', description: 'Optimizing for production', youtube_url: 'https://www.youtube.com/watch?v=mLgWmpF2TXw', youtube_video_id: 'mLgWmpF2TXw', duration_seconds: 720 }
                ]
            }
        ]
    },

    // ==================== COMPUTER SCIENCE CORE ====================
    {
        title: 'Data Structures Complete Course',
        slug: 'data-structures-complete',
        description: 'Master data structures for coding interviews and software development. Learn arrays, linked lists, trees, graphs, hash tables, and more.',
        category: 'Computer Science Core',
        difficulty: 'intermediate' as const,
        estimated_hours: 45,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/RBSGKlAvoiM/maxresdefault.jpg',
        tags: ['Data Structures', 'Algorithms', 'Interview', 'DSA'],
        is_featured: true,
        sections: [
            {
                title: 'Introduction to Data Structures',
                videos: [
                    { title: 'Data Structures Full Course', description: 'Complete DSA tutorial', youtube_url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', youtube_video_id: 'RBSGKlAvoiM', duration_seconds: 14400 },
                    { title: 'Big O Notation', description: 'Time and space complexity', youtube_url: 'https://www.youtube.com/watch?v=Mo4whiaP_1s', youtube_video_id: 'Mo4whiaP_1s', duration_seconds: 900 },
                    { title: 'Arrays', description: 'Array data structure', youtube_url: 'https://www.youtube.com/watch?v=55l-aZ7_F24', youtube_video_id: '55l-aZ7_F24', duration_seconds: 720 }
                ]
            },
            {
                title: 'Linear Data Structures',
                videos: [
                    { title: 'Linked Lists', description: 'Singly and doubly linked lists', youtube_url: 'https://www.youtube.com/watch?v=HsLFb5l1NQU', youtube_video_id: 'HsLFb5l1NQU', duration_seconds: 1080 },
                    { title: 'Stacks', description: 'LIFO data structure', youtube_url: 'https://www.youtube.com/watch?v=F1F2imiD_J8', youtube_video_id: 'F1F2imiD_J8', duration_seconds: 720 },
                    { title: 'Queues', description: 'FIFO data structure', youtube_url: 'https://www.youtube.com/watch?v=baheIFEwHmo', youtube_video_id: 'baheIFEwHmo', duration_seconds: 660 }
                ]
            },
            {
                title: 'Trees and Graphs',
                videos: [
                    { title: 'Binary Trees', description: 'Tree data structures', youtube_url: 'https://www.youtube.com/watch?v=H5JubkIy_p8', youtube_video_id: 'H5JubkIy_p8', duration_seconds: 1200 },
                    { title: 'Binary Search Trees', description: 'BST operations', youtube_url: 'https://www.youtube.com/watch?v=cgtLOcS9Enk', youtube_video_id: 'cgtLOcS9Enk', duration_seconds: 900 },
                    { title: 'Graphs', description: 'Graph representations', youtube_url: 'https://www.youtube.com/watch?v=gXgEDyodOJU', youtube_video_id: 'gXgEDyodOJU', duration_seconds: 1080 },
                    { title: 'Graph Traversal', description: 'BFS and DFS algorithms', youtube_url: 'https://www.youtube.com/watch?v=pcKY4hjTwEs', youtube_video_id: 'pcKY4hjTwEs', duration_seconds: 960 }
                ]
            },
            {
                title: 'Hash Tables',
                videos: [
                    { title: 'Hash Tables', description: 'Hashing and collision resolution', youtube_url: 'https://www.youtube.com/watch?v=KyUTuwzL7Fg', youtube_video_id: 'KyUTuwzL7Fg', duration_seconds: 840 },
                    { title: 'Hash Functions', description: 'Designing hash functions', youtube_url: 'https://www.youtube.com/watch?v=2Ti5gMhX1sQ', youtube_video_id: '2Ti5gMhX1sQ', duration_seconds: 600 }
                ]
            }
        ]
    },
    {
        title: 'Algorithms Complete Course',
        slug: 'algorithms-complete',
        description: 'Learn essential algorithms for coding interviews and competitive programming. Sorting, searching, dynamic programming, and graph algorithms.',
        category: 'Computer Science Core',
        difficulty: 'intermediate' as const,
        estimated_hours: 50,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/8hly31xKli0/maxresdefault.jpg',
        tags: ['Algorithms', 'DSA', 'Interview', 'Dynamic Programming'],
        is_featured: true,
        sections: [
            {
                title: 'Sorting Algorithms',
                videos: [
                    { title: 'Algorithms Full Course', description: 'Complete algorithms course', youtube_url: 'https://www.youtube.com/watch?v=8hly31xKli0', youtube_video_id: '8hly31xKli0', duration_seconds: 14400 },
                    { title: 'Bubble Sort', description: 'Basic sorting algorithm', youtube_url: 'https://www.youtube.com/watch?v=xli_FI7nLwA', youtube_video_id: 'xli_FI7nLwA', duration_seconds: 480 },
                    { title: 'Merge Sort', description: 'Divide and conquer sorting', youtube_url: 'https://www.youtube.com/watch?v=4VqmGXwpLqc', youtube_video_id: '4VqmGXwpLqc', duration_seconds: 720 },
                    { title: 'Quick Sort', description: 'Efficient sorting algorithm', youtube_url: 'https://www.youtube.com/watch?v=Hoixgm4-P4M', youtube_video_id: 'Hoixgm4-P4M', duration_seconds: 660 }
                ]
            },
            {
                title: 'Searching Algorithms',
                videos: [
                    { title: 'Binary Search', description: 'Efficient searching', youtube_url: 'https://www.youtube.com/watch?v=j5uXyPJ0Pew', youtube_video_id: 'j5uXyPJ0Pew', duration_seconds: 600 },
                    { title: 'Linear Search', description: 'Basic search algorithm', youtube_url: 'https://www.youtube.com/watch?v=C46Qf9W7t5A', youtube_video_id: 'C46Qf9W7t5A', duration_seconds: 360 }
                ]
            },
            {
                title: 'Dynamic Programming',
                videos: [
                    { title: 'Introduction to DP', description: 'DP fundamentals', youtube_url: 'https://www.youtube.com/watch?v=vYquumk4nW0', youtube_video_id: 'vYquumk4nW0', duration_seconds: 1800 },
                    { title: 'Fibonacci with DP', description: 'Classic DP problem', youtube_url: 'https://www.youtube.com/watch?v=ee0uQUYOkB0', youtube_video_id: 'ee0uQUYOkB0', duration_seconds: 720 },
                    { title: 'Knapsack Problem', description: '0/1 Knapsack DP', youtube_url: 'https://www.youtube.com/watch?v=y6kpGJBI7t0', youtube_video_id: 'y6kpGJBI7t0', duration_seconds: 900 },
                    { title: 'Longest Common Subsequence', description: 'LCS problem', youtube_url: 'https://www.youtube.com/watch?v=sSno9rV8Rhg', youtube_video_id: 'sSno9rV8Rhg', duration_seconds: 840 },
                ]
            }
        ]
    },
    {
        title: 'Database Management Systems (DBMS)',
        slug: 'dbms-complete',
        description: 'Complete DBMS course covering database design, normalization, SQL, transactions, and database management concepts for software engineers.',
        category: 'Computer Science Core',
        difficulty: 'intermediate' as const,
        estimated_hours: 40,
        instructor: 'Gate Smashers',
        thumbnail_url: 'https://i.ytimg.com/vi/kBdlM6hNDAE/maxresdefault.jpg',
        tags: ['DBMS', 'Database', 'SQL', 'Normalization'],
        is_featured: true,
        sections: [
            {
                title: 'Introduction to DBMS',
                videos: [
                    { title: 'DBMS Full Course', description: 'Complete DBMS tutorial by Gate Smashers', youtube_url: 'https://www.youtube.com/watch?v=kBdlM6hNDAE', youtube_video_id: 'kBdlM6hNDAE', duration_seconds: 28800 },
                    { title: 'What is a Database', description: 'Database basics explained', youtube_url: 'https://www.youtube.com/watch?v=ZtVw2LuO1qw', youtube_video_id: 'ZtVw2LuO1qw', duration_seconds: 600 },
                    { title: 'DBMS Architecture', description: 'Database system architecture', youtube_url: 'https://www.youtube.com/watch?v=5lW5tC6zCjA', youtube_video_id: '5lW5tC6zCjA', duration_seconds: 720 }
                ]
            },
            {
                title: 'Database Design',
                videos: [
                    { title: 'ER Diagrams', description: 'Entity-Relationship modeling', youtube_url: 'https://www.youtube.com/watch?v=5lW5tC6zCjA', youtube_video_id: '5lW5tC6zCjA', duration_seconds: 1080 },
                    { title: 'Normalization', description: 'Database normalization forms', youtube_url: 'https://www.youtube.com/watch?v=JgeatKiW_xo', youtube_video_id: 'JgeatKiW_xo', duration_seconds: 1200 },
                    { title: 'Functional Dependencies', description: 'Understanding dependencies', youtube_url: 'https://www.youtube.com/watch?v=JgeatKiW_xo', youtube_video_id: 'JgeatKiW_xo', duration_seconds: 900 }
                ]
            },
            {
                title: 'Transactions and Concurrency',
                videos: [
                    { title: 'ACID Properties', description: 'Transaction properties', youtube_url: 'https://www.youtube.com/watch?v=JgeatKiW_xo', youtube_video_id: 'JgeatKiW_xo', duration_seconds: 720 },
                    { title: 'Concurrency Control', description: 'Managing concurrent access', youtube_url: 'https://www.youtube.com/watch?v=JgeatKiW_xo', youtube_video_id: 'JgeatKiW_xo', duration_seconds: 900 },
                    { title: 'Locking Protocols', description: 'Database locks', youtube_url: 'https://www.youtube.com/watch?v=JgeatKiW_xo', youtube_video_id: 'JgeatKiW_xo', duration_seconds: 840 }
                ]
            }
        ]
    },
    {
        title: 'SQL Complete Course',
        slug: 'sql-complete-course',
        description: 'Master SQL from basics to advanced queries. Learn to create databases, write complex queries, optimize performance, and manage data effectively.',
        category: 'Computer Science Core',
        difficulty: 'beginner' as const,
        estimated_hours: 30,
        instructor: 'freeCodeCamp',
        thumbnail_url: 'https://i.ytimg.com/vi/HXV3zeQKqGY/maxresdefault.jpg',
        tags: ['SQL', 'Database', 'MySQL', 'PostgreSQL'],
        is_featured: true,
        sections: [
            {
                title: 'SQL Fundamentals',
                videos: [
                    { title: 'SQL Full Course', description: 'Complete SQL tutorial', youtube_url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', youtube_video_id: 'HXV3zeQKqGY', duration_seconds: 14400 },
                    { title: 'SELECT Statements', description: 'Querying data', youtube_url: 'https://www.youtube.com/watch?v=yOkKxuKuOYY', youtube_video_id: 'yOkKxuKuOYY', duration_seconds: 600 },
                    { title: 'WHERE Clause', description: 'Filtering data', youtube_url: 'https://www.youtube.com/watch?v=EfCyrY3pRTY', youtube_video_id: 'EfCyrY3pRTY', duration_seconds: 480 }
                ]
            },
            {
                title: 'Intermediate SQL',
                videos: [
                    { title: 'JOINs', description: 'Combining tables', youtube_url: 'https://www.youtube.com/watch?v=9yeOee0ahwg', youtube_video_id: '9yeOee0ahwg', duration_seconds: 1080 },
                    { title: 'GROUP BY', description: 'Aggregating data', youtube_url: 'https://www.youtube.com/watch?v=EN4j5Ym_5Mk', youtube_video_id: 'EN4j5Ym_5Mk', duration_seconds: 600 },
                    { title: 'Subqueries', description: 'Nested queries', youtube_url: 'https://www.youtube.com/watch?v=VQOBlXFIUjc', youtube_video_id: 'VQOBlXFIUjc', duration_seconds: 720 }
                ]
            },
            {
                title: 'Database Management',
                videos: [
                    { title: 'CREATE TABLE', description: 'Creating database tables', youtube_url: 'https://www.youtube.com/watch?v=1D0D_oLJuEI', youtube_video_id: '1D0D_oLJuEI', duration_seconds: 540 },
                    { title: 'INSERT, UPDATE, DELETE', description: 'Modifying data', youtube_url: 'https://www.youtube.com/watch?v=4JY4vE1uZUU', youtube_video_id: '4JY4vE1uZUU', duration_seconds: 660 },
                    { title: 'Indexes', description: 'Optimizing queries', youtube_url: 'https://www.youtube.com/watch?v=HFrTCIBYyMk', youtube_video_id: 'HFrTCIBYyMk', duration_seconds: 720 }
                ]
            }
        ]
    },
    {
        title: 'Operating Systems',
        slug: 'operating-systems',
        description: 'Learn operating system concepts including processes, threads, memory management, file systems, and CPU scheduling. Essential for CS students.',
        category: 'Computer Science Core',
        difficulty: 'intermediate' as const,
        estimated_hours: 35,
        instructor: 'Neso Academy',
        thumbnail_url: 'https://i.ytimg.com/vi/vBURT7sX6jA/maxresdefault.jpg',
        tags: ['Operating Systems', 'OS', 'Processes', 'Memory'],
        is_featured: false,
        sections: [
            {
                title: 'OS Introduction',
                videos: [
                    { title: 'Operating System Full Course', description: 'Complete OS tutorial', youtube_url: 'https://www.youtube.com/watch?v=vBURT7sX6jA', youtube_video_id: 'vBURT7sX6jA', duration_seconds: 18000 },
                    { title: 'What is an OS', description: 'OS basics and functions', youtube_url: 'https://www.youtube.com/watch?v=1Q2UbK4S8IE', youtube_video_id: '1Q2UbK4S8IE', duration_seconds: 720 },
                    { title: 'Types of OS', description: 'Different OS types', youtube_url: 'https://www.youtube.com/watch?v=UvD5c5XIe2k', youtube_video_id: 'UvD5c5XIe2k', duration_seconds: 600 }
                ]
            },
            {
                title: 'Process Management',
                videos: [
                    { title: 'Processes', description: 'Process concepts', youtube_url: 'https://www.youtube.com/watch?v=OrjTqJFN3KE', youtube_video_id: 'OrjTqJFN3KE', duration_seconds: 840 },
                    { title: 'Threads', description: 'Multithreading basics', youtube_url: 'https://www.youtube.com/watch?v=O3EyzlZxx3g', youtube_video_id: 'O3EyzlZxx3g', duration_seconds: 900 },
                    { title: 'CPU Scheduling', description: 'Scheduling algorithms', youtube_url: 'https://www.youtube.com/watch?v=EWurQ4pLhyE', youtube_video_id: 'EWurQ4pLhyE', duration_seconds: 1080 },
                    { title: 'Process Synchronization', description: 'Synchronization mechanisms', youtube_url: 'https://www.youtube.com/watch?v=2eUXY6-pmkI', youtube_video_id: '2eUXY6-pmkI', duration_seconds: 960 }
                ]
            },
            {
                title: 'Memory Management',
                videos: [
                    { title: 'Memory Allocation', description: 'Memory management basics', youtube_url: 'https://www.youtube.com/watch?v=1pMNP5B9-DY', youtube_video_id: '1pMNP5B9-DY', duration_seconds: 720 },
                    { title: 'Paging', description: 'Paging technique', youtube_url: 'https://www.youtube.com/watch?v=p9ybnLe2k48', youtube_video_id: 'p9ybnLe2k48', duration_seconds: 840 },
                    { title: 'Virtual Memory', description: 'Virtual memory concepts', youtube_url: 'https://www.youtube.com/watch?v=qcSzCefA1Ws', youtube_video_id: 'qcSzCefA1Ws', duration_seconds: 780 }
                ]
            }
        ]
    },
    {
        title: 'Computer Networks',
        slug: 'computer-networks',
        description: 'Complete computer networking course. Learn OSI model, TCP/IP, routing, switching, and network protocols. Essential for software engineers.',
        category: 'Computer Science Core',
        difficulty: 'intermediate' as const,
        estimated_hours: 40,
        instructor: 'Neso Academy',
        thumbnail_url: 'https://i.ytimg.com/vi/qiQR5rTSshw/maxresdefault.jpg',
        tags: ['Networking', 'TCP/IP', 'OSI Model', 'Protocols'],
        is_featured: false,
        sections: [
            {
                title: 'Network Fundamentals',
                videos: [
                    { title: 'Computer Networks Full Course', description: 'Complete networking tutorial', youtube_url: 'https://www.youtube.com/watch?v=qiQR5rTSshw', youtube_video_id: 'qiQR5rTSshw', duration_seconds: 21600 },
                    { title: 'Introduction to Networks', description: 'Network basics', youtube_url: 'https://www.youtube.com/watch?v=3QhU9jd03bo', youtube_video_id: '3QhU9jd03bo', duration_seconds: 720 },
                    { title: 'OSI Model', description: '7 layers of OSI', youtube_url: 'https://www.youtube.com/watch?v=7IS7g5un9GI', youtube_video_id: '7IS7g5un9GI', duration_seconds: 900 }
                ]
            },
            {
                title: 'TCP/IP and Protocols',
                videos: [
                    { title: 'TCP/IP Model', description: 'Internet protocol suite', youtube_url: 'https://www.youtube.com/watch?v=2TaV4R5LTQY', youtube_video_id: '2TaV4R5LTQY', duration_seconds: 840 },
                    { title: 'IP Addressing', description: 'IPv4 and IPv6', youtube_url: 'https://www.youtube.com/watch?v=5WfiTHiHSU4', youtube_video_id: '5WfiTHiHSU4', duration_seconds: 960 },
                    { title: 'TCP and UDP', description: 'Transport layer protocols', youtube_url: 'https://www.youtube.com/watch?v=uwoD5h25H5I', youtube_video_id: 'uwoD5h25H5I', duration_seconds: 720 },
                    { title: 'HTTP Protocol', description: 'Web protocol', youtube_url: 'https://www.youtube.com/watch?v=iYM2zFP3Zn8', youtube_video_id: 'iYM2zFP3Zn8', duration_seconds: 600 }
                ]
            },
            {
                title: 'Routing and Switching',
                videos: [
                    { title: 'Routing Algorithms', description: 'How routing works', youtube_url: 'https://www.youtube.com/watch?v=7WAtwbfOXFE', youtube_video_id: '7WAtwbfOXFE', duration_seconds: 900 },
                    { title: 'Switching', description: 'Network switching', youtube_url: 'https://www.youtube.com/watch?v=K2QHbJtvL_c', youtube_video_id: 'K2QHbJtvL_c', duration_seconds: 720 },
                    { title: 'DNS', description: 'Domain name system', youtube_url: 'https://www.youtube.com/watch?v=mpQZVYPuDGg', youtube_video_id: 'mpQZVYPuDGg', duration_seconds: 660 }
                ]
            }
        ]
    },
    {
        title: 'Software Engineering',
        slug: 'software-engineering',
        description: 'Learn software engineering principles, methodologies, and best practices. SDLC, agile, testing, and project management for developers.',
        category: 'Computer Science Core',
        difficulty: 'intermediate' as const,
        estimated_hours: 30,
        instructor: 'Neso Academy',
        thumbnail_url: 'https://i.ytimg.com/vi/WnCUlt6-KHU/maxresdefault.jpg',
        tags: ['Software Engineering', 'SDLC', 'Agile', 'Testing'],
        is_featured: false,
        sections: [
            {
                title: 'Software Process',
                videos: [
                    { title: 'Software Engineering Full Course', description: 'Complete SE tutorial', youtube_url: 'https://www.youtube.com/watch?v=WnCUlt6-KHU', youtube_video_id: 'WnCUlt6-KHU', duration_seconds: 14400 },
                    { title: 'SDLC Models', description: 'Software development life cycle', youtube_url: 'https://www.youtube.com/watch?v=I0Y5Uk1q7fs', youtube_video_id: 'I0Y5Uk1q7fs', duration_seconds: 900 },
                    { title: 'Agile Methodology', description: 'Agile development', youtube_url: 'https://www.youtube.com/watch?v=9zZuDjTEJlI', youtube_video_id: '9zZuDjTEJlI', duration_seconds: 720 }
                ]
            },
            {
                title: 'Requirements and Design',
                videos: [
                    { title: 'Requirements Engineering', description: 'Gathering requirements', youtube_url: 'https://www.youtube.com/watch?v=9zZuDjTEJlI', youtube_video_id: '9zZuDjTEJlI', duration_seconds: 600 },
                    { title: 'Software Design', description: 'Design principles', youtube_url: 'https://www.youtube.com/watch?v=Fs1FEH6cKZc', youtube_video_id: 'Fs1FEH6cKZc', duration_seconds: 720 },
                    { title: 'UML Diagrams', description: 'Unified modeling language', youtube_url: 'https://www.youtube.com/watch?v=WnMQ9HvJ6xI', youtube_video_id: 'WnMQ9HvJ6xI', duration_seconds: 900 }
                ]
            },
            {
                title: 'Testing and Quality',
                videos: [
                    { title: 'Software Testing', description: 'Testing strategies', youtube_url: 'https://www.youtube.com/watch?v=3fPBjW4d8lg', youtube_video_id: '3fPBjW4d8lg', duration_seconds: 840 },
                    { title: 'Unit Testing', description: 'Testing individual units', youtube_url: 'https://www.youtube.com/watch?v=3fPBjW4d8lg', youtube_video_id: '3fPBjW4d8lg', duration_seconds: 600 },
                    { title: 'Code Quality', description: 'Maintaining code quality', youtube_url: 'https://www.youtube.com/watch?v=qLq2mMIBtAc', youtube_video_id: 'qLq2mMIBtAc', duration_seconds: 540 }
                ]
            }
        ]
    }
];

export { additionalCourses };
