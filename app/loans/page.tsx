import dynamic from 'next/dynamic'

const LoanList = dynamic(() => import('../../components/LoanList'), { ssr: false })
const CreateLoan = dynamic(() => import('../../components/CreateLoan'), { ssr: false })

export default function Loans() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Create Loan</h3>
          <CreateLoan />
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Active Loans</h3>
          <LoanList />
        </div>
      </div>
    </div>
  )
}

