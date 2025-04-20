import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Page = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to bottom right, #004B87, #A4001D);
  color: #FFFFFF;
  min-height: 100vh;
  padding: 20px;
`;

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: #002F6C;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ProgressBarContainer = styled.div`
  background-color: #003B6F;
  border-radius: 8px;
  height: 25px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  background-color: #A4001D;
  height: 100%;
  width: ${props => props.width}%;
  transition: width 0.3s;
`;

const Option = styled.div`
  background-color: #003B6F;
  border: 1px solid #002F6C;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  color: #FFFFFF;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #002F6C;
    transform: scale(1.02);
  }

  &.selected {
    background-color: #A4001D;
    border-color: #A4001D;
  }
`;

const ControlButton = styled.button`
  background-color: #004B87;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  margin: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #003B6F;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background: #002F6C;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: ${fadeIn} 1s ease-in-out;
`;

const RetryButton = styled(ControlButton)`
  background-color: #28a745;
  animation: ${pulse} 2s infinite;
  &:hover { background-color: #218838; }
`;

const QuitButton = styled(ControlButton)`
  background-color: #dc3545;
  &:hover { background-color: #c82333; }
`;

const MCQQuizWithResults = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const quizId = new URLSearchParams(location.search).get('quizId');

  useEffect(() => {
    if (!quizId) {
      setError('Quiz ID is missing.');
      return;
    }

    fetch(`http://localhost:8000/api/quizzes/${quizId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch quiz');
        return res.json();
      })
      .then(data => {
        if (!data.questions || data.questions.length === 0) {
          setError('No questions found in this quiz.');
          return;
        }

        const formatted = data.questions.map((q, i) => {
          const uniqueOptions = shuffleArray([
            q.answer,
            ...getRandomOptions(data.questions, q.answer),
          ]);

          while (uniqueOptions.length < 4) {
            uniqueOptions.push(`Option ${uniqueOptions.length + 1}`);
          }

          return {
            question: q.question,
            options: uniqueOptions.slice(0, 4),
            correctAnswer: q.answer
          };
        });

        setQuiz({ name: data.name, questions: formatted });
        setUserAnswers(Array(formatted.length).fill(''));
      })
      .catch(err => {
        console.error('Error loading quiz:', err);
        setError('Failed to load quiz.');
      });
  }, [quizId]);

  const shuffleArray = arr => [...arr].sort(() => Math.random() - 0.5);

  const getRandomOptions = (questions, correctAnswer) => {
    const pool = questions.map(q => q.answer).filter(a => a !== correctAnswer);
    return shuffleArray([...new Set(pool)]).slice(0, 3);
  };

  const handleOptionSelect = val => {
    const updated = [...userAnswers];
    updated[currentIndex] = val;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    const incorrect = quiz.questions.map((q, i) => {
      const user = userAnswers[i];
      return user.trim().toLowerCase() !== q.correctAnswer.trim().toLowerCase()
        ? { question: q.question, userAnswer: user, correctAnswer: q.correctAnswer }
        : null;
    }).filter(Boolean);

    setResults({ total: quiz.questions.length, correct: quiz.questions.length - incorrect.length, incorrect });
  };

  const retryQuiz = () => {
    setResults(null);
    setCurrentIndex(0);
    setUserAnswers(Array(quiz.questions.length).fill(''));
  };

  if (error) return <Page><p>{error}</p></Page>;
  if (!quiz) return <Page><p>Loading...</p></Page>;

  return (
    <Page>
      {!results ? (
        <QuizContainer>
          <h1>{quiz.name}</h1>
          <ProgressBarContainer>
            <ProgressBar width={((currentIndex + 1) / quiz.questions.length) * 100} />
          </ProgressBarContainer>
          <p>Question {currentIndex + 1} of {quiz.questions.length}</p>
          <h2>{quiz.questions[currentIndex].question}</h2>
          <div>
            {quiz.questions[currentIndex].options.map((opt, i) => (
              <Option
                key={i}
                className={userAnswers[currentIndex] === opt ? 'selected' : ''}
                onClick={() => handleOptionSelect(opt)}
              >
                {opt}
              </Option>
            ))}
          </div>
          <div>
            <ControlButton onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))} disabled={currentIndex === 0}>
              Previous
            </ControlButton>
            {currentIndex < quiz.questions.length - 1 ? (
              <ControlButton onClick={() => setCurrentIndex(i => i + 1)}>Next</ControlButton>
            ) : (
              <ControlButton onClick={handleSubmit}>Submit</ControlButton>
            )}
            <ControlButton onClick={() => navigate('/my-quizzes')}>Quit</ControlButton>
          </div>
        </QuizContainer>
      ) : (
        <ResultsContainer>
          <h1>Quiz Results</h1>
          <p>You got {results.correct} out of {results.total} questions correct.</p>
          <p id="percentage">Your score: {((results.correct / results.total) * 100).toFixed(2)}%</p>
          <RetryButton onClick={retryQuiz}>Retry Quiz</RetryButton>
          <QuitButton onClick={() => navigate('/my-quizzes')}>Quit</QuitButton>
        </ResultsContainer>
      )}
    </Page>
  );
};

export default MCQQuizWithResults;
