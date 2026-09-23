# TaleemHub Pakistan (تعليم ہب)
> **Automated National Educational Schemes & Scholarships Platform for Pakistani Students**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![ASP.NET Core](https://img.shields.io/badge/Backend-ASP.NET%20Core%20Web%20API-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Python Scrapers](https://img.shields.io/badge/Pipeline-Python%20Scrapers-3776AB?logo=python)](https://www.python.org/)

TaleemHub Pakistan is an end-to-end open public directory and aggregation platform designed to solve the fragmentation of higher education scholarships, endowments, and financial assistance programs across Pakistan. 

Instead of requiring students to navigate dozens of unindexed departmental websites, provincial gazettes, and university bulletin boards, TaleemHub automatically discovers, deduplicates, and surfaces verified educational schemes across all 5 provincial and federal administrations in a single unified interface.

---

## Architecture Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        REGIONAL CRAWLER NETWORK                        │
│                                                                        │
│  [Punjab PEEF]    [Federal HEC]    [Sindh SEEF]    [Balochistan BEEF]  │
│  peef_scraper.py  hec_scraper.py   sindh_scraper.py beef_scraper.py    │
│                           [KP HED / KPITB]                             │
│                             kp_scraper.py                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON Datasets
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   MASTER AGGREGATOR & DEDUPLICATION                    │
│                        (scraper/MasterAggregator.py)                   │
│                                                                        │
│  • Canonical Key Normalization       • Acronym Expansion (PEEF, HEC)   │
│  • Typo & Diacritic Sanitization     • Parenthetical Preservation      │
│  • Cross-Portal Semantic Merging     • Automated PostgreSQL DB Upsert  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Idempotent Sync
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         POSTGRESQL 16 DATABASE                         │
│                                                                        │
│  • Schemes Table (96+ verified)      • Users & Roles (Admin, Student)  │
│  • Eligibilities (6 standard tiers)  • SavedSchemes (Bookmarks)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ EF Core / Npgsql
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ASP.NET CORE 10 WEB API                         │
│                                                                        │
│  • RESTful Controllers               • JWT Bearer Authentication       │
│  • FluentValidation Auto-Validation  • Pagination & Multi-Filter Search│
│  • Scalar / OpenAPI Documentation    • Port: 5000                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON API (/api)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 16 REACT CLIENT                         │
│                                                                        │
│  • Turbopack Development Server      • Dynamic Route Detail Pages      │
│  • Live Search & Quota Filtering     • Benefits & Requirements Badges  │
│  • Student Bookmarks Management      • Protected Admin Dashboard       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Regional Coverage Scope

The crawler network collects and synchronizes opportunities from all key educational bodies:

| Region | Primary Portal / Organization | Source Script | Schemes Captured |
|---|---|---|:---:|
| **Federal** | Higher Education Commission (HEC Pakistan) | `hec_scraper.py` | 33 |
| **Punjab** | Punjab Educational Endowment Fund (PEEF) & Honhaar | `peef_scraper.py` | 6 |
| **Sindh** | Sindh Education Endowment Fund (SEEF) & SEF | `sindh_scraper.py` | 3 |
| **Balochistan** | Balochistan Education Endowment Fund (BEEF) | `beef_scraper.py` | 9 |
| **KP** | Higher Education Department KP / KPITB | `kp_scraper.py` | 58 |
| **National Total** | **Consolidated, Deduplicated Catalog** | `MasterAggregator.py` | **96 Clean Schemes** |

---

## Tech Stack

* **Frontend**: Next.js 16.3 (Turbopack), React 19, TypeScript, Tailwind CSS, Base UI, Lucide Icons, Sonner toasts.
* **Backend**: ASP.NET Core 10 Web API, Entity Framework Core 10, Npgsql (PostgreSQL provider), FluentValidation, Scalar OpenAPI.
* **Database**: PostgreSQL 16 Alpine running via Docker on port `5433`.
* **Data Pipeline**: Python 3.10+, Requests, BeautifulSoup4, psycopg2.

---

## Local Setup & Quickstart

### Prerequisites
* [.NET 10 or .NET 8 SDK](https://dotnet.microsoft.com/download)
* [Node.js 18+](https://nodejs.org/) & `npm`
* [Docker & Docker Compose](https://www.docker.com/)
* [Python 3.10+](https://www.python.org/)

---

### Step 1: Start PostgreSQL Database

Launch the preconfigured PostgreSQL 16 container:
```bash
docker compose up -d db
```
The database will be accessible at `127.0.0.1:5433` with database name `personalproject`.

---

### Step 2: Configure & Launch Backend API

1. Ensure `appsettings.json` points to the local database:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=127.0.0.1;Port=5433;Database=personalproject;Username=postgres;Password=REDACTED"
  },
  "Jwt": {
    "Key": "a-random-sentece-that-is-32-digits-long",
    "Issuer": "PersonalProject",
    "Audience": "PersonalProject"
  }
}
```

2. Run database migrations and launch the server:
```bash
dotnet run
```
The API starts at:
* **Base URL**: `http://localhost:5000`
* **Interactive API Documentation (Scalar)**: `http://localhost:5000/scalar/v1`

---

### Step 3: Launch Next.js Frontend

1. Navigate to the `fRontEnd` directory and install dependencies:
```bash
cd fRontEnd
npm install
```

2. Verify or create `.env.local`:
```bash
cp .env.example .env.local
```

3. Launch the development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Running the Scraper & Data Ingestion Pipeline

To re-scrape all regional portals, deduplicate against the master registry, and update PostgreSQL:

```bash
# 1. Install scraper dependencies
pip install requests beautifulsoup4 psycopg2-binary

# 2. Run the master aggregation pipeline
python3 scraper/MasterAggregator.py
```

The pipeline will:
1. Trigger all 5 provincial crawlers sequentially.
2. Canonicalize scheme titles, expand acronyms, and drop duplicates across regional borders.
3. Save the clean aggregate dataset to `scraper/all_pakistan_schemes.json` and sync with `fRontEnd/public/data/all_schemes.json`.
4. Connect to PostgreSQL and idempotently upsert all schemes and eligibility categories.

---

## REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/schemes` | Public | List paginated schemes (`?pageNumber=1&pageSize=10`) |
| `GET` | `/api/schemes/{id}` | Public | Retrieve detailed information for a single scheme |
| `GET` | `/api/schemes/search` | Public | Multi-filter search (`textQuery`, `province`, `eligibID`, `activeOnly`, `sortBy`) |
| `POST` | `/api/schemes` | Admin | Create a new scholarship scheme |
| `PUT` | `/api/schemes/{id}` | Admin | Update an existing scholarship scheme |
| `DELETE` | `/api/schemes/{id}` | Admin | Delete a scholarship scheme |
| `GET` | `/api/eligibility` | Public | List standardized educational levels |
| `POST` | `/api/users/register` | Public | Student/user registration |
| `POST` | `/api/users/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/bookmarks` | Authenticated | Retrieve the logged-in user's saved schemes |
| `POST` | `/api/bookmarks/{schemeId}` | Authenticated | Bookmark a scheme |
| `DELETE` | `/api/bookmarks/{schemeId}` | Authenticated | Remove a scheme from bookmarks |

---

## Demo Accounts

For local demonstration and evaluation, the following pre-seeded accounts are available:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Admin** | `admin@schemes.pk` | `admin123` | Full CRUD on schemes, portal management (`/admin`) |
| **Admin (Alt)** | `REDACTED` | `123456` | Full CRUD on schemes, portal management (`/admin`) |
| **Student** | `student@example.com` | `student123` | Bookmarking schemes, personal saved dashboard (`/bookmarks`) |

---

## Project Structure

```text
.
├── Controllers/              # ASP.NET Core REST API controllers
├── Data/                     # EF Core DbContext & seed initializers
├── DTO/                      # Request / response data transfer objects
├── Models/                   # Entity models (Scheme, User, SavedScheme, Eligibility)
├── Services/                 # Business logic (SchemeService, AuthService, BookmarkService)
├── Validators/               # FluentValidation request rules
├── docker-compose.yml        # Docker service definitions (PostgreSQL & Web API)
├── scraper/                  # Python crawler network & MasterAggregator pipeline
│   ├── MasterAggregator.py   # Canonical normalization & DB synchronization
│   ├── hec_scraper.py        # Federal HEC pipeline
│   ├── peef_scraper.py       # Punjab PEEF pipeline
│   ├── sindh_scraper.py      # Sindh SEEF pipeline
│   ├── beef_scraper.py       # Balochistan BEEF pipeline
│   └── kp_scraper.py         # KP HED & KPITB pipeline
└── fRontEnd/                 # Next.js 16 Web Application
    ├── app/                  # App Router pages (/, /browse, /schemes/[id], /admin, /bookmarks)
    ├── components/           # Reusable UI components & dialogs
    ├── lib/                  # API client, auth context, bookmarks context, formatters
    └── public/data/          # Static fallback datasets
```

---

## License
Open-source under the [MIT License](LICENSE). Built for the public benefit of Pakistani students.
