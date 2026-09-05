import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { API_BASE_URL } from '../api';

const Page = styled.div`
  background: linear-gradient(135deg, #003a63, #A50044);
  color: #fff;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  padding: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  margin: 0;
`;

const BackLink = styled.a`
  color: #ffcb05;
  text-decoration: underline;

  &:hover {
    color: #e0b904;
  }
`;

const QuizContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const QuizBox = styled.div`
  background: linear-gradient(135deg, #a50044, #004d98);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: calc(33% - 20px);
  max-width: 280px;
  color: #fff;

  @media (max-width: 768px) {
    width: calc(50% - 20px);
  }

  @media (max-width: 480px) {
    width: calc(100% - 20px);
  }
`;

const QuizName = styled.div`
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #ffcb05;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
`;

const QuestionCount = styled.div`
  font-size: 0.9em;
  margin-bottom: 15px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const RestoreButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #218838;
  }
`;

const PurgeButton = styled.button`
  background: none;
  border: 1px solid #ffcb05;
  color: #ffcb05;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 203, 5, 0.15);
  }
`;

const DeletedQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchDeleted = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/quizzes/deleted`);
      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Failed to load deleted quizzes:', error);
    }
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  const restoreQuiz = async (id) => {
    await fetch(`${API_BASE_URL}/api/quizzes/${id}/restore`, { method: 'POST' });
    fetchDeleted();
  };

  const purgeQuiz = async (id) => {
    if (!window.confirm('Permanently delete this quiz? This cannot be undone.')) return;
    await fetch(`${API_BASE_URL}/api/quizzes/${id}/purge`, { method: 'DELETE' });
    fetchDeleted();
  };

  return (
    <Page>
      <Header>
        <Title>Recently Deleted</Title>
        <BackLink href="/my-quizzes">← Back to My Quizzes</BackLink>
      </Header>

      <QuizContainer>
        {quizzes.length === 0 ? (
          <p>Nothing here.</p>
        ) : (
          quizzes.map((quiz) => (
            <QuizBox key={quiz.id}>
              <QuizName>{quiz.name}</QuizName>
              <QuestionCount>{quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}</QuestionCount>
              <ButtonRow>
                <RestoreButton onClick={() => restoreQuiz(quiz.id)}>Restore</RestoreButton>
                <PurgeButton onClick={() => purgeQuiz(quiz.id)}>Delete Forever</PurgeButton>
              </ButtonRow>
            </QuizBox>
          ))
        )}
      </QuizContainer>
    </Page>
  );
};

export default DeletedQuizzes;
