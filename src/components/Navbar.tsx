import React, { useState } from 'react';
import { Menu, X, User, Settings, CreditCard, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold text-gray-900">AMLYL</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('how-it-works')}
              className="text-gray-700 hover:text-primary-600 transition"
            >
              How it Works
            </button>
            <button
              onClick={() => handleNavigation('benefits')}
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Benefits
            </button>
            <button
              onClick={() => handleNavigation('statistics')}
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Statistics
            </button>
            {user ? (
              <>
                <Link to="/applications" className="text-gray-700 hover:text-primary-600 transition">
                  My Applications
                </Link>
                <Link
                  to="/apply"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Apply Now
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center text-gray-700 hover:text-primary-600 transition"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Account Overview
                          </div>
                        </Link>
                        <Link
                          to="/account/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </div>
                        </Link>
                        <Link
                          to="/account/settings"
                          state={{ section: 'payment' }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Payment Methods
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <button
              onClick={() => handleNavigation('how-it-works')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600"
            >
              How it Works
            </button>
            <button
              onClick={() => handleNavigation('benefits')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600"
            >
              Benefits
            </button>
            <button
              onClick={() => handleNavigation('statistics')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600"
            >
              Statistics
            </button>
            {user ? (
              <>
                <Link
                  to="/applications"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  My Applications
                </Link>
                <Link
                  to="/account"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Account Overview
                </Link>
                <Link
                  to="/account/settings"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  to="/apply"
                  className="block w-full text-center mt-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  Apply Now
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center mt-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}