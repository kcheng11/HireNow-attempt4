"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Laborer, Contractor, Project, HireRequest, Rating, Role } from "@/lib/types"
import { seedLaborers, seedContractors, seedProjects, seedHireRequests } from "@/lib/seed-data"

interface AppState {
  laborers: Laborer[]
  contractors: Contractor[]
  projects: Project[]
  hireRequests: HireRequest[]
  currentRole: Role | null
  currentUserId: string | null
  hydrated: boolean
}

interface AppContextType extends AppState {
  setRole: (role: Role, userId: string) => void
  logout: () => void
  addLaborer: (l: Laborer) => void
  addContractor: (c: Contractor) => void
  addProject: (p: Project) => void
  addHireRequest: (r: HireRequest) => void
  updateHireRequest: (id: string, updates: Partial<HireRequest>) => void
  addRating: (laborerId: string, rating: Rating) => void
}

const AppContext = createContext<AppContextType | null>(null)

const STORAGE_KEY = "hirenow-data"

function loadState(): AppState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

const defaultState: AppState = {
  laborers: seedLaborers,
  contractors: seedContractors,
  projects: seedProjects,
  hireRequests: seedHireRequests,
  currentRole: null,
  currentUserId: null,
  hydrated: false,
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState)

  useEffect(() => {
    const saved = loadState()
    if (saved) {
      setState({ ...saved, hydrated: true })
    } else {
      setState((s) => ({ ...s, hydrated: true }))
    }
  }, [])

  useEffect(() => {
    if (state.hydrated) saveState(state)
  }, [state])

  const setRole = useCallback((role: Role, userId: string) => {
    setState((s) => ({ ...s, currentRole: role, currentUserId: userId }))
  }, [])

  const logout = useCallback(() => {
    setState((s) => ({ ...s, currentRole: null, currentUserId: null }))
  }, [])

  const addLaborer = useCallback((l: Laborer) => {
    setState((s) => ({ ...s, laborers: [...s.laborers, l] }))
  }, [])

  const addContractor = useCallback((c: Contractor) => {
    setState((s) => ({ ...s, contractors: [...s.contractors, c] }))
  }, [])

  const addProject = useCallback((p: Project) => {
    setState((s) => ({ ...s, projects: [...s.projects, p] }))
  }, [])

  const addHireRequest = useCallback((r: HireRequest) => {
    setState((s) => ({ ...s, hireRequests: [...s.hireRequests, r] }))
  }, [])

  const updateHireRequest = useCallback((id: string, updates: Partial<HireRequest>) => {
    setState((s) => ({
      ...s,
      hireRequests: s.hireRequests.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }))
  }, [])

  const addRating = useCallback((laborerId: string, rating: Rating) => {
    setState((s) => ({
      ...s,
      laborers: s.laborers.map((l) =>
        l.id === laborerId ? { ...l, ratings: [...l.ratings, rating] } : l
      ),
    }))
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        setRole,
        logout,
        addLaborer,
        addContractor,
        addProject,
        addHireRequest,
        updateHireRequest,
        addRating,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
