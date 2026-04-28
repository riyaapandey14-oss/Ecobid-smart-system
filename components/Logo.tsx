import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // 'light' is for dark backgrounds (Splash), 'dark' is for light backgrounds (Login)
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'dark', showTagline = true }) => {
  // Text colors based on background
  const taglineColor = variant === 'light' ? 'text-gray-200' : 'text-slate-600';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img
        src="/logo.png"
        alt="EcoBid Logo"
        className="h-20 w-auto object-contain drop-shadow-lg"
      />

      {/* Text Container - Removed separate text as image contains it, keeping tagline if needed */}
      <div className="flex flex-col justify-center items-start">
        {/* EcoBid Text removed as it is in the logo image now */}

        {showTagline && (
          <p className={`text-sm font-medium tracking-wide mt-1 ${taglineColor}`}>
            Waste to Worth. For Nature.
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;