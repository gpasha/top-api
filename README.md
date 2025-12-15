# Top Rating API

REST API for a product and goods rating system built with NestJS.

## Description

Top Rating API is a backend application for managing ratings of products, goods, courses, services, and books. The API provides functionality for:

- User authentication and authorization (JWT)
- User management
- Creating and managing top pages with categories
- Product management
- Review system

## Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Containerization**: Docker & Docker Compose

## Project Structure

```
src/
├── auth/              # Authentication and authorization module
├── users/             # User management module
├── top-page/          # Top pages with categories module
├── product/           # Product module
├── review/            # Review module
├── configs/           # Configurations (MongoDB, JWT)
├── decorators/        # Custom decorators
└── pipes/             # Validation pipes
```

## Installation and Setup

### Requirements

- Node.js 20+
- npm or yarn
- Docker and Docker Compose (for Docker deployment)

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# MongoDB
MONGO_LOGIN=admin
MONGO_PASSWORD=admin
MONGO_HOST=localhost
MONGO_PORT=27018
MONGO_AUTH_DB=admin

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Application
PORT=3000
NODE_ENV=development
```

## Running the Application

### Local Development

```bash
# Development mode with hot-reload
npm run start:dev

# Standard start
npm run start

# Debug mode
npm run start:debug
```

### Production

```bash
# Build the project
npm run build

# Run production version
npm run start:prod
```

### Running with Docker Compose

```bash
# Start all services (API + MongoDB)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at: `http://localhost:3000/api`

## API Endpoints

All endpoints have the `/api` prefix.

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to the system

### Users

- Endpoints for user management (authentication required)

### Top Pages

- Endpoints for creating and managing top pages with categories

### Products

- Endpoints for product management

### Reviews

- Endpoints for creating and managing reviews

## Testing

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

### Code Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

## Docker

### Build Image

```bash
docker build -t top-api .
```

### Run Container

```bash
docker run -p 3000:3000 top-api
```

## License

UNLICENSED
