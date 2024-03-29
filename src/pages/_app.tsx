import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StopPaymentProvider } from '../contexts/StopPaymentContext'
import { Header } from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StopPaymentProvider>
      <Header />
      <Component {...pageProps} />
    </StopPaymentProvider>
  )
}
