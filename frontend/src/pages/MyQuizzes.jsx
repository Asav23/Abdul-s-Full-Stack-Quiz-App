import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/my-quizzes.css';

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
        method: 'DELETE'
      });
      fetchQuizzes();
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <>
      <div id="quizContainer">
        {quizzes.length === 0 ? (
          <p>No quizzes found. Create a new quiz to get started!</p>
        ) : (
          quizzes.map((quiz, index) => (
            <div className="quiz-box" key={quiz.id}>
              <div className="quiz-name">{index + 1}. {quiz.name}</div>
              <div className="question-answer-list">
                {quiz.questions.slice(0, 5).map((q, i) => (
                  <div className="question-answer-item" key={i}>
                    <strong>Q{i + 1}:</strong> {q.question}<br />
                    <strong>Answer:</strong> {q.answer}
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate(`/full-quiz?quizId=${quiz.id}`)}
                className="edit-quiz-button"
              >
                {quiz.questions.length > 5 ? 'See Full Quiz' : 'Edit Quiz'}
              </button>
              <a className="test-button" href={`/test?quizId=${quiz.id}`}>Test Now</a>
              <a className="multiple-choice-button" href={`/mcq?quizId=${quiz.id}`}>Multiple Choice</a>
              <button className="delete-button" onClick={() => {
                setQuizIdToDelete(quiz.id);
                setShowModal(true);
              }}>
                Delete Quiz
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div id="deleteModal" className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <p>Are you sure you want to delete this quiz?</p>
            <div className="modal-buttons">
              <button onClick={() => deleteQuiz(quizIdToDelete)}>Yes, Delete</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyQuizzes;
