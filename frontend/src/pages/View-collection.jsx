import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

const ViewCollection = () => {
  const [collection, setCollection] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/api/collections/${id}`)
      .then(res => res.json())
      .then(data => setCollection(data))
      .catch(err => console.error('Error loading collection:', err));

    fetch('http://localhost:8000/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error('Error loading quizzes:', err));
  }, [id]);

  const handleBack = () => {
    navigate('/collections');
  };

  const handleTestQuiz = (quizId) => {
    navigate(`/test?quizId=${quizId}`);
  };

  if (!collection) {
    return <Container><Header><h1>Collection Not Found</h1><Back onClick={handleBack}>Back to Collections</Back></Header></Container>;
  }

  return (
    <Container>
      <Header>
        <h1>{collection.name}</h1>
        <Back onClick={handleBack}>Back to Collections</Back>
      </Header>
      <Main>
        {collection.quizzes.length > 0 ? (
          collection.quizzes.map(quizId => {
            const quiz = quizzes.find(q => q.id === parseInt(quizId));
            if (!quiz) return null;
            return (
              <QuizItem key={quiz.id}>
                <strong>{quiz.name}</strong>
                {quiz.questions.map((q, i) => (
                  <div key={i}><strong>Q{i + 1}:</strong> {q.question}<br /><strong>Answer:</strong> {q.answer}</div>
                ))}
                <TestButton onClick={() => handleTestQuiz(quiz.id)}>Test Quiz Now</TestButton>
              </QuizItem>
            );
          })
        ) : (
          <p>No quizzes in this collection.</p>
        )}
      </Main>
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
