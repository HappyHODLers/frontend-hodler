/**
 * Pyth Network Service
 * Provides real-time price feeds from 500+ assets using Hermes REST API
 */
class PythService {
  constructor() {
    // Hermes REST API endpoint
    this.hermesEndpoint = 'https://hermes.pyth.network';
    
    // Price Feed IDs - Los más populares para crypto
    this.priceFeeds = {
      // Major Cryptocurrencies
      BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
      ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
      SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
      
      // Stablecoins
      USDC: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
      USDT: '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
      DAI: '0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd',
      
      // L2 & Altcoins
      AVAX: '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7',
      MATIC: '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52',
      ARB: '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5',
      OP: '0x385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf',
      
      // Additional popular coins
      BNB: '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
      ADA: '0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d',
      DOT: '0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b',
      LINK: '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221',
      UNI: '0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501',
    };
    
    // Mapeo de nombres comunes a símbolos
    this.assetMapping = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'solana': 'SOL',
      'bnb': 'BNB',
      'cardano': 'ADA',
      'polkadot': 'DOT',
      'chainlink': 'LINK',
      'uniswap': 'UNI',
      'avalanche': 'AVAX',
      'polygon': 'MATIC',
      'arbitrum': 'ARB',
      'optimism': 'OP',
    };
    
    // Cache para optimizar requests
    this.cache = new Map();
    this.cacheExpiry = 5000; // 5 segundos
  }

  /**
   * Normaliza el nombre del asset a símbolo
   */
  normalizeAsset(assetString) {
    const normalized = assetString.toLowerCase().trim();
    return this.assetMapping[normalized] || assetString.toUpperCase();
  }

  /**
   * Obtiene el precio de un solo asset
   */
  async getPrice(symbol) {
    try {
      // Normalizar símbolo
      symbol = this.normalizeAsset(symbol);

      // Check cache
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log(`📦 Cache hit for ${symbol}`);
        return cached.data;
      }

      // Obtener Price Feed ID
      const priceId = this.priceFeeds[symbol];
      if (!priceId) {
        throw new Error(`Price feed not found for ${symbol}. Available: ${Object.keys(this.priceFeeds).join(', ')}`);
      }

      console.log(`🔍 Fetching ${symbol} price from Pyth Network...`);
      
      // Fetch from Hermes REST API
      const response = await fetch(
        `${this.hermesEndpoint}/v2/updates/price/latest?ids[]=${priceId}`
      );
      
      if (!response.ok) {
        throw new Error(`Hermes API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.parsed || data.parsed.length === 0) {
        throw new Error(`No price data received for ${symbol}`);
      }

      const priceInfo = data.parsed[0].price;
      
      // Convertir precio usando el exponente
      const price = parseFloat(priceInfo.price) * Math.pow(10, priceInfo.expo);
      const confidence = parseFloat(priceInfo.conf) * Math.pow(10, priceInfo.expo);
      
      const result = {
        symbol,
        price: price,
        confidence: confidence,
        timestamp: parseInt(priceInfo.publish_time) * 1000, // Convert to milliseconds
        expo: priceInfo.expo,
        sources: ['Binance', 'OKX', 'Coinbase', 'Kraken'], // Pyth agrega de múltiples fuentes
      };

      // Update cache
      this.cache.set(symbol, {
        data: result,
        timestamp: Date.now()
      });

      console.log(`✅ ${symbol}: $${result.price.toFixed(2)}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Error fetching price for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene precios de múltiples assets
   */
  async getPrices(symbols) {
    try {
      // Normalizar símbolos
      const normalizedSymbols = symbols.map(s => this.normalizeAsset(s));
      
      // Obtener Price Feed IDs
      const priceIds = normalizedSymbols
        .map(s => this.priceFeeds[s])
        .filter(Boolean);
      
      if (priceIds.length === 0) {
        throw new Error('No valid price feeds found for the requested symbols');
      }

      console.log(`🔍 Fetching prices for ${normalizedSymbols.join(', ')}...`);
      
      // Build query string with multiple IDs
      const idsQuery = priceIds.map(id => `ids[]=${id}`).join('&');
      const response = await fetch(
        `${this.hermesEndpoint}/v2/updates/price/latest?${idsQuery}`
      );
      
      if (!response.ok) {
        throw new Error(`Hermes API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.parsed || data.parsed.length === 0) {
        throw new Error('No price data received');
      }

      return data.parsed.map((item, i) => {
        const priceInfo = item.price;
        const price = parseFloat(priceInfo.price) * Math.pow(10, priceInfo.expo);
        const confidence = parseFloat(priceInfo.conf) * Math.pow(10, priceInfo.expo);
        
        return {
          symbol: normalizedSymbols[i],
          price: price,
          confidence: confidence,
          timestamp: parseInt(priceInfo.publish_time) * 1000,
          expo: priceInfo.expo,
          sources: ['Binance', 'OKX', 'Coinbase', 'Kraken'],
        };
      });
      
    } catch (error) {
      console.error('❌ Error fetching multiple prices:', error);
      throw error;
    }
  }

  /**
   * Formatea precio a USD
   */
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }

  /**
   * Formatea precio con más decimales para crypto
   */
  formatCryptoPrice(price) {
    if (price >= 1000) {
      return this.formatPrice(price);
    } else if (price >= 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  }

  /**
   * Calcula el tiempo transcurrido
   */
  getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  /**
   * Obtiene todos los assets disponibles
   */
  getAvailableAssets() {
    return Object.keys(this.priceFeeds);
  }

  /**
   * Limpia el cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }
}

// Exportar instancia singleton
const pythService = new PythService();
export default pythService;
