import React, { useState } from 'react';
import Logo from './Logo';
import Input from './ui/Input';
import Button from './ui/Button';
import { AuthService } from './services/AuthService';
import BackgroundPattern from './BackgroundPattern';
import { Shield } from 'lucide-react';

interface LoginProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: (role: 'user' | 'admin', user?: any) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onNavigateToForgotPassword, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await AuthService.login(formData.identifier, formData.password);

      if (result.success && result.role) {
        onLoginSuccess(result.role, result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    // For demo/admin shortcut - we can try to login with provided restricted credentials or just prompt user
    // Ideally admin should login via same form. 
    // I will retain the logic but use real AuthService if possible, or just prefill the form.
    const adminEmail = 'admin@ecobid.com';
    const adminPass = 'admin123'; // This likely won't work on real Supabase unless created

    setFormData({ identifier: adminEmail, password: adminPass });
    // Let user click sign in manually or auto submit?
    // Auto submit might fail if user doesn't exist.
    // I will just prefill.
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">

      {/* Left Side - Decorative (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-eco-teal items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <BackgroundPattern theme="dark" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-eco-darkTeal/90 to-transparent z-10"></div>

        <div className="relative z-20 p-12 text-white max-w-lg animate-fade-in-up">
          <div className="mb-8 scale-110 origin-left">
            <Logo variant="light" showTagline={false} />
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-tight">Turn Waste into <span className="text-eco-green">Value</span></h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Join the world's most transparent and sustainable waste bidding platform. Connect with authorized recyclers and ensure 100% traceability.
          </p>


        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 self-center">
            <Logo variant="dark" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                {error}
              </div>
            )}

            <Input
              label="Email or Username"
              placeholder="Enter your email"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              required
            />

            <div>
              <Input
                label="Password"
                placeholder="••••••••"
                isPassword
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-sm font-medium text-eco-green hover:text-eco-darkGreen transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-4 text-lg h-12 shadow-xl shadow-eco-green/20">
              Sign In
            </Button>

            <button
              type="button"
              onClick={handleAdminLogin}
              className="w-full py-2 text-[10px] font-bold text-gray-300 hover:text-slate-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Shield size={12} /> Login as Admin
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-eco-green font-semibold hover:underline transition-all"
              >
                Create an account
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;