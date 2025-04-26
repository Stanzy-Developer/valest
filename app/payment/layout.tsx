import { Suspense } from "react"
import { CryptoMarquee } from "@/components/payment-flow/crypto-marquee"

interface PaymentLayoutProps {
  children: React.ReactNode
}

export default function PaymentLayout({ children }: PaymentLayoutProps) {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Valest Payment
      </h1>
      
      <Suspense>
        <CryptoMarquee />
      </Suspense>

      {children}
    </div>
  )
}