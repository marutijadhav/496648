-- Create Database
CREATE DATABASE IF NOT EXISTS quiz_app;

-- Use the Database
USE quiz_app;

-- Create `quizzes` Table
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(36) PRIMARY KEY,           -- Unique identifier for the quiz
    title VARCHAR(255) NOT NULL,         -- Title of the quiz
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of quiz creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp of last update
);

-- Create `questions` Table
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,          -- Unique identifier for the question
    quiz_id VARCHAR(36) NOT NULL,        -- Foreign key to quizzes table
    text TEXT NOT NULL,                  -- The question text
    options JSON NOT NULL,               -- JSON array of answer options
    correct_option INT NOT NULL,         -- Index of the correct answer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of question creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp of last update
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE -- Cascade delete when quiz is deleted
);

-- Create `results` Table
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,   -- Unique identifier for each result
    quiz_id VARCHAR(36) NOT NULL,        -- Foreign key to quizzes table
    user_id VARCHAR(255) NOT NULL,       -- ID of the user who took the quiz
    question_id VARCHAR(50) NOT NULL,    -- Foreign key to questions table
    selected_option INT NOT NULL,        -- Index of the selected answer
    is_correct BOOLEAN NOT NULL,         -- Whether the answer was correct
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of result creation
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE, -- Cascade delete when quiz is deleted
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE -- Cascade delete when question is deleted
);

-- Create Indexes for Optimization
CREATE INDEX idx_quiz_user ON results (quiz_id, user_id);
CREATE INDEX idx_question ON results (question_id);
