import { Poppins } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Anzora Media',
  description: 'End-to-end automated media generation agency',
}

