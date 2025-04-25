import type { ReactNode } from "react"

interface MobileFrameProps {
  children: ReactNode
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="relative mx-auto h-[712px] w-[350px] overflow-hidden rounded-[40px] border-[14px] border-black bg-white shadow-xl">
      <div className="absolute left-1/2 top-0 z-10 h-6 w-40 -translate-x-1/2 rounded-b-3xl bg-black"></div>
      <div className="h-full overflow-y-auto">{children}</div>
    </div>
  )
}
