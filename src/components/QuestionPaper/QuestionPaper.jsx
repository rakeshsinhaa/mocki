import React, { useState } from 'react';
import { Upload, BookOpen, Brain } from 'lucide-react';

const QuestionPaper = () => {
  const [formData, setFormData] = useState({
    inputType: '',
    file: null,
    topic: '',
    difficulty: '',
    questionType: '',
    totalMarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="pt-16">
      {/* Animated Header */}
      <header className="py-16 px-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600">
        <h1 className="text-5xl font-bold text-white mb-4 transform hover:scale-105 transition-transform duration-300 cursor-pointer animate-fadeIn">
          Question Paper Generator
        </h1>
        <div className="flex justify-center space-x-4 animate-slideUp">
          <div className="flex items-center text-white">
            <Upload className="w-6 h-6 mr-2" />
            <span>Upload Papers</span>
          </div>
          <div className="flex items-center text-white">
            <BookOpen className="w-6 h-6 mr-2" />
            <span>Generate Questions</span>
          </div>
          <div className="flex items-center text-white">
            <Brain className="w-6 h-6 mr-2" />
            <span>AI Powered</span>
          </div>
        </div>
      </header>

      {/* Main Form Section */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 animate-fadeIn">
          {/* Input Type Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Choose Input Type</label>
            <select
              name="inputType"
              value={formData.inputType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Input Type</option>
              <option value="pdf">Upload PDF</option>
            </select>
          </div>

          {/* File Upload */}
          {formData.inputType === 'pdf' && (
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">Upload PDF File</label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-gray-500">Click to upload or drag and drop</span>
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          )}

          {/* Topic Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Enter subject or topic"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Difficulty Level</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Question Type</label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Question Type</option>
              <option value="theory">Theory</option>
              <option value="mcq">MCQ</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Total Marks */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleInputChange}
              placeholder="Enter total marks"
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Questions
          </button>
        </form>
      </main>
    </div>
  );
};

export default QuestionPaper;