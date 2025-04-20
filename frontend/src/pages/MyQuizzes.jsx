import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const QuizContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 40px;
  justify-content: center;
`;

const QuizBox = styled.div`
  background: linear-gradient(135deg, #a50044, #004d98);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: calc(33% - 20px);
  max-width: 280px;
  color: #fff;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }

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

const QuestionAnswerList = styled.div`
  margin-bottom: 15px;
`;

const QuestionAnswerItem = styled.div`
  margin-bottom: 8px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9em;
  color: #333;
`;

const Button = styled.button`
  display: inline-block;
  padding: 10px 20px;
  background: linear-gradient(45deg, #004d98, #a50044);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  margin: 10px 0;
  transition: background 0.3s, transform 0.3s;
  border: none;
  cursor: pointer;

  &:hover {
    background: linear-gradient(45deg, #a50044, #004d98);
    transform: scale(1.05);
  }
`;

const MultipleChoiceButton = styled.a`
  background-color: #ffcb05;
  color: #004d98;
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
  text-decoration: none;
  text-align: center;

  &:hover {
    background-color: #e0b904;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ffcb05;
  font-size: 0.8em;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
  transition: color 0.3s, transform 0.3s;

  &:hover {
    color: #e0b904;
    transform: scale(1.2);
  }
`;

const Modal = styled.div`
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background-color: #fff;
  margin: 10% auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  color: #333;
`;

const Close = styled.span`
  color: #333;
  float: right;
  font-size: 32px;
  cursor: pointer;

  &:hover {
    color: #ffcb05;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizIdToDelete, setQuizIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/quizzes');
      const data = await res.json();
      setQuizzes(data.reverse());
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    }
  };

  const deleteQuiz = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/quizzes/${id}`, {
        method: 'DELETE',
      });
      fetchQuizzes();
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <>
      <QuizContainer>
        {quizzes.length === 0 ? (
          <p>No quizzes found. Create a new quiz to get started!</p>
        ) : (
          quizzes.map((quiz, index) => (
            <QuizBox key={quiz.id}>
              <QuizName>{index + 1}. {quiz.name}</QuizName>
              <QuestionAnswerList>
                {quiz.questions.slice(0, 5).map((q, i) => (
                  <QuestionAnswerItem key={i}>
                    <strong>Q{i + 1}:</strong> {q.question}<br />
                    <strong>Answer:</strong> {q.answer}
                  </QuestionAnswerItem>
                ))}
              </QuestionAnswerList>
              <Button onClick={() => navigate(`/full-quiz?quizId=${quiz.id}`)}>
                {quiz.questions.length > 5 ? 'See Full Quiz' : 'Edit Quiz'}
              </Button>
              <MultipleChoiceButton href={`/test?quizId=${quiz.id}`}>Test Now</MultipleChoiceButton>
              <MultipleChoiceButton href={`/mcq?quizId=${quiz.id}`}>Multiple Choice</MultipleChoiceButton>
              <DeleteButton onClick={() => {
                setQuizIdToDelete(quiz.id);
                setShowModal(true);
              }}>
                Delete Quiz
              </DeleteButton>
            </QuizBox>
          ))
        )}
      </QuizContainer>

      {showModal && (
        <Modal>
          <ModalContent>
            <Close onClick={() => setShowModal(false)}>&times;</Close>
            <p>Are you sure you want to delete this quiz?</p>
            <ModalButtons>
              <Button onClick={() => deleteQuiz(quizIdToDelete)}>Yes, Delete</Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MyQuizzes;
