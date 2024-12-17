'use client'

import { useLendify } from '../contexts/LendifyContext'
import { Button } from './ui/button'

export default function Header() {
  const { isConnected, connect, disconnect } = useLendify()

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Lendify</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="text-gray-600 hover:text-gray-800">Dashboard</a></li>
            <li><a href="/loans" className="text-gray-600 hover:text-gray-800">Loans</a></li>
            <li><a href="/governance" className="text-gray-600 hover:text-gray-800">Governance</a></li>
          </ul>
        </nav>
        <Button onClick={isConnected ? disconnect : connect}>
          {isConnected ? 'Disconnect' : 'Connect Wallet'}
        </Button>
      </div>
    </header>
  )
}

