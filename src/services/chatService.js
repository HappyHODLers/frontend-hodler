/**
 * Servicio para comunicarse con el backend Flask para el chatbot y transferencias
 */
import pythService from './pythService';

// URL base del backend
const API_BASE_URL = "https://clary-backend-ai.onrender.com/";
//const API_BASE_URL = "http://127.0.0.1:5000";

/**
 * Detecta si el mensaje es una consulta de precio
 */
export const detectPriceQuery = (message) => {
  const lowerMsg = message.toLowerCase();
  
  // Patrones para detectar consultas de precio
  const pricePatterns = [
    /(?:what'?s|what is|how much is|price of|precio de|cuánto está|cotización de)\s+(\w+)/i,
    /(\w+)\s+(?:price|precio|cotización)/i,
  ];
  
  for (const pattern of pricePatterns) {
    const match = message.match(pattern);
    if (match) {
      return {
        isPrice: true,
        asset: match[1],
      };
    }
  }
  
  return { isPrice: false };
};

/**
 * Detecta si el mensaje pide comparar múltiples assets
 */
export const detectComparison = (message) => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('compare') || lowerMsg.includes('compara')) {
    // Extraer símbolos (BTC, ETH, SOL, etc.)
    const assets = [];
    const symbols = ['BTC', 'ETH', 'SOL', 'USDC', 'USDT', 'DAI', 'AVAX', 'MATIC', 'ARB', 'OP', 'BNB', 'ADA', 'DOT', 'LINK', 'UNI'];
    
    for (const symbol of symbols) {
      const regex = new RegExp(symbol, 'i');
      if (regex.test(message)) {
        assets.push(symbol);
      }
    }
    
    // También buscar nombres completos
    const nameMapping = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'solana': 'SOL',
    };
    
    for (const [name, symbol] of Object.entries(nameMapping)) {
      const regex = new RegExp(name, 'i');
      if (regex.test(message) && !assets.includes(symbol)) {
        assets.push(symbol);
      }
    }
    
    return {
      isComparison: assets.length >= 2,
      assets,
    };
  }
  
  return { isComparison: false };
};

/**
 * Envía un mensaje al chatbot y recibe una acción recomendada
 * @param {string} message - El mensaje del usuario para el chatbot
 * @param {string} senderWallet - La dirección de wallet del usuario conectado
 */
export const sendChatMessage = async (message, senderWallet = '') => {
  try {
    // Primero verificar si es una consulta de precio
    const priceQuery = detectPriceQuery(message);
    if (priceQuery.isPrice) {
      const priceData = await pythService.getPrice(priceQuery.asset);
      return {
        action: 'price_query',
        message: `📊 Here's the current price for ${priceData.symbol}`,
        priceData,
      };
    }
    
    // Verificar si es una comparación
    const comparison = detectComparison(message);
    if (comparison.isComparison) {
      const prices = await pythService.getPrices(comparison.assets);
      return {
        action: 'price_comparison',
        message: `📊 Here's the comparison for ${comparison.assets.join(', ')}`,
        priceData: prices,
      };
    }
    
    // Si no es consulta de precio, enviar al backend normal
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        sender_wallet: senderWallet  // ✅ Agregar la wallet del usuario
      }),
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar mensaje al chatbot:', error);
    return {
      action: 'none',
      message: 'Lo siento, ha ocurrido un error al procesar tu mensaje.'
    };
  }
};

/**
 * Obtiene el valor actual del contador desde el backend
 */
export const getCounterValue = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-count`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el contador');
    }

    const data = await response.json();
    return Math.floor(Number(data.count));
  } catch (error) {
    console.error('Error al obtener el contador:', error);
    throw error;
  }
};

/**
 * Consulta el balance de una wallet de Stacks
 * @param {string} address - Dirección de la wallet
 */
export const getWalletBalance = async (address) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el balance');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el balance:', error);
    throw error;
  }
};

/**
 * Prepara los datos para una transferencia de STX
 * @param {string} sender - Dirección del remitente
 * @param {string} recipient - Dirección del destinatario
 * @param {number} amount - Cantidad de STX a transferir
 */
export const prepareTransfer = async (sender, recipient, amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/prepare-transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender, recipient, amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al preparar la transferencia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al preparar la transferencia:', error);
    throw error;
  }
};

/**
 * Verifica el estado de una transacción
 * @param {string} txid - ID de la transacción
 */
export const checkTransaction = async (txid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
    });

    if (!response.ok) {
      throw new Error('Error al verificar la transacción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al verificar la transacción:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de transacciones de una dirección usando Scroll Sepolia
 * @param {string} address - Dirección de la wallet (Ethereum format)
 * @param {number} limit - Número máximo de transacciones a obtener (default: 50)
 * @param {number} offset - Offset para paginación (default: 0)
 * @returns {Promise} Objeto con transacciones y metadatos
 */
export const getTransactionHistory = async (address, limit = 50, offset = 0) => {
  try {
    // Scroll Sepolia no tiene una API REST como Hiro
    // Por ahora retornar array vacío
    // TODO: Implementar con Etherscan-like API o The Graph cuando esté disponible
    console.log('⚠️ Transaction history not yet implemented for Scroll L2');
    return {
      total: 0,
      limit: limit,
      offset: offset,
      transactions: []
    };
  } catch (error) {
    console.error('Error al obtener el historial de transacciones:', error);
    return {
      total: 0,
      limit: limit,
      offset: offset,
      transactions: []
    };
  }
};

/**
 * Obtiene transferencias ETH (reemplaza getSTXTransfers para Scroll L2)
 * @param {string} address - Dirección de la wallet (Ethereum format)
 * @param {number} limit - Número máximo de transacciones
 * @returns {Promise} Array de transacciones
 */
export const getSTXTransfers = async (address, limit = 50) => {
  try {
    const history = await getTransactionHistory(address, limit);
    
    // Retornar transacciones formateadas para Scroll L2
    return history.transactions.map(tx => ({
      txid: tx.txid || '',
      type: tx.type || 'transfer',
      status: tx.status || 'unknown',
      sender: tx.sender || address,
      recipient: tx.recipient || '',
      amount: tx.amount || '0',
      date: tx.timestamp ? new Date(tx.timestamp).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Unknown',
      explorerUrl: tx.explorerUrl || `https://sepolia.scrollscan.com/tx/${tx.txid}`
    }));
  } catch (error) {
    console.error('Error al obtener transferencias:', error);
    return []; // Retornar array vacío en lugar de throw
  }
};
