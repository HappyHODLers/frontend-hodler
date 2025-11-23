/**
 * Servicio para interactuar con el backend de Scroll Sepolia
 */

const API_URL = 'https://clary-backend-ai.onrender.com';

/**
 * Enviar un mensaje al chatbot de DeepSeek
 */
export const sendChatMessage = async (message, senderWallet) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        sender_wallet: senderWallet
      })
    });

    if (!response.ok) {
      throw new Error('Error al comunicarse con el chatbot');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en sendChatMessage:', error);
    throw error;
  }
};

/**
 * Consultar balance de una wallet en Scroll Sepolia
 */
export const getBalance = async (address) => {
  try {
    const response = await fetch(`${API_URL}/api/balance/${address}`);
    
    if (!response.ok) {
      throw new Error('Error al consultar el balance');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getBalance:', error);
    throw error;
  }
};

/**
 * Preparar una transferencia (obtener estimación de gas y detalles)
 */
export const prepareTransfer = async (recipient, amount, sender) => {
  try {
    const response = await fetch(`${API_URL}/prepare-transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient,
        amount: parseFloat(amount),
        sender
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al preparar la transferencia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en prepareTransfer:', error);
    throw error;
  }
};

/**
 * Verificar el estado de una transacción
 */
export const checkTransaction = async (txid) => {
  try {
    const response = await fetch(`${API_URL}/check-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid })
    });

    if (!response.ok) {
      throw new Error('Error al verificar la transacción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en checkTransaction:', error);
    throw error;
  }
};

/**
 * Obtener información de la red
 */
export const getNetworkInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/network-info`);
    
    if (!response.ok) {
      throw new Error('Error al obtener información de la red');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getNetworkInfo:', error);
    throw error;
  }
};

/**
 * Crear un nuevo usuario
 */
export const createUser = async (username, walletAddress) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        wallet_address: walletAddress
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
};

/**
 * Obtener usuario por wallet address
 */
export const getUserByWallet = async (walletAddress) => {
  try {
    const response = await fetch(`${API_URL}/users/wallet/${walletAddress}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Usuario no encontrado');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUserByWallet:', error);
    throw error;
  }
};

/**
 * Obtener contactos de un usuario por wallet address
 */
export const getUserContacts = async (walletAddress) => {
  try {
    const response = await fetch(`${API_URL}/users/wallet/${walletAddress}/contacts`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener contactos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUserContacts:', error);
    throw error;
  }
};

/**
 * Crear un nuevo contacto
 */
export const createContact = async (userId, nombre, walletAddress) => {
  try {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        nombre,
        wallet_address: walletAddress
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear contacto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createContact:', error);
    throw error;
  }
};
