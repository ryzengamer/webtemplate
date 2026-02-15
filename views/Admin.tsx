
import React, { useState } from 'react';
import { store } from '../store';
import { PricingType, OrderStatus, TicketStatus, EffectType, StoreItem, Category } from '../types';
import { THEMES } from '../constants';
import { 
  FaChartBar, FaCogs, FaBox, FaList, FaShoppingCart, FaTicketAlt, 
  FaSignOutAlt, FaMoon, FaSun, FaCheck, FaTimes, FaEdit, FaTrash, FaPlus, FaEye, FaPaperPlane 
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const dummyStats = [
  { name: 'Mon', revenue: 400, orders: 12 },
  { name: 'Tue', revenue: 300, orders: 8 },
  { name: 'Wed', revenue: 550, orders: 15 },
  { name: 'Thu', revenue: 450, orders: 14 },
  { name: 'Fri', revenue: 800, orders: 25 },
  { name: 'Sat', revenue: 950, orders: 32 },
  { name: 'Sun', revenue: 700, orders: 22 },
];

export const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', pass: '' });
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [config, setConfig] = useState(store.getConfig());

  const handleLogin = () => {
    const savedConfig = store.getConfig();
    if (loginForm.email === savedConfig.adminEmail && loginForm.pass === savedConfig.adminPass) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials.");
    }
  };

  const saveConfig = () => {
    store.setConfig(config);
    alert("Configuration saved successfully!");
  };

  const handleAddCategory = () => {
    if (newCatName) {
      store.addCategory(newCatName);
      setNewCatName('');
    }
  };

  const orders = store.getOrders();
  const categories = store.getCategories();
  const items = store.getItems();
  const tickets = store.getTickets();

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#f0f2f5] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-500 font-medium">Restricted Access Area</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={loginForm.email}
                onChange={e => setLoginForm(p => ({...p, email: e.target.value}))}
                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Password</label>
              <input 
                type="password" 
                value={loginForm.pass}
                onChange={e => setLoginForm(p => ({...p, pass: e.target.value}))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 font-bold"
              />
            </div>
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95"
            >
              Authenticate
            </button>
          </div>
        </div>
      </div>
    );
  }

  const baseClasses = darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-900";
  const cardClasses = darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100 shadow-sm";

  return (
    <div className={`min-h-screen flex ${baseClasses} transition-colors duration-300`}>
      {/* Sidebar */}
      <div className={`w-72 border-r flex flex-col ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="p-8 border-b border-inherit">
          <h2 className="text-2xl font-black italic text-blue-500">ADMIN PANEL</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: <FaChartBar />, label: 'Dashboard' },
            { id: 'settings', icon: <FaCogs />, label: 'Settings' },
            { id: 'categories', icon: <FaList />, label: 'Categories' },
            { id: 'items', icon: <FaBox />, label: 'Items' },
            { id: 'orders', icon: <FaShoppingCart />, label: 'Orders' },
            { id: 'tickets', icon: <FaTicketAlt />, label: 'Tickets' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : `hover:${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-inherit space-y-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center justify-between p-4 rounded-xl font-bold border ${darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-100'}`}
          >
            Mode {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 p-4 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`p-8 rounded-3xl border ${cardClasses}`}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <p className="text-3xl font-black">$4,250.00</p>
                </div>
                <div className={`p-8 rounded-3xl border ${cardClasses}`}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Orders</p>
                  <p className="text-3xl font-black">{orders.filter(o => o.status === OrderStatus.PENDING).length}</p>
                </div>
                <div className={`p-8 rounded-3xl border ${cardClasses}`}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Open Tickets</p>
                  <p className="text-3xl font-black">{tickets.filter(t => t.status === TicketStatus.OPEN).length}</p>
                </div>
                <div className={`p-8 rounded-3xl border ${cardClasses}`}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Staff Members</p>
                  <p className="text-3xl font-black">4</p>
                </div>
              </div>

              <div className={`p-10 rounded-[2.5rem] border ${cardClasses}`}>
                <h3 className="text-xl font-black mb-8">Revenue Overview</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dummyStats}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#e2e8f0"} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={`p-10 rounded-[2.5rem] border ${cardClasses}`}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black italic">Site Configuration</h2>
                <button onClick={saveConfig} className="px-10 py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-xl">SAVE ALL CHANGES</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-blue-500 uppercase tracking-widest">General</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Server Name</label>
                      <input type="text" value={config.serverName} onChange={e => setConfig({...config, serverName: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                      <input type="text" value={config.description} onChange={e => setConfig({...config, description: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">IP Address</label>
                        <input type="text" value={config.serverIp} onChange={e => setConfig({...config, serverIp: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Port</label>
                        <input type="text" value={config.serverPort} onChange={e => setConfig({...config, serverPort: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-black text-blue-500 uppercase tracking-widest">Aesthetics & Payments</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Active Effect</label>
                      <select value={config.effect} onChange={e => setConfig({...config, effect: e.target.value as EffectType})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                        {Object.values(EffectType).map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">UPI ID</label>
                      <input type="text" value={config.upiId} onChange={e => setConfig({...config, upiId: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Background Image URL</label>
                      <input type="text" value={config.bgImage} onChange={e => setConfig({...config, bgImage: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Theme Preset</label>
                      <select value={config.theme} onChange={e => setConfig({...config, theme: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                        {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className={`p-10 rounded-[2.5rem] border ${cardClasses}`}>
              <h2 className="text-3xl font-black italic mb-10">Manage Categories</h2>
              <div className="flex gap-4 mb-10">
                <input 
                  type="text" 
                  placeholder="New Category Name" 
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)} 
                  className={`flex-1 p-5 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} 
                />
                <button 
                  onClick={handleAddCategory}
                  className="px-10 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  ADD CATEGORY
                </button>
              </div>
              <div className="space-y-4">
                {categories.map(cat => (
                  <div key={cat.id} className={`flex items-center justify-between p-6 rounded-2xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-100'}`}>
                    <span className="font-black text-xl">{cat.name}</span>
                    <button onClick={() => store.deleteCategory(cat.id)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className={`text-3xl font-black italic ${darkMode ? 'text-white' : 'text-slate-900'}`}>Orders Hub</h2>
              <div className="grid grid-cols-1 gap-6">
                {orders.length > 0 ? orders.map(order => (
                  <div key={order.id} className={`p-8 rounded-[2rem] border transition-all ${cardClasses} flex items-center gap-8`}>
                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center bg-blue-500/10">
                      <img src={`https://minotar.net/helm/${order.mcUsername}/48.png`} alt="player" className="rounded-lg shadow-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-1">
                        <h4 className="text-xl font-black">{order.itemName}</h4>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === OrderStatus.PENDING ? 'bg-yellow-500/10 text-yellow-500' : 
                          order.status === OrderStatus.CONFIRMED ? 'bg-green-500/10 text-green-500' : 
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-400">User: <span className="text-blue-500">{order.mcUsername}</span> &bull; Discord: {order.discordUsername}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-green-500">${order.price}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => window.open(order.screenshot)}
                        className="p-4 bg-gray-100 dark:bg-slate-700 rounded-xl hover:scale-110 transition-all"
                        title="View Proof"
                       >
                         <FaEye />
                       </button>
                       {order.status === OrderStatus.PENDING && (
                         <>
                           <button onClick={() => store.updateOrderStatus(order.id, OrderStatus.CONFIRMED)} className="p-4 bg-green-500 text-white rounded-xl hover:scale-110 transition-all"><FaCheck /></button>
                           <button onClick={() => store.updateOrderStatus(order.id, OrderStatus.CANCELLED)} className="p-4 bg-red-500 text-white rounded-xl hover:scale-110 transition-all"><FaTimes /></button>
                         </>
                       )}
                    </div>
                  </div>
                )) : (
                  <div className={`p-20 text-center rounded-[2.5rem] border ${cardClasses}`}>
                    <p className="text-xl font-bold opacity-30">No orders placed yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black italic">Store Inventory</h2>
                  <button onClick={() => setEditingItem({ id: Date.now().toString(), name: '', price: 0, pricingType: PricingType.MONTHLY, categoryId: categories[0]?.id || '', image: 'https://picsum.photos/400/300' })} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-black flex items-center gap-2 shadow-xl">
                    <FaPlus /> ADD NEW ITEM
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map(item => (
                    <div key={item.id} className={`p-6 rounded-3xl border ${cardClasses} group`}>
                      <img src={item.image} className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-[1.02] transition-transform" />
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-black">{item.name}</h4>
                          <p className="text-xs font-bold text-gray-400">{categories.find(c => c.id === item.categoryId)?.name}</p>
                        </div>
                        <span className="text-xl font-black text-blue-500">${item.price}</span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => setEditingItem(item)} className="flex-1 p-4 bg-gray-100 dark:bg-slate-700 rounded-xl font-bold flex items-center justify-center gap-2"><FaEdit /> EDIT</button>
                         <button onClick={() => store.deleteItem(item.id)} className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingItem && (
                   <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                      <div className={`p-10 rounded-[2.5rem] w-full max-w-2xl border ${cardClasses} shadow-2xl overflow-y-auto max-h-[90vh]`}>
                         <h3 className="text-2xl font-black italic mb-8">Item Editor</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                               <div className="space-y-1">
                                  <label className="text-xs font-bold uppercase text-gray-400">Item Name</label>
                                  <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-xs font-bold uppercase text-gray-400">Price ($)</label>
                                  <input type="number" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-xs font-bold uppercase text-gray-400">Pricing Type</label>
                                  <select value={editingItem.pricingType} onChange={e => setEditingItem({...editingItem, pricingType: e.target.value as PricingType})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                     {Object.values(PricingType).map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-1">
                                  <label className="text-xs font-bold uppercase text-gray-400">Category</label>
                                  <select value={editingItem.categoryId} onChange={e => setEditingItem({...editingItem, categoryId: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                     {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                               </div>
                               <div className="space-y-1">
                                  <label className="text-xs font-bold uppercase text-gray-400">Image URL</label>
                                  <input type="text" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button onClick={() => {
                               const exists = items.find(i => i.id === editingItem.id);
                               if (exists) store.updateItem(editingItem);
                               else store.addItem(editingItem);
                               setEditingItem(null);
                            }} className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl transition-all">SAVE ITEM</button>
                            <button onClick={() => setEditingItem(null)} className="flex-1 py-5 bg-gray-100 dark:bg-slate-700 font-black rounded-2xl text-red-500">CANCEL</button>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          )}

          {activeTab === 'tickets' && (
             <div className="space-y-6">
                <h2 className="text-3xl font-black italic">Support Desk</h2>
                <div className="grid grid-cols-1 gap-6">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className={`p-8 rounded-[2rem] border ${cardClasses} flex items-center justify-between`}>
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <img src={`https://minotar.net/helm/${ticket.mcUsername}/32.png`} className="rounded-lg" />
                         </div>
                         <div>
                            <h4 className="text-xl font-black">{ticket.subject}</h4>
                            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">From: <span className="text-blue-500">{ticket.mcUsername}</span> &bull; {ticket.reason}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                           ticket.status === TicketStatus.OPEN ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                         }`}>{ticket.status}</span>
                         <button 
                          onClick={() => {
                            const reply = prompt("Enter your reply to the user:");
                            if (reply) {
                              store.addTicketMessage(ticket.id, reply, 'admin');
                              alert("Reply sent!");
                            }
                          }}
                          className="p-4 bg-blue-500 text-white rounded-xl hover:scale-110 transition-all"
                         >
                           <FaPaperPlane />
                         </button>
                         {ticket.status === TicketStatus.OPEN && (
                           <button onClick={() => store.closeTicket(ticket.id)} className="p-4 bg-green-500 text-white rounded-xl hover:scale-110 transition-all"><FaCheck /></button>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};
