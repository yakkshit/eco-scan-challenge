"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dict from "@/dictonary/data.json"

interface CarbonFootprintProps {
  data: {
    [key: string]: string
  }
  model_used: string,
  image_status: string,
  total_footprint: string
}

export default function CarbonFootprint({ data, total_footprint }: CarbonFootprintProps) {
  const entries = Object.entries(data)
  const [showLeaves, setShowLeaves] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setShowLeaves((prev) => !prev), 3000)
    return () => clearInterval(interval)
  }, [])

  // Format total footprint to 2 decimal places
  const formattedFootprint = Number(total_footprint).toFixed(2)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
          <AnimatePresence mode="wait">
            {showLeaves ? (
              <motion.svg
                key="leaves"
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <circle cx="12" cy="7" r="5" fill="green" />
                <circle cx="7" cy="14" r="4" fill="green" />
                <circle cx="17" cy="14" r="4" fill="green" />
              </motion.svg>
            ) : (
              <motion.svg
                key="tree"
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <path d="M12 13V21" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12V16" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12V16" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="8" r="4" fill="green" />
                <circle cx="15" cy="8" r="4" fill="green" />
                <circle cx="12" cy="5" r="4" fill="green" />
              </motion.svg>
            )}
          </AnimatePresence>
          {dict["components-text"].carbonfootprint.text1}
        </h2>
        {/* <p className="pt-2 text-sm text-gray-600 dark:text-gray-400">
          {dict["components-text"].carbonfootprint.modelused} - {model_used}
        </p>
        <p className="pb-2 text-sm text-gray-600 dark:text-gray-400">
          {dict["components-text"].carbonfootprint.imagestatus} - {image_status}
        </p> */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-green-100 dark:bg-green-800 rounded-lg p-6 mt-4"
        >
          <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
            Total Carbon Footprint
          </h3>
          <motion.p
            key={formattedFootprint}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-green-600 dark:text-green-400"
          >
            {formattedFootprint}kg CO₂e
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Breakdown by Item
        </h3>
        <div className="overflow-y-auto max-h-80 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {entries.map(([item, footprint], index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
              >
                <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300 capitalize">
                  {item}
                </h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{footprint}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}