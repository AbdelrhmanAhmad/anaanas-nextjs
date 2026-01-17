'use client'

import { createContext, use, type ReactNode } from 'react'

import type { Section } from '@/lib/api/sections'
import type { Category } from '@/lib/api/categories'

type SectionContextType = {
  section: Section
  categories: Category[]
}

const SectionContext = createContext<SectionContextType | undefined>(undefined)

export const useSectionContext = () => {
  const context = use(SectionContext)
  if (!context) {
    throw new Error('useSectionContext can only be used within SectionProvider')
  }
  return context
}

type SectionProviderProps = {
  value: SectionContextType
  children: ReactNode
}

export const SectionProvider = ({ value, children }: SectionProviderProps) => {
  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>
}

