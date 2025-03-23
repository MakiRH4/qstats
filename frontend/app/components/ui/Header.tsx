// components/Header.js
import { useState } from "react";
import Image from 'next/image';

const Header = () => {
      const [account, setAccount] = useState<string | null>(null);
     
     const connectMetaMask = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Solicita acceso a las cuentas de MetaMask
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          // Asigna la cuenta conectada al estado
          console.log(accounts);
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error conectando con MetaMask:", error);
        }
      } else {
        alert("MetaMask no está instalada.");
      }
    };
  return (

    

    <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center">
        <Image
              src="/qstats_black.png"
              alt="Logo de qstat"
              width={132}
              height={129}
            />        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-black font-medium">Home</a>
          <a href="#" className="text-gray-500 font-medium">About</a>
          <a href="#" className="text-gray-500 font-medium">Features</a>
        </nav>
        <button 
        className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium">
          USER
        </button>
      </div>
    </div>
  </header>
  );
};

export default Header;
