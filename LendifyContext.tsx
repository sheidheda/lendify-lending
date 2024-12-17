'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Loan {
  id: number
  borrower: string
  lender: string
  amount: number
  collateral: number
  interestRate: number
  dueDate: number
  isActive: boolean
}

interface Proposal {
  id: number
  proposer: string
  description: string
  votesFor: number
  votesAgainst: number
  endBlock: number
  executed: boolean
}

interface LendifyContextType {
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  balance: number
  loans: Loan[]
  proposals: Proposal[]
  createLoan: (loan: Omit<Loan, 'id' | 'isActive'>) => void
  createProposal: (proposal: Omit<Proposal, 'id' | 'votesFor' | 'votesAgainst' | 'executed'>) => void
  vote: (proposalId: number, voteFor: boolean) => void
  isLoading: boolean
}

const LendifyContext = createContext<LendifyContextType | undefined>(undefined)

export const useLendify = () => {
  const context = useContext(LendifyContext)
  if (!context) {
    throw new Error('useLendify must be used within a LendifyProvider')
  }
  return context
}

export const LendifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(0)
  const [loans, setLoans] = useState<Loan[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeData = () => {
      if (isConnected) {
        setBalance(1000) // Simulated balance
        setLoans([
          {
            id: 1,
            borrower: 'User1',
            lender: 'User2',
            amount: 500,
            collateral: 750,
            interestRate: 5,
            dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            isActive: true
          }
        ])
        setProposals([
          {
            id: 1,
            proposer: 'User1',
            description: 'Increase interest rate by 1%',
            votesFor: 10,
            votesAgainst: 5,
            endBlock: Date.now() + 7 * 24 * 60 * 60 * 1000,
            executed: false
          }
        ])
      } else {
        setBalance(0)
        setLoans([])
        setProposals([])
      }
      setIsLoading(false)
    }

    initializeData()
  }, [isConnected])

  const connect = () => setIsConnected(true)
  const disconnect = () => setIsConnected(false)

  const createLoan = (loan: Omit<Loan, 'id' | 'isActive'>) => {
    setLoans(prevLoans => [...prevLoans, { ...loan, id: prevLoans.length + 1, isActive: true }])
  }

  const createProposal = (proposal: Omit<Proposal, 'id' | 'votesFor' | 'votesAgainst' | 'executed'>) => {
    setProposals(prevProposals => [
      ...prevProposals,
      { ...proposal, id: prevProposals.length + 1, votesFor: 0, votesAgainst: 0, executed: false }
    ])
  }

  const vote = (proposalId: number, voteFor: boolean) => {
    setProposals(prevProposals =>
      prevProposals.map(proposal =>
        proposal.id === proposalId
          ? {
              ...proposal,
              votesFor: voteFor ? proposal.votesFor + 1 : proposal.votesFor,
              votesAgainst: voteFor ? proposal.votesAgainst : proposal.votesAgainst + 1
            }
          : proposal
      )
    )
  }

  return (
    <LendifyContext.Provider
      value={{
        isConnected,
        connect,
        disconnect,
        balance,
        loans,
        proposals,
        createLoan,
        createProposal,
        vote,
        isLoading
      }}
    >
      {children}
    </LendifyContext.Provider>
  )
}

