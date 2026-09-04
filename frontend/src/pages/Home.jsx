import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BookOpen, PlusCircle, Layers, Folder } from 'react-feather';

const Page = styled.div`
  background: radial-gradient(circle at top, #004a80, #003a63 55%, #7a0035 130%);
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #A50044;
  color: #ffd700;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  letter-spacing: 2px;
`;

const Hero = styled.div`
  text-align: center;
  margin: 60px 0 40px;
`;

const HeroTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(45deg, #ffd700, #ffcb05);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`;

const Tagline = styled.p`
  font-size: 1.3rem;
  color: #ffd700;
  min-height: 1.6em;
  margin-top: 15px;
`;

const CardGrid = styled.nav`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const NavCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 16px;
  color: #fff;
  text-decoration: none;
  text-align: center;
  backdrop-filter: blur(4px);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: #ffd700;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  }

  svg {
    color: #ffd700;
  }
`;

const CardTitle = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

const CardDescription = styled.span`
  font-size: 0.9rem;
  color: #e6e6e6;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 25px 15px 10px;
  margin-top: auto;
  color: #ffd700;
  opacity: 0.85;
  font-size: 0.9rem;
`;

const NAV_ITEMS = [
  { href: '/my-quizzes', icon: BookOpen, title: 'My Quizzes', description: 'Browse and manage everything you’ve created' },
  { href: '/create-quiz', icon: PlusCircle, title: 'Create Quiz', description: 'Build a new quiz from scratch' },
  { href: '/flashcards', icon: Layers, title: 'Flashcards', description: 'Study a quiz’s questions as flip cards' },
  { href: '/collections', icon: Folder, title: 'My Collections', description: 'Group quizzes together and test them as one' },
];

const TAGLINE = 'Test and challenge yourself with flashcards and quizzes.';

const Home = () => {
  const [charsShown, setCharsShown] = useState(0);

  useEffect(() => {
    if (charsShown >= TAGLINE.length) return;
    const timer = setTimeout(() => setCharsShown(n => n + 1), 50);
    return () => clearTimeout(timer);
  }, [charsShown]);

  const message = TAGLINE.slice(0, charsShown);

  return (
    <Page>
      <Header>
        <Title>Quizzer</Title>
      </Header>

      <Hero>
        <HeroTitle>Sharpen your recall</HeroTitle>
        <Tagline>{message}</Tagline>
      </Hero>

      <CardGrid>
        {NAV_ITEMS.map(({ href, icon: Icon, title, description }) => (
          <NavCard key={href} href={href}>
            <Icon size={32} />
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </NavCard>
        ))}
      </CardGrid>

      <Footer>
        <p>Quizzer &copy; 2024 Made by Abdul Adesanya</p>
      </Footer>
    </Page>
  );
};

export default Home;
