"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthFormContainer } from "@/components/auth/auth-form-container"
import { useAuth } from "@/lib/auth/auth-context"
import { signUpSchema, type SignUpFormValues } from "@/lib/validators/auth-validators"

export default function SignUpPage() {
  const { signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true)
      setError(null)
      await signUp(data.name, data.email, data.password)
    } catch (error) {
      console.error("Sign up error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign up. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFormContainer title="Create your account" subtitle="Sign up to get started with Sentinel XDR">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register("name")}
            className={errors.name ? "border-error" : ""}
          />
          {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={errors.email ? "border-error" : ""}
          />
          {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...register("password")}
              className={errors.password ? "border-error pr-10" : "pr-10"}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
          <p className="text-neutral-text-tertiary text-xs">
            Password must be at least 6 characters and include uppercase, lowercase, numbers, and special characters.
          </p>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-neutral-text-secondary text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthFormContainer>
  )
}
