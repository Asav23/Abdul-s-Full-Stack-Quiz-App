import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const ViewCollection = () => {
  const [collection, setCollection] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    console.log('📦 Loading collection:', id);

    fetch(`http://localhost:8000/api/collections/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Collection fetch failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Collection loaded:', data);
        setCollection(data);
      })
      .catch(err => {
        console.error('❌ Collection load error:', err);
        setError('Could not load collection.');
      });

    fetch('http://localhost:8000/api/quizzes')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Quizzes loaded:', data);
        setQuizzes(data);
      })
      .catch(err => console.error('❌ Quiz fetch error:', err));
  }, [id]);

  const handleBack = () => navigate('/collections');

  const handleTest = (quizId) => navigate(`/test?quizId=${quizId}`);

  if (error) return <Container><p>{error}</p></Container>;
  if (!collection) return <Container><p>Loading collection...</p></Container>;

  return (
    <Container>
      <Header>
        <h1>{collection.name}</h1>
        <BackButton onClick={handleBack}>← Back to Collections</BackButton>
      </Header>

      <QuizList>
        {collection.quizzes?.length > 0 ? (
          collection.quizzes.map((quizId) => {
            const quiz = quizzes.find(q => q.id === quizId);
            if (!quiz) return null;

            return (
              <QuizBox key={quiz.id}>
                <h3>{quiz.name}</h3>
                {quiz.questions.map((q, i) => (
                  <div key={i}>
                    <strong>Q{i + 1}:</strong> {q.question} <br />
                    <strong>Answer:</strong> {q.answer}
                  </div>
                ))}
                <TestButton onClick={() => handleTest(quiz.id)}>Test Now</TestButton>
              </QuizBox>
            );
          })
        ) : (
          <p>No quizzes in this collection.</p>
        )}
      </QuizList>
    </Container>
  );
};

export default ViewCollection;

const Container = styled.div`
  width: 60%;
  max-width: 800px;
  margin: 40px auto;
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
  padding: 14px 28px;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #218838;
    transform: scale(1.05);
  }
`;

const QuizList = styled.div`
  margin-top: 20px;
  padding: 10px;
  background: #f1f1f1;
  border-radius: 10px;

  label {
    display: block;
    margin-bottom: 10px;
    font-size: 1.1rem;
  }

  input[type="checkbox"] {
    margin-right: 10px;
  }
`;
