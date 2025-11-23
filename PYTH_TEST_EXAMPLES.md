# 🧪 Ejemplos de Prueba - Pyth Network Integration

## 📋 Casos de Prueba

### 1️⃣ **Consultas de Precio Individual**

#### Caso 1.1: Bitcoin (BTC)
```
Input: "What's Bitcoin price?"
Expected Output:
- ✅ Mensaje: "📊 Here's the current price for BTC"
- ✅ PriceCard renderizado
- ✅ Precio > $40,000
- ✅ Confidence interval < $50
- ✅ Timestamp actualizado
```

#### Caso 1.2: Ethereum (ETH)
```
Input: "How much is ETH?"
Expected Output:
- ✅ Mensaje: "📊 Here's the current price for ETH"
- ✅ PriceCard con precio ~$2,000-$3,000
```

#### Caso 1.3: Solana (SOL)
```
Input: "Price of SOL"
Expected Output:
- ✅ Mensaje: "📊 Here's the current price for SOL"
- ✅ PriceCard con precio ~$100-$150
```

#### Caso 1.4: Nombre completo (bitcoin → BTC)
```
Input: "Cuánto está Bitcoin?"
Expected Output:
- ✅ Normalización automática: bitcoin → BTC
- ✅ PriceCard renderizado correctamente
```

---

### 2️⃣ **Comparaciones de Múltiples Activos**

#### Caso 2.1: Comparar BTC y ETH
```
Input: "Compare BTC and ETH"
Expected Output:
- ✅ Mensaje: "📊 Here's the comparison for BTC, ETH"
- ✅ ComparisonView con 2 cards
- ✅ Card 1: BTC (border amarillo)
- ✅ Card 2: ETH (border naranja)
```

#### Caso 2.2: Comparar 3 activos
```
Input: "Compare Bitcoin, Ethereum y Solana"
Expected Output:
- ✅ ComparisonView con 3 cards
- ✅ BTC, ETH, SOL con colores únicos
- ✅ Todos los precios actualizados
```

#### Caso 2.3: Comparar 5 activos (máximo)
```
Input: "Show me BTC ETH SOL USDC USDT"
Expected Output:
- ✅ ComparisonView con 5 cards
- ✅ Colores: yellow, orange, pink, purple, blue
- ✅ Indicador "Live Data" animado
```

---

### 3️⃣ **Stablecoins**

#### Caso 3.1: USDC
```
Input: "Price of USDC"
Expected Output:
- ✅ Precio ≈ $1.00
- ✅ Confidence < $0.001
```

#### Caso 3.2: USDT vs DAI
```
Input: "Compare USDT and DAI"
Expected Output:
- ✅ Ambos cerca de $1.00
- ✅ Útil para verificar desviaciones de peg
```

---

### 4️⃣ **Layer 2 Tokens**

#### Caso 4.1: Arbitrum (ARB)
```
Input: "What's ARB price?"
Expected Output:
- ✅ PriceCard con precio actual
- ✅ Datos de Pyth Network
```

#### Caso 4.2: Optimism (OP)
```
Input: "How much is OP?"
Expected Output:
- ✅ PriceCard renderizado
```

#### Caso 4.3: Polygon (MATIC)
```
Input: "Price of MATIC"
Expected Output:
- ✅ PriceCard con precio L2 token
```

---

### 5️⃣ **Altcoins**

#### Caso 5.1: Cardano (ADA)
```
Input: "What's Cardano price?"
Expected Output:
- ✅ Normalización: Cardano → ADA
- ✅ PriceCard renderizado
```

#### Caso 5.2: Chainlink (LINK)
```
Input: "Price of LINK"
Expected Output:
- ✅ PriceCard con precio actual
```

#### Caso 5.3: Uniswap (UNI)
```
Input: "How much is UNI?"
Expected Output:
- ✅ PriceCard renderizado
```

---

### 6️⃣ **Casos Edge (Errores esperados)**

#### Caso 6.1: Asset no soportado
```
Input: "What's DOGE price?"
Expected Output:
- ❌ Error: "Asset DOGE not supported"
- ✅ Mensaje del backend sin price data
```

#### Caso 6.2: Sin wallet conectada
```
Input: "Price of BTC" (sin conectar wallet)
Expected Output:
- ✅ Mensaje: "🔒 Please connect your wallet first."
```

#### Caso 6.3: Mensaje no relacionado con precios
```
Input: "Hello, how are you?"
Expected Output:
- ✅ Respuesta del backend Flask normal
- ❌ NO renderizar PriceCard
```

---

## 🎯 Checklist de Validación

### **UI/UX**
- [ ] PriceCard tiene gradiente amarillo-naranja-rosa
- [ ] ComparisonView tiene colores únicos por asset
- [ ] Timestamp muestra "hace X segundos" dinámico
- [ ] Confidence interval formateado con ±
- [ ] Logo de Pyth Network visible
- [ ] Responsive en móvil (Tailwind breakpoints)

### **Funcionalidad**
- [ ] `detectPriceQuery()` detecta correctamente patrones
- [ ] `detectComparison()` extrae múltiples símbolos
- [ ] `pythService.getPrice()` retorna datos válidos
- [ ] `pythService.getPrices()` funciona con arrays
- [ ] Cache funciona (2da consulta más rápida)
- [ ] Normalización de nombres (bitcoin → BTC)

### **Performance**
- [ ] Latencia < 500ms en primera consulta
- [ ] Latencia < 100ms con cache hit
- [ ] No hay memory leaks en cache
- [ ] Componentes se renderizan sin lag

### **Errores**
- [ ] Maneja assets no soportados
- [ ] Maneja errores de red (Hermes down)
- [ ] Maneja respuestas inválidas de Pyth
- [ ] Console sin errores críticos

---

## 🔍 Comandos de Testing

### **Prueba Manual en UI**

1. **Iniciar servidor**:
```bash
npm run dev
```

2. **Abrir navegador**:
```
http://localhost:5174
```

3. **Conectar wallet** (MetaMask, Rainbow, etc.)

4. **Probar en chat**:
```
Caso 1: "What's Bitcoin price?"
Caso 2: "Compare BTC and ETH"
Caso 3: "Price of SOL"
```

---

### **Prueba con DevTools**

1. **Abrir consola del navegador** (F12)

2. **Verificar llamadas a Pyth**:
```javascript
// En Network tab, buscar:
https://hermes.pyth.network/v2/updates/price/latest?...
```

3. **Ver logs de pythService**:
```javascript
// En Console tab, buscar:
"Fetching price for: BTC"
"Cache hit for: BTC"
```

---

### **Prueba Programática**

#### Test 1: pythService.getPrice()
```javascript
import pythService from './src/services/pythService';

// Test single price
const btcPrice = await pythService.getPrice('BTC');
console.log('BTC:', btcPrice);

// Expected:
// {
//   symbol: 'BTC',
//   price: 45123.50,
//   confidence: 2.35,
//   timestamp: 1234567890
// }
```

#### Test 2: pythService.getPrices()
```javascript
// Test multiple prices
const prices = await pythService.getPrices(['BTC', 'ETH', 'SOL']);
console.log('Prices:', prices);

// Expected: Array[3] with all price data
```

#### Test 3: Cache functionality
```javascript
// First call (no cache)
console.time('No cache');
await pythService.getPrice('BTC');
console.timeEnd('No cache'); // ~200ms

// Second call (with cache)
console.time('With cache');
await pythService.getPrice('BTC');
console.timeEnd('With cache'); // ~1ms
```

---

## 📊 Matriz de Resultados Esperados

| Input | Action Detected | Component Rendered | Latency |
|-------|----------------|-------------------|---------|
| "What's BTC price?" | `price_query` | `PriceCard` | ~200ms |
| "Compare BTC ETH" | `price_comparison` | `ComparisonView` | ~250ms |
| "Hello bot" | `none` | Mensaje normal | ~150ms |
| "Price of XYZ" (no soportado) | `price_query` | Error message | ~100ms |

---

## 🐛 Debug Tips

### **Si PriceCard no se renderiza:**

1. Verificar que el mensaje tenga `isPriceQuery: true`:
```javascript
// En ChatBot.jsx, agregar console.log:
console.log('Message:', message);
// Debe mostrar: { isPriceQuery: true, priceData: {...} }
```

2. Verificar imports:
```javascript
import PriceCard from './PriceCard';
// ✅ NO './components/PriceCard'
```

---

### **Si detectPriceQuery no funciona:**

1. Verificar patrones regex:
```javascript
// En chatService.js
const pricePatterns = [
  /(?:what'?s|what is|how much is|price of)\s+(\w+)/i,
  // Probar con: console.log(message.match(pattern))
];
```

2. Verificar normalización:
```javascript
// En pythService.js
console.log(pythService.normalizeAsset('bitcoin')); // Debe retornar 'BTC'
```

---

### **Si los precios no se actualizan:**

1. Verificar cache:
```javascript
// Limpiar cache manualmente
pythService.priceCache.clear();
```

2. Verificar timestamp:
```javascript
// En pythService.js
console.log('Cache age:', Date.now() - cached.timestamp);
// Debe ser < 5000ms
```

---

## ✅ Criterios de Aceptación

### **Must Have (P0)**
- [x] Consultas individuales funcionan (BTC, ETH, SOL)
- [x] Comparaciones funcionan (hasta 5 assets)
- [x] PriceCard renderiza correctamente
- [x] ComparisonView renderiza correctamente
- [x] Cache funciona (reduce latencia)

### **Should Have (P1)**
- [x] Normalización de nombres (bitcoin → BTC)
- [x] Manejo de errores (assets no soportados)
- [x] Responsive design (móvil y desktop)
- [x] Timestamp dinámico ("hace X segundos")

### **Nice to Have (P2)**
- [ ] Animaciones de entrada para PriceCard
- [ ] Gráficos históricos (futuro)
- [ ] Sistema de alertas (Q2 2025)

---

## 📸 Screenshots Esperados

### **PriceCard (Consulta Individual)**
```
┌─────────────────────────────────────┐
│ 📊 Bitcoin (BTC)                    │
│                                     │
│ 💰 $45,123.50                       │
│                                     │
│ ± Confidence: $2.35                 │
│ ⏰ Updated: 3 seconds ago           │
│                                     │
│ 🐍 Pyth Network                     │
│ Binance | OKX | Coinbase | Kraken  │
└─────────────────────────────────────┘
```

### **ComparisonView (3 Assets)**
```
┌─────────────┬─────────────┬─────────────┐
│ BTC         │ ETH         │ SOL         │
│ (yellow)    │ (orange)    │ (pink)      │
│ $45,123.50  │ $2,456.78   │ $110.25     │
│ ± $2.35     │ ± $1.20     │ ± $0.05     │
└─────────────┴─────────────┴─────────────┘
```

---

**¡Prueba todos los casos y reporta cualquier issue! 🚀😊**
