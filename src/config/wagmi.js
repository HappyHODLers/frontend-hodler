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
  appName: 'HappyHODLers - Transactional Chatbot',
  projectId: '3c2b1e8f9d7a6c5b4e3f2a1d0c9b8a7f', // Project ID genérico de desarrollo
  chains: [scrollSepolia],
  ssr: false,
});
