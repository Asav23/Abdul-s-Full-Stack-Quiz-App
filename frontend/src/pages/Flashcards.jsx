import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../api';

const Page = styled.div`
  background: linear-gradient(135deg, #003a63, #A50044);
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  text-align: center;
  opacity: 0.85;
  margin-bottom: 30px;
`;

const QuizGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const QuizPickerBox = styled.div`
  background: linear-gradient(135deg, #a50044, #004d98);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 220px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin: 0;
    color: #ffcb05;
  }

  p {
    margin: 8px 0 0;
    font-size: 0.9rem;
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #ffcb05;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 100px;
`;

const CardFace = styled.div`
  background: ${props => (props.flipped ? '#ffcb05' : '#002F6C')};
  color: ${props => (props.flipped ? '#002F6C' : '#fff')};
  border-radius: 12px;
  padding: 20px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background 0.2s ease;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const TestCardButton = styled.button`
  background: #A4001D;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;

  &:hover {
    background: #7c0016;
  }
`;

const SelectedBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #002F6C;
  padding: 15px;
  text-align: center;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.4);
`;

const TestSelectedButton = styled.button`
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #004B87, #A4001D);
  color: white;
  cursor: pointer;
  font-size: 1rem;
`;

const Flashcards = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [flippedIds, setFlippedIds] = useState(new Set());
  const [checkedIds, setCheckedIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/quizzes`)
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error('Failed to load quizzes:', err));
  }, []);

  const openQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setFlippedIds(new Set());
    setCheckedIds(new Set());
  };

  const toggleFlip = (id) => {
    setFlippedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleChecked = (id) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const testCard = (id) => {
    navigate(`/flashcard-test/${selectedQuiz.id}?ids=${id}`);
  };

  const testSelected = () => {
    navigate(`/flashcard-test/${selectedQuiz.id}?ids=${[...checkedIds].join(',')}`);
  };

  if (!selectedQuiz) {
    return (
      <Page>
        <Title>Flashcards</Title>
        <Subtitle>Pick a quiz to study its questions as flashcards.</Subtitle>
        <QuizGrid>
          {quizzes.length === 0 ? (
            <p>No quizzes yet. Create one first.</p>
          ) : (
            quizzes.map(quiz => (
              <QuizPickerBox key={quiz.id} onClick={() => openQuiz(quiz)}>
                <h3>{quiz.name}</h3>
                <p>{quiz.questions.length} card{quiz.questions.length === 1 ? '' : 's'}</p>
              </QuizPickerBox>
            ))
          )}
        </QuizGrid>
      </Page>
    );
  }

  return (
    <Page>
      <BackLink onClick={() => setSelectedQuiz(null)}>← Back to quizzes</BackLink>
      <Title>{selectedQuiz.name}</Title>
      <Subtitle>Click a card to flip it. Check cards to test them together.</Subtitle>

      <CardGrid>
        {selectedQuiz.questions.map((q) => {
          const flipped = flippedIds.has(q.id);
          return (
            <CardWrapper key={q.id}>
              <CardFace flipped={flipped} onClick={() => toggleFlip(q.id)}>
                {flipped ? q.answer : q.question}
              </CardFace>
              <CardControls>
                <label>
                  <input
                    type="checkbox"
                    checked={checkedIds.has(q.id)}
                    onChange={() => toggleChecked(q.id)}
                  />{' '}
                  Select
                </label>
                <TestCardButton onClick={() => testCard(q.id)}>Test This Card</TestCardButton>
              </CardControls>
            </CardWrapper>
          );
        })}
      </CardGrid>

      {checkedIds.size > 0 && (
        <SelectedBar>
          <TestSelectedButton onClick={testSelected}>
            Test Selected ({checkedIds.size})
          </TestSelectedButton>
        </SelectedBar>
      )}
    </Page>
  );
};

export default Flashcards;
