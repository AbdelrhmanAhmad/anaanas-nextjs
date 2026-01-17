import { getApiUrl } from './config'

export type City = {
  id: number
  name: string
  country_id: number
}

type CitiesResponse = {
  data: City[]
}

export async function fetchCitiesByCountryId(countryId: number): Promise<City[]> {
  const url = getApiUrl(`/api/cities?country_id=${countryId}`)

  const res = await fetch(url, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch cities: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as CitiesResponse

  // التعامل مع بنية الاستجابة المختلفة
  let citiesData: City[] = []
  
  if (json && Array.isArray(json.data)) {
    citiesData = json.data
  } else if (Array.isArray(json)) {
    // إذا كانت الاستجابة array مباشرة
    citiesData = json
  } else if (json && json.data && Array.isArray(json.data)) {
    citiesData = json.data
  }

  console.log('Fetched cities:', { countryId, citiesData, json })
  return citiesData
}

