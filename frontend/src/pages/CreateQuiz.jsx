import React, { useState } from 'react';
import '../styles/create-quiz.css'; // Adjust path if you placed CSS elsewhere

const CreateQuiz = () => {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizName.trim()) {
      alert('Please enter a quiz name.');
      return;
    }

    const validQuestions = questions.filter(q => q.question && q.answer);
    if (validQuestions.length === 0) {
      alert('Please add at least one question and answer.');
      return;
    }

    const quiz = {
      name: quizName,
      questions: validQuestions
    };

    try {
      const res = await fetch('http://localhost:8000/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
      });

      if (!res.ok) throw new Error('Failed to save quiz.');
      alert('Quiz saved successfully!');
      window.location.href = '/my-quizzes'; // Or use router navigation
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the quiz.');
    }
  };

  return (
    <div className="container">
      <h1 className="header-title">Create Your Quiz</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name your quiz"
          aria-label="Quiz Name"
          required
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />

        {questions.map((q, index) => (
          <div className="question-answer-pair" key={index}>
            <div className="numbering">Question {index + 1}:</div>
            <input
              type="text"
              placeholder="Enter your question"
              value={q.question}
              onChange={(e) => handleChange(index, 'question', e.target.value)}
              className="question-input"
            />
            <input
              type="text"
              placeholder="Enter the answer"
              value={q.answer}
              onChange={(e) => handleChange(index, 'answer', e.target.value)}
              className="answer-input"
            />
            <button
              type="button"
              className="delete-button"
              onClick={() => handleDeleteQuestion(index)}
            >
              Delete
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion} className="button">Add Question</button>
        <button type="submit" className="button">Save Quiz</button>
      </form>

      <a href="/my-quizzes.html" className="button">Go to My Quizzes</a>
    </div>
  );
};

export default CreateQuiz;
