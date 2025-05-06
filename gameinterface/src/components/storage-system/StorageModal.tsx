import React from 'react';
import { Item } from '@/types/items';
import { Box, Package, Warehouse, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

interface TransferModalProps {
    selectedItem: Item | null;
    transferType: 'toStorage' | 'toInventory';
    transferAmount: number;
    setTransferAmount: (amount: number | ((prev: number) => number)) => void;
    setTransferModalOpen: (open: boolean) => void;
    handleConfirmMoveToStorage: (itemId: string, amount: number) => void;
    handleConfirmMoveToInventory: (itemId: string, amount: number) => void;
  }

const TransferModal: React.FC<TransferModalProps> = ({
  selectedItem,
  transferType,
  transferAmount,
  setTransferAmount,
  setTransferModalOpen,
  handleConfirmMoveToStorage,
  handleConfirmMoveToInventory,
}) => {
  if (!selectedItem) return null;

  const maxAmount = selectedItem.count || 1;
  const title = transferType === 'toStorage' ? 'inventory to Storage' : 'Retrieve to Inventory';
  const actionText = transferType === 'toStorage' ? 'Save' : 'Retrieve';
  const Icon = transferType === 'toStorage' ? Warehouse : Package;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setTransferAmount(1);
    } else {
      setTransferAmount(Math.min(maxAmount, Math.max(1, value)));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransferAmount(parseInt(e.target.value));
  };

  const incrementAmount = () => {
    setTransferAmount(prev => Math.min(maxAmount, prev + 1)); // Error here
  };
  
  const decrementAmount = () => {
    setTransferAmount(prev => Math.max(1, prev - 1)); // Error here
  };

  const handleConfirm = () => {
    if (transferType === 'toStorage') {
      handleConfirmMoveToStorage(selectedItem.id, transferAmount);
    } else {
      handleConfirmMoveToInventory(selectedItem.id, transferAmount);
    }
    setTransferModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
            <Icon size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <p className="text-gray-300 mb-6">
          Select quantity of <span className="font-medium text-white">{selectedItem.name}</span> to{' '}
          {transferType === 'toStorage' ? 'inventory in storage' : 'retrieve to inventory'}
        </p>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={decrementAmount}
              disabled={transferAmount <= 1}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex-1 mx-4">
              <input
                type="range"
                min="1"
                max={maxAmount}
                value={transferAmount}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <button 
              onClick={incrementAmount}
              disabled={transferAmount >= maxAmount}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              min="1"
              max={maxAmount}
              value={transferAmount}
              onChange={handleAmountChange}
              className="w-20 text-center bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-gray-400">/ {maxAmount}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setTransferModalOpen(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Check size={18} />
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;