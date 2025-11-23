# 😊 HappyHODLers - AI-Powered Crypto Chatbot

An intelligent conversational chatbot powered by **Pyth Network** real-time price feeds. Check crypto prices, set price alerts, and manage your DeFi portfolio through natural language conversations.

---

## ✨ Key Features

### 💬 **Conversational AI Chatbot**
Chat naturally to get real-time crypto insights:
- "What's Bitcoin price?" → Get real-time BTC price with confidence intervals
- "Compare BTC and ETH" → Side-by-side price comparison
- "Alert me when ETH reaches $2500" → Set automated price alerts

### 📊 **Pyth Network Integration**
Real-time verified prices from 15+ cryptocurrencies:
- **15 assets**: BTC, ETH, SOL, USDC, USDT, DAI, AVAX, MATIC, ARB, OP, BNB, ADA, DOT, LINK, UNI
- **15+ exchanges**: Binance, OKX, Coinbase, Kraken, and more
- **400ms updates**: Ultra-fast price feeds directly from Pyth Network
- **High precision**: Confidence intervals on every price point

### 🔔 **Price Alert System**
Automated monitoring with natural language:
- "Alert me if Bitcoin reaches $100k"
- "Notify me when ETH falls below $2000"
- Live monitoring every 5 seconds
- Automatic notifications when targets are reached
- Spanish and English support

### 🎯 **Smart Price Queries**
Natural language price detection:
- Individual queries: "What's Bitcoin price?"
- Multi-asset comparisons: "Compare BTC, ETH, and SOL"
- Stablecoin tracking: "Show me USDC and USDT"
- Bilingual support: English and Spanish

### 🤖 **AI-Powered Pattern Recognition**
Intelligent message parsing:
- Automatically detects price queries
- Extracts crypto symbols from natural language
- Normalizes asset names (bitcoin → BTC, ethereum → ETH)
- Routes queries to appropriate data sources

### 🔐 **Non-Custodial & Secure**
Full user control and transparency:
- Connect with any Web3 wallet (MetaMask, Rainbow, Coinbase Wallet)
- No private keys stored
- Open source codebase
- Client-side transaction signing

---

## 🚀 Quick Start

### ⚡ **Setup (3 steps)**

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Open in browser**
```
http://localhost:5173
```

🎉 **You're ready!** Connect your wallet and try:
```
"What's Bitcoin price?"
"Compare BTC and ETH"
"Alert me when SOL reaches $150"
```

### 📋 **Prerequisites**
- **Node.js** 16+ ([download](https://nodejs.org/))
- **Web3 Wallet**: MetaMask, Rainbow, Coinbase Wallet, or similar
- **Modern browser**: Chrome, Firefox, Brave, or Edge

---

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── ChatBot.jsx      # Main chatbot with Pyth integration & alerts
│   ├── PriceCard.jsx    # Individual asset price display
│   ├── ComparisonView.jsx  # Multi-asset comparison view
│   ├── TransactionHistory.jsx  # Transaction history viewer
│   ├── landing/         # Landing page components
│   └── 3D/              # 3D StarBackground
├── services/            # APIs and Services
│   ├── pythService.js   # Pyth Network price feeds
│   ├── priceAlertService.js  # Price alert monitoring system
│   ├── chatService.js   # Backend integration & query detection
│   └── scrollSepoliaService.js  # Blockchain API
├── pages/
│   └── LandingPage.jsx  # Main landing page
├── hooks/
│   └── useStacksContract.js  # Custom blockchain hooks
├── config/
│   ├── wagmi.js         # Wagmi configuration (Rainbow)
│   └── contract.js      # Smart contract addresses
└── assets/              # Images and logos
```

---

## 🛠️ Available Scripts

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Code linting
npm run lint
```

---

## 💡 Usage Guide

### **1. Price Queries (Pyth Network)**

#### Individual Price
```
User: "What's Bitcoin price?"

Bot: 📊 Here's the current price for BTC
     [PriceCard displaying:]
     💰 $86,097.11
     ± Confidence: $2.35
     ⏰ Updated: 2 seconds ago
     🐍 Powered by Pyth Network
```

#### Multi-Asset Comparison
```
User: "Compare BTC and ETH"

Bot: 📊 Here's the comparison for BTC, ETH
     [ComparisonView with 2 cards side-by-side]
```

#### Stablecoin Tracking
```
User: "Show me USDC and USDT"

Bot: 📊 Here's the comparison for USDC, USDT
     [Both ~$1.00 with confidence < $0.001]
```

### **2. Price Alerts**

#### Set Alert (English)
```
User: "Alert me when Bitcoin reaches $100000"

Bot: ✅ Alert configured!
     📍 BTC/USD
     🎯 Target: $100,000.00
     📊 Condition: Price exceeds
     ⏱️ Monitoring every 5 seconds with Pyth Network
```

#### Set Alert (Spanish)
```
User: "Avísame si Ethereum llega a $2500"

Bot: ✅ ¡Alerta configurada!
     📍 ETH/USD
     🎯 Objetivo: $2,500.00
     📊 Condición: Precio supera
     ⏱️ Monitoreando cada 5 segundos
```

#### Alert Trigger Notification
```
Bot: 🔔 ALERT TRIGGERED!
     📍 ETH/USD
     💰 Current price: $2,502.50
     🎯 Target reached: $2,500.00
```

### **3. Quick Shortcuts**

Available preset shortcuts in the chat:
- **Bitcoin** - Get BTC price
- **Ethereum** - Get ETH price
- **Solana** - Get SOL price
- **Stablecoins** - Compare USDC, USDT, DAI
- **L2 Tokens** - View ARB, OP, MATIC
- **DeFi** - Compare LINK and UNI
- **Alt L1s** - View AVAX, ADA, DOT, BNB
- **Top 3** - Compare BTC, ETH, SOL
- **Balance** - Check wallet balance

---

## 📊 Supported Assets (Pyth Network)

| Symbol | Full Name | Category | Avg Confidence |
|---------|----------------|-----------|----------------|
| BTC | Bitcoin | Cryptocurrency | ±$2.35 |
| ETH | Ethereum | Cryptocurrency | ±$1.20 |
| SOL | Solana | Cryptocurrency | ±$0.05 |
| USDC | USD Coin | Stablecoin | ±$0.0001 |
| USDT | Tether | Stablecoin | ±$0.0001 |
| DAI | Dai Stablecoin | Stablecoin | ±$0.0002 |
| AVAX | Avalanche | Layer 1 | ±$0.15 |
| MATIC | Polygon | Layer 2 | ±$0.005 |
| ARB | Arbitrum | Layer 2 | ±$0.01 |
| OP | Optimism | Layer 2 | ±$0.02 |
| BNB | Binance Coin | Exchange Token | ±$0.50 |
| ADA | Cardano | Layer 1 | ±$0.003 |
| DOT | Polkadot | Layer 0 | ±$0.01 |
| LINK | Chainlink | Oracle | ±$0.02 |
| UNI | Uniswap | DEX Token | ±$0.01 |

**Total: 15 assets** | **Sources: 15+ exchanges** | **Update: Every 400ms**

---

## 🏗️ Technical Architecture

### **Frontend Stack**
- **React 18** + **Vite 7** - Modern UI framework with hot reload
- **Tailwind CSS** - Utility-first styling
- **Wagmi** + **RainbowKit** - Web3 wallet connections
- **Pyth Network Hermes API** - Real-time price feeds
- **React Hooks** - State management and lifecycle

### **Price Alert System**
- **Monitoring Interval**: 5 seconds
- **Pattern Detection**: Natural language processing (English/Spanish)
- **Alert Triggers**: Above/below price conditions
- **Auto-cleanup**: Alerts removed after triggering
- **Live Status**: Sidebar panel with active monitoring indicators

### **Backend Stack**
- **Flask API** - Python backend at `clary-backend-ai.onrender.com`
- **PostgreSQL** - User data and contacts storage
- **Render.com** - Cloud hosting platform

### **Data Sources**
- **Pyth Network** - Decentralized oracle for verified prices
- **15+ Exchanges** - Binance, OKX, Coinbase, Kraken, and more
- **Hermes REST API** - Fast and reliable price endpoints

---

## 🔮 Roadmap

### **Phase 1** ✅ COMPLETED
- [x] Pyth Network integration
- [x] PriceCard component with official crypto logos
- [x] ComparisonView component
- [x] Automatic query detection
- [x] 15 supported assets
- [x] Price caching (5 seconds)
- [x] Price Alert System
- [x] Natural language alert detection
- [x] Bilingual support (English/Spanish)

### **Phase 2** 🚧 IN PROGRESS
- [ ] **Historical charts**: Price trends with Chart.js
- [ ] **Portfolio tracking**: Total wallet value in USD
- [ ] **Alert history**: View triggered alerts
- [ ] **Advanced patterns**: More natural language variations
- [ ] **Performance optimization**: Smart polling intervals

### **Phase 3** 📅 PLANNED
- [ ] **Price predictions**: ML models with Pyth data
- [ ] **Multi-chain support**: Arbitrum, Optimism, Base
- [ ] **DEX integration**: Direct swaps from chat
- [ ] **Mobile app**: React Native version
- [ ] **Telegram bot**: Expand to Telegram platform

---

## 🧪 Testing

### **Manual Test Cases**

Price Queries:
```
✓ "What's Bitcoin price?"
✓ "Show me ETH"
✓ "Price of Solana"
✓ "Compare BTC and ETH"
✓ "Show me all stablecoins"
```

Price Alerts:
```
✓ "Alert me when BTC reaches $100000"
✓ "Avísame si ETH llega a $2500"
✓ "Notify me if SOL falls below $100"
✓ Click "Set Price Alert" shortcut
✓ Delete active alert from sidebar
```

Shortcuts:
```
✓ Click "Bitcoin" → BTC price
✓ Click "Ethereum" → ETH price
✓ Click "Stablecoins" → USDC, USDT, DAI comparison
✓ Click "Top 3" → BTC, ETH, SOL comparison
✓ Click "Balance" → Wallet balance
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🏆 Built For

**ETH Global Hackathon**  
**Track:** DeFi + Oracle Integration  
**Sponsors:** Pyth Network

**Technologies:**
- Pyth Network - Real-time price oracle
- React + Vite - Modern web framework
- Tailwind CSS - Responsive styling
- Wagmi - Web3 wallet integration

---

## 👥 Team

**HappyHODLers**
- Building the future of conversational DeFi
- Making crypto accessible through natural language
- Powered by decentralized oracles

---

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Backend API**: https://clary-backend-ai.onrender.com
- **Pyth Network**: https://pyth.network
- **Documentation**: See `/docs` folder

---

Built with 🦙 and ❤️ to democratize DeFi access
