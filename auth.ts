import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { DefaultSession } from 'next-auth'
import { getApiUrl } from '@/lib/api/config'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      mobile?: string | null
      emailVerified?: boolean
    } & DefaultSession['user']
    accessToken?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    mobile?: string | null
    accessToken?: string
    emailVerified?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    name?: string | null
    email?: string | null
    mobile?: string | null
    accessToken?: string
    emailVerified?: boolean
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'email@example.com',
        },
        mobile: {
          label: 'Mobile',
          type: 'text',
          placeholder: '+1234567890',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          throw new Error('Password is required')
        }

        if (!credentials?.email && !credentials?.mobile) {
          throw new Error('Either email or mobile is required')
        }

        try {
          const body: Record<string, string> = {
            password: credentials.password as string,
          }

          if (credentials.email) {
            body.email = credentials.email as string
          } else if (credentials.mobile) {
            body.mobile = credentials.mobile as string
          }

          const res = await fetch(getApiUrl('/api/auth/login'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(body),
          })

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.message || 'Invalid credentials')
          }

          const data = await res.json()

          if (data.success && data.data) {
            const { user, token } = data.data

            return {
              id: user.id?.toString() || user.id,
              name: user.name || user.first_name || user.username || null,
              email: user.email || null,
              mobile: user.mobile || user.phone || null,
              accessToken: token,
              emailVerified: Boolean(user.email_verified ?? user.email_verified_at != null),
            }
          }

          throw new Error('Invalid response from server')
        } catch (error) {
          console.error('Auth error:', error)
          throw error instanceof Error ? error : new Error('Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.mobile = user.mobile
        token.accessToken = user.accessToken
        token.emailVerified = Boolean(user.emailVerified)
      }

      if (trigger === 'update' && session) {
        if (typeof (session as { emailVerified?: boolean }).emailVerified === 'boolean') {
          token.emailVerified = (session as { emailVerified?: boolean }).emailVerified
        }
        if ((session as { email?: string }).email) {
          token.email = (session as { email?: string }).email
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string | null
        session.user.email = token.email as string | null
        session.user.mobile = token.mobile as string | null
        session.user.emailVerified = Boolean(token.emailVerified)
      }
      session.accessToken = token.accessToken as string | undefined
      return session
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    newUser: '/auth/sign-up',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
}

const handler = NextAuth(authOptions)

export default handler

// Export authOptions for getServerSession
export { authOptions }

// Export auth helper for server-side usage
export const auth = async () => {
  const { getServerSession } = await import('next-auth')
  return getServerSession(authOptions)
}

// Re-export signIn and signOut from next-auth/react for client-side usage
// Export signIn and signOut separately to avoid chunk issues
export { signIn, signOut } from 'next-auth/react'

