
import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  connectedAddress: string | null;
  onConnectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, connectedAddress, onConnectWallet }) => {
  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="w-full flex justify-between items-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-sky-500">
        Web3 Snake
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          {theme === 'light' ? (
            <MoonIcon className="h-6 w-6 text-sky-500" />
          ) : (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          )}
        </button>
        <button
          onClick={onConnectWallet}
          className="px-4 py-2 text-sm md:text-base rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/30"
        >
          {connectedAddress ? formatAddress(connectedAddress) : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default Header;
