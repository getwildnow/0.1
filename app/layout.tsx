import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Veriff Verification',
  description: 'Start your identity verification process',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

