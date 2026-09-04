import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../api';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #a2c2e6, #f0f8ff);
`;

const Container = styled.div`
  background: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 700px;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  font-size: 3em;
  font-weight: bold;
  color: #4a90e2;
  background: linear-gradient(45deg, #50e3c2, #4a90e2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;

  &::before {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 5px;
    background: #50e3c2;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transform: scaleX(0);
    transform-origin: bottom left;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  font-size: 1em;
  transition: border-color 0.3s;

  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
`;

const Button = styled.button`
  margin: 10px 0;
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(45deg, #4a90e2, #50e3c2);
  color: white;
  cursor: pointer;
  font-size: 1.1em;
  text-align: center;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: linear-gradient(45deg, #50e3c2, #4a90e2);
    transform: translateY(-3px);
  }
`;

const LinkButton = styled.a`
  ${Button}
  display: inline-block;
  text-decoration: none;
`;

const QuestionBlock = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const Numbering = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const MAX_QUESTIONS = 35;

const CreateQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizId = new URLSearchParams(location.search).get('quizId');
  const isEditMode = Boolean(quizId);

  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    fetch(`${API_BASE_URL}/api/quizzes/${quizId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load quiz');
        return res.json();
      })
      .then(data => {
        setQuizName(data.name);
        setQuestions(data.questions.map(q => ({ question: q.question, answer: q.answer })));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Could not load that quiz.');
        navigate('/my-quizzes');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const handleAddQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) return;
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizName.trim()) {
      alert('Please enter a quiz name.');
      return;
    }

    const validQuestions = questions.filter(q => q.question && q.answer);
    if (validQuestions.length === 0) {
      alert('Please add at least one question and answer.');
      return;
    }

    const quiz = {
      name: quizName,
      questions: validQuestions,
    };

    try {
      const res = await fetch(
        isEditMode ? `${API_BASE_URL}/api/quizzes/${quizId}` : `${API_BASE_URL}/api/quizzes`,
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quiz),
        }
      );

      if (!res.ok) throw new Error('Failed to save quiz.');
      alert(isEditMode ? 'Quiz updated successfully!' : 'Quiz saved successfully!');
      window.location.href = '/my-quizzes';
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the quiz.');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <p>Loading quiz...</p>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <HeaderTitle>{isEditMode ? 'Edit Quiz' : 'Create Your Quiz'}</HeaderTitle>
        <StyledForm onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Name your quiz"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />

          {questions.map((q, index) => (
            <QuestionBlock key={index}>
              <Numbering>Question {index + 1}:</Numbering>
              <TextInput
                type="text"
                placeholder="Enter your question"
                value={q.question}
                onChange={(e) => handleChange(index, 'question', e.target.value)}
              />
              <TextInput
                type="text"
                placeholder="Enter the answer"
                value={q.answer}
                onChange={(e) => handleChange(index, 'answer', e.target.value)}
              />
              <Button type="button" onClick={() => handleDeleteQuestion(index)}>
                Delete
              </Button>
            </QuestionBlock>
          ))}

          <Numbering>{questions.length} / {MAX_QUESTIONS} questions</Numbering>
          {questions.length < MAX_QUESTIONS && (
            <Button type="button" onClick={handleAddQuestion}>Add Question</Button>
          )}
          <Button type="submit">{isEditMode ? 'Save Changes' : 'Save Quiz'}</Button>
        </StyledForm>

        <LinkButton href="/my-quizzes">Go to My Quizzes</LinkButton>
      </Container>
    </PageWrapper>
  );
};

export default CreateQuiz;
