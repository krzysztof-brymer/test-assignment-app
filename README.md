# Test Assignment Application

This project is an RESTful API application based on Express with usage of TypeScript. Database conneciton is being made using TypeORM.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18.x.x or higher)
- Docker and Docker Compose

### Installation

Follow these steps to set up the project locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/krzysztof-brymer/test-assignment-app.git
   cd test-assignment-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

### Environment Setup

1. **Set up environment variables**

   Copy `.env.example` to `.env` and update it with your local settings:

   ```bash
   cp .env.example .env
   ```

### Using Docker Compose

For convenience, you can use Docker Compose to run both databases locally:

- Postgres Database
- test Postgres Database

```bash
docker-compose up
```

## Running the Application

### Development Mode

Run the application in development mode with hot reload:

```bash
npm run dev
```

This uses nodemon and ts-node to run your TypeScript application, watching for changes.

### Production Mode

```bash
npm start
```

This script first builds the project and then starts the server.

**NOTE:** both scripts does run automatic migration on local database, creating User table in Postgres DB.

## Testing

Execute automated tests written with Jest and Supertest. Tests are running on separate, test database not to corrupt local Postgres DB data.

```bash
npm test
```

Make sure your environment is properly set up for testing (e.g., test database configuration created by `docker compose up` command).

## Swagger Documentation

The Swagger UI can be accessed directly through your web browser at:

```bash
http://localhost:8888/docs
```

### How to Use

Navigate to the Swagger UI: Open the link provided above in a web browser.

- **Authentication:** For endpoints requiring authentication, you can enter authentication credentials directly within the Swagger UI (`user: test, password: testpw`)
- **Explore Endpoints:** Click on any endpoint to expand its details. You will see the HTTP method, URL path, description, parameters, request body examples.
- **Execute Requests:** Use the "Try it out" feature to fill in the required parameters or request body and execute the request.

## Contributing

Encourage contributions and provide guidelines on how to do so effectively. For instance:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -am 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is open-source and available under the MIT License.
