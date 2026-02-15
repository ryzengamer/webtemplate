
import React from 'react';
import { store } from '../store';
import { FaDiscord, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

export const Footer: React.FC = () => {
  const config = store.getConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-black/80 border-t border-white/5 pt-16 pb-8 px-6 mt-20 relative z-[10]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={config.logoUrl} alt="Logo" className="w-10 h-10 rounded-lg" />
            <h3 className="text-2xl font-black italic">{config.serverName}</h3>
          </div>
          <p className="text-white/60 leading-relaxed text-sm">
            {config.description}
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Server Info</h4>
          <ul className="space-y-3 text-white/50 text-sm">
            <li>IP: <span className="text-blue-400 font-mono">{config.serverIp}</span></li>
            <li>Port: <span className="text-blue-400 font-mono">{config.serverPort}</span></li>
            <li>Platform: Java & Bedrock</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Connect</h4>
          <div className="flex gap-4">
            <a href={config.discordLink} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"><FaDiscord /></a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"><FaTwitter /></a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"><FaYoutube /></a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
        &copy; {year} {config.serverName}. All rights reserved. Not an official Minecraft product. Not approved by or associated with Mojang.
      </div>
    </footer>
  );
};
