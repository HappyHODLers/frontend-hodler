import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Definir Scroll Sepolia manualmente
const scrollSepolia = defineChain({
  id: 534351,
  name: 'Scroll Sepolia',
  network: 'scroll-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.scroll.io'],
    },
    public: {
      http: ['https://sepolia-rpc.scroll.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Scrollscan',
      url: 'https://sepolia.scrollscan.com',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'LlamaRollup - AI Financial Agent',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Obtén uno gratis en https://cloud.walletconnect.com
  chains: [scrollSepolia],
  ssr: false,
});
