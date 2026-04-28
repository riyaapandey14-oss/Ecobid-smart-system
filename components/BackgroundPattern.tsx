import React from 'react';
import { Recycle, Leaf, Globe, Gavel } from 'lucide-react';

interface BackgroundPatternProps {
  theme?: 'light' | 'dark';
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ theme = 'light' }) => {
  // Generate a grid of icons
  const icons = [];
  const rows = 8;
  const cols = 6;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const IconType = (i + j) % 4 === 0 ? Recycle : (i + j) % 4 === 1 ? Leaf : (i + j) % 4 === 2 ? Globe : Gavel;
      
      // For dark theme (Teal background), use very faint white/teal
      const color = theme === 'light' ? '#2E7D32' : '#4DB6AC'; 
      const opacity = theme === 'light' ? 0.03 : 0.05;

      icons.push(
        <div 
          key={`${i}-${j}`}
          className="absolute transform transition-transform duration-1000"
          style={{
            top: `${(i / rows) * 100}%`,
            left: `${(j / cols) * 100}%`,
            opacity: Math.random() * opacity + 0.01,
            transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`,
          }}
        >
          <IconType size={40} color={color} />
        </div>
      );
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
       {/* Background Base */}
       <div className={`absolute inset-0 ${theme === 'light' ? 'bg-eco-bgLight' : 'bg-transparent'} z-0`}></div>
       
       {/* Icons Pattern */}
       <div className="absolute inset-0 z-0">
          {icons}
       </div>
    </div>
  );
};

export default BackgroundPattern;