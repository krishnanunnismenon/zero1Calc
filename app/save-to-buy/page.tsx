'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/custom/date-input'


const Page = () => {
  const [price, setPrice] = useState<string>('')
  const [date, setDate] = useState<Date>(new Date())
  const [savings, setSavings] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [explanation, setExplanation] = useState<string>('')

  const calculateSavings = () => {
    if (!date || !price) return

    const today = new Date()
    const targetDate = new Date(date)
    const monthsDiff = (targetDate.getFullYear() - today.getFullYear()) * 12 + targetDate.getMonth() - today.getMonth()
    const yearsDiff = monthsDiff / 12

    let annualRate: number
    let rateExplanation: string

    if (yearsDiff <= 1) {
      annualRate = 0.05
      rateExplanation = "For short-term goals (up to 1 year), we assume a conservative 5% annual return, suitable for low-risk investments like high-yield savings accounts or short-term bonds."
    } else if (yearsDiff <= 3) {
      annualRate = 0.08
      rateExplanation = "For medium-term goals (1-3 years), we assume an 8% annual return, which might be achieved through a balanced portfolio of stocks and bonds."
    } else {
      annualRate = 0.10
      rateExplanation = "For long-term goals (over 3 years), we assume a 10% annual return, which is closer to the historical average return of the stock market over long periods."
    }

    const monthlyRate = annualRate / 12
    const targetAmount = parseFloat(price)

    const monthlySavings = targetAmount * (monthlyRate * Math.pow(1 + monthlyRate, monthsDiff)) / (Math.pow(1 + monthlyRate, monthsDiff) - 1)

    setSavings(monthlySavings)
    setIsSubmitted(true)

    const totalSavings = monthlySavings * monthsDiff
    const totalInterest = totalSavings - targetAmount

    setExplanation(`
      Based on your goal of saving ₹${targetAmount.toFixed(2)} by ${targetDate.toLocaleDateString()}, 
      which is ${monthsDiff} months or ${yearsDiff.toFixed(2)} years from now:

      ${rateExplanation}

      Monthly Savings: ₹${monthlySavings.toFixed(2)}
      This is the amount you need to save each month to reach your goal.

      Total Savings: ₹${totalSavings.toFixed(2)}
      This is the total amount you'll have saved over ${monthsDiff} months.

      Total Interest Earned: ₹${totalInterest.toFixed(2)}
      This is the amount you'll earn in interest or investment returns.
    `)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center p-4 ${isSubmitted ? 'bg-gradient-to-r from-purple-400 to-pink-500' : 'bg-gray-100'}`}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Dream Saver Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Label htmlFor="price">Price of Your Dream</Label>
              <Input
                id="price"
                placeholder="Enter the Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1"
              />
            </motion.div>

            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Label>When do you want to achieve your dream?</Label>
              <div className="mt-1">
              <DateInput value={date} onChange={(newDate) => setDate(newDate)} />
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Button onClick={calculateSavings} className="w-full">
                Calculate Savings
              </Button>
            </motion.div>

            {savings !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-4 p-4 bg-white rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">Your Savings Plan</h3>
                <p className="text-lg">
                  Save <span className="font-bold text-green-600">₹{savings.toFixed(2)}</span> per month
                </p>
                <div className="mt-4 text-sm text-gray-600 whitespace-pre-line">
                  {explanation}
                </div>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Page

