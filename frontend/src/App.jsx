import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateQuiz from './pages/CreateQuiz';
import MyQuizzes from './pages/MyQuizzes';
import Test from './pages/Test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyQuizzes />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/my-quizzes" element={<MyQuizzes />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
