'use client'

import { useState } from 'react'
import { useLendify } from '../contexts/LendifyContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function CreateLoan() {
  const { createLoan } = useLendify()
  const [loanDetails, setLoanDetails] = useState({
    lender: '',
    amount: '',
    collateral: '',
    interestRate: '',
    duration: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanDetails({ ...loanDetails, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createLoan({
      borrower: 'CurrentUser', // In a real app, this would be the connected user's address
      lender: loanDetails.lender,
      amount: Number(loanDetails.amount),
      collateral: Number(loanDetails.collateral),
      interestRate: Number(loanDetails.interestRate),
      dueDate: Date.now() + Number(loanDetails.duration) * 24 * 60 * 60 * 1000,
    })
    alert('Loan created successfully!')
    setLoanDetails({
      lender: '',
      amount: '',
      collateral: '',
      interestRate: '',
      duration: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="lender">Lender Address</Label>
        <Input
          id="lender"
          name="lender"
          value={loanDetails.lender}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="amount">Loan Amount (LFY)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={loanDetails.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="collateral">Collateral Amount (LFY)</Label>
        <Input
          id="collateral"
          name="collateral"
          type="number"
          value={loanDetails.collateral}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="interestRate">Interest Rate (%)</Label>
        <Input
          id="interestRate"
          name="interestRate"
          type="number"
          value={loanDetails.interestRate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (days)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          value={loanDetails.duration}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Create Loan</Button>
    </form>
  )
}

