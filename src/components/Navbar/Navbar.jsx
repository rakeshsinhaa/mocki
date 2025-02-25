import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Languages, 
  FileQuestion, 
  User,
  ChevronDown,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import NavButton from './NavButton';
import DropdownItem from './DropdownItem';
import MobileNavButton from './MobileNavButton';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogin = () => {
    setShowLogin(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSignup = () => {
    setShowSignup(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigation('/')}>
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Mocki-fi
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <NavButton icon={<BookOpen />} text="Mock Test" onClick={() => handleNavigation('/mock-test')} />
              <NavButton icon={<Languages />} text="AI Translation" onClick={() => handleNavigation('/ai-translation')} />
              <NavButton icon={<FileQuestion />} text="QuePap" onClick={() => handleNavigation('/question-papers')} />
              
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 animate-fadeIn">
                    {isLoggedIn ? (
                      <>
                        <DropdownItem text="My Profile" onClick={() => handleNavigation('/profile')} />
                        <DropdownItem text="Logout" onClick={handleLogout} />
                      </>
                    ) : (
                      <>
                        <DropdownItem text="Login" onClick={handleLogin} />
                        <DropdownItem text="Sign Up" onClick={handleSignup} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavButton icon={<BookOpen />} text="Mock Test" onClick={() => handleNavigation('/mock-test')} />
              <MobileNavButton icon={<Languages />} text="AI Translation" onClick={() => handleNavigation('/ai-translation')} />
              <MobileNavButton icon={<FileQuestion />} text="QuePap" onClick={() => handleNavigation('/question-papers')} />
              {isLoggedIn ? (
                <>
                  <MobileNavButton text="My Profile" onClick={() => handleNavigation('/profile')} />
                  <MobileNavButton text="Logout" onClick={handleLogout} />
                </>
              ) : (
                <>
                  <MobileNavButton text="Login" onClick={handleLogin} />
                  <MobileNavButton text="Sign Up" onClick={handleSignup} />
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modals */}
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} setIsLoggedIn={setIsLoggedIn} />
      )}
      {showSignup && (
        <Signup onClose={() => setShowSignup(false)} setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
};

export default Navbar;