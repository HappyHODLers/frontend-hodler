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
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      SOL: '◎',
      USDC: '💵',
      USDT: '💵',
      DAI: '◈',
      AVAX: '🔺',
      MATIC: '🟣',
      ARB: '🔵',
      OP: '🔴',
      BNB: '💛',
      ADA: '🔷',
      DOT: '⚫',
      LINK: '🔗',
      UNI: '🦄',
    };
    return icons[symbol] || '💰';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-orange-400/30 hover:border-pink-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-400/20">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{getAssetIcon(data.symbol)}</div>
          <div>
            <h3 className="text-xl font-bold text-white">{data.symbol}/USD</h3>
            <p className="text-xs text-gray-400">Pyth Network</p>
          </div>
        </div>
        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30">
          ✓ Verified
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text mb-2">
          {formatPrice(data.price)}
        </div>
        <div className="text-sm text-gray-400">
          Confidence: ±${data.confidence.toFixed(2)}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Updated</div>
          <div className="text-sm font-semibold text-white">{timeAgo}</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Confidence</div>
          <div className="text-sm font-semibold text-white">±${data.confidence.toFixed(2)}</div>
        </div>
      </div>

      {/* Sources */}
      <div className="border-t border-gray-700 pt-4">
        <div className="text-xs text-gray-400 mb-2">Data Sources</div>
        <div className="flex flex-wrap gap-2">
          {data.sources.map((source, i) => (
            <span
              key={i}
              className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-md text-xs"
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
