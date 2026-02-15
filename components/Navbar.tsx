
import React from 'react';
import { store } from '../store';
import { FaDiscord, FaUser, FaSignOutAlt } from 'react-icons/fa';

interface NavbarProps {
  user: string | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenTickets: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogin, onLogout, onOpenTickets }) => {
  const config = store.getConfig();

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] glass px-6 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4">
        <a 
          href={config.discordLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors shadow-lg"
          title="Join our Discord"
        >
          <FaDiscord size={24} />
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenTickets}
          className="text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity mr-4 hidden md:block"
        >
          Tickets
        </button>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-white/10 px-4 py-2 rounded-xl">
              <img 
                src={`https://minotar.net/helm/${user}/32.png`} 
                alt="skin" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-bold tracking-wide">{user}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all border border-red-500/20"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all shadow-xl active:scale-95"
          >
            <FaUser size={14} />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
