import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Page = styled.div`
  background: linear-gradient(135deg, #003a63, #A50044);
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #A50044;
  color: #ffd700;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  letter-spacing: 2px;
`;

const ButtonContainer = styled.nav`
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.a`
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(45deg, #A50044, #003a63);
  color: #ffd700;
  text-decoration: none;
  font-size: 1.2rem;
  margin: 10px;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  }
`;

const Welcome = styled.div`
  font-size: 1.8rem;
  color: #ffd700;
  text-align: center;
  margin: 20px 0;
`;

const MessageSection = styled.section`
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  color: #ffd700;
  text-align: center;

  p {
    font-size: 1.2rem;
    color: #fff;
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 15px;
  background-color: #A50044;
  color: #ffd700;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.4);
  position: fixed;
  width: 100%;
  bottom: 0;
`;

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const text = 'Test and challenge yourself with flashcards and quizzes.';
    let index = 0;
    const speed = 50;

    const type = () => {
      if (index < text.length) {
        setMessage(prev => prev + text.charAt(index));
        index++;
        setTimeout(type, speed);
      }
    };
    type();
  }, []);

  return (
    <Page>
      <Header>
        <Title>Quizzer</Title>
      </Header>

      <ButtonContainer>
        <Button href="/my-quizzes">My Quizzes</Button>
        <Button href="/create-quiz">Create Quiz</Button>
        <Button href="/Flashcards">Flashcards</Button>
        <Button href="/CreateCollection">CreateCollection</Button>

      </ButtonContainer>

      <Welcome>Welcome, Guest!</Welcome>

      <MessageSection>
        <p>{message}</p>
      </MessageSection>

      <Footer>
        <p>Quizzer &copy; 2024 Made by Pelumi</p>
      </Footer>
    </Page>
  );
};

export default Home;
