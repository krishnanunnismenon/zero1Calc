'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { IndianRupee, Youtube } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Inputs {
  annualIncome: string;
  onRoadPrice: string;
  loanAmount: string;
  loanTenure: string;
  interestRate: string;
  registrationFees: string;
  fuelCost: string;
  insurancePremium: string;
  lifeSpan: string;
  maintenanceCost: string;
}

interface Results {
  tax: number;
  disposableIncome: number;
  downPayment: number;
  emi: number;
  totalInterest: number;
  totalLoan: number;
  totalBuyingCost: number;
  totalOperationalCost: number;
  totalMaintenanceCost: number;
  totalCost: number;
  annualCost: number;
  isAffordable: boolean;
}

const Page: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    annualIncome: '',
    onRoadPrice: '',
    loanAmount: '',
    loanTenure: '',
    interestRate: '',
    registrationFees: '',
    fuelCost: '',
    insurancePremium: '',
    lifeSpan: '',
    maintenanceCost: '',
  })

  const [results, setResults] = useState<Results | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showVideo, setShowVideo] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const clearAllFields = () => {
    setInputs({
      annualIncome: '',
      onRoadPrice: '',
      loanAmount: '',
      loanTenure: '',
      interestRate: '',
      registrationFees: '',
      fuelCost: '',
      insurancePremium: '',
      lifeSpan: '',
      maintenanceCost: '',
    })
    setResults(null)
    setErrors([])
  }

  const validateInputs = (): boolean => {
    const newErrors: string[] = []
    Object.entries(inputs).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors.push(`${formatLabel(key)} is required`)
      }
    })
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const calculateResults = () => {
    if (!validateInputs()) {
      return
    }


    setIsLoading(true)
    setTimeout(() => {
      const {
        annualIncome,
        onRoadPrice,
        loanAmount,
        loanTenure,
        interestRate,
        registrationFees,
        fuelCost,
        insurancePremium,
        lifeSpan,
        maintenanceCost,
      } = inputs

      // Convert inputs to numeric values
      const income = parseFloat(annualIncome)
      const price = parseFloat(onRoadPrice)
      const principle = parseFloat(loanAmount)
      const tenure = parseFloat(loanTenure)
      const rate = parseFloat(interestRate) / 100
      const registration = parseFloat(registrationFees)
      const fuel = parseFloat(fuelCost)
      const insurance = parseFloat(insurancePremium)
      const carLifeSpan = parseInt(lifeSpan, 10)
      const maintenance = parseFloat(maintenanceCost)

      // Step 1: Calculate Personal Income Tax (New Regime) 
      let tax = 0
      if (income <= 750000) {
        tax = 0
      } else if (income <= 1000000) {
        tax = (income - 750000) * 0.15 + 37500
      } else if (income <= 1250000) {
        tax = (income - 1000000) * 0.2 + 75000
      } else if (income <= 1500000) {
        tax = (income - 1250000) * 0.25 + 125000
      } else {
        tax = (income - 1500000) * 0.3 + 187500
      }

      // Step 2: Calculate Disposable Income 
      const disposableIncome = income - tax

      // Step 3: Calculate Down Payment 
      const downPayment = price * 0.2

      // Step 4: Calculate EMI on Loan 
      const monthlyRate = rate / 12
      const emi =
        (principle * monthlyRate * Math.pow(1 + monthlyRate, tenure * 12)) /
        (Math.pow(1 + monthlyRate, tenure * 12) - 1)

      // Step 5: Calculate Total Interest on Loan 
      const totalInterest = emi * 12 * tenure - principle

      // Step 6: Calculate Loan Amount to be Repaid 
      const totalLoan = principle + totalInterest

      // Step 7: Calculate Total Buying Cost 
      const totalBuyingCost = downPayment + totalLoan + registration

      // Step 8: Calculate Total Operational Cost 
      const totalOperationalCost = (fuel + insurance) * carLifeSpan

      // Step 9: Calculate Total Maintenance Cost 
      const totalMaintenanceCost = maintenance * carLifeSpan

      //  Step 10: Calculate Total Cost of Owning the Car 
      const totalCost = totalBuyingCost + totalOperationalCost + totalMaintenanceCost

      //  Step 11: Calculate Annual Cost of Owning the Car 
      const annualCost = totalCost / carLifeSpan

      // Step 12: Affordability Check 
      const isAffordable = annualCost < disposableIncome * 0.2

      // Set Results
      setResults({
        tax: Math.round(tax),
        disposableIncome: Math.round(disposableIncome),
        downPayment: Math.round(downPayment),
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalLoan: Math.round(totalLoan),
        totalBuyingCost: Math.round(totalBuyingCost),
        totalOperationalCost: Math.round(totalOperationalCost),
        totalMaintenanceCost: Math.round(totalMaintenanceCost),
        totalCost: Math.round(totalCost),
        annualCost: Math.round(annualCost),
        isAffordable,
      })
      setIsLoading(false)
    }, 500)
  }

  const formatLabel = (key: string) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    if (['interestRate'].includes(key)) {
      return `${label} (in %)`
    } else if (['loanTenure', 'lifeSpan'].includes(key)) {
      return `${label} (in years)`
    } else {
      return `${label} (in ₹)`
    }
  }

  const formatPlaceholder = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  }

  return (
    <div className={`min-h-screen p-8 transition-colors duration-500 ${results ? (results.isAffordable ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'}`}>
      <Card className="max-w-4xl mx-auto bg-white shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Car Affordability Calculator 🚗</CardTitle>
        </CardHeader>
        <CardContent>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Object.entries(inputs).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium text-gray-700">
                  {formatLabel(key)}
                </Label>
                <div className="relative">
                  <Input
                    id={key}
                    type="number"
                    placeholder={formatPlaceholder(key)}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className={`bg-white border-2 border-blue-300 focus:border-blue-500 transition-all duration-300 pl-7 ${
                      errors.some(error => error.includes(formatLabel(key))) ? 'border-red-500' : ''
                    }`}
                  />
                  {!['interestRate', 'loanTenure', 'lifeSpan'].includes(key) && (
                    <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            <Button 
              onClick={calculateResults} 
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-full transition-all duration-300"
            >
              {isLoading ? 'Calculating...' : 'Calculate'}
            </Button>
            <Button 
              onClick={clearAllFields}
              className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-full transition-all duration-300 hover:bg-gray-400"
            >
              Clear All Fields
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="max-w-4xl mx-auto bg-white shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-semibold">{formatLabel(key)}:</span>
                    <span className={key === 'isAffordable' ? (value ? 'text-green-500' : 'text-red-500') : ''}>
                      {key === 'isAffordable' ? (value ? 'Yes' : 'No') : `₹${value.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <motion.div
            className="flex justify-center mt-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {results.isAffordable ? (
              <motion.div
                className="text-9xl"
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                😄
              </motion.div>
            ) : (
              <motion.div
                className="text-9xl"
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                😢
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      <Card className="max-w-4xl mx-auto bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Video Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 text-center">
            This calculator is based on the concepts explained in the following YouTube video. 
            Click the button below to watch the full explanation.
          </p>
          <Button
            onClick={() => setShowVideo(!showVideo)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all duration-300 flex items-center justify-center"
          >
            <Youtube className="mr-2" />
            {showVideo ? 'Hide Video' : 'Watch Video'}
          </Button>
          {showVideo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/wWrq4JHDuMc?si=le8UOPGnvEl3984b&amp;start=450"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Page

