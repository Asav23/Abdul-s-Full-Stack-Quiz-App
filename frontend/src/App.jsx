import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateQuiz from './pages/CreateQuiz';
import MyQuizzes from './pages/MyQuizzes';
import Test from './pages/Test';
import MCQQuizWithResult from './pages/MCQQuizWithResult';
import Home from './pages/Home';
import ViewCollection from './pages/ViewCollection';
import Flashcards from './pages/Flashcards';


import Sidebar from './components/Sidebar';
import CreateCollection from './pages/CreateCollection';

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
        <Route path="/collections/:id" element={<ViewCollection />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/createcollection" element={<CreateCollection />} />
      </Routes>
    </Router>
  );
}

export default App;
