import type {
  AuthResponse,
  EligibilityCategory,
  Paginated,
  Scheme,
  SchemeInput,
  SchemeSearchParams,
} from "./types"

/**
 * In-browser fallback used when the ASP.NET Core API at NEXT_PUBLIC_API_BASE_URL
 * is unreachable (e.g. inside the v0 preview, where localhost:5000 does not exist).
 * State is persisted to localStorage so admin edits and bookmarks survive navigation.
 */

const LS = {
  schemes: "ssdemo:schemes_v2",
  categories: "ssdemo:categories_v2",
  users: "ssdemo:users_v2",
  bookmarks: "ssdemo:bookmarks_v2",
}

const daysFromNow = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

const seedCategories: EligibilityCategory[] = [
  { id: 1, name: "Undergraduate", description: "Bachelor's degree students in HEC-recognized institutions." },
  { id: 2, name: "Postgraduate", description: "MS/MPhil and equivalent master's level students." },
  { id: 3, name: "PhD / Doctoral", description: "Doctoral candidates and research scholars." },
  { id: 4, name: "Matric & Intermediate", description: "Students in grades 9-12 / FA / FSc." },
  { id: 5, name: "Need-Based", description: "Financially disadvantaged students across all levels." },
  { id: 6, name: "Merit-Based", description: "High-achieving students recognized on academic merit." },
  { id: 7, name: "Technical / Vocational", description: "Diploma, TEVTA and skills-development programs." },
]

const seedSchemes: Scheme[] = [
  {
    id: 1,
    title: "HEC Need-Based Scholarship Program",
    description:
      "The Higher Education Commission provides need-based scholarships covering full tuition and a monthly stipend for talented students who cannot afford higher education at public sector universities.",
    organization: "Higher Education Commission (HEC)",
    province: "Federal",
    eligibilityID: 5,
    eligibilityName: "Need-Based",
    deadline: daysFromNow(24),
    officialUrl: "https://www.hec.gov.pk/english/scholarshipsgrants/NBS/Pages/default.aspx",
    benefits: "Full tuition fee, monthly stipend of PKR 8,000, and hostel/transport allowance.",
    requiredDocuments: ["CNIC / B-Form", "Latest fee voucher", "Income certificate of parents", "Admission letter"],
    createdAt: daysFromNow(-60),
  },
  {
    id: 2,
    title: "Ehsaas Undergraduate Scholarship",
    description:
      "Under the Ehsaas program, undergraduate students from low-income families receive scholarships covering 100% of tuition plus a living stipend across 130+ public universities.",
    organization: "Ehsaas / BISP",
    province: "Federal",
    eligibilityID: 1,
    eligibilityName: "Undergraduate",
    deadline: daysFromNow(12),
    officialUrl: "https://ehsaas.pass.gov.pk/",
    benefits: "100% tuition coverage plus PKR 4,000 monthly living stipend for the full degree duration.",
    requiredDocuments: ["CNIC / B-Form", "Family income proof", "Enrollment proof", "Bank account details"],
    createdAt: daysFromNow(-45),
  },
  {
    id: 3,
    title: "Prime Minister's Laptop Scheme",
    description:
      "The PM Laptop Scheme distributes free laptops to high-performing students enrolled in public sector higher-education institutions to bridge the digital divide.",
    organization: "Government of Pakistan",
    province: "Federal",
    eligibilityID: 6,
    eligibilityName: "Merit-Based",
    deadline: daysFromNow(40),
    officialUrl: "https://pmyp.gov.pk/",
    benefits: "One free laptop per eligible student based on CGPA and merit position.",
    requiredDocuments: ["Student ID card", "CNIC", "Current semester result", "University enrollment letter"],
    createdAt: daysFromNow(-30),
  },
  {
    id: 4,
    title: "PEEF Undergraduate Scholarship",
    description:
      "The Punjab Educational Endowment Fund supports meritorious and needy students of Punjab pursuing undergraduate studies at recognized institutions within and outside the province.",
    organization: "Government of Punjab (PEEF)",
    province: "Punjab",
    eligibilityID: 1,
    eligibilityName: "Undergraduate",
    deadline: daysFromNow(8),
    officialUrl: "https://www.peef.org.pk/",
    benefits: "Tuition fee, hostel charges, and an annual book allowance.",
    requiredDocuments: ["Domicile of Punjab", "CNIC / B-Form", "Previous academic records", "Income statement"],
    createdAt: daysFromNow(-20),
  },
  {
    id: 5,
    title: "BEEF Merit Scholarship (Balochistan)",
    description:
      "The Balochistan Education Endowment Fund awards scholarships to talented and deserving students of Balochistan to pursue higher and professional education.",
    organization: "Government of Balochistan (BEEF)",
    province: "Balochistan",
    eligibilityID: 6,
    eligibilityName: "Merit-Based",
    deadline: daysFromNow(33),
    officialUrl: "https://beef.org.pk/",
    benefits: "Full tuition, monthly stipend, and one-time settlement allowance.",
    requiredDocuments: ["Domicile of Balochistan", "CNIC", "Academic transcripts", "Admission proof"],
    createdAt: daysFromNow(-18),
  },
  {
    id: 6,
    title: "Sindh Endowment Fund Scholarship",
    description:
      "The Government of Sindh offers financial assistance to students domiciled in Sindh enrolled in professional and general degree programs.",
    organization: "Government of Sindh",
    province: "Sindh",
    eligibilityID: 5,
    eligibilityName: "Need-Based",
    deadline: daysFromNow(-5),
    officialUrl: "https://sef.org.pk/",
    benefits: "Semester tuition support and examination fee reimbursement.",
    requiredDocuments: ["Domicile of Sindh", "CNIC / B-Form", "Fee challan", "Income certificate"],
    createdAt: daysFromNow(-90),
  },
  {
    id: 7,
    title: "HEC Overseas Scholarship for PhD",
    description:
      "Fully funded scholarships for Pakistani nationals to pursue PhD degrees at top-ranked universities abroad in priority disciplines.",
    organization: "Higher Education Commission (HEC)",
    province: "Federal",
    eligibilityID: 3,
    eligibilityName: "PhD / Doctoral",
    deadline: daysFromNow(55),
    officialUrl: "https://www.hec.gov.pk/",
    benefits: "Full tuition, airfare, monthly living stipend, and health insurance abroad.",
    requiredDocuments: ["Master's degree", "GRE / subject test score", "Research proposal", "Two references"],
    createdAt: daysFromNow(-15),
  },
  {
    id: 8,
    title: "KPK Ehsas Undergraduate Scholarship",
    description:
      "The Government of Khyber Pakhtunkhwa provides need-cum-merit scholarships to students of the province studying in public sector universities.",
    organization: "Government of Khyber Pakhtunkhwa",
    province: "Khyber Pakhtunkhwa",
    eligibilityID: 5,
    eligibilityName: "Need-Based",
    deadline: daysFromNow(19),
    officialUrl: "https://hostels.kp.gov.pk/",
    benefits: "Tuition fee waiver and hostel accommodation support.",
    requiredDocuments: ["Domicile of KPK", "CNIC / B-Form", "Merit list position", "Income proof"],
    createdAt: daysFromNow(-12),
  },
  {
    id: 9,
    title: "TEVTA Skills Development Stipend",
    description:
      "Punjab TEVTA offers stipends to youth enrolled in technical and vocational training programs to promote employable skills.",
    organization: "TEVTA Punjab",
    province: "Punjab",
    eligibilityID: 7,
    eligibilityName: "Technical / Vocational",
    deadline: daysFromNow(6),
    officialUrl: "https://tevta.gop.pk/",
    benefits: "Monthly training stipend of PKR 3,000 and free course materials.",
    requiredDocuments: ["CNIC", "Course enrollment slip", "Bank account"],
    createdAt: daysFromNow(-9),
  },
  {
    id: 10,
    title: "AJK Talent Scholarship",
    description:
      "The Government of Azad Jammu & Kashmir supports meritorious students of the region in pursuing higher education across Pakistan.",
    organization: "Government of AJK",
    province: "Azad Jammu & Kashmir",
    eligibilityID: 6,
    eligibilityName: "Merit-Based",
    deadline: daysFromNow(28),
    officialUrl: "https://ajk.gov.pk/",
    benefits: "Annual merit award and tuition assistance.",
    requiredDocuments: ["State subject certificate", "CNIC", "Academic transcripts"],
    createdAt: daysFromNow(-7),
  },
  {
    id: 11,
    title: "Gilgit-Baltistan Education Grant",
    description:
      "Financial grants for students from Gilgit-Baltistan enrolled in undergraduate and postgraduate programs at recognized institutions.",
    organization: "Government of Gilgit-Baltistan",
    province: "Gilgit-Baltistan",
    eligibilityID: 2,
    eligibilityName: "Postgraduate",
    deadline: daysFromNow(45),
    officialUrl: "https://gilgitbaltistan.gov.pk/",
    benefits: "Semester fee support and research grant for postgraduate students.",
    requiredDocuments: ["Domicile of GB", "CNIC", "Admission letter", "Fee voucher"],
    createdAt: daysFromNow(-5),
  },
  {
    id: 12,
    title: "Fauji Foundation Matric & Intermediate Scholarship",
    description:
      "Scholarships for talented students in grades 9 to 12 from beneficiary families to encourage academic excellence at the school and college level.",
    organization: "Fauji Foundation",
    province: "Federal",
    eligibilityID: 4,
    eligibilityName: "Matric & Intermediate",
    deadline: daysFromNow(3),
    officialUrl: "https://www.fauji.org.pk/",
    benefits: "Annual cash scholarship and free textbooks.",
    requiredDocuments: ["Beneficiary card", "CNIC / B-Form", "Previous result card"],
    createdAt: daysFromNow(-3),
  },
]

interface MockUser {
  id: number
  name: string
  email: string
  password: string
  role: string
  createdAt: string
}

const seedUsers: MockUser[] = [
  {
    id: 1,
    name: "Demo Admin",
    email: "admin@example.com",
    password: "demoPassword123!",
    role: "Admin",
    createdAt: daysFromNow(-120),
  },
]

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function getSchemes(): Scheme[] {
  const s = read<Scheme[] | null>(LS.schemes, null)
  if (s && s.length > 0) {
    const now = Date.now()
    const activeCount = s.filter((item) => !item.deadline || new Date(item.deadline).getTime() >= now).length
    if (activeCount >= 5) {
      return s
    }
  }
  write(LS.schemes, seedSchemes)
  return seedSchemes
}

function getCategories(): EligibilityCategory[] {
  const c = read<EligibilityCategory[] | null>(LS.categories, null)
  if (c) return c
  write(LS.categories, seedCategories)
  return seedCategories
}

function getUsers(): MockUser[] {
  const u = read<MockUser[] | null>(LS.users, null)
  if (u) return u
  write(LS.users, seedUsers)
  return seedUsers
}

function getBookmarkMap(): Record<string, number[]> {
  return read<Record<string, number[]>>(LS.bookmarks, {})
}

function decorate(scheme: Scheme, cats: EligibilityCategory[]): Scheme {
  return {
    ...scheme,
    eligibilityName: cats.find((c) => c.id === scheme.eligibilityID)?.name ?? scheme.eligibilityName,
  }
}

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))
const isActive = (s: Scheme) => !s.deadline || new Date(s.deadline).getTime() >= Date.now()

export const mockApi = {
  async searchSchemes(params: SchemeSearchParams): Promise<Paginated<Scheme>> {
    await delay()
    const cats = getCategories()
    let list = getSchemes().map((s) => decorate(s, cats))

    if (params.textQuery) {
      const q = params.textQuery.toLowerCase()
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
      )
    }
    if (params.eligibID !== undefined && params.eligibID !== null && params.eligibID !== ("" as unknown)) {
      list = list.filter((s) => Number(s.eligibilityID) === Number(params.eligibID))
    }
    if (params.province && params.province !== "all") list = list.filter((s) => s.province === params.province)
    if (params.organization) list = list.filter((s) => s.organization === params.organization)
    if (params.activeOnly) list = list.filter(isActive)

    const getTime = (d: string | undefined | null) => {
      if (!d) return Infinity
      const t = new Date(d).getTime()
      return isNaN(t) ? Infinity : t
    }

    const now = Date.now()

    switch (params.sortBy) {
      case "title":
      case "title-asc":
        list.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        list.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "recent":
        list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
        break
      case "deadline-desc":
        // Furthest deadline first
        list.sort((a, b) => {
          const tA = getTime(a.deadline)
          const tB = getTime(b.deadline)
          return tB - tA
        })
        break
      case "deadline":
      case "deadline-asc":
      default:
        // Soonest deadline first. Active schemes prioritized before expired schemes if activeOnly is false.
        list.sort((a, b) => {
          const tA = getTime(a.deadline)
          const tB = getTime(b.deadline)
          const aExpired = tA < now
          const bExpired = tB < now
          if (aExpired !== bExpired) {
            return aExpired ? 1 : -1
          }
          return tA - tB
        })
        break
    }

    const pageNumber = params.pageNumber ?? 1
    const pageSize = params.pageSize ?? 9
    const totalCount = list.length
    const start = (pageNumber - 1) * pageSize
    const data = list.slice(start, start + pageSize)
    return { data, totalCount, pageNumber, pageSize }
  },

  async getScheme(id: number): Promise<Scheme> {
    await delay(250)
    const cats = getCategories()
    const scheme = getSchemes().find((s) => s.id === id)
    if (!scheme) throw new Error("Scheme not found")
    return decorate(scheme, cats)
  },

  async createScheme(input: SchemeInput): Promise<Scheme> {
    await delay()
    const schemes = getSchemes()
    const id = Math.max(0, ...schemes.map((s) => s.id)) + 1
    const scheme: Scheme = { id, createdAt: new Date().toISOString(), ...input }
    write(LS.schemes, [scheme, ...schemes])
    return decorate(scheme, getCategories())
  },

  async updateScheme(id: number, input: SchemeInput): Promise<Scheme> {
    await delay()
    const schemes = getSchemes()
    const idx = schemes.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error("Scheme not found")
    const updated: Scheme = { ...schemes[idx], ...input, id }
    schemes[idx] = updated
    write(LS.schemes, schemes)
    return decorate(updated, getCategories())
  },

  async deleteScheme(id: number): Promise<void> {
    await delay()
    write(
      LS.schemes,
      getSchemes().filter((s) => s.id !== id),
    )
  },

  async listCategories(): Promise<EligibilityCategory[]> {
    await delay(200)
    return getCategories()
  },

  async createCategory(input: { name: string; description: string }): Promise<EligibilityCategory> {
    await delay()
    const cats = getCategories()
    const id = Math.max(0, ...cats.map((c) => c.id)) + 1
    const cat = { id, ...input }
    write(LS.categories, [...cats, cat])
    return cat
  },

  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
    await delay()
    const users = getUsers()
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error("An account with this email already exists")
    }
    const id = Math.max(0, ...users.map((u) => u.id)) + 1
    const user: MockUser = {
      id,
      name: input.name,
      email: input.email,
      password: input.password,
      role: "User",
      createdAt: new Date().toISOString(),
    }
    write(LS.users, [...users, user])
    return { id, name: user.name, email: user.email, token: fakeToken(user), role: user.role, message: "Registered" }
  },

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    await delay()
    const user = getUsers().find(
      (u) => u.email.toLowerCase() === input.email.toLowerCase() && u.password === input.password,
    )
    if (!user) throw new Error("Invalid email or password")
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: fakeToken(user),
      role: user.role,
      message: "Login successful",
    }
  },

  async listBookmarks(userId: number): Promise<Scheme[]> {
    await delay()
    const cats = getCategories()
    const ids = getBookmarkMap()[String(userId)] ?? []
    return getSchemes()
      .filter((s) => ids.includes(s.id))
      .map((s) => decorate(s, cats))
  },

  async addBookmark(userId: number, schemeId: number): Promise<void> {
    await delay(200)
    const map = getBookmarkMap()
    const key = String(userId)
    const ids = new Set(map[key] ?? [])
    ids.add(schemeId)
    map[key] = [...ids]
    write(LS.bookmarks, map)
  },

  async removeBookmark(userId: number, schemeId: number): Promise<void> {
    await delay(200)
    const map = getBookmarkMap()
    const key = String(userId)
    map[key] = (map[key] ?? []).filter((id) => id !== schemeId)
    write(LS.bookmarks, map)
  },
}

function fakeToken(user: MockUser): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({ sub: user.id, name: user.name, email: user.email, role: user.role }),
  )
  return `${header}.${payload}.mock`
}
