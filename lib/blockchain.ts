
import { ethers, BrowserProvider, Eip1193Provider, Signer } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, BASE_MAINNET_INFO } from '../constants';

// Type guard to check for window.ethereum
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

let provider: BrowserProvider | null = null;
let signer: Signer | null = null;

// Connect to MetaMask wallet
export const connectWallet = async (): Promise<string | null> => {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask to use this feature.');
    return null;
  }
  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    await checkAndSwitchNetwork();
    return address;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
};

// Check if the current network is Base and prompt to switch if not
export const checkAndSwitchNetwork = async (): Promise<boolean> => {
  if (!provider) return false;
  try {
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(BASE_MAINNET_INFO.chainId)) {
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: BASE_MAINNET_INFO.chainId }]);
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          await provider.send('wallet_addEthereumChain', [BASE_MAINNET_INFO]);
        } else {
          throw switchError;
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to switch network:', error);
    return false;
  }
};

// Submit score to the smart contract
export const submitScoreToContract = async (score: number): Promise<ethers.TransactionResponse> => {
  if (!signer) {
    throw new Error('Wallet not connected. Please connect your wallet first.');
  }

  const isNetworkCorrect = await checkAndSwitchNetwork();
  if (!isNetworkCorrect) {
    throw new Error('Please switch to the Base network to submit your score.');
  }

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  try {
    const tx = await contract.submitScore(score);
    return tx;
  } catch (error) {
    console.error('Error submitting score to contract:', error);
    throw error;
  }
};
