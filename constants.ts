
// Game Constants
export const BOARD_SIZE = 20;
export const INITIAL_SPEED = 200; // in ms
export const SPEED_INCREMENT = 5; // ms decrease per food item

// Web3 Constants
export const CONTRACT_ADDRESS = '0xAF54e8EE5F59F6c4A08426CcCd726C5E48e6c79B';

// This is a placeholder ABI. The actual ABI should be populated here.
// It includes the function signature for submitting a score.
export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "score",
        "type": "uint256"
      }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Base Mainnet details
export const BASE_MAINNET_INFO = {
  chainId: '0x2105', // 8453
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
};
