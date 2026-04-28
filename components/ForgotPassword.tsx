import React, { useState } from 'react';
import Logo from './Logo';
import Input from './ui/Input';
import Button from './ui/Button';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';

interface ForgotPasswordProps {
  onNavigateToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
            <BackgroundPattern theme="dark" />
        </div>
        <div className="relative z-10 text-center text-white p-12 animate-fade-in-up">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                <Mail size={40} className="text-eco-green" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Check your Inbox</h2>
            <p className="text-gray-400 max-w-md mx-auto">
                We'll send you a secure link to reset your password. The link will be valid for 24 hours.
            </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <button 
            onClick={onNavigateToLogin}
            className="absolute top-8 left-8 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
        >
            <ArrowLeft size={24} />
        </button>

        <div className="w-full max-w-md flex flex-col animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          
          <div className="mb-8">
             <div className="w-12 h-12 bg-eco-light/50 rounded-xl flex items-center justify-center text-eco-darkGreen mb-4 lg:hidden">
                <Mail size={24} />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h2>
             <p className="text-slate-500">Don't worry, it happens to the best of us.</p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8 flex flex-col items-center text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
              <p className="text-gray-600 mb-8">Instructions sent to <span className="font-semibold">{email}</span></p>
              <Button onClick={onNavigateToLogin} variant="outline" className="w-full bg-white hover:bg-green-50">
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <Input 
                label="Email Address"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Button type="submit" isLoading={isLoading} className="text-lg h-12 shadow-lg shadow-eco-green/20">
                Send Reset Link
              </Button>

              <button 
                type="button"
                onClick={onNavigateToLogin}
                className="flex items-center justify-center gap-2 text-gray-500 hover:text-eco-green transition-colors py-2 font-medium"
              >
                <ArrowLeft size={18} />
                <span>Back to Login</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;