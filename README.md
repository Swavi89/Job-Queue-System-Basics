# TypeScript Jobs Project 🚀

A robust job queue system built with TypeScript, Express, and BullMQ for handling asynchronous file operations with Redis as the message broker.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Development](#development)
- [API Reference](#api-reference)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)

## ✨ Features

- **Job Queue System**: Asynchronous job processing using BullMQ
- **Redis Integration**: Reliable message broker for job queuing
- **Express Server**: RESTful API for job submission
- **TypeScript**: Full type safety and modern JavaScript features
- **Docker Support**: Easy containerized development environment
- **File Operations**: Background file writing capabilities

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for Redis)
- **TypeScript** (installed globally or locally)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd typescript-jobs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start Redis using Docker**

   ```bash
   docker-compose up -d
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
typescript-jobs/
├── server.ts          # Express server with job queue API
├── worker.ts          # BullMQ worker for processing jobs
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── docker-compose.yml # Redis container setup
├── dist/              # Compiled JavaScript output
└── node_modules/      # Dependencies
```

## 🎯 Usage

### Starting the Services

1. **Start Redis** (if not already running):

   ```bash
   docker-compose up -d
   ```

2. **Start the worker** (in a separate terminal):

   ```bash
   npx ts-node worker.ts
   ```

3. **Start the server** (in another terminal):
   ```bash
   npx ts-node server.ts
   ```

### API Usage

The server provides a REST API for submitting file writing jobs:

**Endpoint**: `GET /write-to-file`

**Query Parameters**:

- `fileName`: Name of the file to create
- `fileContent`: Content to write to the file

**Example Request**:

```bash
curl "http://localhost:3000/write-to-file?fileName=test.txt&fileContent=Hello%20World!"
```

**Response**: The job is added to the queue and processed asynchronously by the worker.

### Job Processing

Jobs are processed in the background by the worker:

- Jobs are queued in Redis
- Worker picks up jobs and writes files
- Console logs show job processing status
- Error handling for failed operations

## 🛠️ Development

### Available Scripts

```bash
npm run build    # Compile TypeScript to JavaScript
npm test         # Run tests (placeholder)
```

### Development Workflow

1. **Make changes** to TypeScript files
2. **Build the project**: `npm run build`
3. **Restart services** as needed
4. **Test your changes** using the API

### TypeScript Configuration

The project uses modern TypeScript settings:

- **Target**: ES2020
- **Module**: NodeNext
- **Module Resolution**: NodeNext
- **Source Maps**: Enabled
- **Output Directory**: `dist/`

## 📚 API Reference

### Server Endpoints

| Method | Endpoint         | Description               | Query Parameters          |
| ------ | ---------------- | ------------------------- | ------------------------- |
| GET    | `/write-to-file` | Submit a file writing job | `fileName`, `fileContent` |

### Worker Configuration

The worker processes jobs from the "SendHello" queue and:

- Extracts `fileName` and `fileContent` from job data
- Writes content to the specified file
- Returns success/error status
- Logs processing information

## 🐳 Docker Setup

The project includes Docker Compose configuration for Redis:

```yaml
version: "3.8"
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
```

**Benefits**:

- Persistent Redis data
- Easy development setup
- Consistent environment across machines

## 🔍 Monitoring and Debugging

### Console Output

- **Server**: Shows startup message and port
- **Worker**: Displays job processing status and file operations
- **Error Handling**: Comprehensive error logging

### Redis Monitoring

You can monitor Redis using:

```bash
docker exec -it <redis-container> redis-cli
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Redis Connection Error**

   - Ensure Redis is running: `docker-compose ps`
   - Check Redis logs: `docker-compose logs redis`

2. **Port Already in Use**

   - Change the port in `server.ts` or stop conflicting services

3. **TypeScript Compilation Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check `tsconfig.json` for configuration issues

### Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Verify all services are running
3. Ensure Redis is accessible on localhost:6379
4. Review the API request format

---

**Happy Coding! 🎉**
