# Streaker - Backend

## Introduction
Streaker is a web application backend built to track and manage user activity streaks. It provides a robust API infrastructure to support the frontend application in maintaining user engagement through streak-based incentives.

## Features
- User authentication and authorization
- Streak tracking and management
- Activity logging
- API endpoints for streak statistics
- Data persistence with PostgreSQL
- RESTful API architecture

## Tech Stack
- Node.js
- Hono.js
- PostgreSQL
- JWT for authentication
- Prisma ORM

## Local Setup

### Prerequisites
- Node.js (v14 or higher)
- npm  package manager

### Installation Steps
1. Clone the repository
```bash
git clone https://github.com/dexter-ifti/streaker.git
cd streaker-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. Start the development server
```bash
npm run dev
```

The server will start at `http://localhost:5000`


## Deployment
The application is deployed at: [https://streaker-backend.archonbumper.workers.dev](https://streaker-backend.archonbumper.workers.dev)

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.