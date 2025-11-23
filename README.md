# 🦙 LlamaRollup - AI Financial Agent

Agente de IA Financiero que maximiza tus rendimientos DeFi con una simple conversación. Powered by DefiLlama + Scroll L2.

## ✨ Características

- 🤖 **IA Conversacional**: Pregunta en lenguaje natural y obtén recomendaciones inteligentes
- � **Análisis de Yields**: Acceso a +10,000 pools de liquidez vía DefiLlama API
- ⚡ **Scroll L2**: Transacciones ultra-rápidas y baratas (~$0.02 gas)
- 🎯 **Decisiones Inteligentes**: El agente analiza TVL, riesgo, APY e IL automáticamente
- 🔐 **Seguridad Total**: Smart contracts auditados, tú mantienes control de tus fondos
- 💬 **UX Simple**: De pregunta a inversión optimizada en 30 segundos

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 16+
- Wallet compatible (MetaMask, Rainbow, etc.)
- Fondos en Scroll L2

### Instalación
```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

## 📁 Estructura
```
src/
├── components/     # Componentes UI (ChatBot, Landing, etc.)
├── pages/         # Páginas principales
├── services/      # APIs (DefiLlama, chatService)
├── hooks/         # Hooks personalizados
└── config/        # Configuración (Wagmi, contracts)
```

## 🛠️ Scripts
- `npm run dev` - Desarrollo
- `npm run build` - Producción
- `npm run preview` - Preview

## 💡 Uso
1. Conecta tu wallet a Scroll L2
2. Pregunta: "¿Dónde invierto 1000 USDC?"
3. El agente analiza yields con DefiLlama
4. Confirma la transacción optimizada

## 🏆 Built For
- **DefiLlama Track** - Uso creativo de yields API
- **Scroll Track** - Smart contracts desplegados en L2

---

Desarrollado con 🦙 y ❤️ para democratizar DeFi
