import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

const MAX_QUIZZES_PER_COLLECTION = 7;

const ViewCollection = () => {
  const [collection, setCollection] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const loadCollection = () => {
    fetch(`${API_BASE_URL}/api/collections/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Collection fetch failed: ${res.status}`);
        return res.json();
      })
      .then(data => setCollection(data))
      .catch(err => {
        console.error('Collection load error:', err);
        setError('Could not load collection.');
      });
  };

  useEffect(() => {
    loadCollection();

    fetch(`${API_BASE_URL}/api/quizzes`)
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error('Quiz fetch error:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBack = () => navigate('/collections');

  const handleTest = (quizId) => navigate(`/test?quizId=${quizId}`);

  const handlePlayAll = () => navigate(`/collection-test/${id}`);

  const handleAddQuiz = () => {
    if (!selectedQuizId) return;
    fetch(`${API_BASE_URL}/api/collections/${id}/quizzes/${selectedQuizId}`, {
      method: 'POST',
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to add quiz to collection');
        }
        setSelectedQuizId('');
        loadCollection();
      })
      .catch(err => alert(err.message));
  };

  const handleRemoveQuiz = (quizId) => {
    fetch(`${API_BASE_URL}/api/collections/${id}/quizzes/${quizId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to remove quiz from collection');
        loadCollection();
      })
      .catch(err => alert(err.message));
  };

  if (error) return <Page><Container><p>{error}</p></Container></Page>;
  if (!collection) return <Page><Container><p>Loading collection...</p></Container></Page>;

  const collectionQuizzes = collection.quizzes
    .map(quizId => quizzes.find(q => q.id === quizId))
    .filter(Boolean);
  const availableQuizzes = quizzes.filter(q => !collection.quizzes.includes(q.id));
  const atLimit = collectionQuizzes.length >= MAX_QUIZZES_PER_COLLECTION;

  return (
    <Page>
    <Container>
      <Header>
        <h1>{collection.name}</h1>
        <Back onClick={handleBack}>← Back to Collections</Back>
      </Header>

      <Main>
        {collectionQuizzes.length > 0 && (
          <TestButton onClick={handlePlayAll}>Play All Quizzes</TestButton>
        )}

        <QuizList>
          <label>{collectionQuizzes.length} / {MAX_QUIZZES_PER_COLLECTION} quizzes</label>
          {atLimit ? (
            <p>Collection is full.</p>
          ) : (
            <AddQuizRow>
              <StyledSelect value={selectedQuizId} onChange={(e) => setSelectedQuizId(e.target.value)}>
                <option value="">Select a quiz to add...</option>
                {availableQuizzes.map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </StyledSelect>
              <SaveButton type="button" onClick={handleAddQuiz} disabled={!selectedQuizId}>
                Add Quiz
              </SaveButton>
            </AddQuizRow>
          )}
        </QuizList>

        {collectionQuizzes.length > 0 ? (
          collectionQuizzes.map((quiz) => (
            <QuizItem key={quiz.id}>
              <h3>{quiz.name}</h3>
              {quiz.questions.map((q, i) => (
                <div key={i}>
                  <strong>Q{i + 1}:</strong> {q.question} <br />
                  <strong>Answer:</strong> {q.answer}
                </div>
              ))}
              <TestButton onClick={() => handleTest(quiz.id)}>Test Now</TestButton>
              <Back onClick={() => handleRemoveQuiz(quiz.id)}>Remove from Collection</Back>
            </QuizItem>
          ))
        ) : (
          <p>No quizzes in this collection.</p>
        )}
      </Main>
    </Container>
    </Page>
  );
};

export default ViewCollection;

const Page = styled.div`
  background: linear-gradient(135deg, #003a63, #A50044);
  min-height: 100vh;
  padding: 40px 0;
  font-family: Arial, sans-serif;
`;

const Container = styled.div`
  width: 60%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border: 3px solid #004d98;
  animation: fadeIn 0.8s ease-out;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #004d98, #a50044);
  color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.6s ease-out;

  h1 {
    font-size: 2.5rem;
    margin: 0;
  }
`;

const Back = styled.button`
  background: #004d98;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #003471;
    transform: scale(1.05);
  }
`;

const Main = styled.main`
  margin-top: 30px;
`;

const QuizItem = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin-bottom: 25px;
  border: 2px solid #a50044;
  font-size: 1.1rem;
  color: #333;

  strong {
    display: block;
    color: #004d98;
    margin-bottom: 12px;
    font-size: 1.4rem;
  }

  div {
    margin-bottom: 12px;
    line-height: 1.6;
  }
`;

const TestButton = styled.button`
  background: #a50044;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #91003a;
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }
`;

const SaveButton = styled.button`
  background: #28a745;
  color: white;
  padding: 12px 28px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #218838;
    transform: scale(1.05);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuizList = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f1f1f1;
  border-radius: 10px;

  label {
    display: block;
    margin-bottom: 15px;
    font-size: 1.1rem;
    color: #333;
    font-weight: bold;
  }

  input[type="checkbox"] {
    margin-right: 10px;
  }
`;

const AddQuizRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const StyledSelect = styled.select`
  flex: 1;
  min-width: 220px;
  padding: 12px 16px;
  font-size: 1.05rem;
  border-radius: 8px;
  border: 2px solid #004d98;
  background-color: #fff;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #a50044;
  }
`;
