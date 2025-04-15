import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/test.css';

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [shuffled, setShuffled] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);

  const quizId = new URLSearchParams(location.search).get('quizId');

  useEffect(() => {
    fetch(`http://localhost:8000/api/quizzes/${quizId}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data);
        const shuffledQs = shuffleArray(data.questions.map((q, i) => ({ ...q, index: i })));
        setShuffled(shuffledQs);
        setAnswers(Array(data.questions.length).fill(''));
      })
      .catch(() => navigate('/my-quizzes'));
  }, [quizId, navigate]);

  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleChange = (val) => {
    const copy = [...answers];
    copy[shuffled[currentIndex].index] = val;
    setAnswers(copy);
  };

  const handleSubmit = () => {
    const incorrect = quiz.questions.map((q, i) => {
      const userAnswer = answers[i];
      const correctAnswer = q.answer;
      return userAnswer.trim().toLowerCase() !== correctAnswer.trim().toLowerCase()
        ? { question: q.question, userAnswer, correctAnswer }
        : null;
    }).filter(Boolean);

    setResults({
      total: quiz.questions.length,
      correct: quiz.questions.length - incorrect.length,
      incorrect,
    });
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="quiz-container">
      <h1>Quiz: {quiz.name}</h1>

      {results ? (
        <div className="results">
          <p>Your score: {(results.correct / results.total * 100).toFixed(2)}%</p>
          <p>You got {results.correct} out of {results.total} correct.</p>
          <ul>
            {results.incorrect.map((q, i) => (
              <li key={i}>
                <strong>Q:</strong> {q.question}<br />
                <strong>Your Answer:</strong> {q.userAnswer}<br />
                <strong>Correct Answer:</strong> {q.correctAnswer}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate(`/test?quizId=${quiz.id}`)}>Retry</button>
          <button onClick={() => navigate('/my-quizzes')}>Quit</button>
        </div>
      ) : (
        <>
          <div className="progress-bar" style={{ width: `${(currentIndex + 1) / shuffled.length * 100}%` }}></div>
          <p>{currentIndex + 1} of {shuffled.length}</p>
          <h2>{shuffled[currentIndex].question}</h2>
          <input
            type="text"
            value={answers[shuffled[currentIndex].index] || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Your answer"
          />
          <div className="buttons">
            <button onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))}>Previous</button>
            {currentIndex < shuffled.length - 1 ? (
              <button onClick={() => setCurrentIndex(i => i + 1)}>Next</button>
            ) : (
              <button onClick={handleSubmit}>Submit</button>
            )}
            <button onClick={() => navigate('/my-quizzes')}>Quit</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Test;
