const DEFAULT_API_BASE_URL = 'http://localhost:8000'
export const API_BASE_URL = 
  (typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_API_BASE_URL 
    : process.env.API_BASE_URL) 
  ?? DEFAULT_API_BASE_URL

export const getApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}