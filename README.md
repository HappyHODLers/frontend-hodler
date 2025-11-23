# 😊 HappyHODLers - Transactional Chatbot

Transactional Chatbot powered by **Pyth Network** real-time prices. Trade, check prices, and get DeFi insights with simple conversations on **Scroll L2**.

---

## ✨ Características Principales

### 💬 **Transactional Chatbot**
Chat naturally to trade, check prices, and manage your crypto:
- "What's Bitcoin price?" → Get real-time BTC price
- "Compare BTC and ETH" → Side-by-side comparison
- "Send 0.5 ETH to Alice" → Execute transfers

### 📊 **Pyth Network Integration** ⚡ NUEVO
Real-time verified prices from 15+ cryptocurrencies:
- **15 assets**: BTC, ETH, SOL, USDC, USDT, DAI, AVAX, MATIC, ARB, OP, BNB, ADA, DOT, LINK, UNI
- **15+ exchanges**: Binance, OKX, Coinbase, Kraken, Huobi, KuCoin, etc.
- **400ms updates**: Ultra-fast price feeds from Pyth Network
- **±0.01% precision**: Confidence intervals on every price

### 🔔 **Smart Price Queries**
Natural language price detection:
- Individual queries: "What's Bitcoin price?"
- Comparisons: "Compare BTC, ETH, and SOL"
- Stablecoins: "Show me USDC and USDT"
- Spanish support: "Cuánto está Bitcoin?"

### ⚡ **Scroll L2 Blockchain**
Ultra-fast and cheap transactions:
- **~$0.02 gas fees** (vs $50+ on Ethereum mainnet)
- **<2 second confirmations**
- **EVM-compatible** (works with MetaMask, Rainbow, etc.)
- **Production-ready** on Scroll Sepolia testnet

### 🤖 **AI-Powered Detection**
Smart pattern recognition:
- Detects price queries automatically
- Extracts symbols from messages
- Normalizes asset names (bitcoin → BTC)
- Routes to correct service (Pyth vs backend)

### 🔐 **Non-Custodial & Secure**
You always maintain full control:
- Connect with any Web3 wallet
- Sign transactions on your device
- No private keys stored
- Open source codebase

---

## 🚀 Inicio Rápido

### ⚡ **Quick Start (3 pasos)**

1. **Instalar dependencias**
```bash
npm install
```

2. **Iniciar servidor**
```bash
npm run dev
```

3. **Abrir navegador**
```
http://localhost:5173
```

🎉 **¡Listo!** Conecta tu wallet y prueba:
```
"What's Bitcoin price?"
"Compare BTC and ETH"
"Price of SOL"
```

### 📋 **Prerrequisitos**
- **Node.js** 16+ ([descargar](https://nodejs.org/))
- **Wallet compatible**: MetaMask, Rainbow, Coinbase Wallet, etc.
- **Fondos en Scroll L2** (opcional para transferencias)
- **Navegador moderno**: Chrome, Firefox, Brave, etc.

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes UI
│   ├── ChatBot.jsx      # Chatbot principal con Pyth integration
│   ├── PriceCard.jsx    # ⚡ NUEVO: Card de precio individual
│   ├── ComparisonView.jsx  # ⚡ NUEVO: Comparación de assets
│   ├── TransactionHistory.jsx
│   ├── landing/         # Landing page components
│   └── 3D/              # StarBackground 3D
├── services/            # APIs y servicios
│   ├── pythService.js   # ⚡ NUEVO: Pyth Network integration
│   ├── chatService.js   # Backend Flask + price detection
│   └── scrollSepoliaService.js  # Scroll L2 API
├── pages/
│   └── LandingPage.jsx  # Página principal
├── hooks/
│   └── useStacksContract.js
├── config/
│   ├── wagmi.js         # Configuración Wagmi (Rainbow)
│   └── contract.js      # Smart contracts
└── assets/              # Imágenes y logos
```

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo (hot reload)
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

---

## 💡 Guía de Uso

### **1. Consultar Precios (Pyth Network)**

#### Precio Individual
```
Usuario: "What's Bitcoin price?"

Bot: 📊 Here's the current price for BTC
     [PriceCard mostrando:]
     💰 $45,123.50
     ± Confidence: $2.35
     ⏰ Updated: 3 seconds ago
     🐍 Pyth Network
```

#### Comparación Multiple
```
Usuario: "Compare BTC and ETH"

Bot: 📊 Here's the comparison for BTC, ETH
     [ComparisonView con 2 tarjetas lado a lado]
```

#### Stablecoins
```
Usuario: "Show me USDC and USDT"

Bot: 📊 Here's the comparison for USDC, USDT
     [Ambos ~$1.00 con confidence < $0.001]
```

### **2. Transferencias en Scroll L2**

```
Usuario: "Send 0.5 ETH to 0x123...abc"

Bot: 🔔 Confirmar Transferencia
     📤 Destinatario: 0x123...abc
     💰 Cantidad: 0.5 ETH
     
     [Botón: Confirmar Transferencia]
```

### **3. Historial de Transacciones**

```
Usuario: [Click en icono de historial]

Bot: [Modal mostrando últimas 10 transacciones]
     • Send 0.1 ETH to Alice - 2 mins ago ✅
     • Receive 0.5 ETH from Bob - 1 hour ago ✅
```

---

## 📊 Activos Soportados (Pyth Network)

| Símbolo | Nombre Completo | Categoría | Confidence Avg |
|---------|----------------|-----------|----------------|
| BTC | Bitcoin | Crypto | ±$2.35 |
| ETH | Ethereum | Crypto | ±$1.20 |
| SOL | Solana | Crypto | ±$0.05 |
| USDC | USD Coin | Stablecoin | ±$0.0001 |
| USDT | Tether | Stablecoin | ±$0.0001 |
| DAI | Dai Stablecoin | Stablecoin | ±$0.0002 |
| AVAX | Avalanche | L1 | ±$0.15 |
| MATIC | Polygon | L2 | ±$0.005 |
| ARB | Arbitrum | L2 | ±$0.01 |
| OP | Optimism | L2 | ±$0.02 |
| BNB | Binance Coin | Exchange | ±$0.50 |
| ADA | Cardano | L1 | ±$0.003 |
| DOT | Polkadot | L0 | ±$0.01 |
| LINK | Chainlink | Oracle | ±$0.02 |
| UNI | Uniswap | DEX | ±$0.01 |

**Total: 15 activos** | **Fuentes: 15+ exchanges** | **Actualización: Cada 400ms**

---

## 🏗️ Arquitectura Técnica

### **Frontend Stack**
- **React 18** + **Vite 7** - UI framework con hot reload
- **Tailwind CSS** - Utility-first styling
- **Wagmi** + **RainbowKit** - Web3 wallet connections
- **Pyth Network SDK** - Real-time price feeds
- **Ethers.js v5** - Blockchain interactions

### **Blockchain Stack**
- **Scroll L2 Sepolia** - Testnet para transacciones
- **Pyth Network** - Oracle de precios verificados
- **EVM-compatible** - Smart contracts Solidity

### **Backend API**
- **Flask** - Python backend en `clary-backend-ai.onrender.com`
- **PostgreSQL** - Database para contactos/historial
- **Render.com** - Cloud hosting

---

## 🔮 Roadmap

### **Q1 2025** ✅ COMPLETADO
- [x] Integración Pyth Network
- [x] PriceCard component
- [x] ComparisonView component
- [x] Detección automática de consultas
- [x] 15 activos soportados
- [x] Cache de precios (5 segundos)

### **Q2 2025** 🚧 EN PROGRESO
- [ ] **Sistema de Alertas**: "Notify me if ETH reaches $3000"
- [ ] **Gráficos históricos**: Tendencias de precios con Chart.js
- [ ] **Portfolio tracking**: Valor total de wallet en USD
- [ ] **Wallet propia**: No dependencia de MetaMask
- [ ] **WhatsApp API**: Consultas por WhatsApp

### **Q3 2025** 📅 PLANEADO
- [ ] **Price predictions**: ML models con datos Pyth
- [ ] **Multi-chain**: Soporte para Arbitrum, Optimism, Base
- [ ] **DEX integration**: Swaps directos desde el chat
- [ ] **Telegram bot**: Expansión a Telegram

---

## 📚 Documentación Adicional

- **[Quick Start Guide](./QUICK_START.md)** - Guía rápida de inicio
- **[Pyth Integration Guide](./PYTH_INTEGRATION_GUIDE.md)** - Detalles técnicos de Pyth
- **[Test Examples](./PYTH_TEST_EXAMPLES.md)** - 15+ casos de prueba
- **[Visual Examples](./PYTH_VISUAL_EXAMPLES.md)** - Mockups de UI
- **[Implementation Summary](./PYTH_IMPLEMENTATION_SUMMARY.md)** - Resumen completo

---

## 🏆 Built For

**ETH Global DevConnect Hackathon**  
**Track:** DeFi + Oracle Integration  
**Sponsor:** Pyth Network + Scroll L2
- **DefiLlama Track** - Uso creativo de yields API
- **Scroll Track** - Smart contracts desplegados en L2

---

Desarrollado con 🦙 y ❤️ para democratizar DeFi
