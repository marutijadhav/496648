
// Take-Home Exam: Create a Quiz App (API-based)
// Objective: 
// Build a RESTful APIs for a quiz application that allows users to answer multiple-choice questions and receive feedback on their performance.
// Instructions:
// You are required to develop a backend service with RESTful APIs to manage and execute a quiz. 
// Requirements:
// •	API Endpoints:
// •	Create Quiz:
// o	Endpoint to create a new quiz with a set of questions.
// o	Each question should have 4 answer options and indicate the correct answer.
// •	Get Quiz:
// o	Endpoint to fetch a quiz by its ID.
// o	Return the questions without revealing the correct answers.
// •	Submit Answer:
// o	Endpoint to submit an answer for a specific question in a quiz.
// o	Return immediate feedback if the answer is correct or incorrect and provide the correct answer if the user was wrong.
// •	Get Results:
// o	Endpoint to get the user's results for a specific quiz.
// o	Return the score and a summary of the user's answers (correct/incorrect).
// •	Data Models:
// o	Quiz:
// 	id: Unique identifier for the quiz.
// 	title: Title of the quiz.
// 	questions: List of questions.
// o	Question:
// 	id: Unique identifier for the question.
// 	text: The question text.
// 	options: List of answer options.
// 	correct_option: Index of the correct answer.
// o	Answer:
// 	question_id: ID of the question being answered.
// 	selected_option: Index of the selected answer.
// 	is_correct: Boolean indicating if the answer was correct.
// o	Result:
// 	quiz_id: ID of the quiz.
// 	user_id: ID of the user.
// 	score: The user's score.
// 	answers: List of answers provided by the user.


// Backend:

// Use any programming language and framework you are comfortable with (e.g., Node.js/Express, Python/Django).
// Use an in-memory backend for storing quizzes, questions, and user answers.

// Technical Requirements:
// •	Follow RESTful principles for API design.
// 	Return 201 status on create
// 	Return 404 status on not found
// 	Return 500 status on error
// •	Use appropriate HTTP status codes and methods (GET, POST, PUT, DELETE).
// •	Include validation and error handling for inputs.

// Submission:
// •	Typescript and JavaScript are preferred solutions.
// •	Create a GitHub repository and push your code.
// •	DO NOT identify the repo and/or the task as being connected to Madison Logic
// •	Commit unit and/or integrations tests files along with the code
// •	Include a README file with:
// o	Instructions on how to set up and run the service - a docker-compose file with all dependencies will be sufficient in most cases.
// o	Any known issues or limitations.

// Evaluation Criteria:
// •	Functionality
// o	 Do the APIs meet the requirements and perform the necessary tasks?
// •	Code Quality: 
// o	Is the code well-structured, tested appropriately (integration or unit), commented, and easy to understand?
// •	API Design: 
// o	Are the APIs well-designed, following RESTful principles and best practices?
// •	Algorithms: 
// o	Appropriate storage mechanisms for access of data


// write code for this api

const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory storage
const quizzes = {};
const results = {};

// Create Quiz
app.post('/quizzes', (req, res) => {
    const { title, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Invalid quiz data.' });
    }

    const quizId = uuidv4();
    quizzes[quizId] = {
        id: quizId,
        title,
        questions: questions.map((q, index) => ({
            id: `${quizId}-q${index + 1}`,
            text: q.text,
            options: q.options,
            correct_option: q.correct_option
        }))
    };

    res.status(201).json({ quizId });
});

// Get Quiz
app.get('/quizzes/:id', (req, res) => {
    const { id } = req.params;
    const quiz = quizzes[id];

    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found.' });
    }

    const sanitizedQuiz = {
        id: quiz.id,
        title: quiz.title,
        questions: quiz.questions.map(({ id, text, options }) => ({ id, text, options }))
    };

    res.json(sanitizedQuiz);
});

// Submit Answer
app.post('/quizzes/:quizId/questions/:questionId/answers', (req, res) => {
    const { quizId, questionId } = req.params;
    const { selected_option } = req.body;

    const quiz = quizzes[quizId];
    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found.' });
    }

    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) {
        return res.status(404).json({ error: 'Question not found.' });
    }

    const isCorrect = question.correct_option === selected_option;
    const userId = req.headers['user-id'] || 'anonymous';

    if (!results[quizId]) results[quizId] = {};
    if (!results[quizId][userId]) results[quizId][userId] = { answers: [], score: 0 };

    results[quizId][userId].answers.push({
        question_id: questionId,
        selected_option,
        is_correct: isCorrect
    });

    if (isCorrect) results[quizId][userId].score += 1;

    res.json({ is_correct: isCorrect, correct_option: question.correct_option });
});

// Get Results
app.get('/quizzes/:quizId/results/:userId', (req, res) => {
    const { quizId, userId } = req.params;
    const quizResults = results[quizId]?.[userId];

    if (!quizResults) {
        return res.status(404).json({ error: 'Results not found.' });
    }

    res.json(quizResults);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
