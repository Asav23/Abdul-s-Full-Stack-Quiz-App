import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../api';

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
  margin-bottom: 5px;
`;

const SourceQuiz = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 15px;
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

const CollectionTest = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [collectionName, setCollectionName] = useState('');
  const [items, setItems] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/collections/${collectionId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load collection');
        return res.json();
      })
      .then(collection => {
        setCollectionName(collection.name);
        if (!collection.quizzes || collection.quizzes.length === 0) {
          setError('This collection has no quizzes yet.');
          return Promise.resolve([]);
        }
        return Promise.all(
          collection.quizzes.map(quizId =>
            fetch(`${API_BASE_URL}/api/quizzes/${quizId}`).then(res => res.json())
          )
        );
      })
      .then(quizzesData => {
        const combined = (quizzesData || []).flatMap(quiz =>
          quiz.questions.map(q => ({
            question: q.question,
            answer: q.answer,
            quizName: quiz.name,
          }))
        );
        if (combined.length === 0 && !error) {
          setError('This collection has no questions yet.');
          return;
        }
        setItems(combined);
        setAnswers(Array(combined.length).fill(''));
      })
      .catch(err => {
        console.error('Error loading collection quizzes:', err);
        setError('Failed to load this collection.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

  const handleChange = (val) => {
    const copy = [...answers];
    copy[currentIndex] = val;
    setAnswers(copy);
  };

  const handleSubmit = () => {
    const incorrect = items.map((item, i) => {
      const userAnswer = answers[i];
      return userAnswer.trim().toLowerCase() !== item.answer.trim().toLowerCase()
        ? { question: item.question, quizName: item.quizName, userAnswer, correctAnswer: item.answer }
        : null;
    }).filter(Boolean);

    setResults({
      total: items.length,
      correct: items.length - incorrect.length,
      incorrect,
    });
  };

  if (error) return (
    <Page>
      <QuizContainer>
        <p>{error}</p>
        <Button onClick={() => navigate(`/view-collection/${collectionId}`)}>Back to Collection</Button>
      </QuizContainer>
    </Page>
  );
  if (!items) return <Page><p>Loading...</p></Page>;

  return (
    <Page>
      <QuizContainer>
        <Title>Collection: {collectionName}</Title>

        {results ? (
          <Results>
            <Percentage>Your score: {(results.correct / results.total * 100).toFixed(2)}%</Percentage>
            <Score>You got {results.correct} out of {results.total} correct.</Score>
            <IncorrectList>
              {results.incorrect.map((q, i) => (
                <li key={i}>
                  <strong>{q.quizName} — Q:</strong> {q.question}<br />
                  <strong>Your Answer:</strong> {q.userAnswer}<br />
                  <strong>Correct Answer:</strong> {q.correctAnswer}
                </li>
              ))}
            </IncorrectList>
            <NavRow>
              <Button onClick={() => navigate(`/view-collection/${collectionId}`)}>Back to Collection</Button>
            </NavRow>
          </Results>
        ) : (
          <>
            <ProgressBarContainer>
              <ProgressBar width={((currentIndex + 1) / items.length) * 100} />
            </ProgressBarContainer>
            <p>{currentIndex + 1} of {items.length}</p>
            <SourceQuiz>From: {items[currentIndex].quizName}</SourceQuiz>
            <QuestionText>{items[currentIndex].question}</QuestionText>
            <Input
              type="text"
              value={answers[currentIndex] || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Your answer"
            />
            <NavRow>
              <Button onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))} disabled={currentIndex === 0}>
                Previous
              </Button>
              {currentIndex < items.length - 1 ? (
                <Button onClick={() => setCurrentIndex(i => i + 1)}>Next</Button>
              ) : (
                <Button onClick={handleSubmit}>Submit</Button>
              )}
              <Button onClick={() => navigate(`/view-collection/${collectionId}`)}>Quit</Button>
            </NavRow>
          </>
        )}
      </QuizContainer>
    </Page>
  );
};

export default CollectionTest;
