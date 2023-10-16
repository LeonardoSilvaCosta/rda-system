import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/global.scss';
import { RegisterClientContextProvider } from '@/context/registerClientContext';
import { RegisterAppointmentContextProvider } from '@/context/registerAppointmentContext';
import { LoginContextProvider } from '@/context/loginContext';
import { GlobalContextProvider } from '@/context/globalContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CIAP WEB',
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
      <body
        className={inter.className}>
        <GlobalContextProvider>
          <LoginContextProvider>
          <RegisterClientContextProvider>
            <RegisterAppointmentContextProvider>
              {children}
            </RegisterAppointmentContextProvider>
          </RegisterClientContextProvider>
          </LoginContextProvider>
        </GlobalContextProvider>
      </body>
    </html>
  )
}
