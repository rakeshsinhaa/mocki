import React, { createContext, useContext, useState } from 'react';

const PaperContext = createContext();

export const PaperProvider = ({ children }) => {
  const [generatedPapers, setGeneratedPapers] = useState([]);

  const addGeneratedPaper = (paper) => {
    setGeneratedPapers(prev => [paper, ...prev]);
  };

  const deletePaper = (paperId) => {
    setGeneratedPapers(prev => prev.filter(paper => paper.id !== paperId));
  };

  return (
    <PaperContext.Provider value={{ generatedPapers, addGeneratedPaper, deletePaper }}>
      {children}
    </PaperContext.Provider>
  );
};

export const usePapers = () => {
  const context = useContext(PaperContext);
  if (!context) {
    throw new Error('usePapers must be used within a PaperProvider');
  }
  return context;
};