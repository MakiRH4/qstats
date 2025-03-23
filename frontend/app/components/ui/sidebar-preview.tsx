import React, { useState } from 'react';
import { Search, Info, Settings, ChevronDown, X } from 'lucide-react';

const ContractTriggerPreview = () => {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  return (
    <div className="flex items-center justify-center p-4 bg-gray-100">
      <div className="w-96 h-screen bg-white shadow-lg rounded-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Configure Contract Trigger</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Network Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blockchain Network
              </label>
              <div className="relative">
                <select
                  defaultValue="ethereum"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="ethereum">Ethereum Mainnet</option>
                  <option value="arbitrum">Arbitrum One</option>
                  <option value="optimism">Optimism</option>
                  <option value="polygon">Polygon</option>
                  <option value="bsc">Binance Smart Chain</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Contract Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Wallet Address
                </label>
                <button className="text-blue-500 text-sm hover:underline flex items-center">
                  <Search size={14} className="mr-1" />
                  Look up
                </button>
              </div>
              <input
                type="text"
                placeholder="0x..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Enter the smart contract address you want to monitor</p>
            </div>

            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Event
              </label>
              <div className="relative">
                <select
                  defaultValue=""
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="" disabled>Select an event to trigger on</option>
                  <option value="transfer">Transfer(address,address,uint256)</option>
                  <option value="approval">Approval(address,address,uint256)</option>
                  <option value="deposit">Deposit(address,uint256)</option>
                  <option value="withdraw">Withdraw(address,uint256)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <button 
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex items-center justify-between w-full py-2 text-sm font-medium text-left text-gray-700 border-b border-gray-200"
              >
                <div className="flex items-center">
                  <Settings size={16} className="mr-2" />
                  Advanced Settings
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-500 transition-transform ${advancedOpen ? 'transform rotate-180' : ''}`} 
                />
              </button>
              
              {advancedOpen && (
                <div className="mt-3 space-y-4 pl-1">
                  {/* Filter Parameters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter Parameters
                    </label>
                    <div className="flex items-start space-x-2">
                      <div className="w-1/2">
                        <input
                          type="text"
                          placeholder="Parameter"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="w-1/2">
                        <input
                          type="text"
                          placeholder="Value"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button className="mt-2 text-blue-500 text-sm hover:underline">
                      + Add another filter
                    </button>
                  </div>

                  {/* Gas Price Threshold */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gas Price Threshold (Gwei)
                    </label>
                    <input
                      type="number"
                      placeholder="200"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Confirmation Blocks */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Confirmation Blocks
                      </label>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Info size={14} />
                      </button>
                    </div>
                    <input
                      type="number"
                      defaultValue={1}
                      min={1}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Webhook Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://your-api-endpoint.com/webhook"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add a webhook to receive contract events directly to your API
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Trigger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractTriggerPreview;