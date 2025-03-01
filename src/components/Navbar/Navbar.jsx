import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logOut();
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
              
              {/* User Profile Dropdown */}
              <div 
                className="relative"
                tabIndex={0} // Allows focus for onBlur
                onBlur={() => setIsDropdownOpen(false)}
              >
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none"
                >
                  {user ? (
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border border-gray-300"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 animate-fadeIn z-50">
                    {user ? (
                      <>
                        <DropdownItem text="My Profile" onClick={() => handleNavigation('/profile')} />
                        <DropdownItem text="Logout" onClick={handleLogout} />
                      </>
                    ) : (
                      <>
                        <DropdownItem text="Login" onClick={() => setAuthModal('login')} />
                        <DropdownItem text="Sign Up" onClick={() => setAuthModal('signup')} />
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavButton icon={<BookOpen />} text="Mock Test" onClick={() => handleNavigation('/mock-test')} />
              <MobileNavButton icon={<Languages />} text="AI Translation" onClick={() => handleNavigation('/ai-translation')} />
              <MobileNavButton icon={<FileQuestion />} text="QuePap" onClick={() => handleNavigation('/question-papers')} />
              {user ? (
                <>
                  <MobileNavButton text="My Profile" onClick={() => handleNavigation('/profile')} />
                  <MobileNavButton text="Logout" onClick={handleLogout} />
                </>
              ) : (
                <>
                  <MobileNavButton text="Login" onClick={() => setAuthModal('login')} />
                  <MobileNavButton text="Sign Up" onClick={() => setAuthModal('signup')} />
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modals */}
      {authModal === 'login' && <Login onClose={() => setAuthModal(null)} />}
      {authModal === 'signup' && <Signup onClose={() => setAuthModal(null)} />}
    </>
  );
};

export default Navbar;
