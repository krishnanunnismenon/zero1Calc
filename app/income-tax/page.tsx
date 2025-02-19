'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useState } from 'react'

interface TaxDetails {
  incomeTax: string
  relief: string
  surcharge: string
  cess: string
  totalTax: string
}

const page = () => {
  const [ageCategory, setAgeCategory] = useState<string>('')
  const [is115BAC, setIs115BAC] = useState<string>('')
  const [income, setIncome] = useState<string>('')
  const [taxDetails, setTaxDetails] = useState<TaxDetails | null>(null)

  const calculateTax = () => {
    const netIncome = parseFloat(income);

    if (!netIncome || netIncome <= 0) {
      setTaxDetails({
        incomeTax: '0.00',
        relief: '0.00',
        surcharge: '0.00',
        cess: '0.00',
        totalTax: '0.00',
      });
      return;
    }

    let incomeTax = 0;
    let relief = 0;
    let surcharge = 0;
    let cess = 0;

    // Tax slabs for FY 2023-24
    const oldRegimeSlabs = ageCategory === 'below60' ? 
      [250000, 500000, 1000000] : 
      ageCategory === '60to80' ? 
      [300000, 500000, 1000000] : 
      [500000, 1000000];

    const oldRegimeRates = [0.05, 0.2, 0.3];
    const newRegimeSlabs = [400000, 800000, 1200000, 1600000, 2000000, 2400000];
    const newRegimeRates = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3];

    if (is115BAC === 'yes') {
      // New Tax Regime
      newRegimeSlabs.forEach((slab, index) => {
        if (netIncome > slab) {
          incomeTax += (Math.min(netIncome, newRegimeSlabs[index + 1] || netIncome) - slab) * newRegimeRates[index];
        }
      });

      // Relief under Section 87A
      if (netIncome <= 1200000) {
        relief = Math.min(incomeTax, 60000); // Max relief under new regime
      }
    } else {
      // Old Tax Regime
      oldRegimeSlabs.forEach((slab, index) => {
        if (netIncome > slab) {
          incomeTax += (Math.min(netIncome, oldRegimeSlabs[index + 1] || netIncome) - slab) * oldRegimeRates[index];
        }
      });

      // Relief under Section 87A
      if (netIncome <= 500000) {
        relief = Math.min(incomeTax, 12500); // Max relief under old regime
      }
    }

    // Surcharge
    if (netIncome > 5000000 && netIncome <= 10000000) {
      surcharge = incomeTax * 0.1;
    } else if (netIncome > 10000000 && netIncome <= 20000000) {
      surcharge = incomeTax * 0.15;
    } else if (netIncome > 20000000 && netIncome <= 50000000) {
      surcharge = incomeTax * 0.25;
    } else if (netIncome > 50000000) {
      surcharge = incomeTax * 0.37;
    }

    // Health and Education Cess
    if(incomeTax!==relief){
      cess = (incomeTax + surcharge) * 0.04;
    }

    const totalTax = incomeTax - relief + surcharge + cess;

    setTaxDetails({
      incomeTax: incomeTax.toFixed(2),
      relief: relief.toFixed(2),
      surcharge: surcharge.toFixed(2),
      cess: cess.toFixed(2),
      totalTax: totalTax.toFixed(2),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Calculate Your Income Tax</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <Label htmlFor="age-category" className="self-center">Age Category</Label>
            <Select value={ageCategory} onValueChange={setAgeCategory}>
              <SelectTrigger id="age-category" className="w-full">
                <SelectValue placeholder="Select Age Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below60">Less than 60 years</SelectItem>
                <SelectItem value="60to80">60 to 80 years</SelectItem>
                <SelectItem value="above80">More than 80 years</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="115bac" className="self-center">Opt for 115BAC</Label>
            <Select value={is115BAC} onValueChange={setIs115BAC}>
              <SelectTrigger id="115bac" className="w-full">
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="income" className="self-center">Net Taxable Income</Label>
            <Input
              id="income"
              type="number"
              placeholder="Enter your income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />

            <div className="col-span-2 mt-4">
              <Button className="w-full" onClick={calculateTax}>Calculate Income Tax</Button>
            </div>

            {taxDetails && (
              <div className="col-span-2 mt-4 space-y-2">
                <p><strong>Income Tax:</strong> ₹{taxDetails.incomeTax}</p>
                <p><strong>Relief u/s 87A:</strong> ₹{taxDetails.relief}</p>
                <p><strong>Surcharge:</strong> ₹{taxDetails.surcharge}</p>
                <p><strong>Health & Education Cess:</strong> ₹{taxDetails.cess}</p>
                <p className="text-lg font-bold"><strong>Total Tax Liability:</strong> ₹{taxDetails.totalTax}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default page
