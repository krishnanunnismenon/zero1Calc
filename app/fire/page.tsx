'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TableDataItem {
  age: number;
  corpusAtBeginning: string;
  returnOnInvestment: string;
  corpusAtEnd: string;
  amountWithdrawn: string;
}

const Page: React.FC = () => {
  const [annualExpenses, setAnnualExpenses] = useState<string>('')
  const [withdrawalRate, setWithdrawalRate] = useState<string>('')
  const [fireNumber, setFireNumber] = useState<string>('')
  const [roi, setROI] = useState<string>('')
  const [startingAge, setStartingAge] = useState<string>('')
  const [tableData, setTableData] = useState<TableDataItem[]>([])
  const [showTable, setShowTable] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const generateTableData = () => {
    if (
      annualExpenses &&
      withdrawalRate &&
      fireNumber &&
      roi &&
      startingAge
    ) {
      setIsLoading(true)
      setTimeout(() => {
        const parsedFireNumber = parseFloat(fireNumber)
        const parsedROI = parseFloat(roi) / 100
        const parsedWithdrawalRate = parseFloat(withdrawalRate) / 100
        const parsedStartingAge = parseInt(startingAge, 10)

        const data: TableDataItem[] = []
        let currentCorpus = parsedFireNumber

        for (let i = 0; i < 20; i++) { 
          const age = parsedStartingAge + i
          const returnOnInvestment = currentCorpus * parsedROI
          const corpusAtEnd = currentCorpus + returnOnInvestment
          const amountWithdrawn = corpusAtEnd * parsedWithdrawalRate

          data.push({
            age,
            corpusAtBeginning: currentCorpus.toFixed(2),
            returnOnInvestment: returnOnInvestment.toFixed(2),
            corpusAtEnd: corpusAtEnd.toFixed(2),
            amountWithdrawn: amountWithdrawn.toFixed(2),
          })

          currentCorpus = corpusAtEnd - amountWithdrawn
        }

        setTableData(data)
        setShowTable(true)
        setIsLoading(false)
      }, 500) // Half a second delay
    } else {
      alert('Please fill out all fields.')
    }
  }

  return (
    <div className="min-h-screen bg-blue-900 p-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Calculate Fire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              type="number"
              placeholder="Annual Expenses"
              value={annualExpenses}
              onChange={(e) => setAnnualExpenses(e.target.value)}
              className="bg-white border-2 border-blue-300 focus:border-blue-500 transition-all duration-300"
            />
            <Input
              type="number"
              max={100}
              placeholder="Safe Withdrawal Rate (In %)"
              value={withdrawalRate}
              onChange={(e) => setWithdrawalRate(e.target.value)}
              className="bg-white border-2 border-blue-300 focus:border-blue-500 transition-all duration-300"
            />
            <Input
              type="number"
              placeholder="Fire Number"
              value={fireNumber}
              onChange={(e) => setFireNumber(e.target.value)}
              className="bg-white border-2 border-blue-300 focus:border-blue-500 transition-all duration-300"
            />
            <Input
              type="number"
              placeholder="ROI (In %)"
              value={roi}
              onChange={(e) => setROI(e.target.value)}
              className="bg-white border-2 border-blue-300 focus:border-blue-500 transition-all duration-300"
            />
            <Input
              type="number"
              placeholder="Starting Age"
              value={startingAge}
              onChange={(e) => setStartingAge(e.target.value)}
              className="bg-white border-2 border-blue-300 focus:border-blue-500 transition-all duration-300"
            />
          </div>
          <Button 
            onClick={generateTableData} 
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-full transition-all duration-300"
          >
            {isLoading ? 'Generating...' : 'Generate Table'}
          </Button>
        </CardContent>
      </Card>

      {showTable && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card className="overflow-hidden bg-white shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-500">
                      <TableHead className="text-white border">Age</TableHead>
                      <TableHead className="text-white border">Corpus at Beginning</TableHead>
                      <TableHead className="text-white border">Return on Investment</TableHead>
                      <TableHead className="text-white border">Corpus at End</TableHead>
                      <TableHead className="text-white border">Amount Withdrawn</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="border">{row.age}</TableCell>
                        <TableCell className="border">{row.corpusAtBeginning}</TableCell>
                        <TableCell className="border">{row.returnOnInvestment}</TableCell>
                        <TableCell className="border">{row.corpusAtEnd}</TableCell>
                        <TableCell className="border">{row.amountWithdrawn}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default Page

