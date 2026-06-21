# Helfy Home Assignment

The project includes:

- React client with a basic login screen
- Node.js + Express REST API
- TiDB database
- Apache Kafka message broker
- TiDB CDC for database change capture
- Node.js Kafka consumer for real-time database change logging
- Docker Compose setup for running the entire environment with one command
- Structured JSON logging using log4js

---

## Technology Stack

- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: TiDB
- Message Queue: Apache Kafka
- Change Data Capture: TiDB CDC
- Logging: log4js
- Containerization: Docker + Docker Compose

---

## Project Flow

1. The user opens the React client.
2. The user logs in with email and password.
3. The client sends the credentials to the Node.js API.
4. The API validates the user against the TiDB database.
5. When login succeeds:
   - A token is generated.
   - The token is stored in the `user_tokens` table.
   - A structured JSON login log is written to the API console using log4js.
6. TiDB CDC captures the insert operation from the database.
7. TiDB CDC publishes the database change event to Kafka.
8. The Node.js consumer reads the Kafka message.
9. The consumer writes the database change event to the console in structured JSON format.

---

## Default User

The database is initializes automatically and a default user is created with the following credentials:

```text
Email: admin@example.com
Password: admin123
```

---

## Running the Project

The entire project runs with a single Docker Compose command.

```bash
docker compose up --build
```

No `.env` file is required.

The environment variables are already defined inside `docker-compose.yml` so the project can be cloned and started directly.

---

## How to Verify the Assignment

### 1. Start the Project

```bash
docker compose up --build
```

### 2. Open the Client

Go to:

```text
http://localhost:5173
```

### 3. Login

Use:

```text
Email: admin@example.com
Password: admin123
```

## Notes

The default credentials and direct environment variables in `docker-compose.yml` are included intentionally so the assignment can run with one command and without requiring a separate `.env` file.