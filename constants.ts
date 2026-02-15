
import { SiteConfig, EffectType } from './types';

export const DEFAULT_CONFIG: SiteConfig = {
  serverName: "ApexCraft Network",
  description: "The ultimate survival and minigames experience for true warriors.",
  aboutTitle: "About Our Server",
  aboutDesc: "Established in 2024, ApexCraft focuses on community-driven gameplay and balanced economy. Join thousands of players worldwide.",
  discordLink: "https://discord.gg/minecraft",
  serverIp: "play.apexcraft.net",
  serverPort: "25565",
  bgImage: "https://picsum.photos/1920/1080?random=1",
  logoUrl: "https://minotar.net/cube/Steve/100.png",
  qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=example-payment-id",
  upiId: "server@upi",
  effect: EffectType.SNOW,
  theme: "Neon Dark",
  primaryColor: "#3b82f6",
  secondaryColor: "#1e40af",
  adminEmail: "wahidmalik18@gmail.com",
  adminPass: "ryzengamer90"
};

export const THEMES = [
  "Neon Dark", "Deep Ocean", "Sunset Glow", "Emerald Forest", "Royal Purple",
  "Midnight", "Cyberpunk", "Ghost White", "Volcano", "Cherry Blossom",
  "Golden Sand", "Arctic Ice", "Mint Fresh", "Lavender Dream", "Blood Moon",
  "Coffee", "Space", "Modern Grey", "Pastel Rainbow", "Obsidian"
];
