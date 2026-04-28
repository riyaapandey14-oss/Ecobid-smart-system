import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = "", 
  ...props 
}) => {
  const baseStyles = "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-eco-green hover:bg-eco-darkGreen text-white shadow-lg shadow-eco-green/30",
    outline: "border-2 border-eco-green text-eco-green hover:bg-eco-green/10",
    ghost: "bg-transparent text-eco-green hover:underline",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export default Button;