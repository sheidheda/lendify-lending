import './globals.css'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import { LendifyProvider } from '../contexts/LendifyContext'
import Footer from '../components/Footer'

const Header = dynamic(() => import('../components/Header'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lendify - Decentralized Lending Platform',
  description: 'Borrow, lend, and govern on the Stacks blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LendifyProvider>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </LendifyProvider>
      </body>
    </html>
  )
}

