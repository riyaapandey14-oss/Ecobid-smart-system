import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import TermsConditions from './components/TermsConditions';
import UserDashboard from './components/dashboard/user/UserDashboard';
import AdminDashboard from './components/dashboard/admin/AdminDashboard';
import { UserService } from './utils/userService';

import AIChat from './components/AIChat';

export type Screen = 'splash' | 'login' | 'register' | 'forgot-password' | 'terms' | 'user-dashboard' | 'admin-dashboard';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Check for existing session
    const session = UserService.getSession();
    if (session) {
      // Restore session without splash
      if (session.user) {
        UserService.initializeSession(session.user);
      }
      setCurrentScreen(session.role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
    } else {
      // Simulate splash screen duration only if no session
      const timer = setTimeout(() => {
        handleScreenChange('login');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleScreenChange = (screen: Screen) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 300); // Wait for exit animation
  };

  const handleLoginSuccess = (role: 'user' | 'admin', userData?: any) => {
    UserService.saveSession(role, userData);
    if (role === 'admin') {
      handleScreenChange('admin-dashboard');
    } else {
      if (userData) {
        UserService.initializeSession(userData);
      }
      handleScreenChange('user-dashboard');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Global AI Chat Assistant */}
      <AIChat />

      {currentScreen === 'splash' && (
        <SplashScreen onComplete={() => handleScreenChange('login')} />
      )}

      {currentScreen === 'login' && (
        <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Login
            onNavigateToRegister={() => handleScreenChange('register')}
            onNavigateToForgotPassword={() => handleScreenChange('forgot-password')}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}

      {currentScreen === 'register' && (
        <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Register
            onNavigateToLogin={() => handleScreenChange('login')}
            onViewTerms={() => handleScreenChange('terms')}
          />
        </div>
      )}

      {currentScreen === 'forgot-password' && (
        <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <ForgotPassword
            onNavigateToLogin={() => handleScreenChange('login')}
          />
        </div>
      )}

      {currentScreen === 'terms' && (
        <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <TermsConditions onBack={() => handleScreenChange('register')} />
        </div>
      )}

      {currentScreen === 'user-dashboard' && (
        <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <UserDashboard onLogout={() => { UserService.clearSession(); handleScreenChange('login'); }} />
        </div>
      )}

      {currentScreen === 'admin-dashboard' && (
        <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <AdminDashboard onLogout={() => { UserService.clearSession(); handleScreenChange('login'); }} />
        </div>
      )}
    </div>
  );
};

export default App;