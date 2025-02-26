import React, { useState } from 'react';
import { 
  Upload, 
  Edit2, 
  Save, 
  Trash2, 
  Download, 
  Eye, 
  FileText,
  GraduationCap
} from 'lucide-react';
import { usePapers } from '../../context/PaperContext';
import { useProgress } from '../../context/ProgressContext';

const Profile = () => {
  const { generatedPapers, deletePaper } = usePapers();
  const { progress } = useProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200');
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    examPreference: 'JEE'
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDeletePaper = (paperId) => {
    deletePaper(paperId);
  };

  const CircularProgress = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#eee"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
            className="transform origin-center -rotate-90"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center">My Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                <Upload className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-5 h-5" />
                      <span>Edit</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInfoChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInfoChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Preference</label>
                  <select
                    name="examPreference"
                    value={userInfo.examPreference}
                    onChange={handleInfoChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50"
                  >
                    <option value="UPSC">UPSC</option>
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Progress Tracking - {userInfo.examPreference}</h2>
          </div>
          <div className="flex flex-wrap justify-around gap-8">
            <CircularProgress 
              value={progress[userInfo.examPreference].accuracy} 
              label="Accuracy" 
            />
            <CircularProgress 
              value={progress[userInfo.examPreference].completion} 
              label="Completion" 
            />
            <CircularProgress 
              value={progress[userInfo.examPreference].consistency} 
              label="Consistency" 
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Total Tests Taken: {progress[userInfo.examPreference].totalTests}
            {progress[userInfo.examPreference].lastTestDate && (
              <span className="ml-4">
                Last Test: {new Date(progress[userInfo.examPreference].lastTestDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Generated Papers */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Generated Papers</h2>
          </div>
          {generatedPapers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No papers generated yet. Go to Question Papers to generate some!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedPapers.map(paper => (
                <div
                  key={paper.id}
                  className="flex bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    src={paper.preview}
                    alt={paper.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">{paper.title}</h3>
                    <p className="text-sm text-gray-600">{paper.subject}</p>
                    <p className="text-sm text-gray-500">{paper.date}</p>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <button className="text-green-600 hover:text-green-700 flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button 
                        onClick={() => handleDeletePaper(paper.id)}
                        className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile