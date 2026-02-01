export const devProjects = [
  {
    id: 1,
    title: 'WealthTrack',
    tech: ['React Native', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'JWT + BCrypt'],
    description: 'Full-stack mobile application for tracking personal finances and investments with real-time price updates and portfolio analytics.',
    highlights: [
      'Built cross-platform mobile app with React Native and Expo; supports iOS and Android with single codebase',
      'Integrated Yahoo Finance and CoinGecko APIs for real-time price fetching across stocks, crypto, and ETFs',
      'Implemented PostgreSQL-backed REST API with Prisma ORM for type-safe database operations and migrations',
      'Designed premium minimal UI with custom black & white theme, shadows, and responsive layouts',
      'Built secure authentication system with JWT tokens, bcrypt password hashing, and SecureStore integration',
      'Created portfolio analytics engine calculating real-time gains/losses and asset performance metrics',
      'Added price caching layer reducing external API calls and improving response times by ~60%',
      'Architected RESTful API with 12 endpoints supporting full CRUD operations for user assets'
    ],
    github: 'https://github.com/mahyar-jbr/wealthtrack-mobile',
    images: [
      '/projects/wealthtrack-dashboard.jpg', // Portfolio/Dashboard view
      '/projects/wealthtrack-asset.jpg', // Asset detail/Chart view
      '/projects/wealthtrack-add.jpg', // Add asset screen
    ],
    year: '2026'
  },
  {
    id: 2,
    title: 'Pet AI Assistant',
    tech: ['Python', 'FastAPI', 'MongoDB', 'React', 'Vite'],
    description: 'AI-powered application that generates personalized dog food recommendations based on pet profiles.',
    highlights: [
      'Built full-stack web application with React + Vite frontend and FastAPI backend supporting personalized pet nutrition recommendations',
      'Engineered rule-based recommendation engine processing pet profiles (age, breed, weight, allergies, health goals) to match optimal nutrition products',
      'Developed custom web scrapers using BeautifulSoup4 and lxml to extract dog food products from Orijen and PetValu catalogs with ingredient parsing',
      'Implemented async MongoDB integration with Motor driver for high-performance data persistence and retrieval',
      'Designed RESTful API with FastAPI featuring automatic Swagger documentation, request validation, and error handling',
      'Created dynamic React UI with real-time allergy filtering, multi-criteria product comparison, and responsive card layouts',
      'Built data processing pipeline normalizing scraped product data into structured schemas for efficient querying',
      'Architected scalable backend foundation to support future ML-based recommendation system trained on nutritional data and user preferences'
    ],
    github: 'https://github.com/mahyar-jbr/pet-ai-assistant',
    images: [
      '/projects/PAA-form.png',
      '/projects/PAA-recommendation.png',
      '/projects/PAA-comp1.png',
      '/projects/PAA-comp2.png',
    ],
    year: '2026'
  },
  {
    id: 3,
    title: 'School Management System',
    tech: ['Python', 'FastAPI', 'SQLAlchemy', 'SQLite', 'React', 'Vite', 'jsPDF'],
    description: 'Full-stack web app for managing students, teachers, courses, enrollments, and grades with real-time analytics and data export.',
    highlights: [
      'Built full-stack school management system with FastAPI REST API backend and React SPA frontend supporting complete CRUD for students, teachers, and courses',
      'Designed relational enrollment and grading system with automatic GPA calculation on student profile pages',
      'Implemented real-time dashboard with aggregate statistics including student/teacher counts and average grades',
      'Built data export pipeline generating CSV files and styled PDF reports using jsPDF',
      'Added search and filtering across all tables with form validation and inline error messages',
      'Created dark/light theme toggle with toast notification system and responsive design',
      'Backend provides auto-generated API documentation via Swagger UI and ReDoc'
    ],
    github: 'https://github.com/mahyar-jbr/school-management-api',
    images: [
      '/projects/school1.png',
      '/projects/school2.png',
      '/projects/school3.png',
      '/projects/school4.png',
    ],
    year: '2026'
  },
  {
    id: 4,
    title: 'Dog Wash Booking System',
    tech: ['React', 'FastAPI', 'Python', 'SQLAlchemy'],
    description: 'Full-stack appointment scheduling platform for a pet grooming business with admin dashboard and customer booking wizard.',
    highlights: [
      'Developed full-stack appointment scheduling platform with React frontend and Python/FastAPI REST API',
      'Built admin dashboard featuring interactive weekly calendar view, booking management, and real-time filtering across 2 service stations',
      'Implemented double-booking prevention algorithm with time-slot collision detection supporting variable durations (30/60/90 min)',
      'Created 5-step customer booking wizard with dynamic availability based on day-specific store hours and existing reservations',
      'Collaborated in 3-person team delivering MVP within 1-week timeline using Git branching workflow'
    ],
    github: 'https://github.com/mahyar-jbr/dog-wash-booking',
    images: [],
    year: '2026'
  },
  {
    id: 5,
    title: 'Hotel Booking Database System',
    tech: ['SQL', 'ER Modeling', 'Docker'],
    description: 'Normalized database system for hotel operations with advanced SQL queries and optimization.',
    highlights: [
      'Engineered a production-style SQL Server schema for hotel reservations with enforced constraints and cascading relationships',
      'Authored analytical and operational queries (revenue, occupancy, loyalty tracking) using joins, aggregates, and window functions',
      'Applied indexing strategies that improved availability query performance by 4× on large datasets',
      'Packaged with reproducible seed scripts and schema diagrams for deployment and benchmarking'
    ],
    github: 'https://github.com/mahyar-jbr/Hotel-Booking-Database-System',
    year: '2025'
  }
];
