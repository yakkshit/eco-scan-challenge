import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dic from "../../dictonary/data.json";

interface Transaction {
  amount: number;
  timestamp: number;
}

interface RewardsSectionProps {
  ecosavings: number;
  message: string;
  history: Array<{
    ecosavings: number;
  }>;
}

export let totalBalance = 0;

export default function RewardsSection({ ecosavings, message, history }: RewardsSectionProps) {
  const [currentReward, setCurrentReward] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Calculate total balance from history and current ecosavings
  useEffect(() => {
    const historyTotal = history.reduce((sum, item) => sum + item.ecosavings, 0);
    totalBalance = totalBalance + historyTotal;
    
    // Update current reward if there's a new ecosaving
    if (typeof ecosavings === 'number' && !isNaN(ecosavings) && ecosavings > 0) {
      setCurrentReward(ecosavings);
    }
  }, [history, ecosavings]);

  // Update transactions based on history
  useEffect(() => {
    const newTransactions: Transaction[] = history.map(item => ({
      amount: item.ecosavings,
      timestamp: Date.now(), // Note: You might want to add actual timestamps to your history items
    }));

    setTransactions(newTransactions);
  }, [history]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {dic['components-text'].rewards.rewards}
      </h2>
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{dic['components-text'].rewards.walletbalance}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={totalBalance}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-3xl font-bold text-green-600 dark:text-green-400"
            >
              ${totalBalance.toFixed(2)}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{dic['components-text'].rewards.currentreward}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentReward}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              +${currentReward.toFixed(2)}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">{dic['components-text'].rewards.recenttranctions}</h3>
          <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <ul className="space-y-2">
              {transactions.map((transaction, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-600 p-2 rounded">
                  <span className="text-gray-600 dark:text-gray-300">
                    {formatDate(transaction.timestamp)}
                  </span>
                  <span className="text-green-500">+${transaction.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </motion.div>
  );
}