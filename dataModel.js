let data =
{
    "dataModels": {
      "Quiz": {
        "id": "quiz123",
        "title": "General Knowledge Quiz",
        "questions": [
          {
            "id": "q1",
            "text": "What is the capital of France?",
            "options": ["Berlin", "Madrid", "Paris", "Rome"],
            "correct_option": 2
          },
          {
            "id": "q2",
            "text": "Who wrote 'Hamlet'?",
            "options": ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
            "correct_option": 1
          }
        ]
      },
      "Answer": {
        "question_id": "q1",
        "selected_option": 2,
        "is_correct": true
      },
      "Result": {
        "quiz_id": "quiz123",
        "user_id": "user456",
        "score": 1,
        "answers": [
          {
            "question_id": "q1",
            "selected_option": 2,
            "is_correct": true
          },
          {
            "question_id": "q2",
            "selected_option": 0,
            "is_correct": false
          }
        ]
      }
    },
    "apiEndpoints": {
      "CreateQuiz": {
        "method": "POST",
        "url": "/api/quizzes",
        "description": "Create a new quiz with a set of questions.",
        "requestBody": {
          "title": "General Knowledge Quiz",
          "questions": [
            {
              "text": "What is the capital of France?",
              "options": ["Berlin", "Madrid", "Paris", "Rome"],
              "correct_option": 2
            },
            {
              "text": "Who wrote 'Hamlet'?",
              "options": ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
              "correct_option": 1
            }
          ]
        },
        "response": {
          "status": 201,
          "body": {
            "id": "quiz123",
            "message": "Quiz created successfully."
          }
        }
      },
      "GetQuiz": {
        "method": "GET",
        "url": "/api/quizzes/quiz123",
        "description": "Fetch a quiz by its ID without revealing the correct answers.",
        "response": {
          "status": 200,
          "body": {
            "id": "quiz123",
            "title": "General Knowledge Quiz",
            "questions": [
              {
                "id": "q1",
                "text": "What is the capital of France?",
                "options": ["Berlin", "Madrid", "Paris", "Rome"]
              },
              {
                "id": "q2",
                "text": "Who wrote 'Hamlet'?",
                "options": ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"]
              }
            ]
          }
        }
      },
      "SubmitAnswer": {
        "method": "POST",
        "url": "/api/quizzes/quiz123/answers",
        "description": "Submit an answer for a specific question.",
        "requestBody": {
          "question_id": "q1",
          "selected_option": 2
        },
        "response": {
          "status": 200,
          "body": {
            "question_id": "q1",
            "is_correct": true
          }
        }
      },
      "GetResults": {
        "method": "GET",
        "url": "/api/quizzes/quiz123/results?user_id=user456",
        "description": "Get the user's results for a specific quiz.",
        "response": {
          "status": 200,
          "body": {
            "quiz_id": "quiz123",
            "user_id": "user456",
            "score": 1,
            "answers": [
              {
                "question_id": "q1",
                "selected_option": 2,
                "is_correct": true
              },
              {
                "question_id": "q2",
                "selected_option": 0,
                "is_correct": false
              }
            ]
          }
        }
      }
    }
  }
  