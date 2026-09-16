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

  if (res.status === 401) {
    throw new ApiError("Session expired. Please log in again.", 401)
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      message = data.message || data.title || message
    } catch {
      /* ignore body parse errors */
    }
    throw new ApiError(message, res.status)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/** Try the real API; on a pure network failure, fall back to the mock. */
async function withFallback<T>(real: () => Promise<T>, mock: () => Promise<T>): Promise<T> {
  try {
    return await real()
  } catch (err) {
    if (err instanceof NetworkError) return mock()
    throw err
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
      () =>
        request("/schemes/search", {
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
        }),
      () => mockApi.searchSchemes(params),
    )
  },
  getScheme(id: number) {
    return withFallback<Scheme>(
      () => request(`/schemes/${id}`),
      () => mockApi.getScheme(id),
    )
  },
  createScheme(input: SchemeInput) {
    return withFallback<Scheme>(
      () => request("/schemes", { method: "POST", body: input, auth: true }),
      () => mockApi.createScheme(input),
    )
  },
  updateScheme(id: number, input: SchemeInput) {
    return withFallback<Scheme>(
      () => request(`/schemes/${id}`, { method: "PUT", body: input, auth: true }),
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
      () => request("/bookmarks", { auth: true }),
      () => mockApi.listBookmarks(userId),
    )
  },
  addBookmark(userId: number, schemeId: number) {
    return withFallback<void>(
      () => request(`/bookmarks/${schemeId}`, { method: "POST", auth: true }),
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
