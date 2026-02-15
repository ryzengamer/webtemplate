
import React, { useEffect, useState } from 'react';
import { store } from '../store';

export const DiscordRedirect: React.FC = () => {
  const [count, setCount] = useState(3);
  const config = store.getConfig();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev - 1);
    }, 1000);

    if (count === 0) {
      window.location.href = config.discordLink;
    }

    return () => clearInterval(timer);
  }, [count, config.discordLink]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#5865F2] text-white">
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full animate-bounce-slow"
            style={{
              width: Math.random() * 100 + 50 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center glass p-10 rounded-3xl border-white/20">
        <img src="https://assets-global.website-files.com/6257adef93867e3d0394e364/6257adef93867e2a9d94e414_Discord-Logo-White.svg" className="w-32 mx-auto mb-8" alt="Discord" />
        <h1 className="text-4xl font-black mb-4">Redirecting...</h1>
        <p className="text-xl opacity-90">Joining {config.serverName} community in {count}s</p>
        <div className="mt-8 h-2 w-48 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear" 
            style={{ width: `${(3 - count) / 3 * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
