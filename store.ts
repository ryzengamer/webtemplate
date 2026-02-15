
import { SiteConfig, Category, StoreItem, Order, Ticket, OrderStatus, TicketStatus } from './types';
import { DEFAULT_CONFIG } from './constants';

const STORAGE_KEY = 'mc_webstore_data';

interface AppData {
  config: SiteConfig;
  categories: Category[];
  items: StoreItem[];
  orders: Order[];
  tickets: Ticket[];
}

const getInitialData = (): AppData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return {
    config: DEFAULT_CONFIG,
    categories: [],
    items: [],
    orders: [],
    tickets: []
  };
};

let data = getInitialData();

export const saveData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const store = {
  getConfig: () => data.config,
  setConfig: (config: SiteConfig) => { data.config = config; saveData(); },
  
  getCategories: () => data.categories,
  addCategory: (name: string) => {
    const newCat = { id: Date.now().toString(), name };
    data.categories.push(newCat);
    saveData();
    return newCat;
  },
  deleteCategory: (id: string) => {
    data.categories = data.categories.filter(c => c.id !== id);
    data.items = data.items.filter(i => i.categoryId !== id);
    saveData();
  },
  updateCategory: (id: string, name: string) => {
    const cat = data.categories.find(c => c.id === id);
    if (cat) cat.name = name;
    saveData();
  },

  getItems: () => data.items,
  addItem: (item: StoreItem) => {
    data.items.push(item);
    saveData();
  },
  deleteItem: (id: string) => {
    data.items = data.items.filter(i => i.id !== id);
    saveData();
  },
  updateItem: (item: StoreItem) => {
    const idx = data.items.findIndex(i => i.id === item.id);
    if (idx > -1) data.items[idx] = item;
    saveData();
  },

  getOrders: () => data.orders,
  addOrder: (order: Order) => {
    data.orders.push(order);
    saveData();
  },
  updateOrderStatus: (id: string, status: OrderStatus) => {
    const order = data.orders.find(o => o.id === id);
    if (order) order.status = status;
    saveData();
  },

  getTickets: () => data.tickets,
  addTicket: (ticket: Ticket) => {
    data.tickets.push(ticket);
    saveData();
  },
  addTicketMessage: (id: string, text: string, sender: 'user' | 'admin') => {
    const ticket = data.tickets.find(t => t.id === id);
    if (ticket) {
      ticket.messages.push({
        id: Date.now().toString(),
        sender,
        text,
        timestamp: Date.now()
      });
      saveData();
    }
  },
  closeTicket: (id: string) => {
    const ticket = data.tickets.find(t => t.id === id);
    if (ticket) ticket.status = TicketStatus.CLOSED;
    saveData();
  }
};
