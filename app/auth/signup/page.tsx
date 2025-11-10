"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "@/lib/api"
import { authUtils } from "@/lib/auth"
import Header from "@/components/Header"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await signup(formData.name, formData.email, formData.password)

      if (response.success && response.token && response.user) {
        // Store token
        if (typeof window !== 'undefined') {
          localStorage.setItem("auth_token", response.token)
        }
        
        // Map backend user to frontend User type
        const user = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          isAdmin: response.user.role === "admin",
        }
        
        // Store user
        if (typeof window !== 'undefined') {
          localStorage.setItem("smartdrishti_user", JSON.stringify(user))
        }
        
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError("Signup failed. Please try again.")
      }
    } catch (error: any) {
      setError(error.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="animate-in fade-in zoom-in duration-500 w-full max-w-md">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all">
            <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Create Account ✨
            </h1>
            <p className="text-center text-gray-600 mb-6">Join SmartDrishti and start learning IoT!</p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username / Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white py-2.5 rounded-lg font-semibold transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Login here
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating decorative gradient blobs */}
      <div className="absolute -z-10 top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -z-10 bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
    </div>
  )
}
