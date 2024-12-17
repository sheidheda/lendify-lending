'use client'

import { Connect } from '@stacks/connect-react'
import { StacksMocknet } from '@stacks/network'

const network = new StacksMocknet()

export function StacksProvider({ children }: { children: React.ReactNode }) {
  const appDetails = {
    name: 'Lendify',
    icon: 'https://example.com/icon.png',
  }

  return (
    <Connect network={network} appDetails={appDetails}>
      {children}
    </Connect>
  )
}

