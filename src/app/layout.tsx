import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/global.scss';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RDA System',
  description: `Essa aplicação tem o objetivo de apresentar os dados do Registro Diário de Atendimento 
  e facilitar o preenchimento dos registros.`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
