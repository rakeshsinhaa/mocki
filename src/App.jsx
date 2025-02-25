import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Header from './components/Header/Header';
import Features from './components/Features/Features';
import QuestionPaper from './components/QuestionPaper/QuestionPaper';
import MockTest from './components/MockTest/MockTest';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Features />
            </>
          } />
          <Route path="/question-papers" element={<QuestionPaper />} />
          <Route path="/mock-test" element={<MockTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;