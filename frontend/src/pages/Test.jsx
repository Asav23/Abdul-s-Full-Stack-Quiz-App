import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../api';
import { shuffleArray } from '../shuffle';

const Page = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to bottom right, #004B87, #A4001D);
  color: #fff;
  min-height: 100vh;
  padding: 20px;
`;

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: #002F6C;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
`;

const QuestionText = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: calc(100% - 40px);
  padding: 12px;
  border: 2px solid #A4001D;
  border-radius: 8px;
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #333;
`;

const Button = styled.button`
  padding: 14px 30px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #004B87, #A4001D);
  color: white;
  cursor: pointer;
  margin: 8px;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #003B6F;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.97);
  }
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

const Results = styled.div`
  text-align: center;
`;

const Percentage = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: #A4001D;
  margin-bottom: 10px;
`;

const Score = styled.p`
  font-size: 1.5rem;
`;

const IncorrectList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  max-height: 300px;
  overflow-y: auto;
  text-align: left;

  li {
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    color: #fff;
    font-size: 1rem;
  }
`;

const NavRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [shuffled, setShuffled] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [isFullRound, setIsFullRound] = useState(true);

  const quizId = new URLSearchParams(location.search).get('quizId');

  const startRound = (questions, isFull) => {
    setShuffled(shuffleArray(questions));
    setAnswers(Array(questions.length).fill(''));
    setCurrentIndex(0);
    setResults(null);
    setIsFullRound(isFull);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/quizzes/${quizId}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data);
        startRound(data.questions, true);
      })
      .catch(() => navigate('/my-quizzes'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, navigate]);

  const handleChange = (val) => {
    const copy = [...answers];
    copy[currentIndex] = val;
    setAnswers(copy);
  };

  const handleSubmit = () => {
    const graded = shuffled.map((q, i) => {
      const userAnswer = answers[i] || '';
      const wasCorrect = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
      return { question: q.question, answer: q.answer, userAnswer, wasCorrect };
    });
    const incorrect = graded.filter(g => !g.wasCorrect);

    setResults({
      total: graded.length,
      correct: graded.length - incorrect.length,
      incorrect,
    });

    if (isFullRound) {
      fetch(`${API_BASE_URL}/api/quizzes/${quizId}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: graded }),
      }).catch(err => console.error('Failed to record attempt:', err));
    }
  };

  const retryFullQuiz = () => startRound(quiz.questions, true);

  const practiceMissed = () => {
    startRound(results.incorrect.map(q => ({ question: q.question, answer: q.answer })), false);
  };

  if (!quiz) return <Page><p>Loading...</p></Page>;

  return (
    <Page>
      <QuizContainer>
        <Title>Quiz: {quiz.name}</Title>

        {results ? (
          <Results>
            <Percentage>Your score: {(results.correct / results.total * 100).toFixed(2)}%</Percentage>
            <Score>You got {results.correct} out of {results.total} correct.</Score>
            {results.incorrect.length === 0 ? (
              <p>Nice, no mistakes this round.</p>
            ) : (
              <IncorrectList>
                {results.incorrect.map((q, i) => (
                  <li key={i}>
                    <strong>Q:</strong> {q.question}<br />
                    <strong>Your Answer:</strong> {q.userAnswer}<br />
                    <strong>Correct Answer:</strong> {q.answer}
                  </li>
                ))}
              </IncorrectList>
            )}
            <NavRow>
              {results.incorrect.length > 0 && (
                <Button onClick={practiceMissed}>
                  Practice Missed Questions ({results.incorrect.length})
                </Button>
              )}
              <Button onClick={retryFullQuiz}>Retry Full Quiz</Button>
              <Button onClick={() => navigate('/my-quizzes')}>Quit</Button>
            </NavRow>
          </Results>
        ) : (
          <>
            <ProgressBarContainer>
              <ProgressBar width={((currentIndex + 1) / shuffled.length) * 100} />
            </ProgressBarContainer>
            <p>{currentIndex + 1} of {shuffled.length}</p>
            <QuestionText>{shuffled[currentIndex].question}</QuestionText>
            <Input
              type="text"
              value={answers[currentIndex] || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Your answer"
            />
            <NavRow>
              <Button onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))}>Previous</Button>
              {currentIndex < shuffled.length - 1 ? (
                <Button onClick={() => setCurrentIndex(i => i + 1)}>Next</Button>
              ) : (
                <Button onClick={handleSubmit}>Submit</Button>
              )}
              <Button onClick={() => navigate('/my-quizzes')}>Quit</Button>
            </NavRow>
          </>
        )}
      </QuizContainer>
    </Page>
  );
};

export default Test;
