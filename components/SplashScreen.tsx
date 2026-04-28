import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import BackgroundPattern from './BackgroundPattern';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Start animation sequence
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-900">
      
      {/* Background with darker overlay for better contrast */}
      <div className="absolute inset-0 opacity-20 animate-pulse-slow">
        <BackgroundPattern theme="dark" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-eco-darkTeal/90 via-slate-900/95 to-black/90 z-0"></div>
      
      <div className={`relative z-10 flex flex-col items-center transform transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* Glass Container for Logo */}
        <div className="p-10 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-float relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
           <Logo variant="light" className="scale-125" />
        </div>
        
        {/* Refined Loading Indicator */}
        <div className="mt-16 flex flex-col items-center gap-4 w-64">
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
                {/* Primary moving bar */}
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-eco-green to-transparent w-1/2 animate-[slideInRight_1.5s_infinite_linear]"></div>
                {/* Secondary glow */}
                <div className="absolute top-0 left-0 h-full w-full bg-eco-green/20 animate-pulse"></div>
            </div>
            
            <div className="flex flex-col items-center gap-1">
                <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase">Initializing</p>
                <p className="text-eco-green/60 text-[8px] tracking-widest font-mono">SECURE_HANDSHAKE_V2</p>
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-white/20 text-[10px] tracking-[0.3em] z-10 font-medium">
        WASTE TO WEALTH
      </div>
    </div>
  );
};

export default SplashScreen;