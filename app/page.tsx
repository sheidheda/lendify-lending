import dynamic from 'next/dynamic'

const DashboardComponent = dynamic(() => import('../components/Dashboard'), { ssr: false })

export default function Home() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <DashboardComponent />
    </div>
  )
}

