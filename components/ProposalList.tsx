'use client'

import { useLendify } from '../contexts/LendifyContext'
import { Button } from './ui/button'

export default function ProposalList() {
  const { proposals, vote, isLoading } = useLendify()

  if (isLoading) {
    return <p>Loading proposals...</p>
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {proposals.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {proposals.map((proposal) => (
            <li key={proposal.id} className="py-4">
              <p className="font-semibold">Proposal #{proposal.id}</p>
              <p>{proposal.description}</p>
              <p>Votes For: {proposal.votesFor}</p>
              <p>Votes Against: {proposal.votesAgainst}</p>
              <p>End Date: {new Date(proposal.endBlock).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
              <p>Status: {proposal.executed ? 'Executed' : 'Pending'}</p>
              <div className="mt-2">
                <Button className="mr-2" onClick={() => vote(proposal.id, true)}>Vote For</Button>
                <Button variant="outline" onClick={() => vote(proposal.id, false)}>Vote Against</Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active proposals found.</p>
      )}
    </div>
  )
}

