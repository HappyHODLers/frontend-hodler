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
    <div className="space-y-4">
      {/* Header with Pyth branding */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/30 p-2 rounded-lg">
              <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold">Asset Comparison</div>
              <div className="text-xs text-purple-300">Powered by Pyth Network</div>
            </div>
          </div>
          <div className="bg-green-500/20 px-3 py-1.5 rounded-full border border-green-400/30 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-green-300 font-semibold">Live</span>
          </div>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="grid gap-3">
        {data.map((asset, index) => (
          <div
            key={asset.symbol}
            className={`group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border-2 ${getBorderColor(index)}/40 hover:${getBorderColor(index)} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform`}
          >
            <div className="flex justify-between items-center">
              {/* Left: Asset Info */}
              <div className="flex items-center gap-4">
                <div className={`text-4xl bg-gradient-to-br ${getAssetColor(index)} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                  {getAssetIcon(asset.symbol)}
                </div>
                <div>
                  <div className="font-black text-white text-xl tracking-tight">{asset.symbol}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    Updated {Math.floor((Date.now() - asset.timestamp) / 1000)}s ago
                  </div>
                </div>
              </div>

              {/* Right: Price */}
              <div className="text-right">
                <div className={`text-3xl font-black text-transparent bg-gradient-to-r ${getAssetColor(index)} bg-clip-text mb-1`}>
                  {formatPrice(asset.price)}
                </div>
                <div className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded-full inline-block">
                  Confidence: ±${asset.confidence.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with verified sources */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="font-semibold text-white">Verified Data Sources:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            {['Binance', 'OKX', 'Coinbase', 'Kraken'].map((exchange) => (
              <span 
                key={exchange}
                className="text-xs bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-300 px-3 py-1 rounded-full border border-orange-400/30 font-medium"
              >
                {exchange}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
