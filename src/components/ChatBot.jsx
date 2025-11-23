/**
 * HappyHODLers - AI Financial Agent Component
 * Chatbot conversacional con precios en tiempo real de Pyth Network
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getSTXTransfers, sendChatMessage, prepareTransfer } from '../services/chatService';
import { getBalance, getUserContacts, createContact } from '../services/scrollSepoliaService';
import { priceAlertService, detectPriceAlert } from '../services/priceAlertService';
import TransactionHistory from './TransactionHistory';
import PriceCard from './PriceCard';
import ComparisonView from './ComparisonView';
import logoChatBot from '../assets/logo cuadrado.png';
import logoStack from '../assets/logo cuadrado.png';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: `Hello! 😊 I'm HappyHODLers, your AI Financial Agent powered by **Pyth Network**.

🔥 **What I can do:**

📊 Get real-time prices for 15+ crypto assets
🔍 Compare multiple assets side-by-side  
⚡ Prices updated every 400ms from top exchanges
🎯 Confidence intervals for data accuracy

💡 **Try asking:**
• "What's Bitcoin price?"
• "Compare BTC, ETH, and SOL"
• "Show me USDC price"
• "What's the price of Solana?"

Click the buttons below or just type naturally! 🚀`,
      sender: 'bot'
    }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showContactsMenu, setShowContactsMenu] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactWallet, setNewContactWallet] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contacts, setContacts] = useState([]); // Contactos reales desde BD
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]); // Alertas de precio activas
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Estados para reconocimiento de voz
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [silenceDelay] = useState(1000); // 1 segundo de silencio para detener
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // Función para detener el reconocimiento de voz
  const stopListening = useCallback(() => {
    if (recognitionRef.current && listening) {
      clearTimeout(silenceTimerRef.current);
      recognitionRef.current.stop();
      setListening(false);
    }
  }, [listening]);

  // Función para reiniciar el temporizador de silencio
  const resetSilenceTimer = useCallback(() => {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (listening) {
        console.log("Deteniendo por silencio...");
        stopListening();
      }
    }, silenceDelay);
  }, [listening, silenceDelay, stopListening]);

  // Configurar reconocimiento de voz
  useEffect(() => {
    // Obtener micrófono por defecto
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((deviceInfos) => {
        const mics = deviceInfos.filter((d) => d.kind === 'audioinput');
        if (mics.length > 0) setSelectedDeviceId(mics[0].deviceId);
      })
      .catch((err) => console.error('Error micrófono:', err));

    // Limpiar el temporizador al desmontar el componente
    return () => {
      clearTimeout(silenceTimerRef.current);
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Actualizar el input con la transcripción
  useEffect(() => {
    if (listening) {
      setInput(finalTranscript + interimTranscript);
    }
  }, [finalTranscript, interimTranscript, listening]);

  // Función para iniciar el reconocimiento de voz
  const startListening = () => {
    if (listening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('⚠️ Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    setFinalTranscript('');
    setInterimTranscript('');
    setInput('');
    
    navigator.mediaDevices
      .getUserMedia({ 
        audio: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId } } 
          : true 
      })
      .then(() => {
        // Crear nueva instancia de recognition cada vez
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          // Reiniciar el temporizador de silencio cuando se detecta voz
          resetSilenceTimer();
          
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              final += result[0].transcript + ' ';
            } else {
              interim += result[0].transcript;
            }
          }

          if (final) {
            setFinalTranscript((prev) => prev + final);
            setInterimTranscript('');
          }
          if (interim) {
            setInterimTranscript(interim);
          }
        };

        recognition.onend = () => {
          clearTimeout(silenceTimerRef.current);
          setListening(false);
        };

        recognition.onerror = (event) => {
          console.error('Error en reconocimiento:', event.error);
          clearTimeout(silenceTimerRef.current);
          setListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setListening(true);
        resetSilenceTimer(); // Iniciar el temporizador de silencio
      })
      .catch((err) => {
        console.error('Error al iniciar micrófono:', err);
        alert('⚠️ No se pudo acceder al micrófono. Verifica los permisos.');
      });
  };

  // Función para formatear mensajes del bot
  const formatBotMessage = (text) => {
    // Detectar si es una transacción completada
    if (text.includes('Transacción completada') || text.includes('transacción:')) {
      return renderTransactionMessage(text);
    }
    
    // Formatear texto normal con negritas, cursivas, etc.
    return renderFormattedText(text);
  };

  // Renderizar mensaje de transacción especial
  const renderTransactionMessage = (text) => {
    const txIdMatch = text.match(/ID de transacción:\s*([a-f0-9]+)/i);
    const explorerMatch = text.match(/(https:\/\/explorer\.hiro\.so\/txid\/[^\s]+)/i);
    
    if (txIdMatch && explorerMatch) {
      const txId = txIdMatch[1];
      const explorerUrl = explorerMatch[1];
      
      return (
        <div className="space-y-3 sm:space-y-4">
          {/* Header de éxito */}
          <div className="flex items-center gap-2 sm:gap-3 bg-green-600 bg-opacity-20 border border-green-500 rounded-lg p-2 sm:p-3">
            <span className="text-2xl sm:text-3xl md:text-4xl">✅</span>
            <span className="text-sm sm:text-base md:text-lg font-bold text-green-400">
              Transacción Completada
            </span>
          </div>
          
          {/* ID de transacción */}
          <div className="bg-licorice bg-opacity-60 rounded-lg p-3 sm:p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg md:text-xl">📋</span>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-sandy-brown">
                ID de Transacción:
              </span>
            </div>
            <div className="bg-jet bg-opacity-70 rounded p-2 sm:p-3 border border-jet-600">
              <code className="text-[10px] sm:text-xs md:text-sm text-seasalt font-mono break-all leading-relaxed">
                {txId}
              </code>
            </div>
          </div>
          
          {/* Botón para ver en explorer */}
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:from-pink-400 hover:to-yellow-400 text-gray-900 font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-xs sm:text-sm md:text-base"
          >
            <span className="text-lg sm:text-xl md:text-2xl">🔗</span>
            <span>Ver Transacción en Explorer</span>
            <span className="text-xs sm:text-sm">↗</span>
          </a>
          
          {/* Info adicional */}
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-jet-800 italic">
            <span>💡</span>
            <span>Haz clic para ver los detalles completos</span>
          </div>
        </div>
      );
    }
    
    return renderFormattedText(text);
  };

  // Renderizar texto con formato
  const renderFormattedText = (text) => {
    // Detectar enlaces
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          // Si es URL
          if (part.match(urlRegex)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-orange-400 hover:text-pink-400 underline font-semibold transition-colors"
              >
                <span className="text-xs sm:text-sm">🔗</span>
                <span className="text-xs sm:text-sm md:text-base">Ver enlace</span>
              </a>
            );
          }
          
          // Formatear texto normal
          return (
            <span key={index} className="block">
              {part.split('\n').map((line, lineIndex) => {
                // Detectar líneas con emojis al inicio (como listas)
                const emojiMatch = line.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+)\s*(.+)/u);
                
                if (emojiMatch) {
                  const emoji = emojiMatch[1];
                  const content = emojiMatch[2];
                  
                  // Detectar negritas (**texto**)
                  const boldRegex = /\*\*(.+?)\*\*/g;
                  const formattedContent = content.split(boldRegex).map((segment, i) => {
                    if (i % 2 === 1) {
                      return <strong key={i} className="font-bold text-sandy-brown">{segment}</strong>;
                    }
                    return segment;
                  });
                  
                  return (
                    <div key={lineIndex} className="flex items-start gap-2 mb-2">
                      <span className="text-base sm:text-lg md:text-xl flex-shrink-0">{emoji}</span>
                      <span className="flex-1 text-xs sm:text-sm md:text-base leading-relaxed">
                        {formattedContent}
                      </span>
                    </div>
                  );
                }
                
                // Línea normal con soporte para negritas
                const boldRegex = /\*\*(.+?)\*\*/g;
                const formattedLine = line.split(boldRegex).map((segment, i) => {
                  if (i % 2 === 1) {
                    return <strong key={i} className="font-bold text-sandy-brown">{segment}</strong>;
                  }
                  return segment;
                });
                
                return (
                  <p key={lineIndex} className="mb-1 text-xs sm:text-sm md:text-base leading-relaxed">
                    {formattedLine}
                  </p>
                );
              })}
            </span>
          );
        })}
      </div>
    );
  };
  
  // Hooks de wagmi para conectar wallet y enviar transacciones
  const { address: userAddress, isConnected } = useAccount();
  // const { data: balanceData } = useBalance({
  //   address: userAddress,
  // });
  const { data: txHash, sendTransaction, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Estados del chat
  const [chatResponse, setChatResponse] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Registrar o verificar usuario cuando se conecta
  useEffect(() => {
    const registerOrCheckUser = async () => {
      if (isConnected && userAddress) {
        try {
          // 1. Verificar si el usuario ya existe
          const checkResponse = await fetch(`https://clary-backend-ai.onrender.com/users/wallet/${userAddress}`);
          
          if (!checkResponse.ok) {
            // Usuario no existe, registrarlo automáticamente
            console.log('Usuario no encontrado, registrando...');
            
            // Generar un username basado en la wallet (primeros 8 caracteres)
            const username = `user_${userAddress.substring(0, 8)}`;
            
            const createResponse = await fetch('https://clary-backend-ai.onrender.com/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                wallet_address: userAddress
              })
            });

            if (createResponse.ok) {
              const userData = await createResponse.json();
              console.log('Usuario registrado exitosamente:', userData);
              
              // Mostrar mensaje de bienvenida
              setMessages(prev => [...prev, {
                id: Date.now(),
                text: `🎉 ¡Bienvenido! Tu cuenta ha sido creada con el usuario **${username}**\n\n✅ Ya puedes agregar contactos y realizar transferencias.`,
                sender: 'bot'
              }]);
            }
          } else {
            // Usuario ya existe
            const userData = await checkResponse.json();
            console.log('Usuario encontrado:', userData.user);
          }
        } catch (error) {
          console.error('Error al verificar/registrar usuario:', error);
        }
      }
    };

    registerOrCheckUser();
  }, [isConnected, userAddress]);

  // Cargar contactos cuando el usuario se conecta
  useEffect(() => {
    const loadContacts = async () => {
      if (isConnected && userAddress) {
        setLoadingContacts(true);
        try {
          // Obtener contactos por wallet address
          const response = await fetch(`https://clary-backend-ai.onrender.com/users/wallet/${userAddress}/contacts`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.contacts) {
              // Mapear contactos al formato esperado por el componente
              const formattedContacts = data.contacts.map(contact => ({
                id: contact.id,
                name: contact.nombre,
                address: contact.wallet_address
              }));
              setContacts(formattedContacts);
              console.log(`✅ ${formattedContacts.length} contactos cargados`);
            }
          } else {
            // Si no hay contactos o el usuario no existe, dejar vacío
            setContacts([]);
          }
        } catch (error) {
          console.error('Error al cargar contactos:', error);
          setContacts([]);
        } finally {
          setLoadingContacts(false);
        }
      } else {
        // Si no está conectado, limpiar contactos
        setContacts([]);
      }
    };

    loadContacts();
  }, [isConnected, userAddress]);

  // Cargar historial de transacciones cuando el usuario se conecta
  useEffect(() => {
    const loadRecentTransactions = async () => {
      if (isConnected && userAddress) {
        setLoadingHistory(true);
        try {
          const txs = await getSTXTransfers(userAddress, 10); // Solo las últimas 10
          setRecentTransactions(txs);
        } catch (error) {
          console.error('Error cargando transacciones:', error);
          setRecentTransactions([]);
        } finally {
          setLoadingHistory(false);
        }
      } else {
        setRecentTransactions([]);
      }
    };

    loadRecentTransactions();
  }, [isConnected, userAddress]);

  useEffect(() => {
    if (chatResponse !== null) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: chatResponse,
        sender: 'bot'
      }]);
    }
  }, [chatResponse]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // Monitorear estado de la transacción
  useEffect(() => {
    if (isConfirmed && txHash) {
      setIsTransactionPending(false);
      
      // Mostrar mensaje de éxito con el hash de la transacción
      const explorerUrl = `https://sepolia.scrollscan.com/tx/${txHash}`;
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `✅ **Transferencia completada exitosamente!**\n\n📋 Hash: ${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 8)}\n\n🔗 [Ver en explorador](${explorerUrl})`,
        sender: 'bot',
        txId: txHash,
        explorerUrl: explorerUrl
      }]);
    }
  }, [isConfirmed, txHash]);

  // Mostrar estado de envío
  useEffect(() => {
    if (isSending) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: '⏳ Enviando transacción a Scroll Sepolia...\n\nPor favor confirma en tu wallet.',
        sender: 'bot'
      }]);
    }
    
    if (isConfirming && !isSending) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: '⏳ Esperando confirmación en la blockchain...\n\nEsto puede tomar unos segundos.',
        sender: 'bot'
      }]);
    }
  }, [isSending, isConfirming]);

  // Función para enviar mensaje al chatbot
  const sendMessage = async (message) => {
    if (!isConnected) {
      setChatResponse('🔒 Please connect your wallet first.');
      return;
    }

    setIsChatLoading(true);
    try {
      // Llamar al backend con el mensaje y la wallet del usuario
      const response = await sendChatMessage(message, userAddress);
      
      // Procesar la respuesta del backend
      if (response && response.message) {
        // Verificar si es una consulta de precio o comparación
        if (response.action === 'price_query' && response.priceData) {
          // Agregar mensaje con componente de precio
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: response.message,
            sender: 'bot',
            priceData: response.priceData,
            isPriceQuery: true
          }]);
        } else if (response.action === 'price_comparison' && response.priceData) {
          // Agregar mensaje con comparación de precios
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: response.message,
            sender: 'bot',
            priceData: response.priceData,
            isComparison: true
          }]);
        } else {
          // Mensaje normal
          setChatResponse(response.message);
        }
        
        // Si hay una acción específica, manejarla aquí
        if (response.action === 'transfer') {
          // Transferencia detectada - mostrar modal de confirmación
          console.log('Transfer action detected:', response);
          
          const transferData = {
            recipient: response.recipient,
            amount: response.amount,
            recipientName: response.recipient_name || null,
            contactId: response.contact_id || null
          };
          
          setPendingTransfer(transferData);
          
          // Mensaje de confirmación
          const recipientDisplay = response.recipient_name 
            ? `**${response.recipient_name}** (${response.recipient.substring(0, 10)}...)` 
            : `${response.recipient.substring(0, 10)}...${response.recipient.substring(response.recipient.length - 8)}`;
          
          setChatResponse(
            `✅ Transferencia preparada:\n\n` +
            `💰 **Cantidad:** ${response.amount} ETH\n` +
            `📤 **Destinatario:** ${recipientDisplay}\n\n` +
            `⚠️ **Por favor confirma la transferencia abajo.**`
          );
          
        } else if (response.action === 'balance') {
          // Ya se maneja con handleBalanceCheck
          console.log('Balance check action');
        }
      } else {
        setChatResponse('🤖 I received your message. How can I help you optimize your yields?');
      }
      
      setIsChatLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatResponse('❌ Error processing your message. Please try again.');
      setIsChatLoading(false);
    }
  };

  // Función para confirmar transferencia
  const confirmTransfer = async () => {
    if (!pendingTransfer) return;
    
    setIsTransactionPending(true);
    try {
      const { recipient, amount } = pendingTransfer;
      
      // Preparar transferencia en el backend (obtener estimación)
      const prepData = await prepareTransfer(userAddress, recipient, amount);
      
      // Mostrar mensaje de preparación
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `⏳ Preparando transacción...\n\n• Gas estimado: ${prepData.gas_estimate}\n• Precio del gas: ${prepData.gas_price_gwei.toFixed(2)} Gwei\n• Fee estimado: ${prepData.estimated_fee_eth.toFixed(6)} ETH`,
        sender: 'bot'
      }]);
      
      // Convertir amount a Wei
      const amountWei = parseEther(amount.toString());
      
      // Enviar transacción al contrato STXTransfer usando wagmi
      sendTransaction({
        to: prepData.contract_address, // Dirección del contrato
        value: amountWei, // Cantidad en Wei
        data: undefined // El contrato maneja la transferencia automáticamente con receive
      });
      
      setPendingTransfer(null);
    } catch (error) {
      console.error('Error in transfer:', error);
      setChatResponse('❌ Error en la transferencia: ' + error.message);
      setIsTransactionPending(false);
      setPendingTransfer(null);
    }
  };

  // Función para cancelar transferencia
  const cancelTransfer = () => {
    setPendingTransfer(null);
    setChatResponse('❌ Transferencia cancelada.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: input,
      sender: 'user'
    }]);

    // Detectar si es una solicitud de alerta de precio
    const alertDetection = detectPriceAlert(input);
    
    if (alertDetection.detected) {
      // Crear alerta de precio
      const alertId = priceAlertService.createAlert(
        alertDetection.symbol,
        alertDetection.targetPrice,
        alertDetection.condition,
        (alertData) => {
          // Callback cuando se activa la alerta
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: `🔔 **¡ALERTA ACTIVADA!**\n\n📍 ${alertData.symbol}/USD\n💰 Precio actual: $${alertData.currentPrice.toFixed(2)}\n🎯 Objetivo alcanzado: $${alertData.targetPrice.toFixed(2)}\n📊 Condición: ${alertData.condition === 'above' ? 'Precio superó el objetivo' : 'Precio bajó del objetivo'}\n\n¡Tu alerta ha sido activada con éxito! 🎉`,
            sender: 'bot',
            isAlert: true
          }]);
        }
      );

      // Actualizar lista de alertas activas
      setActiveAlerts(prev => [...prev, {
        id: alertId,
        symbol: alertDetection.symbol,
        targetPrice: alertDetection.targetPrice,
        condition: alertDetection.condition,
        createdAt: Date.now()
      }]);

      // Responder con confirmación
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `✅ **¡Alerta configurada!**\n\n📍 ${alertDetection.symbol}/USD\n🎯 Objetivo: $${alertDetection.targetPrice.toFixed(2)}\n📊 Condición: ${alertDetection.condition === 'above' ? 'Precio supera' : 'Precio baja de'}\n⏱️ Monitoreando cada 5 segundos con Pyth Network\n\nTe notificaré cuando se alcance el precio objetivo 🔔`,
        sender: 'bot',
        isAlertConfirmation: true
      }]);
      
      setInput('');
      return;
    }

    // Procesar mensaje normal
    sendMessage(input);
    setInput('');
  };

  const handleShortcut = (text) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  // Función para consultar el balance usando el backend
  const handleBalanceCheck = async () => {
    if (!isConnected || !userAddress) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: '🔒 Please connect your wallet first to check balance.',
        sender: 'bot'
      }]);
      return;
    }

    // Mostrar mensaje de carga
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: '💰 Consultando tu balance en Scroll Sepolia...',
      sender: 'bot'
    }]);

    try {
      const balanceInfo = await getBalance(userAddress);
      
      // Mostrar el balance en el chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `💰 **Tu saldo es ${balanceInfo.balance} ETH**\n\n📊 Detalles:\n• Balance disponible: ${balanceInfo.balance} ETH\n• Red: ${balanceInfo.network}\n• Dirección: ${userAddress.substring(0, 10)}...${userAddress.substring(userAddress.length - 6)}`,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('Error al consultar balance:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: '❌ Error al consultar el balance. Por favor intenta nuevamente.',
        sender: 'bot'
      }]);
    }
  };

  const handleContactSelect = (contact) => {
    setInput(`Enviar a ${contact.name} (${contact.address})`);
    setShowContactsMenu(false);
    textareaRef.current?.focus();
  };

  const handleAddContact = async () => {
    if (!newContactName.trim() || !newContactWallet.trim()) {
      alert('⚠️ Por favor completa todos los campos');
      return;
    }

    // Validar formato de wallet Ethereum
    if (!newContactWallet.startsWith('0x') || newContactWallet.length !== 42) {
      alert('⚠️ La dirección debe ser una wallet Ethereum válida (0x...)');
      return;
    }

    if (!userAddress) {
      alert('⚠️ Debes conectar tu wallet primero');
      return;
    }

    setIsAddingContact(true);

    try {
      // 1. Obtener el user_id del usuario actual por su wallet
      const userResponse = await fetch(`https://clary-backend-ai.onrender.com/users/wallet/${userAddress}`);
      
      if (!userResponse.ok) {
        throw new Error('Your wallet is not registered. Please reconnect your wallet to register automatically.');
      }

      const userData = await userResponse.json();
      const userId = userData.user.id;

      // 2. Crear el contacto usando el servicio
      await createContact(userId, newContactName.trim(), newContactWallet.trim());

      // 3. Éxito: cerrar modal y limpiar campos
      alert(`✅ Contacto "${newContactName}" agregado exitosamente`);
      setShowAddContactModal(false);
      setNewContactName('');
      setNewContactWallet('');

      // 4. Recargar la lista de contactos
      const contactsData = await getUserContacts(userAddress);
      if (contactsData.success && contactsData.contacts) {
        const formattedContacts = contactsData.contacts.map(contact => ({
          id: contact.id,
          name: contact.nombre,
          address: contact.wallet_address
        }));
        setContacts(formattedContacts);
        console.log(`✅ Lista de contactos actualizada: ${formattedContacts.length} contactos`);
      }

      // 5. Mostrar mensaje en el chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `✅ Contacto **${newContactName}** agregado correctamente.\n\n📬 Wallet: ${newContactWallet.substring(0, 10)}...`,
        sender: 'bot'
      }]);

    } catch (error) {
      console.error('Error al agregar contacto:', error);
      alert(`❌ ${error.message}`);
    } finally {
      setIsAddingContact(false);
    }
  };

  return (
    <div className="flex h-screen bg-licorice overflow-hidden font-mono">
      {/* Sidebar - Panel lateral */}
      <div className={`sidebar-scroll ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-64 lg:w-72 h-full bg-jet border-r border-jet-700 transition-transform duration-300 overflow-y-auto`}>
        <div className="p-4">
          {/* Logo y título del sidebar */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-jet-600">
            <img src={logoChatBot} alt="Logo" className="w-10 h-10 rounded-full border-2 border-orange-400 shadow-lg shadow-orange-400/30" />
            <div>
              <h3 className="text-seasalt font-bold text-lg">😊 HappyHODLers</h3>
              <p className="text-jet-800 text-xs">Pyth Network + Scroll L2</p>
            </div>
          </div>

          {/* Contactos */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-kikk-white text-sm font-semibold flex items-center gap-2 bg-kikk-orange px-3 py-2 rounded-sm flex-1 uppercase tracking-widest">
                <span className="text-lg">👥</span> 
                <span>Contacts</span>
              </h4>
              {/* Botón para agregar contacto */}
              <button
                onClick={() => setShowAddContactModal(true)}
                disabled={!isConnected}
                className="p-2 bg-kikk-orange hover:bg-kikk-orange-light disabled:bg-kikk-gray disabled:cursor-not-allowed text-kikk-black rounded-sm transition-all duration-200 disabled:opacity-50 ml-2"
                title="Agregar contacto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {/* Mensaje si no está conectado */}
              {!isConnected && (
                <div className="p-4 rounded-sm bg-kikk-black border border-kikk-gray text-center">
                  <p className="text-kikk-gray text-xs uppercase tracking-wider">
                    🔒 Connect your wallet to view contacts
                  </p>
                </div>
              )}

              {/* Lista de contactos (compacta para dar espacio a alertas) */}
              {isConnected && !loadingContacts && contacts.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {contacts.slice(0, 3).map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className="w-full text-left p-2 rounded-sm bg-kikk-black hover:bg-kikk-gray-dark transition-all duration-200 border border-kikk-gray hover:border-kikk-orange group text-xs"
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs">👤</span>
                        <p className="text-kikk-white font-medium truncate">{contact.name}</p>
                      </div>
                    </button>
                  ))}
                  {contacts.length > 3 && (
                    <p className="text-kikk-gray text-xs text-center py-1">+{contacts.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Alertas de Precio */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <h4 className="text-kikk-white text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 rounded-sm flex-1 uppercase tracking-widest">
                <span className="text-lg">🔔</span> 
                <span>Price Alerts</span>
              </h4>
            </div>
            <div className="space-y-2">
              {activeAlerts.length === 0 ? (
                <div className="p-3 rounded-sm bg-kikk-black border border-kikk-gray text-center">
                  <p className="text-2xl mb-1">🔕</p>
                  <p className="text-kikk-gray text-xs">
                    No active alerts
                  </p>
                  <p className="text-purple-400 text-[10px] mt-1">
                    Try: "Let me know if Ethereum reaches $2,500."
                  </p>
                </div>
              ) : (
                activeAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-sm bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 hover:border-purple-400/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🎯</span>
                        <span className="text-white font-bold text-sm">{alert.symbol}</span>
                      </div>
                      <button
                        onClick={() => {
                          priceAlertService.removeAlert(alert.id);
                          setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                        title="Eliminar alerta"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-[10px] text-gray-300 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span>💰</span>
                        <span className="text-yellow-400 font-semibold">${alert.targetPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📊</span>
                        <span>{alert.condition === 'above' ? 'Supera' : 'Baja de'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-400">Monitoring...</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Historial de Transacciones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-seasalt text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-rust to-transparent px-3 py-2 rounded-lg">
                <span className="text-lg">📜</span> 
                <span>Historial</span>
              </h4>
              {isConnected && userAddress && recentTransactions.length > 0 && (
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="text-orange-400 hover:text-pink-400 text-xs font-semibold transition-colors"
                  title="Ver historial completo"
                >
                  Ver todo →
                </button>
              )}
            </div>
            <div className="space-y-2">
              {!isConnected || !userAddress ? (
                <div className="p-4 rounded-lg bg-jet-600 bg-opacity-30 border border-jet-600 text-center">
                  <p className="text-jet-800 text-xs">
                    🔒 Connect your wallet to view history
                  </p>
                </div>
              ) : loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                  <p className="text-jet-800 text-xs mt-2">Loading...</p>
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="p-4 rounded-lg bg-licorice-300 border border-jet-600 text-center">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="text-jet-800 text-xs">
                    No hay transacciones aún
                  </p>
                </div>
              ) : (
                recentTransactions.map((tx, index) => {
                  // Determinar el icono y color según el tipo de transacción
                  // YA NO MOSTRAMOS FALLIDAS (se filtran en el servicio)
                  const getTransactionStyle = () => {
                    switch (tx.type) {
                      case 'sent':
                        return {
                          icon: '📤',
                          label: 'Enviado',
                          color: 'text-red-400',
                          sign: '-'
                        };
                      case 'received':
                        return {
                          icon: '📥',
                          label: 'Recibido',
                          color: 'text-green-400',
                          sign: '+'
                        };
                      case 'contract':
                        return {
                          icon: '📝',
                          label: tx.displayType,
                          color: 'text-blue-400',
                          sign: '-' // Los contratos que envían STX son negativos
                        };
                      case 'deploy':
                        return {
                          icon: '🚀',
                          label: 'Deploy',
                          color: 'text-purple-400',
                          sign: ''
                        };
                      default:
                        return {
                          icon: '📋',
                          label: tx.displayType || 'Otro',
                          color: 'text-yellow-400',
                          sign: ''
                        };
                    }
                  };

                  const style = getTransactionStyle();

                  return (
                    <div
                      key={tx.txid + index}
                      className="p-3 rounded-lg border transition-colors bg-licorice-300 border-jet-600 hover:border-jet-500"
                    >
                      {/* Primera línea: Monto + Tipo/Ver */}
                      <div className="flex items-start justify-between mb-1">
                        {/* Monto a la izquierda */}
                        {tx.amountSTX > 0 && (
                          <span className={`text-base font-bold ${style.color}`}>
                            {style.sign}{tx.amount} STX
                          </span>
                        )}
                        {/* Para deploy sin monto, mostrar el tipo */}
                        {tx.amountSTX === 0 && (
                          <span className={`text-sm font-semibold ${style.color}`}>
                            {style.label}
                          </span>
                        )}
                        {/* Ver ↗ a la derecha */}
                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-pink-400 text-[10px] font-semibold whitespace-nowrap ml-2"
                        >
                          Ver ↗
                        </a>
                      </div>

                      {/* Segunda línea: Fee + Tipo (si hay monto) */}
                      <div className="flex items-center justify-between mb-2">
                        {tx.fee && parseFloat(tx.fee) > 0 && (
                          <p className="text-jet-700 text-[10px]">
                            Fee: {tx.fee} STX
                          </p>
                        )}
                        {tx.amountSTX > 0 && (
                          <span className={`text-[10px] font-semibold ${style.color}`}>
                            {style.label}
                          </span>
                        )}
                      </div>
                      
                      {/* Mostrar estado si es pendiente */}
                      {tx.status === 'pending' && (
                        <div className="mb-2 px-2 py-1 rounded text-[10px] font-semibold bg-yellow-600 bg-opacity-20 text-yellow-400">
                          ⏳ Pendiente
                        </div>
                      )}
                      
                      {/* Dirección/Contrato */}
                      {tx.type !== 'deploy' && (
                        <div className="mb-1">
                          <p className="text-jet-800 text-[10px] font-mono truncate">
                            <span className="text-jet-900 font-semibold">
                              {tx.type === 'sent' ? 'Para: ' : tx.type === 'received' ? 'De: ' : 'Contrato: '}
                            </span>
                            {tx.type === 'sent' ? tx.recipient : tx.type === 'received' ? tx.sender : tx.recipient}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar sidebar en móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-jet border-b border-jet-700 p-3 sm:p-4 flex items-center justify-between shadow-lg shadow-licorice/50">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa para móvil */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-licorice transition-all duration-200 hover:scale-105 border border-transparent hover:border-orange-400"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <img src={logoChatBot} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-orange-400 shadow-md hover:shadow-orange-400/50 transition-shadow" />
            <div>
              <h2 className="text-seasalt font-bold text-sm sm:text-base flex items-center gap-2">
                <span>😊 HappyHODLers</span>
                {isConnected && <span className="text-green-400 text-xs">●</span>}
              </h2>
              {isConnected && (
                <p className="text-jet-900 text-xs font-mono flex items-center gap-1">
                  <span className="text-[10px]">📬</span>
                  {userAddress ? `${userAddress.substring(0, 8)}...` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Wallet Info */}
          <div className="flex items-center gap-2">
            <ConnectButton 
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              chainStatus="icon"
            />
          </div>
        </div>

        {/* Messages Area - Estilo ChatGPT */}
        <div className="flex-1 overflow-y-auto bg-licorice">
          <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex gap-2 sm:gap-3 md:gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-base shadow-lg ${
                  message.sender === 'user' 
                    ? 'bg-giants-orange text-seasalt' 
                    : 'bg-transparent'
                }`}>
                  {message.sender === 'user' ? '👤' : <img src={logoChatBot} alt="Bot" className="w-full h-full rounded-full object-cover" />}
                </div>
                
                {/* Message Content */}
                <div className={`flex-1 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-xl sm:rounded-2xl shadow-md ${
                    message.sender === 'user'
                      ? 'bg-giants-orange text-seasalt font-medium'
                      : 'bg-jet text-seasalt border border-jet-600'
                  }`}>
                    {message.sender === 'bot' ? (
                      // Renderizar mensaje del bot con formato especial
                      <div className="text-left">
                        {formatBotMessage(message.text)}
                        
                        {/* Renderizar PriceCard si es una consulta de precio */}
                        {message.isPriceQuery && message.priceData && (
                          <div className="mt-4">
                            <PriceCard data={message.priceData} />
                          </div>
                        )}
                        
                        {/* Renderizar ComparisonView si es una comparación */}
                        {message.isComparison && message.priceData && (
                          <div className="mt-4">
                            <ComparisonView data={message.priceData} />
                          </div>
                        )}
                      </div>
                    ) : (
                      // Mensaje del usuario sin formato especial
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-wrap break-words leading-relaxed">
                        {message.text}
                      </p>
                    )}
                  </div>
                  {/* Timestamp opcional */}
                  <p className={`text-[10px] sm:text-xs text-jet-700 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isChatLoading && (
              <div className="flex gap-2 sm:gap-3 md:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-transparent flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={logoChatBot} alt="Bot" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="bg-jet px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-xl sm:rounded-2xl border border-jet-600 shadow-md">
                  <div className="flex gap-1 sm:gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-giants-orange rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-sandy-brown rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-rust rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            {pendingTransfer && (
              <div className="flex justify-center px-2 sm:px-4">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-orange-400 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl max-w-full sm:max-w-md w-full shadow-2xl shadow-orange-400/30">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-seasalt mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl md:text-3xl">🔔</span> 
                    <span>Confirmar Transferencia</span>
                  </h3>
                  <div className="bg-licorice bg-opacity-60 backdrop-blur-sm p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 space-y-2 sm:space-y-3 border border-rust">
                    <p className="text-xs sm:text-sm md:text-base text-seasalt font-semibold">
                      <strong>📤 Destinatario:</strong>
                    </p>
                    <p className="font-mono text-[10px] sm:text-xs md:text-sm bg-licorice bg-opacity-70 p-2 sm:p-3 rounded text-sandy-brown break-all border border-jet-600">
                      {pendingTransfer.recipient}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-seasalt mt-2 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                      <strong className="flex items-center gap-1 sm:gap-2">
                        <span className="text-base sm:text-lg">💰</span>
                        <span className="text-xs sm:text-sm md:text-base">Cantidad:</span>
                      </strong> 
                      <span className="text-sandy-brown font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                        {pendingTransfer.amount} ETH
                      </span>
                    </p>
                    {pendingTransfer.recipientName && (
                      <p className="text-xs sm:text-sm text-green-400 mt-2 sm:mt-3 flex items-center gap-2">
                        <span className="text-base sm:text-lg">👤</span>
                        <span>Contacto: <strong>{pendingTransfer.recipientName}</strong></span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button 
                      onClick={confirmTransfer}
                      disabled={isTransactionPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-jet-600 disabled:cursor-not-allowed text-seasalt font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm md:text-base transition-all shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="text-base sm:text-lg">✅</span>
                        <span>Confirmar</span>
                      </span>
                    </button>
                    <button 
                      onClick={cancelTransfer}
                      disabled={isTransactionPending}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-jet-600 disabled:cursor-not-allowed text-seasalt font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm md:text-base transition-all shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="text-base sm:text-lg">❌</span>
                        <span>Cancelar</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isTransactionPending && (
              <div className="flex justify-center px-2 sm:px-4">
                <div className="bg-gradient-to-r from-sandy-brown to-rust border-2 border-sandy-brown text-seasalt px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-lg shadow-lg shadow-sandy-brown/30 flex items-center gap-2 sm:gap-3 font-semibold text-xs sm:text-sm md:text-base">
                  <span className="text-base sm:text-lg md:text-xl animate-spin">⏳</span>
                  <span>Processing transaction...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
            
            {/* Popular Assets Suggestions - Solo si hay pocos mensajes */}
            {messages.length <= 1 && !isChatLoading && (
              <div className="mt-8 px-2 sm:px-4">
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text mb-2">
                      🔥 Popular Assets on Pyth Network
                    </h3>
                    <p className="text-sm text-gray-400">Click to check real-time prices</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { symbol: 'BTC', name: 'Bitcoin', iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029', color: 'from-orange-400 to-yellow-400' },
                      { symbol: 'ETH', name: 'Ethereum', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029', color: 'from-purple-400 to-blue-400' },
                      { symbol: 'SOL', name: 'Solana', iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=029', color: 'from-purple-400 to-pink-400' },
                      { symbol: 'USDC', name: 'USD Coin', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029', color: 'from-green-400 to-emerald-400' },
                      { symbol: 'AVAX', name: 'Avalanche', iconUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=029', color: 'from-red-400 to-pink-400' },
                    ].map((asset) => (
                      <button
                        key={asset.symbol}
                        onClick={() => handleShortcut(`What's ${asset.name} price?`)}
                        className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 border-gray-700 hover:border-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-400/20"
                      >
                        <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${asset.color} p-2 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center`}>
                          <img 
                            src={asset.iconUrl} 
                            alt={asset.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FB923C"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <div className="text-white font-bold text-sm mb-1">{asset.symbol}</div>
                        <div className="text-gray-400 text-xs">{asset.name}</div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center space-y-3">
                    <button
                      onClick={() => handleShortcut('Compare BTC, ETH, SOL, USDC, and AVAX')}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 px-6 py-3 rounded-full border border-purple-400/40 hover:border-purple-400 transition-all shadow-lg hover:shadow-purple-400/30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="font-semibold">Compare All 5 Assets</span>
                    </button>
                    
                    <button
                      onClick={() => handleShortcut('Avísame si Ethereum llega a $2500')}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 text-yellow-300 px-6 py-3 rounded-full border border-yellow-400/40 hover:border-yellow-400 transition-all shadow-lg hover:shadow-yellow-400/30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span className="font-semibold">Set Price Alert</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Estilo WhatsApp */}
        <div className="bg-jet border-t border-jet-700 p-3 sm:p-4">
          {/* Atajos rápidos con categorías de Pyth - Colores vibrantes */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Major Cryptos */}
            <button
              onClick={() => handleShortcut('What\'s Bitcoin price?')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              Bitcoin
            </button>
            
            <button
              onClick={() => handleShortcut('What\'s Ethereum price?')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              Ethereum
            </button>

            <button
              onClick={() => handleShortcut('What\'s Solana price?')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              Solana
            </button>
            
            {/* Stablecoins */}
            <button
              onClick={() => handleShortcut('Compare USDC, USDT, and DAI')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              Stablecoins
            </button>

            {/* L2 Tokens */}
            <button
              onClick={() => handleShortcut('Show me ARB, OP, and MATIC prices')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              L2 Tokens
            </button>
            
            {/* DeFi Tokens */}
            <button
              onClick={() => handleShortcut('Compare LINK and UNI prices')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              DeFi
            </button>

            {/* Alt L1s */}
            <button
              onClick={() => handleShortcut('Show me AVAX, ADA, DOT, and BNB')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              Alt L1s
            </button>

            {/* Top 3 Comparison */}
            <button
              onClick={() => handleShortcut('Compare BTC, ETH, and SOL')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              Top 3
            </button>

            {/* Balance Check */}
            <button
              onClick={handleBalanceCheck}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm whitespace-nowrap border-2 border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-gray-500/50 hover:scale-105 font-bold"
            >
              Balance
            </button>
          </div>

          {/* Input principal */}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            {/* Botón de contactos */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowContactsMenu(!showContactsMenu)}
                disabled={!isConnected}
                className="p-3 bg-licorice hover:bg-jet-400 disabled:bg-jet-200 rounded-full transition-colors border border-jet-600"
                title="Contactos"
              >
                <svg className="w-5 h-5 text-seasalt" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>

              {/* Menú de contactos desplegable */}
              {showContactsMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-jet rounded-lg shadow-xl border border-jet-600 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-jet-900 text-xs font-semibold mb-2 px-2">Seleccionar contacto</p>
                    {contacts.map(contact => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => handleContactSelect(contact)}
                        className="w-full text-left p-2 rounded hover:bg-licorice transition-colors"
                      >
                        <p className="text-seasalt text-sm font-medium">{contact.name}</p>
                        <p className="text-jet-800 text-xs font-mono truncate">{contact.address}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Textarea expandible */}
            <div className="flex-1 bg-licorice rounded-2xl border border-jet-600 focus-within:border-orange-400 transition-colors">
              <textarea
                ref={textareaRef}
                value={listening ? (finalTranscript + interimTranscript) : input}
                onChange={(e) => {
                  if (!listening) {
                    setInput(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !listening) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={
                  listening 
                    ? "🎤 Listening... Speak clearly" 
                    : isConnected 
                      ? "Ask: 'What's Bitcoin price?' or 'Compare BTC and ETH'..." 
                      : "Connect your wallet to start"
                }
                disabled={!isConnected || isChatLoading}
                rows={1}
                className="w-full px-4 py-3 bg-transparent text-kikk-white placeholder-kikk-gray resize-none focus:outline-none disabled:opacity-50 text-sm sm:text-base"
                style={{ 
                  maxHeight: '120px',
                  color: listening ? '#ff6b35' : '#ffffff' // Naranja cuando está escuchando
                }}
              />
            </div>

            {/* Botones de micrófono - Mostrar solo uno a la vez */}
            {!listening ? (
              // Botón de INICIAR grabación (solo cuando NO está grabando)
              <button
                type="button"
                onClick={startListening}
                disabled={!isConnected || isChatLoading}
                className="p-3 bg-kikk-black hover:bg-kikk-gray-dark disabled:bg-kikk-gray border border-kikk-gray hover:border-kikk-orange rounded-sm transition-all duration-200 disabled:opacity-50"
                title="Iniciar grabación de voz"
              >
                <svg className="w-5 h-5 text-kikk-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            ) : (
              // Botón de DETENER grabación (solo cuando SÍ está grabando)
              <button
                type="button"
                onClick={stopListening}
                className="p-3 bg-red-600 hover:bg-red-700 border border-red-500 rounded-sm transition-all duration-200 animate-pulse"
                title="Detener grabación"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
            )}

            {/* Botón de enviar */}
            <button
              type="submit"
              disabled={!isConnected || isChatLoading || !input.trim()}
              className="p-3 bg-giants-orange hover:bg-rust disabled:bg-jet-900 disabled:border disabled:border-jet-700 rounded-full transition-all duration-200 disabled:opacity-50"
              title="Enviar mensaje"
            >
              <svg className="w-5 h-5 text-seasalt" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Modal para agregar contacto */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-kikk-gray-dark border-2 border-kikk-orange rounded-xl max-w-md w-full p-6 shadow-2xl shadow-kikk-orange/30">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-kikk-white text-xl font-bold flex items-center gap-2 uppercase tracking-wider">
                <span className="text-2xl">➕</span>
                <span>Agregar Contacto</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddContactModal(false);
                  setNewContactName('');
                  setNewContactWallet('');
                }}
                className="text-kikk-gray hover:text-kikk-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
              {/* Campo Nombre */}
              <div>
                <label className="block text-kikk-orange text-sm font-semibold mb-2 uppercase tracking-wider">
                  👤 Nombre del Contacto
                </label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Ej: Andrés"
                  className="w-full px-4 py-3 bg-kikk-black border border-kikk-gray rounded-sm text-kikk-white placeholder-kikk-gray focus:outline-none focus:border-kikk-orange transition-colors"
                  disabled={isAddingContact}
                />
              </div>

              {/* Campo Wallet */}
              <div>
                <label className="block text-kikk-orange text-sm font-semibold mb-2 uppercase tracking-wider">
                  📬 Dirección de Wallet
                </label>
                <input
                  type="text"
                  value={newContactWallet}
                  onChange={(e) => setNewContactWallet(e.target.value)}
                  placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                  className="w-full px-4 py-3 bg-kikk-black border border-kikk-gray rounded-sm text-kikk-white placeholder-kikk-gray focus:outline-none focus:border-kikk-orange transition-colors font-mono text-sm"
                  disabled={isAddingContact}
                />
              </div>

              {/* Info adicional */}
              <div className="bg-kikk-black border border-kikk-gray rounded-sm p-3">
                <p className="text-kikk-gray text-xs flex items-start gap-2">
                  <span className="text-sm">💡</span>
                  <span>La dirección debe comenzar con <strong className="text-kikk-orange">ST</strong> o <strong className="text-kikk-orange">SP</strong></span>
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddContactModal(false);
                    setNewContactName('');
                    setNewContactWallet('');
                  }}
                  disabled={isAddingContact}
                  className="flex-1 px-4 py-3 bg-kikk-black hover:bg-kikk-gray-dark text-kikk-white rounded-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-kikk-gray uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddContact}
                  disabled={isAddingContact || !newContactName.trim() || !newContactWallet.trim()}
                  className="flex-1 px-4 py-3 bg-kikk-orange hover:bg-kikk-orange-light text-kikk-black rounded-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {isAddingContact ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-kikk-black"></div>
                      <span>Agregando...</span>
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      <span>Agregar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial de Transacciones */}
      <TransactionHistory
        address={userAddress}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </div>
  );
};

export default ChatBot;
