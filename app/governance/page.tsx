import dynamic from 'next/dynamic'

const ProposalList = dynamic(() => import('../../components/ProposalList'), { ssr: false })
const CreateProposal = dynamic(() => import('../../components/CreateProposal'), { ssr: false })

export default function Governance() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Governance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Create Proposal</h3>
          <CreateProposal />
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Active Proposals</h3>
          <ProposalList />
        </div>
      </div>
    </div>
  )
}

