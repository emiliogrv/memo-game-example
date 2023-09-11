import './globals.css'

import type { Metadata } from 'next'
import { ReactNode } from 'react'
import Providers from '@/app/providers'

export const metadata: Metadata = {
  title: 'Memo Test Game',
  description: 'A memo test game example app',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-800 text-slate-100 container mx-auto p-4">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
