
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
const db = require('./dbconfig');

const app = express();
const PORT = 3000;

app.use(express.json());

// Create Quiz
app.post('/quizzes', async (req, res) => {
    const { title, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Invalid quiz data.' });
    }

    const quizId = uuidv4();

    try {
        await db.query('INSERT INTO quizzes (id, title) VALUES (?, ?)', [quizId, title]);

        for (const [index, q] of questions.entries()) {
            const questionId = `${quizId}-q${index + 1}`;
            await db.query(
                'INSERT INTO questions (id, quiz_id, text, options, correct_option) VALUES (?, ?, ?, ?, ?)',
                [questionId, quizId, q.text, JSON.stringify(q.options), q.correct_option]
            );
        }

        res.status(201).json({ quizId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get Quiz
app.get('/quizzes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [quizRows] = await db.query('SELECT * FROM quizzes WHERE id = ?', [id]);
        if (quizRows.length === 0) {
            return res.status(404).json({ error: 'Quiz not found.' });
        }

        const [questionsRows] = await db.query('SELECT id, text, options FROM questions WHERE quiz_id = ?', [id]);

        res.json({ id: quizRows[0].id, title: quizRows[0].title, questions: questionsRows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Submit Answer
app.post('/quizzes/:quizId/questions/:questionId/answers', async (req, res) => {
    const { quizId, questionId } = req.params;
    const { selected_option } = req.body;
    const userId = req.headers['user-id'] || 'anonymous';

    try {
        const [questionRows] = await db.query('SELECT * FROM questions WHERE id = ?', [questionId]);
        if (questionRows.length === 0) {
            return res.status(404).json({ error: 'Question not found.' });
        }

        const question = questionRows[0];
        const isCorrect = question.correct_option === selected_option;

        await db.query(
            'INSERT INTO results (quiz_id, user_id, question_id, selected_option, is_correct) VALUES (?, ?, ?, ?, ?)',
            [quizId, userId, questionId, selected_option, isCorrect]
        );

        res.json({ is_correct: isCorrect, correct_option: question.correct_option });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get Results
app.get('/quizzes/:quizId/results/:userId', async (req, res) => {
    const { quizId, userId } = req.params;

    try {
        const [resultsRows] = await db.query(
            'SELECT * FROM results WHERE quiz_id = ? AND user_id = ?',
            [quizId, userId]
        );

        if (resultsRows.length === 0) {
            return res.status(404).json({ error: 'Results not found.' });
        }

        const score = resultsRows.filter(r => r.is_correct).length;
        res.json({ quiz_id: quizId, user_id: userId, score, answers: resultsRows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
