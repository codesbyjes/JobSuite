
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProfile(user) {
      if (!user) {
        if (active) setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .maybeSingle()

      if (!active) return

      if (error) {
        console.error('Could not load profile:', error.message)
        setProfile(null)
      } else {
        setProfile(data)
      }
    }

    async function initialize() {
      const { data, error } = await supabase.auth.getSession()

      if (!active) return

      if (error) {
        console.error('Could not get session:', error.message)
        setLoading(false)
        return
      }

      setSession(data.session)
      await loadProfile(data.session?.user ?? null)

      if (active) setLoading(false)
    }

    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return

      setSession(nextSession)

      if (event === 'SIGNED_OUT' || !nextSession) {
        setProfile(null)
        setLoading(false)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Defer profile fetching so it doesn't run inside the auth callback.
        setTimeout(() => {
          if (active) {
            loadProfile(nextSession.user).finally(() => {
              if (active) setLoading(false)
            })
          }
        }, 0)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function signUp({ fullName, email, password }) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    })
  }

  async function signIn({ email, password }) {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    return await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
