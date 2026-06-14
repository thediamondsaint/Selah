'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { type Profile, EMPTY_PROFILE, loadProfile, saveProfile } from './profile'

type ProfileContextValue = {
  profile: Profile
  loaded: boolean
  update: (patch: Partial<Profile>) => void
  reset: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  // Start from EMPTY so server and first client render match, then hydrate.
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProfile(loadProfile())
    setLoaded(true)
  }, [])

  const update = useCallback((patch: Partial<Profile>) => {
    setProfile(prev => {
      const next = { ...prev, ...patch }
      saveProfile(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setProfile(EMPTY_PROFILE)
    saveProfile(EMPTY_PROFILE)
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, loaded, update, reset }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
