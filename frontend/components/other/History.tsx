import React from 'react'
import { motion } from 'framer-motion'
import dic from "@/dictonary/data.json"

interface ApiResponse {
  carbonfootprint: {
    [key: string]: string
  }
  coupons: {
    title: string
    price: string
  }[]
  coupontotal: string
  ecosavings: number
}

interface HistorySectionProps {
  history: ApiResponse[]
}

export default function HistorySection({ history }: HistorySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{dic['components-text'].history.history}</h2>
      <div className="space-y-4 overflow-y-auto max-h-[525px]">
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Scan {index + 1}</h3>
            <p className="text-sm text-green-600 dark:text-green-400 mb-2">
              <span className="font-medium">{dic['components-text'].history.ecosavings}:</span> ${item.ecosavings.toFixed(2)}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item.carbonfootprint).map(([key, value]) => (
                <p key={key} className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium capitalize">{key}:</span> {value}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}