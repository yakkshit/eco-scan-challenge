import React from 'react'
import { motion } from 'framer-motion'
import dic from "../../dictonary/data.json"
import Link from 'next/link'

interface Coupon {
  title: string
  price: string
  link: string
}

interface CouponsSectionProps {
  coupons: Coupon[]
}

const gradients = [
  'from-blue-500 to-purple-600',
  'from-green-400 to-blue-500',
  'from-yellow-400 to-orange-500',
  'from-pink-500 to-red-500',
  'from-indigo-500 to-purple-600',
]

export default function CouponsSection({ coupons }: CouponsSectionProps) {
  const renderCoupons = (couponsToRender: Coupon[]) => {
    return couponsToRender.map((coupon, index) => {
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]
      const isLimitedTime = Math.random() < 0.5 // 50% chance of being a limited time offer

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`bg-gradient-to-r ${randomGradient} rounded-lg p-4 text-white relative overflow-hidden`}
        >
          {isLimitedTime && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-800 px-2 py-1 text-xs font-bold uppercase rounded-bl">
              {dic['components-text'].coupons.limitedtime}
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2">{coupon.title}</h3>
          <p className="text-3xl font-bold">{coupon.price}</p>
          <p className="text-sm mt-2">{dic['components-text'].coupons.validtime}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-full font-bold text-sm"
          >
            <Link href={coupon.link}>
              {dic['components-text'].coupons.claim}
            </Link>
          </motion.button>
        </motion.div>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{dic['components-text'].coupons.text1}</h2>
      {coupons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-96">
          {renderCoupons(coupons)}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No coupons available at the moment. Check back later for exciting offers!</p>
      )}
    </motion.div>
  )
}
