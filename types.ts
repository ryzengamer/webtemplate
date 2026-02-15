
export enum PricingType {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  SEASONAL = 'Seasonal'
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled'
}

export enum TicketStatus {
  OPEN = 'Open',
  CLOSED = 'Closed'
}

export enum EffectType {
  SNOW = 'Snow',
  LAVA = 'Lava',
  CHERRY = 'Cherry',
  NONE = 'None'
}

export interface Category {
  id: string;
  name: string;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  pricingType: PricingType;
  categoryId: string;
  image: string;
  description?: string;
}

export interface Order {
  id: string;
  itemId: string;
  itemName: string;
  price: number;
  mcUsername: string;
  discordUsername: string;
  screenshot: string;
  status: OrderStatus;
  timestamp: number;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: number;
}

export interface Ticket {
  id: string;
  mcUsername: string;
  subject: string;
  reason: string;
  status: TicketStatus;
  messages: TicketMessage[];
  timestamp: number;
}

export interface SiteConfig {
  serverName: string;
  description: string;
  aboutTitle: string;
  aboutDesc: string;
  discordLink: string;
  serverIp: string;
  serverPort: string;
  bgImage: string;
  logoUrl: string;
  qrUrl: string;
  upiId: string;
  effect: EffectType;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  adminEmail: string;
  adminPass: string;
}
