import { Suspense } from "react"
import ValestApp from "@/components/valest-app"
import { toast } from "sonner"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ValestApp />
      </Suspense>
    </div>
  )
}
