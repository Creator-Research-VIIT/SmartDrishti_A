import type { User } from "./types"
import { storageUtils } from "./localStorage"
import * as api from "./api"

// Legacy seeded users for backward compatibility
const SEEDED_USERS: User[] = [
  {
    id: "admin-001",
    email: "admin@example.com",
    name: "Admin User",
    isAdmin: true,
  },
  {
    id: "student-001",
    email: "student@example.com",
    name: "Student",
    isAdmin: false,
  },
]

const SEEDED_PASSWORDS: Record<string, string> = {
  "admin@example.com": "Admin123!",
  "student@example.com": "Student123!",
}

export const authUtils = {
  initializeUsers: () => {
    if (!storageUtils.isInitialized()) {
      storageUtils.setUsers(SEEDED_USERS)
      storageUtils.setInitialized()
    }
  },

  // New backend-based login
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      // Try backend login first
      const response = await api.login(email, password)
      
      if (response.success && response.token && response.user) {
        // Store token in localStorage (client-side only)
        if (typeof window !== 'undefined') {
          localStorage.setItem("auth_token", response.token)
        }
        
        // Map backend user to frontend User type
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          isAdmin: response.user.role === "admin",
        }
        
        storageUtils.setCurrentUser(user)
        return user
      }
      
      return null
    } catch (error) {
      console.error("Backend login failed:", error)
      
      // Fallback to local authentication for backward compatibility
      authUtils.initializeUsers()
      const users = storageUtils.getUsers()
      const user = users.find((u) => u.email === email)

      if (user && SEEDED_PASSWORDS[email] === password) {
        storageUtils.setCurrentUser(user)
        return user
      }

      return null
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token")
    }
    storageUtils.setCurrentUser(null)
  },

  getCurrentUser: (): User | null => {
    return storageUtils.getCurrentUser()
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("auth_token")
    }
    return null
  },

  isAuthenticated: (): boolean => {
    return storageUtils.getCurrentUser() !== null
  },

  isAdmin: (): boolean => {
    const user = storageUtils.getCurrentUser()
    return user?.isAdmin === true
  },
}
