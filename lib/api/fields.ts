import { getApiUrl } from './config'

export type AttributeOption = {
  id: number
  name: string
  slug: string
  children_count: number | null
}

export type Field = {
  id: number
  name: string
  input_type: string
  key_name: string
  required: boolean
  filterable: boolean
  multiselect: boolean
  multi_level: boolean
  section_id: number
  category_id: number
  sort: number
  slug: string
  attribute_options_count: number | null
  children_count: number | null
  attributeOptions?: AttributeOption[]
}

type FieldsResponse = {
  data: Field[]
}

export async function fetchFields(sectionId: number, categoryId: number, locale?: string): Promise<Field[]> {
  const searchParams = new URLSearchParams()
  searchParams.set('section_id', String(sectionId))
  searchParams.set('category_id', String(categoryId))
  if (locale) {
    searchParams.set('land', locale)
  }
  const query = searchParams.toString()
  const url = getApiUrl(`/api/sections/categories/fet-fields?${query}`)

  const res = await fetch(url, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch fields: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as FieldsResponse

  if (!json || !Array.isArray(json.data)) {
    return []
  }

  return json.data
}

export type SubField = {
  id: number
  name: string
  input_type: string
  key_name: string
  required: boolean
  filterable: boolean
  multiselect: boolean
  multi_level: boolean
  section_id: number
  category_id: number
  sort: number
  slug: string
  attribute_options_count: number | null
  children_count: number | null
  attributeOptions?: AttributeOption[]
}

type SubFieldsResponse = {
  data: SubField[]
}

export async function fetchSubFields(optionId: number, attributeId: number, locale?: string): Promise<SubField[]> {
  const searchParams = new URLSearchParams()
  searchParams.set('option_id', String(optionId))
  searchParams.set('attribute_id', String(attributeId))
  if (locale) {
    searchParams.set('land', locale)
  }
  const query = searchParams.toString()
  const url = getApiUrl(`/api/sections/categories/fet-subfields?${query}`)

  const res = await fetch(url, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch subfields: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as SubFieldsResponse

  if (!json || !Array.isArray(json.data)) {
    return []
  }

  return json.data
}

