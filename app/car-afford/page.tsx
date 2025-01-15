'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  tax: string;
  disposableIncome: string;
  downPayment: string;
  emi: string;
  totalInterest: string;
  totalLoan: string;
  totalBuyingCost: string;
  totalOperationalCost: string;
  totalMaintenanceCost: string;
  totalCost: string;
  annualCost: string;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const calculateResults = () => {
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
        tax: tax.toFixed(2),
        disposableIncome: disposableIncome.toFixed(2),
        downPayment: downPayment.toFixed(2),
        emi: emi.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalLoan: totalLoan.toFixed(2),
        totalBuyingCost: totalBuyingCost.toFixed(2),
        totalOperationalCost: totalOperationalCost.toFixed(2),
        totalMaintenanceCost: totalMaintenanceCost.toFixed(2),
        totalCost: totalCost.toFixed(2),
        annualCost: annualCost.toFixed(2),
        isAffordable,
      })
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Car Affordability Calculator 🚗</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Object.entries(inputs).map(([key, value]) => (
              <Input
                key={key}
                type="number"
                placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                name={key}
                value={value}
                onChange={handleChange}
                className="bg-white border-2 border-blue-300 focus:border-blue-500 transition-all duration-300"
              />
            ))}
          </div>
          <Button 
            onClick={calculateResults} 
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-full transition-all duration-300"
          >
            {isLoading ? 'Calculating...' : 'Calculate'}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card className="max-w-4xl mx-auto bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</span>
                    <span className={key === 'isAffordable' ? (value ? 'text-green-500' : 'text-red-500') : ''}>
                      {key === 'isAffordable' ? (value ? 'Yes' : 'No') : `₹${value}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default Page

