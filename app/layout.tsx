import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth/auth-context"
import { config } from "@/lib/config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: config.app.name,
  description: "Advanced threat detection and response platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
