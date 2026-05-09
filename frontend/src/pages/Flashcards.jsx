import React from 'react';
import styled from 'styled-components';

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
  margin-bottom: 30px;
`;

const Flashcards = () => {
  return (
    <PageWrapper>
      <Container>
        <HeaderTitle>Flashcards</HeaderTitle>
        <p>Flashcard feature coming soon...</p>
      </Container>
    </PageWrapper>
  );
};

export default Flashcards;
