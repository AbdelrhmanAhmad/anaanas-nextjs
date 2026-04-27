import { getApiUrl } from './config'

export type Country = {
  id: number
  name: string
  iso2?: string
  iso_code?: string
  flag?: string
  flag_full_path?: string
  is_active?: string
  banner?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

type CountriesResponse = {
  status?: boolean
  data?: Country[]
}

// Mapping بين ID الدول وأكوادها المدعومة
const COUNTRY_ID_TO_CODE: Record<number, string> = {
  // يمكن إضافة المزيد حسب الحاجة
  // مثال: 1: 'jo', 2: 'eg', 3: 'sa', 4: 'ae'
}

// Mapping بين أسماء الدول وأكوادها المدعومة
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'الأردن': 'jo',
  'Jordan': 'jo',
  'مصر': 'eg',
  'Egypt': 'eg',
  'السعودية': 'sa',
  'Saudi Arabia': 'sa',
  'الإمارات': 'ae',
  'UAE': 'ae',
  'United Arab Emirates': 'ae',
 
}

export type FetchCountriesOptions = {
  /** Next.js `revalidate` (seconds). When omitted, uses `no-store` for always-fresh data. */
  revalidateSeconds?: number
}

export async function fetchCountries(options?: FetchCountriesOptions): Promise<Country[]> {
  const url = getApiUrl('/api/countries')
  // //console.log('Fetching countries from:', url)

  const res = await fetch(
    url,
    options?.revalidateSeconds != null
      ? { next: { revalidate: options.revalidateSeconds } }
      : { cache: 'no-store' },
  )

  if (!res.ok) {
    console.error('Failed to fetch countries:', res.status, res.statusText)
    throw new Error(`Failed to fetch countries: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  //console.log('Countries API response (raw):', json)
  //console.log('Response type:', typeof json, 'Is array:', Array.isArray(json))

  // التعامل مع بنية الاستجابة المختلفة
  let countriesData: Country[] = []
  
  // الحالة 1: الاستجابة هي array مباشرة
  if (Array.isArray(json)) {
    countriesData = json
    //console.log('Response is direct array')
  }
  // الحالة 2: الاستجابة تحتوي على data
  else if (json && typeof json === 'object') {
    if (json.data && Array.isArray(json.data)) {
      countriesData = json.data
      //console.log('Response has data array')
    }
    // الحالة 3: الاستجابة تحتوي على status و data
    else if (json.status && json.data && Array.isArray(json.data)) {
      countriesData = json.data
      //console.log('Response has status and data array')
    }
    // الحالة 4: الاستجابة تحتوي على countries
    else if (json.countries && Array.isArray(json.countries)) {
      countriesData = json.countries
      //console.log('Response has countries array')
    }
  }
  
  //console.log('Parsed countries data:', countriesData, 'Count:', countriesData.length)

  // إضافة iso2 أو iso_code إذا لم تكن موجودة
  return countriesData.map((country) => {
    // إذا كان iso2 أو iso_code موجوداً، استخدمه
    if (country.iso2 || country.iso_code) {
      return country
    }

    // محاولة الحصول على الكود من ID
    if (COUNTRY_ID_TO_CODE[country.id]) {
      return {
        ...country,
        iso2: COUNTRY_ID_TO_CODE[country.id],
      }
    }

    // محاولة الحصول على الكود من الاسم
    const nameLower = country.name.toLowerCase().trim()
    const nameNormalized = country.name.trim()
    
    // البحث المباشر
    if (COUNTRY_NAME_TO_CODE[nameNormalized]) {
      return {
        ...country,
        iso2: COUNTRY_NAME_TO_CODE[nameNormalized],
      }
    }
    
    if (COUNTRY_NAME_TO_CODE[nameLower]) {
      return {
        ...country,
        iso2: COUNTRY_NAME_TO_CODE[nameLower],
      }
    }
    
    // البحث الجزئي
    for (const [name, code] of Object.entries(COUNTRY_NAME_TO_CODE)) {
      const searchName = name.toLowerCase()
      if (nameLower.includes(searchName) || searchName.includes(nameLower)) {
        return {
          ...country,
          iso2: code,
        }
      }
    }

    return country
  })
}

/** Client or non-cached server use; prefer `getCountryByCodeCached` in RSC. */
export async function getCountryByCode(code: string): Promise<Country | null> {
  const countries = await fetchCountries()
  return (
    countries.find((country) => (country.iso2 || country.iso_code || '').toLowerCase() === code.toLowerCase()) || null
  )
}

