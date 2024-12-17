'use client'

import { useLendify } from '../contexts/LendifyContext'

export default function LoanList() {
  const { loans, isLoading } = useLendify()

  if (isLoading) {
    return <p>Loading loans...</p>
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {loans.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {loans.map((loan) => (
            <li key={loan.id} className="py-4">
              <p className="font-semibold">Loan #{loan.id}</p>
              <p>Amount: {loan.amount} LFY</p>
              <p>Collateral: {loan.collateral} LFY</p>
              <p>Interest Rate: {loan.interestRate}%</p>
              <p>Due Date: {new Date(loan.dueDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active loans found.</p>
      )}
    </div>
  )
}

