'use client'

import { createContext, use, type ReactNode } from 'react'

import type { Category } from '@/lib/api/categories'

type CategoryContextType = Category

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export const useCategoryContext = () => {
  const context = use(CategoryContext)
  if (!context) {
    throw new Error('useCategoryContext can only be used within CategoryProvider')
  }
  return context
}

type CategoryProviderProps = {
  value: CategoryContextType
  children: ReactNode
}

export const CategoryProvider = ({ value, children }: CategoryProviderProps) => {
  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
}


