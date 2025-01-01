# Quiz App API

This is a RESTful API for managing and executing a quiz application. The service allows users to create quizzes, answer questions, and retrieve results.

## Features
- Create a new quiz with multiple-choice questions.
- Fetch quiz details without revealing the correct answers.
- Submit answers and receive immediate feedback.
- Retrieve results, including scores and answer summaries.

## Requirements
- **Node.js** (v14 or later)
- **npm** or **yarn** for dependency management

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quiz-app-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Application
```bash
npm start
```
The server will start on `http://localhost:3000`.

### 4. Run Tests
To execute unit and integration tests:
```bash
npm test
```

## API Endpoints

### 1. Create Quiz
**Endpoint:** `POST /quizzes`

**Request Body:**
```json
{
  "title": "Sample Quiz",
  "questions": [
    {
      "text": "What is the capital of France?",
      "options": ["Berlin", "Madrid", "Paris", "Rome"],
      "correct_option": 2
    }
  ]
}
```

**Response:**
```json
{
  "quizId": "<generated-uuid>"
}
```

### 2. Get Quiz
**Endpoint:** `GET /quizzes/:id`

**Response:**
```json
{
  "id": "<quiz-id>",
  "title": "Sample Quiz",
  "questions": [
    {
      "id": "<question-id>",
      "text": "What is the capital of France?",
      "options": ["Berlin", "Madrid", "Paris", "Rome"]
    }
  ]
}
```

### 3. Submit Answer
**Endpoint:** `POST /quizzes/:quizId/questions/:questionId/answers`

**Request Body:**
```json
{
  "selected_option": 2
}
```

**Response:**
```json
{
  "is_correct": true,
  "correct_option": 2
}
```

### 4. Get Results
**Endpoint:** `GET /quizzes/:quizId/results/:userId`

**Response:**
```json
{
  "score": 1,
  "answers": [
    {
      "question_id": "<question-id>",
      "selected_option": 2,
      "is_correct": true
    }
  ]
}
```

## Known Issues and Limitations
- Data is stored in memory, so all quizzes and results will be lost upon server restart.
- Limited validation and error handling.

## Future Enhancements
- Persistent storage using a database (e.g., MongoDB, PostgreSQL).
- User authentication and role management.
- Pagination for large quizzes and results.

## Docker Setup
A `docker-compose.yml` file is provided for containerized deployment.

### 1. Build and Run
```bash
docker-compose up --build
```

### 2. Access the API
The API will be available at `http://localhost:3000`.

## License
This project is licensed under the MIT License.