
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './views/Home';
import { AdminView } from './views/Admin';
import { Tickets } from './views/Tickets';
import { DiscordRedirect } from './views/DiscordRedirect';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Particles } from './components/Particles';
import { store } from './store';
import { FaTimes } from 'react-icons/fa';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<string | null>(localStorage.getItem('mc_user'));
  const [showLogin, setShowLogin] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const location = useLocation();
  const config = store.getConfig();

  const handleLogin = () => {
    if (loginUsername.trim()) {
      localStorage.setItem('mc_user', loginUsername);
      setUser(loginUsername);
      setShowLogin(false);
      setLoginUsername('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mc_user');
    setUser(null);
  };

  // Hidden admin access detection (typing '/admin' in URL or hash)
  const isAdminPage = location.pathname === '/admin';
  const isDiscordPage = location.pathname === '/discord';

  return (
    <div className={`min-h-screen transition-all duration-700 bg-cover bg-fixed bg-center`} style={{ backgroundImage: isAdminPage ? 'none' : `url(${config.bgImage})` }}>
      {!isAdminPage && <Particles type={config.effect} />}
      {!isAdminPage && !isDiscordPage && (
        <Navbar 
          user={user} 
          onLogin={() => setShowLogin(true)} 
          onLogout={handleLogout} 
          onOpenTickets={() => window.location.hash = '#/tickets'}
        />
      )}

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/tickets" element={<Tickets user={user} />} />
        <Route path="/discord" element={<DiscordRedirect />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>

      {!isAdminPage && !isDiscordPage && <Footer />}

      {/* Auth Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowLogin(false)} />
          <div className="relative glass p-10 rounded-[2.5rem] w-full max-w-sm border-white/10 shadow-2xl">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><FaTimes /></button>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <img src="https://minotar.net/helm/Steve/64.png" className="w-12 h-12 rounded-lg" />
              </div>
              <h2 className="text-3xl font-black italic">Player Login</h2>
              <p className="text-white/40 font-medium mt-1">Join the network</p>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Minecraft Username" 
                autoFocus
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 text-center font-bold text-lg"
              />
              <button 
                onClick={handleLogin}
                className="w-full py-5 bg-white text-black font-black rounded-2xl text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                Let's Play
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
