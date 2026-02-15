
import React, { useState } from 'react';
import { store } from '../store';
import { Ticket, TicketStatus } from '../types';
import { FaPaperPlane, FaPlus, FaComments, FaHistory, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const Tickets: React.FC<{ user: string | null }> = ({ user }) => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newTicket, setNewTicket] = useState({ subject: '', reason: '' });

  const tickets = store.getTickets().filter(t => t.mcUsername === user);

  const handleCreate = () => {
    if (!user || !newTicket.subject || !newTicket.reason) return;
    const t: Ticket = {
      id: Date.now().toString(),
      mcUsername: user,
      subject: newTicket.subject,
      reason: newTicket.reason,
      status: TicketStatus.OPEN,
      messages: [],
      timestamp: Date.now()
    };
    store.addTicket(t);
    setShowNew(false);
    setNewTicket({ subject: '', reason: '' });
  };

  const handleSend = () => {
    if (!activeTicket || !newMessage.trim()) return;
    store.addTicketMessage(activeTicket.id, newMessage, 'user');
    setNewMessage('');
    // Update active ticket to show new message immediately
    const updated = store.getTickets().find(t => t.id === activeTicket.id);
    if (updated) setActiveTicket({...updated});
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pt-32">
        <div className="glass p-10 rounded-3xl text-center max-w-md">
          <FaComments className="text-6xl mx-auto mb-6 text-blue-400 opacity-50" />
          <h2 className="text-3xl font-black mb-4">Login Required</h2>
          <p className="text-white/60 mb-8 font-medium">Please login with your Minecraft username to access the support system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <button 
          onClick={() => setShowNew(true)}
          className="w-full py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all"
        >
          <FaPlus /> NEW TICKET
        </button>

        <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 font-black italic uppercase tracking-widest text-white/40 text-xs">
            Your Support History
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {tickets.length > 0 ? (
              tickets.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  className={`w-full p-4 rounded-2xl text-left transition-all mb-2 group ${
                    activeTicket?.id === t.id ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm truncate max-w-[120px]">{t.subject}</span>
                    {t.status === TicketStatus.OPEN ? <FaHistory className="text-yellow-500 text-xs" /> : <FaCheckCircle className="text-green-500 text-xs" />}
                  </div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-white/30">
                    {new Date(t.timestamp).toLocaleDateString()}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-white/20">
                <FaHistory className="text-4xl mx-auto mb-4 opacity-10" />
                <p className="text-sm font-bold">No tickets yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 glass rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px] border-white/5">
        {activeTicket ? (
          <>
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black italic">{activeTicket.subject}</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Status: <span className={activeTicket.status === TicketStatus.OPEN ? 'text-yellow-500' : 'text-green-500'}>{activeTicket.status}</span></p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Initial description */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FaComments />
                </div>
                <div className="glass p-4 rounded-2xl max-w-[80%]">
                  <p className="text-white/50 text-[10px] font-black uppercase mb-1">Issue Details</p>
                  <p className="font-bold text-sm text-blue-400 mb-1">{activeTicket.reason}</p>
                  <p className="text-sm leading-relaxed">{activeTicket.subject}</p>
                </div>
              </div>

              {activeTicket.messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                     msg.sender === 'user' ? 'bg-white/10 text-white' : 'bg-green-500/20 text-green-400'
                   }`}>
                     {msg.sender === 'user' ? <img src={`https://minotar.net/helm/${user}/24.png`} className="rounded-lg" /> : <FaCheckCircle />}
                   </div>
                   <div className={`p-4 rounded-2xl max-w-[80%] ${
                     msg.sender === 'user' ? 'bg-white/10' : 'glass'
                   }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="text-[8px] text-white/30 uppercase mt-2 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                   </div>
                </div>
              ))}
            </div>

            {activeTicket.status === TicketStatus.OPEN && (
              <div className="p-6 bg-black/40 border-t border-white/5">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl pr-16 focus:outline-none focus:border-white/20 transition-all font-medium"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-3 top-3 bottom-3 aspect-square bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
            <FaComments className="text-8xl mb-6" />
            <h3 className="text-2xl font-black italic">Select a ticket to view conversation</h3>
            <p className="max-w-xs mt-4 font-medium">Or create a new one to get help from our staff team.</p>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNew && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNew(false)} />
          <div className="relative glass w-full max-w-lg rounded-[2.5rem] p-10 border-white/10 shadow-2xl">
            <h2 className="text-3xl font-black italic mb-8 uppercase tracking-tight">Open Support Ticket</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-white/40 mb-2 tracking-widest">Reason for Contact</label>
                <select 
                  value={newTicket.reason}
                  onChange={e => setNewTicket(p => ({...p, reason: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-500 font-bold"
                >
                  <option value="">Select Reason</option>
                  <option value="Purchase Issue">Purchase Issue</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Player Report">Player Report</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-white/40 mb-2 tracking-widest">Description</label>
                <textarea 
                  placeholder="Describe your issue in detail..."
                  value={newTicket.subject}
                  onChange={e => setNewTicket(p => ({...p, subject: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-500 min-h-[150px] font-medium"
                />
              </div>
              <button 
                onClick={handleCreate}
                className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-white/90 active:scale-95 transition-all shadow-xl uppercase tracking-widest"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
