import { useState, useEffect } from 'react';

/**
 * ComparisonView Component
 * Muestra comparación de múltiples assets
 */
const ComparisonView = ({ data }) => {
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

  const getAssetColor = (index) => {
    const colors = [
      'from-yellow-400 to-orange-400',
      'from-orange-400 to-pink-400',
      'from-pink-400 to-purple-400',
      'from-purple-400 to-blue-400',
      'from-blue-400 to-cyan-400',
    ];
    return colors[index % colors.length];
  };

  const getBorderColor = (index) => {
    const colors = [
      'border-yellow-400',
      'border-orange-400',
      'border-pink-400',
      'border-purple-400',
      'border-blue-400',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-300 mb-4 flex items-center gap-2">
        <span className="text-lg">📊</span>
        <span>Comparing {data.length} assets with Pyth Network real-time data</span>
      </div>

      {data.map((asset, index) => (
        <div
          key={asset.symbol}
          className={`bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border-l-4 ${getBorderColor(index)} hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex justify-between items-center">
            {/* Left: Asset Info */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getAssetIcon(asset.symbol)}</div>
              <div>
                <div className="font-bold text-white text-lg">{asset.symbol}</div>
                <div className="text-xs text-gray-400">
                  Updated {Math.floor((Date.now() - asset.timestamp) / 1000)}s ago
                </div>
              </div>
            </div>

            {/* Right: Price */}
            <div className="text-right">
              <div className={`text-2xl font-bold text-transparent bg-gradient-to-r ${getAssetColor(index)} bg-clip-text`}>
                {formatPrice(asset.price)}
              </div>
              <div className="text-xs text-gray-400">
                ±${asset.confidence.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Live data from Pyth Network • Sources: Binance, OKX, Coinbase, Kraken</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
