import { supabase } from "../supabase/client"
import { config } from "../config"

export type SignUpCredentials = {
  name: string
  email: string
  password: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type User = {
  id: string
  email: string
  name: string
}

export const authService = {
  async signUp({ name, email, password }: SignUpCredentials) {
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) throw error

      // Store the user's name in your FastAPI backend if needed
      if (data.session) {
        const token = data.session.access_token
        await fetch(`${config.api.backendUrl}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        })
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  },

  async login({ email, password }: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  },

  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error

      // Get additional user info from your FastAPI backend
      const token = (await supabase.auth.getSession()).data.session?.access_token

      if (token) {
        const response = await fetch(`${config.api.backendUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          return userData
        }
      }

      return data.user
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  },
}
