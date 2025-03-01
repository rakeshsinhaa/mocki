import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Edit2, Save, Trash2, FileText, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePapers } from '../../context/PaperContext';
import { useProgress } from '../../context/ProgressContext';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { generatedPapers = [], deletePaper } = usePapers();
  const { progress } = useProgress();

  const defaultImage = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200';
  const [profileImage, setProfileImage] = useState(user?.photoURL || defaultImage);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.displayName || 'Unknown User',
    email: user?.email || 'No Email Provided',
    examPreference: 'JEE',
  });

  useEffect(() => {
    if (user) {
      setProfileImage(user.photoURL || defaultImage);
      setUserInfo({
        name: user.displayName || 'Unknown User',
        email: user.email || 'No Email Provided',
        examPreference: 'JEE',
      });
    }
  }, [user?.photoURL, user?.displayName, user?.email]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    const { name } = userInfo;
    const photoURL = profileImage;
    
    const result = await updateUserProfile(name, photoURL);
    if (result.error) {
      console.error("Error updating profile:", result.error);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-center text-white text-4xl font-bold">
        My Profile
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Profile Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Upload className="w-6 h-6 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                <button onClick={() => setIsEditing((prev) => !prev)} className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-2">
                  {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                  <span>{isEditing ? 'Save' : 'Edit'}</span>
                </button>
              </div>

              {/* User Information Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'email'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={userInfo[field]}
                      onChange={handleInfoChange}
                      disabled={field === 'email' || !isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Preference</label>
                  <select
                    name="examPreference"
                    value={userInfo.examPreference}
                    onChange={handleInfoChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  >
                    {['UPSC', 'JEE', 'NEET'].map((exam) => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Tracking */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold">Progress Tracking - {userInfo.examPreference}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {['accuracy', 'completion', 'consistency'].map((metric) => (
              <div key={metric} className="p-4 bg-gray-100 rounded-lg">
                <p className="text-lg font-semibold">{progress?.[userInfo.examPreference]?.[metric] || 0}%</p>
                <span className="text-sm text-gray-600 capitalize">{metric}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Generated Papers */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold">Generated Papers</h2>
          </div>
          {generatedPapers.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No papers generated yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedPapers.map(({ id, title, subject, date, preview }) => (
                <div key={id} className="flex bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img src={preview} alt={title} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-gray-600">{subject}</p>
                    <p className="text-sm text-gray-500">{date}</p>
                    <button className="text-red-600 hover:text-red-700" onClick={() => deletePaper(id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
