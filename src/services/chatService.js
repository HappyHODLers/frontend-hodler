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
 * Obtiene el historial de transacciones de una dirección usando la API de Hiro
 * @param {string} address - Dirección de la wallet
 * @param {number} limit - Número máximo de transacciones a obtener (default: 50)
 * @param {number} offset - Offset para paginación (default: 0)
 * @returns {Promise} Objeto con transacciones y metadatos
 */
export const getTransactionHistory = async (address, limit = 50, offset = 0) => {
  try {
    const HIRO_API = "https://api.testnet.hiro.so"; // Cambiar a mainnet si es necesario
    const response = await fetch(
      `${HIRO_API}/extended/v1/address/${address}/transactions?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error('Error al obtener el historial de transacciones');
    }

    const data = await response.json();
    
    // Formatear las transacciones para facilitar su uso
    const formattedTransactions = data.results.map(tx => ({
      txid: tx.tx_id,
      type: tx.tx_type,
      status: tx.tx_status,
      sender: tx.sender_address,
      fee: tx.fee_rate,
      nonce: tx.nonce,
      blockHeight: tx.block_height,
      blockTime: tx.burn_block_time,
      timestamp: new Date(tx.burn_block_time * 1000).toISOString(),
      // Para transferencias STX
      amount: tx.tx_type === 'token_transfer' ? tx.token_transfer?.amount : null,
      recipient: tx.tx_type === 'token_transfer' ? tx.token_transfer?.recipient_address : null,
      memo: tx.tx_type === 'token_transfer' ? tx.token_transfer?.memo : null,
      // Para contract calls
      contractCall: tx.tx_type === 'contract_call' ? {
        contractId: tx.contract_call?.contract_id,
        functionName: tx.contract_call?.function_name,
        functionArgs: tx.contract_call?.function_args
      } : null,
      // URL del explorer
      explorerUrl: `https://explorer.hiro.so/txid/${tx.tx_id}?chain=testnet`
    }));

    return {
      total: data.total,
      limit: data.limit,
      offset: data.offset,
      transactions: formattedTransactions
    };
  } catch (error) {
    console.error('Error al obtener el historial de transacciones:', error);
    throw error;
  }
};

/**
 * Obtiene TODAS las transacciones (transferencias, contract calls, exitosas y fallidas)
 * @param {string} address - Dirección de la wallet
 * @param {number} limit - Número máximo de transacciones
 * @returns {Promise} Array de todas las transacciones
 */
export const getSTXTransfers = async (address, limit = 50) => {
  try {
    const history = await getTransactionHistory(address, limit);
    
    // FILTRAR: Solo transacciones exitosas o pendientes (sin fallidas)
    const filteredTransactions = history.transactions.filter(tx => 
      tx.status === 'success' || tx.status === 'pending'
    );
    
    return filteredTransactions.map(tx => {
      // Determinar el tipo de transacción
      let type = 'unknown';
      let amount = 0;
      let recipient = '';
      let displayType = '';
      
      if (tx.type === 'token_transfer') {
        // Transferencia STX normal
        type = tx.sender === address ? 'sent' : 'received';
        amount = tx.amount ? (tx.amount / 1_000_000).toFixed(6) : '0';
        recipient = tx.recipient;
        displayType = type === 'sent' ? 'Enviado' : 'Recibido';
      } else if (tx.type === 'contract_call') {
        // Llamada a contrato
        type = 'contract';
        displayType = 'Contrato: ' + (tx.contractCall?.functionName || 'unknown');
        recipient = tx.contractCall?.contractId || '';
        
        // ⭐ INTENTAR EXTRAER EL MONTO DE LOS ARGUMENTOS DEL CONTRATO
        let contractAmount = 0;
        try {
          if (tx.contractCall && tx.contractCall.functionArgs && Array.isArray(tx.contractCall.functionArgs)) {
            // Buscar argumento llamado 'amount', 'amt', 'value', 'val'
            const amountArg = tx.contractCall.functionArgs.find(arg => 
              arg.name === 'amount' || arg.name === 'amt' || arg.name === 'value' || arg.name === 'val'
            );
            
            if (amountArg && amountArg.repr) {
              // El formato de Clarity es "u10000000" para uint
              const match = amountArg.repr.match(/u(\d+)/);
              if (match) {
                contractAmount = parseInt(match[1]) / 1_000_000;
              }
            }
          }
        } catch (error) {
          console.log('No se pudo extraer monto del contrato:', error);
        }
        
        // Si encontramos un monto en los argumentos, usarlo; si no, mostrar 0
        amount = contractAmount > 0 ? contractAmount.toFixed(6) : '0';
      } else if (tx.type === 'smart_contract') {
        // Despliegue de contrato
        type = 'deploy';
        displayType = 'Deploy Contrato';
        amount = '0'; // Los deploys no tienen monto
      } else {
        // Otros tipos
        type = 'other';
        displayType = tx.type || 'Otro';
        amount = '0';
      }

      return {
        txid: tx.txid,
        date: new Date(tx.timestamp).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        amount: amount,
        amountSTX: parseFloat(amount),
        sender: tx.sender,
        recipient: recipient || tx.recipient || 'N/A',
        type: type, // sent, received, contract, deploy, other
        displayType: displayType, // Para mostrar en la UI
        status: tx.status, // success, pending (ya no fallidas)
        explorerUrl: tx.explorerUrl,
        memo: tx.memo,
        fee: tx.fee ? (tx.fee / 1_000_000).toFixed(6) : '0',
        txType: tx.type, // token_transfer, contract_call, etc.
        blockHeight: tx.blockHeight
      };
    });
  } catch (error) {
    console.error('Error al obtener transferencias STX:', error);
    throw error;
  }
};
