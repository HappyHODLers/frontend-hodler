# Integración RainbowKit + Scroll Sepolia

## ✅ Cambios Implementados

### 1. Configuración de RainbowKit

- **Archivo**: `src/config/wagmi.js`
- Configurado para usar únicamente **Scroll Sepolia** (Chain ID: 534351)
- RPC: `https://sepolia-rpc.scroll.io`
- Explorer: `https://sepolia.scrollscan.com`

### 2. Servicio de Backend

- **Archivo**: `src/services/scrollSepoliaService.js`
- Funciones para interactuar con tu backend Flask:
  - `sendChatMessage()` - Envía mensajes al chatbot de DeepSeek
  - `getBalance()` - Consulta balance de ETH
  - `prepareTransfer()` - Prepara una transferencia
  - `checkTransaction()` - Verifica el estado de una transacción
  - `getUserByWallet()` - Obtiene usuario por wallet
  - `getUserContacts()` - Obtiene contactos del usuario
  - `createContact()` - Crea un nuevo contacto

### 3. Componente ChatBot Actualizado

- **Archivo**: `src/components/ChatBot.jsx`
- Integrado con hooks de wagmi:
  - `useAccount()` - Obtiene la wallet conectada
  - `useSendTransaction()` - Envía transacciones a Scroll Sepolia
  - `useWaitForTransactionReceipt()` - Espera confirmación de transacción
- Funciones actualizadas:
  - `sendMessage()` - Interpreta comandos con DeepSeek AI
  - `confirmTransfer()` - Ejecuta transferencias en Scroll Sepolia
  - `handleBalanceCheck()` - Consulta balance usando el backend
  - `handleAddContact()` - Agrega contactos con validación de wallet Ethereum

### 4. Providers Configurados

- **Archivo**: `src/main.jsx`
- `WagmiProvider` - Maneja conexiones de wallet
- `QueryClientProvider` - Cache de datos de React Query
- `RainbowKitProvider` - UI de conexión de wallet

## 🚀 Configuración Necesaria

### 1. Obtener Project ID de WalletConnect

1. Ve a [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia el **Project ID**
5. Actualiza en `src/config/wagmi.js`:

```javascript
export const config = getDefaultConfig({
  appName: 'sBTC ChatBot',
  projectId: 'TU_PROJECT_ID_AQUI', // ⚠️ Cambiar esto
  chains: [scrollSepolia],
  ssr: false,
});
```

### 2. Verificar Backend

Asegúrate de que tu backend Flask esté corriendo en `http://localhost:5000`

```bash
cd backend
python app.py
```

### 3. Ejecutar el Frontend

```bash
npm run dev
```

## 📝 Cómo Usar

### Conectar Wallet

1. Haz clic en el botón **"Connect Wallet"** en la esquina superior derecha
2. Selecciona tu wallet (MetaMask, WalletConnect, etc.)
3. Asegúrate de estar conectado a **Scroll Sepolia**
4. El bot te registrará automáticamente

### Comandos Disponibles

#### Consultar Balance
```
¿Cuál es mi balance?
```

#### Transferir a una Wallet
```
Transferir 0.1 ETH a 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

#### Transferir a un Contacto
```
Enviar 0.5 ETH a Juan
```

#### Ver Información de la Red
```
¿Qué red estoy usando?
```

### Agregar Contactos

1. Haz clic en el botón **+** en la sección de Contactos
2. Ingresa el nombre del contacto
3. Ingresa la wallet Ethereum (debe empezar con `0x`)
4. Haz clic en **Agregar Contacto**

## 🔄 Flujo de Transferencia

1. **Usuario envía comando**: "Transferir 0.1 ETH a Juan"
2. **DeepSeek interpreta**: Extrae destinatario y monto
3. **Backend prepara**: Calcula gas y valida
4. **Usuario confirma**: Hace clic en "Confirmar Transferencia"
5. **Wallet firma**: MetaMask/otra wallet solicita firma
6. **Transacción enviada**: Se muestra hash y estado
7. **Confirmación**: Mensaje de éxito con link al explorer

## 🎨 Características

- ✅ Conexión de wallet con RainbowKit
- ✅ Transferencias en Scroll Sepolia
- ✅ Gestión de contactos con base de datos
- ✅ Chatbot con IA (DeepSeek)
- ✅ Consulta de balance
- ✅ Historial de transacciones
- ✅ Estimación de gas
- ✅ Links al block explorer

## 🔧 Troubleshooting

### Error: "Failed to fetch"
- Verifica que el backend esté corriendo en `http://localhost:5000`
- Revisa la consola del navegador para más detalles

### Error: "User rejected the request"
- El usuario canceló la transacción en la wallet
- Esto es normal, simplemente intenta de nuevo

### Wallet no se conecta
- Asegúrate de tener MetaMask u otra wallet instalada
- Verifica que tengas fondos en Scroll Sepolia
- Puedes obtener ETH de prueba en: [https://scroll.io/faucet](https://scroll.io/faucet)

### Transacción pendiente por mucho tiempo
- Scroll Sepolia puede tardar 10-30 segundos
- Verifica el estado en el explorer: `https://sepolia.scrollscan.com`

## 📦 Dependencias Instaladas

```json
{
  "@rainbow-me/rainbowkit": "^2.2.9",
  "@tanstack/react-query": "^5.x",
  "wagmi": "^2.19.5",
  "viem": "^2.x"
}
```

## 🌐 URLs Importantes

- **Scroll Sepolia RPC**: https://sepolia-rpc.scroll.io
- **Explorer**: https://sepolia.scrollscan.com
- **Faucet**: https://scroll.io/faucet
- **WalletConnect Cloud**: https://cloud.walletconnect.com

## 📚 Documentación

- [RainbowKit Docs](https://rainbowkit.com/docs)
- [Wagmi Docs](https://wagmi.sh)
- [Scroll Docs](https://docs.scroll.io)
- [Viem Docs](https://viem.sh)
