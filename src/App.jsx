import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext"; 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase"; // Firebase auth import
import Navbar from './components/Navbar/Navbar';
import Header from './components/Header/Header';
import Features from './components/Features/Features';
import QuestionPaper from './components/QuestionPaper/QuestionPaper';
import MockTest from './components/MockTest/MockTest';
import Profile from './components/Profile/Profile';
import Login from './components/Auth/Login'; // Import Login Component
import { PaperProvider } from './context/PaperContext';
import { ProgressProvider } from './context/ProgressContext';
import PrivateRoute from './routes/PrivateRoute'; // Private Route Import
import { fetchHomeData } from "./utils/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Prevents flashing UI

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });
    const loadData = async () => {
      const result = await fetchHomeData();
      setData(result);
  };
    loadData();
    return unsubscribe; // Cleanup listener
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  return (
    <AuthProvider>
      <ProgressProvider>
        <PaperProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
              <Navbar />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<><Header /><Features /></>} />
                <Route path="/login" element={<Login />} />

                {/* Private Routes */}
                <Route element={<PrivateRoute isAuthenticated={isLoggedIn} />}>
                  <Route path="/question-papers" element={<QuestionPaper />} />
                  <Route path="/mock-test" element={<MockTest />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Redirect Unknown Routes */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Router>
        </PaperProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
