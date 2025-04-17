import Image from "next/image"
import type { ReactNode } from "react"

type AuthFormContainerProps = {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthFormContainer({ children, title, subtitle }: AuthFormContainerProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary flex-col justify-center items-center p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/placeholder.svg?height=80&width=240"
              alt="Sentinel XDR Logo"
              width={240}
              height={80}
              className="mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Welcome to Sentinel XDR</h1>
          <p className="text-white/80 text-lg">
            Advanced threat detection and response platform for modern security operations
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 text-center">
            <Image
              src="/placeholder.svg?height=60&width=180"
              alt="Sentinel XDR Logo"
              width={180}
              height={60}
              className="mx-auto"
            />
          </div>

          <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
          {subtitle && <p className="text-neutral-text-secondary mb-6">{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  )
}
