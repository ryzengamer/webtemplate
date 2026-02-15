
import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { Category, StoreItem, PricingType, OrderStatus } from '../types';
import { FaShoppingCart, FaServer, FaUsers, FaCopy, FaCheck } from 'react-icons/fa';

export const Home: React.FC<{ user: string | null }> = ({ user }) => {
  const config = store.getConfig();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [purchaseItem, setPurchaseItem] = useState<StoreItem | null>(null);
  const [copying, setCopying] = useState(false);
  const [orderForm, setOrderForm] = useState({
    discord: '',
    mc: user || '',
    screenshot: ''
  });

  const categories = store.getCategories();
  const items = store.getItems();
  const filteredItems = selectedCat === 'all' 
    ? items 
    : items.filter(i => i.categoryId === selectedCat);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(config.serverIp);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrderForm(prev => ({ ...prev, screenshot: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitOrder = () => {
    if (!purchaseItem || !orderForm.mc || !orderForm.discord || !orderForm.screenshot) {
      alert("Please fill all fields and upload payment proof.");
      return;
    }

    store.addOrder({
      id: Date.now().toString(),
      itemId: purchaseItem.id,
      itemName: purchaseItem.name,
      price: purchaseItem.price,
      mcUsername: orderForm.mc,
      discordUsername: orderForm.discord,
      screenshot: orderForm.screenshot,
      status: OrderStatus.PENDING,
      timestamp: Date.now()
    });

    alert("Order submitted successfully! Please wait for admin approval.");
    setPurchaseItem(null);
    setOrderForm({ discord: '', mc: user || '', screenshot: '' });
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        
        {/* Animated Logo */}
        <div className="relative z-10 mb-8 animate-bounce-slow">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full glass border-4 border-white/10 p-4 shadow-2xl flex items-center justify-center">
            <img src={config.logoUrl} alt="Server Logo" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight italic text-white drop-shadow-2xl">
            {config.serverName}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mx-auto">
            {config.description}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
            <div 
              onClick={handleCopyIp}
              className="glass px-8 py-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all border border-white/20 group"
            >
              <div className="p-3 bg-white/10 rounded-xl">
                <FaServer className="text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Server Address</p>
                <p className="font-mono text-lg font-bold flex items-center gap-2">
                  {config.serverIp} 
                  {copying ? <FaCheck className="text-green-400 text-sm" /> : <FaCopy className="text-white/20 group-hover:text-white transition-colors text-sm" />}
                </p>
              </div>
            </div>

            <div className="glass px-8 py-4 rounded-2xl flex items-center gap-4 border border-white/20">
              <div className="p-3 bg-white/10 rounded-xl">
                <FaUsers className="text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Online Players</p>
                <p className="text-lg font-bold">128 / 500</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black italic">Store</h2>
          <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x mb-12">
          <button 
            onClick={() => setSelectedCat('all')}
            className={`px-8 py-3 rounded-2xl font-bold whitespace-nowrap transition-all snap-start ${
              selectedCat === 'all' ? 'bg-white text-black shadow-xl scale-105' : 'glass hover:bg-white/10'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-8 py-3 rounded-2xl font-bold whitespace-nowrap transition-all snap-start ${
                selectedCat === cat.id ? 'bg-white text-black shadow-xl scale-105' : 'glass hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="group glass rounded-3xl overflow-hidden hover:border-white/20 transition-all hover:translate-y-[-8px] flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                  <div className="absolute top-4 right-4 glass px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {item.pricingType}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-white/40 text-sm mb-6 line-clamp-2">{item.description || 'Premium rank features and exclusive server access.'}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-black text-blue-400">${item.price}</span>
                    <button 
                      onClick={() => setPurchaseItem(item)}
                      className="p-3 bg-white text-black rounded-xl hover:bg-blue-400 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl opacity-50">
            <p className="text-xl">No items found in this category.</p>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="glass p-12 rounded-[3rem] border-white/5 bg-white/[0.02]">
           <h2 className="text-3xl font-black italic mb-6 text-blue-400">{config.aboutTitle}</h2>
           <p className="text-lg text-white/60 leading-relaxed italic">
             "{config.aboutDesc}"
           </p>
        </div>
      </section>

      {/* Purchase Modal */}
      {purchaseItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPurchaseItem(null)} />
          <div className="relative glass-light text-black w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 pb-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-black uppercase">Complete Order</h2>
                  <p className="text-black/50 font-bold uppercase text-xs tracking-widest mt-1">
                    {purchaseItem.name} &bull; ${purchaseItem.price}
                  </p>
                </div>
                <button onClick={() => setPurchaseItem(null)} className="text-2xl opacity-50 hover:opacity-100">&times;</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase mb-1 opacity-50">UPI ID</label>
                    <div className="bg-black/5 p-3 rounded-xl font-mono text-sm border border-black/5 font-bold">{config.upiId}</div>
                  </div>
                  <div className="flex justify-center p-4 bg-white border border-black/10 rounded-2xl">
                    <img src={config.qrUrl} alt="QR" className="w-full max-w-[150px]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Minecraft Username" 
                      value={orderForm.mc}
                      onChange={e => setOrderForm(p => ({...p, mc: e.target.value}))}
                      className="w-full p-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:border-blue-500 font-bold"
                    />
                    <input 
                      type="text" 
                      placeholder="Discord (e.g. user#1234)" 
                      value={orderForm.discord}
                      onChange={e => setOrderForm(p => ({...p, discord: e.target.value}))}
                      className="w-full p-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:border-blue-500 font-bold"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        id="screenshot" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label 
                        htmlFor="screenshot"
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-500 text-white font-bold cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                      >
                        {orderForm.screenshot ? 'Screenshot Uploaded!' : 'Upload Proof (Screenshot)'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 mt-auto">
              <button 
                onClick={submitOrder}
                className="w-full py-5 bg-black text-white rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-black/90 transition-all shadow-xl active:scale-95"
              >
                Submit Payment
              </button>
              <p className="text-center text-[10px] text-black/30 font-bold uppercase mt-4">Orders are usually processed within 10-30 minutes.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
