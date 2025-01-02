-- Create Database
CREATE DATABASE IF NOT EXISTS quiz_app;

-- Use the Database
USE quiz_app;

-- Create `quizzes` Table
CREATE TABLE quizzes (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

-- Create `questions` Table
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    quiz_id VARCHAR(36) NOT NULL,
    text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_option INT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Create `results` Table
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    selected_option INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
