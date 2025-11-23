import { useState, useEffect } from 'react';

/**
 * PriceCard Component
 * Muestra el precio de un asset con datos de Pyth Network
 */
const PriceCard = ({ data }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - data.timestamp) / 1000);
      if (seconds < 10) setTimeAgo('just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [data.timestamp]);

  const formatPrice = (price) => {
    if (price >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    } else if (price >= 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const getAssetIcon = (symbol) => {
    // Usar cryptocurrency-icons CDN para iconos oficiales
    const iconMap = {
      BTC: 'btc',
      ETH: 'eth',
      SOL: 'sol',
      USDC: 'usdc',
      USDT: 'usdt',
      DAI: 'dai',
      AVAX: 'avax',
      MATIC: 'matic',
      ARB: 'arb',
      OP: 'op',
      BNB: 'bnb',
      ADA: 'ada',
      DOT: 'dot',
      LINK: 'link',
      UNI: 'uni',
    };
    
    const iconSlug = iconMap[symbol] || 'generic';
    return `https://cryptologos.cc/logos/${iconSlug === 'arb' ? 'arbitrum-arb' : iconSlug === 'op' ? 'optimism-ethereum-op' : iconSlug === 'matic' ? 'polygon-matic' : iconSlug === 'sol' ? 'solana-sol' : iconSlug === 'avax' ? 'avalanche-avax' : iconSlug === 'link' ? 'chainlink-link' : iconSlug === 'ada' ? 'cardano-ada' : iconSlug === 'dot' ? 'polkadot-new-dot' : iconSlug}-logo.svg?v=029`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 border-2 border-orange-400/40 hover:border-pink-400/60 transition-all duration-300 shadow-2xl hover:shadow-orange-400/30">
      {/* Header: Badges en una fila */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-purple-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-purple-400/30">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          <span className="text-[10px] sm:text-xs font-semibold text-purple-300">Pyth Network</span>
        </div>
        <div className="bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border border-green-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          Live
        </div>
      </div>

      {/* Main Content: Layout Horizontal en desktop */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-4">
        {/* Left: Asset Info + Icon */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-700 to-gray-800 p-2 sm:p-2.5 lg:p-3 rounded-xl flex-shrink-0 flex items-center justify-center">
            <img 
              src={getAssetIcon(data.symbol)} 
              alt={data.symbol}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FB923C"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/%3E%3C/svg%3E';
              }}
            />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">{data.symbol}</h3>
            <p className="text-xs sm:text-sm text-gray-400">vs USD</p>
          </div>
        </div>

        {/* Center: Price - Destacado */}
        <div className="flex-1 bg-black/30 rounded-xl p-3 sm:p-4 border border-gray-700/50">
          <div className="text-[10px] sm:text-xs text-gray-400 mb-1 uppercase tracking-wider">Current Price</div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text mb-1">
            {formatPrice(data.price)}
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs text-gray-400">Confidence:</span>
            <span className="text-xs sm:text-sm font-semibold text-yellow-400">±${data.confidence.toFixed(2)}</span>
            <span className="text-[10px] sm:text-xs text-gray-500">({((data.confidence / data.price) * 100).toFixed(3)}%)</span>
          </div>
        </div>

        {/* Right: Metadata compacto */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 lg:min-w-[140px]">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-2 sm:p-3 border border-blue-500/20">
            <div className="text-[10px] sm:text-xs text-blue-300 mb-0.5 sm:mb-1 flex items-center gap-1">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span className="hidden sm:inline">Updated</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white">{timeAgo}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg p-2 sm:p-3 border border-purple-500/20">
            <div className="text-[10px] sm:text-xs text-purple-300 mb-0.5 sm:mb-1 flex items-center gap-1">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
              <span className="hidden sm:inline">Accuracy</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white">99.9%</div>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="border-t border-gray-700 pt-4">
        <div className="text-xs text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Verified by {data.sources} exchanges
        </div>
        <div className="flex flex-wrap gap-2">
          {data.sources.map((source, i) => (
            <span
              key={i}
              className="text-xs bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-300 px-3 py-1 rounded-full border border-orange-400/30 font-medium"
            >
              {source}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
