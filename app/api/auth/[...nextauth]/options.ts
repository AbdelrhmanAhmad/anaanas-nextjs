import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { randomBytes } from 'crypto'
import type { UserType } from '@/types/auth'

export const fakeUsers: UserType[] = [
  {
    id: '1',
    email: 'user@demo.com',
    username: 'demo_user',
    password: '123456',
    firstName: 'Demo',
    lastName: 'User',
    role: 'Admin',
    token:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDb2RlcnRoZW1lcyIsImF1ZCI6Imh0dHBzOi8vY29kZXJ0aGVtZXMuY29tLyIsInN1YiI6InN1cHBvcnRAY29kZXJ0aGVtZXMuY29tIiwibGFzdE5hbWUiOiJDb2RlcnRoZW1lcyIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJTb2NpYWwifQ.pXkZfHciKpF8c7NQRgJvjHG15HZalq0Ne2R2ggWKnqEb6D-uyFvBn_N6p1N4mhbjMTimrvNQc8Lw0qL1J1VhEQ',
  },
]

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email:',
          type: 'text',
          placeholder: 'Enter your username',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        const filteredUser = fakeUsers.find((user) => {
          return user.email === credentials?.email && user.password === credentials?.password
        })
        if (filteredUser) {
          return filteredUser
        } else {
          throw new Error('Email or Password is not valid')
        }
      },
    }),
  ],
  secret: 'kvwLrfri/MBznUCofIoRH9+NvGu6GqvVdqO3mor1GuA=',
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    session: ({ session, token }) => {
      session.user = {
        id: '1',
        email: 'user@demo.com',
        name: 'Test User',
      }
      return Promise.resolve(session)
    },
  },
  session: {
    maxAge: 24 * 60 * 60 * 1000,
    generateSessionToken: () => {
      return randomBytes(32).toString('hex')
    },
  },
}
