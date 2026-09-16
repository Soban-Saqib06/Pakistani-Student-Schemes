export type Province =
  | "Punjab"
  | "Sindh"
  | "Khyber Pakhtunkhwa"
  | "Balochistan"
  | "Federal"
  | "Azad Jammu & Kashmir"
  | "Gilgit-Baltistan"

export const PROVINCES: Province[] = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Federal",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
]

export interface EligibilityCategory {
  id: number
  name: string
  description: string
}

export interface Scheme {
  id: number
  title: string
  description: string
  organization: string
  province: string
  eligibilityID: number
  eligibilityName?: string
  deadline: string // ISO date string
  officialUrl: string
  benefits: string
  requiredDocuments?: string[]
  createdAt?: string
}

export interface User {
  id: number
  name: string
  email: string
  role?: string
  token?: string
  createdAt?: string
}

export interface AuthResponse {
  id: number
  name: string
  email: string
  token: string
  message?: string
  role?: string
}

export interface Paginated<T> {
  data: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

export type SortBy = "deadline" | "recent" | "title"

export interface SchemeSearchParams {
  textQuery?: string
  eligibID?: number | null
  province?: string | null
  organization?: string | null
  sortBy?: SortBy
  activeOnly?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface SchemeInput {
  title: string
  description: string
  organization: string
  province: string
  eligibilityID: number
  deadline: string
  officialUrl: string
  benefits: string
  requiredDocuments?: string[]
}
