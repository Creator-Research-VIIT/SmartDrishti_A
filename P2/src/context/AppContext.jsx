import React, { createContext, useState, useEffect, useContext } from 'react'
import levelsSeed from '../data/levels.json'
import usersSeed from '../data/users.json'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [levels, setLevels] = useState([])
  const [completedProjects, setCompletedProjects] = useState([])

  // Load data from localStorage or seed
  useEffect(() => {
    const loadData = () => {
      // Load users
      const savedUsers = localStorage.getItem('portal_users')
      if (savedUsers) {
        try {
          setUsers(JSON.parse(savedUsers))
        } catch (e) {
          setUsers(usersSeed)
        }
      } else {
        setUsers(usersSeed)
        localStorage.setItem('portal_users', JSON.stringify(usersSeed))
      }

      // Load levels
      const savedLevels = localStorage.getItem('portal_levels')
      if (savedLevels) {
        try {
          setLevels(JSON.parse(savedLevels))
        } catch (e) {
          setLevels(levelsSeed)
        }
      } else {
        setLevels(levelsSeed)
        localStorage.setItem('portal_levels', JSON.stringify(levelsSeed))
      }

      // Load completed projects
      const savedProjects = localStorage.getItem('portal_completed_projects')
      if (savedProjects) {
        try {
          setCompletedProjects(JSON.parse(savedProjects))
        } catch (e) {
          setCompletedProjects([])
        }
      }

      // Load current user from session
      const savedUser = localStorage.getItem('portal_current_user')
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser))
        } catch (e) {
          setCurrentUser(null)
        }
      }
    }

    loadData()
  }, [])

  // Save users to localStorage
  const saveUsers = (newUsers) => {
    setUsers(newUsers)
    localStorage.setItem('portal_users', JSON.stringify(newUsers))
  }

  // Save levels to localStorage
  const saveLevels = (newLevels) => {
    setLevels(newLevels)
    localStorage.setItem('portal_levels', JSON.stringify(newLevels))
  }

  // Login
  const login = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    )
    if (user) {
      const userData = { ...user }
      delete userData.password // Don't store password in state
      setCurrentUser(userData)
      localStorage.setItem('portal_current_user', JSON.stringify(userData))
      return user
    }
    return null
  }

  // Logout
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('portal_current_user')
  }

  // Signup
  const signup = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      role: 'student',
      createdAt: new Date().toISOString(),
    }
    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    return newUser
  }

  // Update user password
  const updatePassword = (userId, newPassword) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, password: newPassword } : u
    )
    saveUsers(updatedUsers)
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser })
    }
  }

  // Add admin
  const addAdmin = (adminData) => {
    const newAdmin = {
      id: users.length + 1,
      ...adminData,
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
    const updatedUsers = [...users, newAdmin]
    saveUsers(updatedUsers)
    return newAdmin
  }

  // Delete user
  const deleteUser = (userId) => {
    const updatedUsers = users.filter((u) => u.id !== userId)
    saveUsers(updatedUsers)
    if (currentUser && currentUser.id === userId) {
      logout()
    }
  }

  // Update level
  const updateLevel = (levelId, updatedLevel) => {
    const updatedLevels = levels.map((l) =>
      l.id === levelId ? { ...l, ...updatedLevel } : l
    )
    saveLevels(updatedLevels)
  }

  // Add level
  const addLevel = (newLevel) => {
    const level = {
      ...newLevel,
      id: Math.max(...levels.map((l) => l.id), 0) + 1,
      order: levels.length + 1,
      unlocked: newLevel.unlocked !== undefined ? newLevel.unlocked : true,
    }
    const updatedLevels = [...levels, level]
    saveLevels(updatedLevels)
    return level
  }

  // Delete level
  const deleteLevel = (levelId) => {
    const updatedLevels = levels.filter((l) => l.id !== levelId)
    saveLevels(updatedLevels)
  }

  // Reorder levels
  const reorderLevels = (reorderedLevels) => {
    const updated = reorderedLevels.map((l, index) => ({
      ...l,
      order: index + 1,
    }))
    saveLevels(updated)
  }

  // Complete project
  const completeProject = (projectData) => {
    const project = {
      ...projectData,
      id: completedProjects.length + 1,
      completedAt: new Date().toISOString(),
    }
    const updated = [...completedProjects, project]
    setCompletedProjects(updated)
    localStorage.setItem('portal_completed_projects', JSON.stringify(updated))
    return project
  }

  // Export levels JSON
  const exportLevelsJSON = () => {
    const dataStr = JSON.stringify(levels, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'levels.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import levels JSON
  const importLevelsJSON = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData)
      if (Array.isArray(parsed)) {
        saveLevels(parsed)
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  const value = {
    currentUser,
    users,
    levels,
    completedProjects,
    login,
    logout,
    signup,
    updatePassword,
    addAdmin,
    deleteUser,
    updateLevel,
    addLevel,
    deleteLevel,
    reorderLevels,
    completeProject,
    exportLevelsJSON,
    importLevelsJSON,
    saveLevels,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}


