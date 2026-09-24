import { mockApi } from "./mock-data"
import type {
  AuthResponse,
  EligibilityCategory,
  Paginated,
  Scheme,
  SchemeInput,
  SchemeSearchParams,
  User,
} from "./types"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api"

const TOKEN_KEY = "ssdemo:token"
const USER_KEY = "ssdemo:user"

/* ------------------------------------------------------------------ */
/* Token + session helpers                                             */
/* ------------------------------------------------------------------ */

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setSession(user: User | null) {
  if (typeof window === "undefined") return
  if (user?.token) {
    window.localStorage.setItem(TOKEN_KEY, user.token)
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function decodeRole(token: string | undefined | null): string | undefined {
  if (!token) return undefined
  try {
    const payload = token.split(".")[1]
    if (!payload) return undefined
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return (
      json.role ||
      json.Role ||
      json["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      (json.isAdmin ? "Admin" : undefined)
    )
  } catch {
    return undefined
  }
}

/* ------------------------------------------------------------------ */
/* Core request wrapper with graceful mock fallback                    */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** Thrown when the network request itself fails (backend unreachable). */
class NetworkError extends Error {}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  query?: Record<string, string | number | boolean | null | undefined>
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, query } = options
  const url = new URL(`${API_BASE_URL}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const headers: Record<string, string> = {}
  if (body) headers["Content-Type"] = "application/json"
  if (auth) {
    const token = getToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // Backend unreachable — signal the caller to use the mock fallback.
    throw new NetworkError("Network request failed")
  }

  if (!res.ok) {
    let message = res.status === 401 && !path.includes("/login")
      ? "Session expired. Please log in again."
      : `Request failed (${res.status})`
    try {
      const data = await res.json()
      if (data.errors && typeof data.errors === "object") {
        const msgs = Object.values(data.errors).flat().filter(Boolean) as string[]
        if (msgs.length > 0) {
          message = msgs.join(". ")
        } else {
          message = data.message || data.title || message
        }
      } else if (data.message) {
        message = data.message
      } else if (data.title) {
        message = data.title
      }
    } catch {
      /* ignore body parse errors */
    }
    throw new ApiError(message, res.status)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/** Try the real API; on connection, fetch, or 5xx server failures (including SSR prerender), fall back to the mock. */
async function withFallback<T>(real: () => Promise<T>, mock: () => Promise<T>): Promise<T> {
  try {
    return await real()
  } catch (err) {
    if (
      err instanceof NetworkError ||
      (err instanceof ApiError && err.status >= 500) ||
      typeof window === "undefined"
    ) {
      return mock()
    }
    throw err
  }
}

/* ------------------------------------------------------------------ */
/* Scheme adapter: ensures benefits & officialUrl are always populated */
/* ------------------------------------------------------------------ */

export function inferBenefits(title: string = "", desc: string = ""): string {
  const t = title.toLowerCase()
  const d = desc.toLowerCase()
  const combined = `${t} ${d}`

  if (combined.includes("laptop")) {
    return "Free brand-new high-spec laptop and digital learning package."
  }
  if (combined.includes("foreign phd") || combined.includes("fully funded")) {
    return "100% tuition waiver, return airfare, health insurance, and monthly living stipend."
  }
  if (combined.includes("oxford") || combined.includes("opp")) {
    return "Full university tuition waiver and international graduate research grant."
  }
  if (combined.includes("mines labours")) {
    const match = desc.match(/Rs\.?\s*[\d,]+/i)
    return match
      ? `Educational cash stipend of ${match[0]} plus textbooks and materials.`
      : "Educational cash stipend, free textbooks, and school supplies."
  }
  if (combined.includes("honhaar")) {
    return "100% full tuition fee coverage for 4-5 year undergraduate degree program."
  }
  if (combined.includes("cmeef") || combined.includes("chief minister education endowment")) {
    return "Full tuition fees, accommodation allowance, and monthly stipend in top institutions."
  }
  if (combined.includes("pbm") || combined.includes("bait ul mal")) {
    return "Individual financial assistance covering tuition, registration, and examination fees."
  }
  if (combined.includes("zakat")) {
    return "Full semester fee waiver and educational stipend for deserving candidates."
  }
  if (combined.includes("out of province")) {
    return "Tuition fee support and accommodation stipend for studies outside domicile province."
  }
  if (combined.includes("need base") || combined.includes("financial aid") || combined.includes("inaffordability")) {
    return "Full tuition waiver and monthly subsistence stipend for deserving students."
  }
  if (combined.includes("merit")) {
    return "Merit scholarship award, tuition waiver, and academic certificate."
  }
  if (combined.includes("benevolent")) {
    return "Annual cash educational grant for children of provincial government servants."
  }
  if (combined.includes("girls stipend")) {
    return "Monthly education stipend and free learning materials."
  }

  const amtMatch = desc.match(/Rs\.?\s*[\d,]+/i)
  if (amtMatch) {
    return `Financial grant of ${amtMatch[0]} and academic support.`
  }

  return "Full tuition fee waiver and educational assistance grant."
}

export function adaptScheme(raw: any): Scheme {
  if (!raw) return raw
  const title = raw.title || raw.Title || ""
  const description = raw.description || raw.Description || ""
  const url = raw.officialUrl || raw.OfficialUrl || raw.applyUrl || raw.ApplyUrl || "#"

  // Pick benefits from backend or infer from title/description
  let benefits = raw.benefits || raw.Benefits || ""
  if (!benefits || benefits === "Full tuition fee waiver and educational assistance grant.") {
    benefits = inferBenefits(title, description)
  }

  return {
    id: raw.id ?? raw.Id ?? 0,
    title,
    description,
    organization: raw.organization ?? raw.Organization ?? "Government of Pakistan",
    province: raw.province ?? raw.Province ?? "Federal",
    eligibilityID: raw.eligibilityID ?? raw.eligibilityId ?? raw.EligibilityId ?? 1,
    eligibilityName: raw.eligibilityName ?? raw.EligibilityName ?? "All Levels",
    deadline: raw.deadline ?? raw.Deadline ?? null,
    officialUrl: url,
    benefits,
    requiredDocuments: raw.requiredDocuments || [
      "Valid CNIC / B-Form",
      "Academic Transcripts / Marksheet",
      "Domicile Certificate of Applicant",
      "Income Certificate / Proof of Enrollment"
    ],
    createdAt: raw.createdAt ?? raw.CreatedAt,
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export const api = {
  /* ---- Auth ---- */
  register(input: { name: string; email: string; password: string }) {
    return withFallback<AuthResponse>(
      () => request("/users/register", { method: "POST", body: input }),
      () => mockApi.register(input),
    )
  },
  login(input: { email: string; password: string }) {
    return withFallback<AuthResponse>(
      () => request("/users/login", { method: "POST", body: input }),
      () => mockApi.login(input),
    )
  },

  /* ---- Schemes ---- */
  searchSchemes(params: SchemeSearchParams) {
    return withFallback<Paginated<Scheme>>(
      async () => {
        const res = await request<any>("/schemes/search", {
          query: {
            textQuery: params.textQuery,
            eligibID: params.eligibID,
            province: params.province,
            organization: params.organization,
            sortBy: params.sortBy,
            activeOnly: params.activeOnly,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
          },
        })
        const items = res?.data ?? res?.schemes ?? res?.Schemes ?? []
        return {
          data: items.map(adaptScheme),
          totalCount: res?.totalCount ?? res?.TotalCount ?? items.length,
          pageNumber: res?.pageNumber ?? res?.PageNumber ?? params.pageNumber ?? 1,
          pageSize: res?.pageSize ?? res?.PageSize ?? params.pageSize ?? 9,
        }
      },
      () => mockApi.searchSchemes(params),
    )
  },
  getScheme(id: number) {
    return withFallback<Scheme>(
      async () => {
        const raw = await request<any>(`/schemes/${id}`)
        return adaptScheme(raw)
      },
      () => mockApi.getScheme(id),
    )
  },
  createScheme(input: SchemeInput) {
    const body = { ...input, applyUrl: input.officialUrl, officialUrl: input.officialUrl }
    return withFallback<Scheme>(
      () => request("/schemes", { method: "POST", body, auth: true }),
      () => mockApi.createScheme(input),
    )
  },
  updateScheme(id: number, input: SchemeInput) {
    const body = { ...input, applyUrl: input.officialUrl, officialUrl: input.officialUrl }
    return withFallback<Scheme>(
      () => request(`/schemes/${id}`, { method: "PUT", body, auth: true }),
      () => mockApi.updateScheme(id, input),
    )
  },
  deleteScheme(id: number) {
    return withFallback<void>(
      () => request(`/schemes/${id}`, { method: "DELETE", auth: true }),
      () => mockApi.deleteScheme(id),
    )
  },

  /* ---- Eligibility ---- */
  listCategories() {
    return withFallback<EligibilityCategory[]>(
      () => request("/eligibility"),
      () => mockApi.listCategories(),
    )
  },
  createCategory(input: { name: string; description: string }) {
    return withFallback<EligibilityCategory>(
      () => request("/eligibility", { method: "POST", body: input, auth: true }),
      () => mockApi.createCategory(input),
    )
  },

  /* ---- Bookmarks ---- */
  listBookmarks(userId: number) {
    return withFallback<Scheme[]>(
      async () => {
        const list = await request<any[]>("/bookmarks", { auth: true })
        return (list ?? []).map(adaptScheme)
      },
      () => mockApi.listBookmarks(userId),
    )
  },
  addBookmark(userId: number, schemeId: number) {
    return withFallback<void>(
      async () => {
        try {
          await request(`/bookmarks/${schemeId}`, { method: "POST", auth: true })
        } catch (err) {
          if (err instanceof ApiError && err.status === 409) {
            return
          }
          throw err
        }
      },
      () => mockApi.addBookmark(userId, schemeId),
    )
  },
  removeBookmark(userId: number, schemeId: number) {
    return withFallback<void>(
      () => request(`/bookmarks/${schemeId}`, { method: "DELETE", auth: true }),
      () => mockApi.removeBookmark(userId, schemeId),
    )
  },
}
