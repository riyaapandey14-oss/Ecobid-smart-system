import React, { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, success, className = "", isPassword = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type || 'text';

  // Determine border and ring color based on state
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
    : success
    ? 'border-green-500 focus:ring-green-200 focus:border-green-500'
    : 'border-gray-300 focus:ring-eco-green focus:border-eco-green';

  return (
    <div className="w-full mb-3">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative group">
        <input
          className={`
            w-full px-4 py-3 rounded-lg border 
            bg-white
            focus:outline-none focus:ring-4
            transition-all duration-200
            placeholder-gray-400 text-gray-800
            ${stateClasses}
            ${className}
          `}
          {...props}
          type={inputType}
        />
        
        {/* Right-side Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {!isPassword && success && !error && (
            <Check size={20} className="text-green-500 animate-fade-in" />
          )}
          
          {!isPassword && error && (
            <AlertCircle size={20} className="text-red-500 animate-fade-in" />
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium animate-fade-in flex items-center gap-1.5">
            <AlertCircle size={14} />
            {error}
        </p>
      )}
    </div>
  );
};

export default Input;