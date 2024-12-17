'use client'

import { useState } from 'react'
import { useLendify } from '../contexts/LendifyContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

export default function CreateProposal() {
  const { createProposal } = useLendify()
  const [proposalDetails, setProposalDetails] = useState({
    description: '',
    votingPeriod: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProposalDetails({ ...proposalDetails, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createProposal({
      proposer: 'CurrentUser', // In a real app, this would be the connected user's address
      description: proposalDetails.description,
      endBlock: Date.now() + Number(proposalDetails.votingPeriod) * 24 * 60 * 60 * 1000,
    })
    alert('Proposal created successfully!')
    setProposalDetails({
      description: '',
      votingPeriod: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Proposal Description</Label>
        <Textarea
          id="description"
          name="description"
          value={proposalDetails.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="votingPeriod">Voting Period (days)</Label>
        <Input
          id="votingPeriod"
          name="votingPeriod"
          type="number"
          value={proposalDetails.votingPeriod}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Create Proposal</Button>
    </form>
  )
}

