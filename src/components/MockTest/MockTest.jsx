import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, XCircle, Brain } from "lucide-react";
import { useProgress } from "../../context/ProgressContext";
import api from "../../utils/api";
import axios from "axios";

const MockTest = () => {
  const { updateProgress } = useProgress();
  const [selectedExam, setSelectedExam] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchMockTest = async () => {
      try {
        const response = await api.get("/generate_mock_test"); // FastAPI endpoint
        console.log("Fetched Questions:", response.data); // Debugging
        setQuestions(response.data.questions || []);
      } catch (error) {
        console.error("Error fetching mock test:", error);
      }
    };

    fetchMockTest();
  }, []);

  const examTypes = [
    { id: "UPSC", name: "UPSC", icon: <BookOpen className="w-6 h-6" /> },
    { id: "JEE", name: "JEE", icon: <Brain className="w-6 h-6" /> },
    { id: "NEET", name: "NEET", icon: <BookOpen className="w-6 h-6" /> },
  ];

  const handleExamSelect = (examId) => {
    setSelectedExam(examId);
    setQuestions(null);
    setResult(null);
    setAnswers({});
  };

  const generateMockTest = async () => {
    if (!selectedExam) return;

    setLoading(true);
    setQuestions(null);
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate_mock_test",
        {
          exam: selectedExam,
          difficulty: difficulty,
          negative_marking: negativeMarking,
        }
      );
      console.log("Mock Test API Response:", response.data);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Error generating mock test:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (!questions) return;

    let correct = 0;
    let incorrect = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      } else if (answers[question.id] !== undefined) {
        incorrect++;
      }
    });

    const totalMarks = correct * 4 - (negativeMarking ? incorrect : 0);
    const accuracy = Math.round((correct / questions.length) * 100);

    const testResults = {
      correct,
      incorrect,
      unattempted: questions.length - correct - incorrect,
      totalMarks,
      accuracy,
      total: questions.length,
    };

    setResult(testResults);

    // Update progress for the selected exam type
    updateProgress(selectedExam, testResults);
  };

  return (
    <div className="pt-16">
      {/* Header */}
      <header className="py-16 px-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600">
        <h1 className="text-5xl font-bold text-white mb-4 animate-fadeIn">
          AI-Powered Mock Tests
        </h1>
        <p className="text-white text-lg opacity-90 max-w-2xl mx-auto animate-slideUp">
          Practice with our AI-generated mock tests tailored for your exam.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Exam Selection */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {examTypes.map((exam) => (
            <button
              key={exam.id}
              onClick={() => handleExamSelect(exam.id)}
              className={`
                p-6 rounded-xl shadow-md flex flex-col items-center justify-center
                transition-all duration-300 hover:-translate-y-1
                ${selectedExam === exam.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-white hover:shadow-lg"
                }
              `}
            >
              {exam.icon}
              <span className="mt-2 font-semibold">{exam.name}</span>
            </button>
          ))}
        </div>

        {selectedExam && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 animate-fadeIn">
            {/* Test Configuration */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="negativeMarking"
                  checked={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.checked)}
                  className="wrounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="negativeMarking" className="text-gray-700">
                  Enable Negative Marking
                </label>
              </div>

              <button
                onClick={generateMockTest}
                disabled={loading}
                className="w-[50] bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90"
              >
                {loading ? "Generating Test..." : "Generate Mock Test"}
              </button>
            </div>

            {/* Questions */}
            {questions && (
              <div className="space-y-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {(question.options && Array.isArray(question.options)) ? question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() =>
                            handleAnswerSelect(question.id, optionIndex)
                          }
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200
                               ${answers[question.id] === optionIndex
                              ? "bg-indigo-500 text-white border border-indigo-700"
                              : "bg-white hover:bg-gray-100"
                            }
                           `}
                        >
                          {option}
                        </button>
                      )) : <p className="text-red-500">No options available</p>}
                    </div>
                  </div>
                ))}

                {!result && (
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90"
                  >
                    Submit Test
                  </button>
                )}

                {/* Results */}
                {result && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold mb-4">Test Results</h3>
                    <p>Correct: {result.correct}</p>
                    <p>Incorrect: {result.incorrect}</p>
                    <p>Unattempted: {result.unattempted}</p>
                    <p>Total Marks: {result.totalMarks}</p>
                    <p>Accuracy: {result.accuracy}%</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MockTest;
