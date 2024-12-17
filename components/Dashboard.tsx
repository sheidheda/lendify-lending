'use client'

import { useLendify } from '../contexts/LendifyContext'

export default function Dashboard() {
  const { isConnected, balance, isLoading } = useLendify()

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (!isConnected) {
    return <p>Please connect your wallet to view your dashboard.</p>
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Your LFY Balance</h3>
      <p className="text-3xl font-bold">{balance} LFY</p>
    </div>
  )
}

