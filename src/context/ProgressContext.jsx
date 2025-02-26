import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    UPSC: {
      accuracy: 0,
      completion: 0,
      consistency: 0,
      totalTests: 0,
      lastTestDate: null
    },
    JEE: {
      accuracy: 0,
      completion: 0,
      consistency: 0,
      totalTests: 0,
      lastTestDate: null
    },
    NEET: {
      accuracy: 0,
      completion: 0,
      consistency: 0,
      totalTests: 0,
      lastTestDate: null
    }
  });

  const updateProgress = (examType, testResults) => {
    const currentProgress = progress[examType];
    const totalTests = currentProgress.totalTests + 1;
    
    // Calculate new accuracy
    const newAccuracy = Math.round(
      ((currentProgress.accuracy * (totalTests - 1)) + testResults.accuracy) / totalTests
    );

    // Calculate completion based on number of questions attempted
    const completion = Math.round(
      ((testResults.correct + testResults.incorrect) / testResults.total) * 100
    );

    // Calculate consistency based on test frequency and scores
    const lastTestDate = new Date();
    const daysSinceLastTest = currentProgress.lastTestDate 
      ? (lastTestDate - new Date(currentProgress.lastTestDate)) / (1000 * 60 * 60 * 24)
      : 0;
    
    const consistencyScore = daysSinceLastTest <= 7 ? 100 : Math.max(0, 100 - ((daysSinceLastTest - 7) * 5));
    const newConsistency = Math.round(
      ((currentProgress.consistency * (totalTests - 1)) + consistencyScore) / totalTests
    );

    setProgress(prev => ({
      ...prev,
      [examType]: {
        accuracy: newAccuracy,
        completion: Math.round((currentProgress.completion + completion) / 2),
        consistency: newConsistency,
        totalTests,
        lastTestDate: lastTestDate.toISOString()
      }
    }));
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};