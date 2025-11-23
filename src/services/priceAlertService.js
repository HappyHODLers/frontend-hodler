/**
 * Price Alert Service
 * Monitoreo de alertas de precio usando Pyth Network
 */
import pythService from './pythService';

class PriceAlertService {
  constructor() {
    this.alerts = new Map(); // Map<alertId, alertConfig>
    this.intervals = new Map(); // Map<alertId, intervalId>
    this.alertIdCounter = 0;
  }

  /**
   * Crear una nueva alerta de precio
   * @param {string} symbol - Símbolo del asset (BTC, ETH, etc.)
   * @param {number} targetPrice - Precio objetivo
   * @param {string} condition - 'above' (supera) o 'below' (baja de)
   * @param {function} onTrigger - Callback cuando se activa la alerta
   * @returns {number} Alert ID
   */
  createAlert(symbol, targetPrice, condition = 'above', onTrigger) {
    const alertId = ++this.alertIdCounter;
    
    const alert = {
      id: alertId,
      symbol: symbol.toUpperCase(),
      targetPrice,
      condition, // 'above' o 'below'
      createdAt: Date.now(),
      triggered: false,
      onTrigger,
      checkCount: 0
    };

    this.alerts.set(alertId, alert);
    
    // Iniciar monitoreo cada 5 segundos
    const intervalId = setInterval(() => {
      this.checkAlert(alertId);
    }, 5000);
    
    this.intervals.set(alertId, intervalId);
    
    console.log(`✅ Alerta ${alertId} creada: ${symbol} ${condition === 'above' ? 'supera' : 'baja de'} $${targetPrice}`);
    
    return alertId;
  }

  /**
   * Verificar si una alerta debe activarse
   */
  async checkAlert(alertId) {
    const alert = this.alerts.get(alertId);
    if (!alert || alert.triggered) return;

    alert.checkCount++;

    try {
      // Obtener precio actual de Pyth Network
      const priceData = await pythService.getPrice(alert.symbol);
      
      if (!priceData) {
        console.warn(`⚠️ No se pudo obtener precio para ${alert.symbol}`);
        return;
      }

      const currentPrice = priceData.price;
      let shouldTrigger = false;

      if (alert.condition === 'above') {
        shouldTrigger = currentPrice >= alert.targetPrice;
      } else if (alert.condition === 'below') {
        shouldTrigger = currentPrice <= alert.targetPrice;
      }

      if (shouldTrigger) {
        console.log(`🔔 ¡ALERTA ACTIVADA! ${alert.symbol} ${alert.condition === 'above' ? 'superó' : 'bajó de'} $${alert.targetPrice}`);
        
        alert.triggered = true;
        alert.triggeredAt = Date.now();
        alert.triggeredPrice = currentPrice;

        // Ejecutar callback
        if (alert.onTrigger) {
          alert.onTrigger({
            alertId,
            symbol: alert.symbol,
            targetPrice: alert.targetPrice,
            currentPrice,
            condition: alert.condition,
            priceData
          });
        }

        // Detener monitoreo
        this.removeAlert(alertId);
      }
    } catch (error) {
      console.error(`❌ Error verificando alerta ${alertId}:`, error);
    }
  }

  /**
   * Eliminar una alerta
   */
  removeAlert(alertId) {
    const intervalId = this.intervals.get(alertId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(alertId);
    }
    
    this.alerts.delete(alertId);
    console.log(`🗑️ Alerta ${alertId} eliminada`);
  }

  /**
   * Obtener todas las alertas activas
   */
  getActiveAlerts() {
    return Array.from(this.alerts.values()).filter(alert => !alert.triggered);
  }

  /**
   * Obtener alerta por ID
   */
  getAlert(alertId) {
    return this.alerts.get(alertId);
  }

  /**
   * Limpiar todas las alertas
   */
  clearAll() {
    for (const intervalId of this.intervals.values()) {
      clearInterval(intervalId);
    }
    this.alerts.clear();
    this.intervals.clear();
    console.log('🧹 Todas las alertas eliminadas');
  }
}

// Instancia singleton
export const priceAlertService = new PriceAlertService();

/**
 * Detectar si un mensaje es una solicitud de alerta
 */
export function detectPriceAlert(message) {
  const text = message.toLowerCase();
  
  // Patrones: "Let me know if Ethereum reaches $2,500.", "alerta cuando BTC supere $50000", etc.
  const patterns = [
    /av[ií]same (si|cuando) (\w+) (llega a|llegue a|supera|supere|baja de|baje de) \$?(\d+\.?\d*)/i,
    /alerta (si|cuando) (\w+) (llega a|llegue a|supera|supere|baja de|baje de) \$?(\d+\.?\d*)/i,
    /notif[ií]came (si|cuando) (\w+) (llega a|llegue a|supera|supere|baja de|baje de) \$?(\d+\.?\d*)/i,
    /alert me (if|when) (\w+) (reaches|exceeds|goes above|falls below|goes below) \$?(\d+\.?\d*)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const symbol = match[2].toUpperCase();
      const conditionText = match[3].toLowerCase();
      const targetPrice = parseFloat(match[4]);

      // Determinar condición
      let condition = 'above';
      if (conditionText.includes('baja') || conditionText.includes('below') || conditionText.includes('falls')) {
        condition = 'below';
      }

      return {
        detected: true,
        symbol,
        targetPrice,
        condition
      };
    }
  }

  return { detected: false };
}
