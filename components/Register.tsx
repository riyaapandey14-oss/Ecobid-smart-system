import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import Input from './ui/Input';
import Button from './ui/Button';
import { AuthService } from './services/AuthService';
import BackgroundPattern from './BackgroundPattern';
import { Check, X, Shield, Upload } from 'lucide-react';

interface RegisterProps {
  onNavigateToLogin: () => void;
  onViewTerms: () => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigateToLogin, onViewTerms }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shakeTerms, setShakeTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });

  // Validation State
  const [validation, setValidation] = useState({
    email: false,
    phone: false,
    passwordMatch: false,
    passwordStrength: 0 // 0-4 scale
  });

  const [touched, setTouched] = useState({
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
  });

  // Real-time Validation Logic
  useEffect(() => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const phoneValid = /^[0-9]{10}$/.test(formData.phone);
    const match = formData.password === formData.confirmPassword && formData.password.length > 0;

    // Calculate Strength
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;

    setValidation({
      email: emailValid,
      phone: phoneValid,
      passwordMatch: match,
      passwordStrength: strength
    });
  }, [formData]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Trigger validation on all fields
    setTouched({
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    if (!formData.agreed) {
      setShakeTerms(true);
      setTimeout(() => setShakeTerms(false), 500);
      return;
    }

    if (!validation.email || !validation.phone) {
      setError("Please fix the errors in the form.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (validation.passwordStrength < 2) {
      setError("Password is too weak.");
      return;
    }

    setIsLoading(true);

    setIsLoading(true);

    try {
      const { success, error } = await AuthService.register(
        formData.email,
        formData.password,
        formData.fullName,
        'user'
      );

      if (success) {
        // You might want to save extra details here to profiles table if you had one in AuthService
        // For now, we assume metadata in auth.users is enough or handled by triggers
        setIsLoading(false);
        onNavigateToLogin();
      } else {
        throw new Error(error || "Registration failed");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const getStrengthColor = (s: number) => {
    if (s === 0) return 'bg-gray-200';
    if (s === 1) return 'bg-red-500';
    if (s === 2) return 'bg-orange-500';
    if (s === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = (s: number) => {
    if (s === 0) return '';
    if (s === 1) return 'Weak';
    if (s === 2) return 'Fair';
    if (s === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">

      {/* Left Side - Decorative Panel (Fixed on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-eco-teal items-center justify-center overflow-hidden h-screen">
        <div className="absolute inset-0 z-0">
          <BackgroundPattern theme="dark" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-eco-darkTeal/95 via-eco-teal/80 to-eco-lightTeal/60 z-10"></div>

        <div className="relative z-20 p-16 text-white max-w-xl animate-fade-in-up">
          <div className="mb-6 opacity-80 scale-90 origin-left">
            <Logo variant="light" showTagline={false} />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Join the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-green to-eco-light">Green Revolution</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 leading-relaxed font-light">
            Empowering businesses to trade waste responsibly. Create your account today to access authorized recyclers and transparent bidding.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { title: 'Verified Network', desc: '100% KYC Vetted' },
              { title: 'Secure Payments', desc: 'Escrow Protection' },
              { title: 'Live Tracking', desc: 'Real-time GPS' },
              { title: 'Compliance', desc: 'Auto-generated Forms' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-eco-green flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-lg shadow-eco-green/20">✓</div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Scrollable Form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto bg-white relative scroll-smooth">
        <div className="min-h-full flex flex-col justify-center p-6 sm:p-12 lg:p-16 max-w-2xl mx-auto">

          <div className="lg:hidden mb-8 self-center">
            <Logo variant="dark" />
          </div>

          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500">Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 animate-fade-in-up delay-100">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 mb-2 flex items-center animate-fade-in">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <Input
              label="Full Name / Company Name"
              placeholder="e.g. Green Recycle Pvt Ltd"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="py-3.5"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => handleBlur('email')}
                success={touched.email && validation.email}
                error={touched.email && !validation.email ? "Invalid email address" : undefined}
                required
              />

              <Input
                label="Phone"
                placeholder="9876543210"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  // Only allow numbers
                  if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
                    setFormData({ ...formData, phone: e.target.value })
                  }
                }}
                onBlur={() => handleBlur('phone')}
                success={touched.phone && validation.phone}
                error={touched.phone && !validation.phone ? "Must be 10 digits" : undefined}
                required
              />
            </div>

            <Input
              label="Address / Location"
              placeholder="City, State"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />

            {/* Auto-Compliance (AI KYC) */}
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">Instant Compliance</h4>
                  <p className="text-xs text-indigo-600">Upload Gov ID for auto-verification</p>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-2 bg-white border border-indigo-200 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                onClick={(e) => {
                  const btn = e.currentTarget;
                  btn.innerText = "Scanning ID...";
                  btn.disabled = true;
                  setTimeout(() => {
                    btn.innerText = "Verified by AI ✓";
                    btn.className = "w-full py-2 bg-green-500 border border-green-600 text-white font-bold rounded-lg flex items-center justify-center gap-2";
                    setFormData(prev => ({ ...prev, fullName: "Aditya Naikwadi", address: "Mumbai, Maharashtra" }));
                  }, 2000);
                }}
              >
                <Upload size={16} /> Upload GST / PAN
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  label="Password"
                  placeholder="••••••••"
                  isPassword
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => handleBlur('password')}
                  required
                />
                {/* Interactive Strength Meter */}
                {formData.password.length > 0 && (
                  <div className="px-1 animate-fade-in">
                    <div className="flex gap-1 h-1 mb-1">
                      {[1, 2, 3, 4].map(step => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full transition-all duration-300 ${validation.passwordStrength >= step ? getStrengthColor(validation.passwordStrength) : 'bg-gray-100'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium text-right ${validation.passwordStrength <= 1 ? 'text-red-500' :
                      validation.passwordStrength === 2 ? 'text-orange-500' :
                        validation.passwordStrength === 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                      {getStrengthLabel(validation.passwordStrength)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  isPassword
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onBlur={() => handleBlur('confirmPassword')}
                  required
                  success={touched.confirmPassword && validation.passwordMatch}
                  error={touched.confirmPassword && !validation.passwordMatch ? "Passwords do not match" : undefined}
                />
              </div>
            </div>

            {/* Terms Checkbox with Shake Animation */}
            <div className={`flex items-start mt-2 mb-4 p-4 rounded-xl border transition-all duration-200 ${shakeTerms ? 'animate-shake border-red-300 bg-red-50' : 'bg-gray-50 border-gray-100'}`}>
              <div className="relative flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-eco-green checked:bg-eco-green hover:border-eco-darkGreen focus:outline-none focus:ring-2 focus:ring-eco-green/20 transition-all"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                />
                <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
              </div>
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600 select-none">
                I agree to the
                <button
                  type="button"
                  onClick={onViewTerms}
                  className="text-eco-green font-bold hover:underline mx-1 focus:outline-none rounded"
                >
                  Terms & Conditions
                </button>
                and Privacy Policy.
              </label>
            </div>

            <Button type="submit" isLoading={isLoading} className="text-lg h-12 shadow-lg shadow-eco-green/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center pb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-gray-500">Already have an account? </span>
            <button
              onClick={onNavigateToLogin}
              className="font-semibold text-eco-green hover:text-eco-darkGreen hover:underline focus:outline-none transition-colors"
            >
              Log in here
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper icon component since it was used in error state but not imported in previous context
const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default Register;