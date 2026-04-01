import type { Metadata } from 'next'
import { Share_Tech_Mono, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const shareTechMono = Share_Tech_Mono({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-share-tech'
});

const orbitron = Orbitron({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: '--font-orbitron'
});

export const metadata: Metadata = {
  title: 'NEXUS ARCHIVE // CLASSIFIED',
  description: 'Restricted Access Terminal - Authorization Required',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${shareTechMono.variable} ${orbitron.variable}`}>
      <body className="font-mono antialiased cursor-crosshair">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
