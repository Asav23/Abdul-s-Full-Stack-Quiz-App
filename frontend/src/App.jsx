import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateQuiz from './pages/CreateQuiz';
import MyQuizzes from './pages/MyQuizzes';
import Test from './pages/Test';
import MCQQuizWithResult from './pages/MCQQuizWithResult';
import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import Collections from './pages/Collections';
import ViewCollection from './pages/view-collection';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/my-quizzes" element={<MyQuizzes />} />
        <Route path="/test" element={<Test />} />
        <Route path="/mcq" element={<MCQQuizWithResult />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/view-collection/:id" element={<view-collection />} />
      </Routes>
    </Router>
  );
}

export default App;
