import json
import re
import os
from datetime import datetime, timezone, timedelta

DATASET_FILES = {
    "Punjab (PEEF)": "peef_complete_schemes.json",
    "Federal / National (HEC)": "hec_complete_schemes.json",
    "Sindh (SEEF/SEF)": "sindh_complete_schemes.json",
    "Balochistan (BEEF)": "beef_complete_schemes.json",
    "Khyber Pakhtunkhwa (KP)": "kp_complete_schemes.json"
}

ACRONYM_MAP = {
    "kpef": "khyber pakhtunkhwa education foundation",
    "cmeef": "chief minister education endowment fund",
    "pbm": "pakistan bait ul mal",
    "beef": "balochistan education endowment fund",
    "peef": "punjab educational endowment fund",
    "seef": "sindh educational endowment fund"
}

def slugify(text: str) -> str:
    """Converts title to a clean URL-friendly ID."""
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text).strip("-")
    return text[:80]

def get_subcat_qualifier(title: str) -> str:
    """
    Extracts discriminators in parentheses like (Middle), (Matric), (Outreach), (Special Quota), (Batch-II),
    while ignoring redundant acronyms like (CMEEF), (KPEF), (BEEF), etc.
    """
    m = re.search(r"\((.*?)\)", title)
    if m:
        content = m.group(1).lower().strip()
        if content not in ["cmeef", "kpef", "beef", "pbm", "hec", "peef", "sef", "seef"]:
            return f" [{content}]"
    return ""

def generate_canonical_key(title: str) -> str:
    """
    Creates a semantic fingerprint for deduplicating identical or re-posted schemes.
    """
    t = title.lower()
    # Strip redundant parenthetical acronyms
    t = re.sub(r"\(cmeef\)|\(kpef\)|\(beef\)|\(pbm\)|\(hec\)|\(peef\)", " ", t)

    # Unify common variations & spellings
    t = re.sub(r"\bbased\b", "base", t)
    t = re.sub(r"\bhonhar\b|\bhohahaar\b", "honhaar", t)
    t = re.sub(r"\bkyber\b|\bpaktunkhwa\b", "khyber pakhtunkhwa", t)
    t = re.sub(r"\bprogrammes\b|\bprogramme\b|\bprograms\b", "program", t)
    t = re.sub(r"\bscholarships\b", "scholarship", t)
    t = re.sub(r"\bschemes\b", "scheme", t)
    t = re.sub(r"\bcm\b", "chief minister", t)

    # Acronym word expansion
    words = []
    for w in t.split():
        if w in ACRONYM_MAP:
            words.extend(ACRONYM_MAP[w].split())
        else:
            words.append(w)

    t = " ".join(words)

    # Special unified programs
    if "honhaar" in t:
        return "honhaar scholarship"
    if "benevolent" in t:
        return "benevolent scholarship"

    t = re.sub(r"[^\w\s]", " ", t)
    stop_words = {
        "scholarship", "scheme", "program", "the", "for", "of", "and", "in",
        "to", "at", "students", "student", "pakistan", "s"
    }
    tokens = [w for w in t.split() if w not in stop_words and len(w) > 1]
    base = " ".join(dict.fromkeys(tokens))
    return base + get_subcat_qualifier(title)

def infer_education_level(title: str, description: str, criteria: list) -> str:
    """Classifies scheme into standard TaleemHub educational level."""
    full_text = f"{title} {description} {' '.join(criteria)}".lower()

    if any(k in full_text for k in ["phd", "ph.d", "doctoral", "post doctoral", "postdoc"]):
        return "PhD / Doctoral"
    if any(k in full_text for k in ["ms", "mphil", "m.phil", "master", "postgraduate"]):
        return "Postgraduate / Master"
    if any(k in full_text for k in ["undergraduate", "bachelor", "bs ", "bs-", "b.s", "mbbs", "bds", "bems", "dpt"]):
        return "Undergraduate / BS"
    if any(k in full_text for k in ["intermediate", "hssc", "fsc", "f.sc", "fa", "f.a", "dae", "college"]):
        return "Intermediate / College"
    if any(k in full_text for k in ["matric", "ssc", "class viii", "grade 8", "primary", "middle", "school"]):
        return "School / Secondary"
    
    return "All Levels / General"

def clean_deadline(deadline_str: str) -> str:
    """Fixes dummy dates like 1947 and standardizes formatting."""
    if not deadline_str:
        return "Open / Check Official Portal"
    
    d = deadline_str.strip()
    if "1947" in d or "check official" in d.lower():
        return "Open / Check Official Portal"
    
    return d

def clean_criteria(criteria_list: list) -> list:
    """Removes duplicates and empty items from eligibility rules."""
    cleaned = []
    seen = set()
    for c in criteria_list:
        text = " ".join(c.strip().split())
        # Skip dummy dates, empty strings, or very short lines
        if len(text) < 15 or "1947" in text:
            continue
        lower_t = text.lower()
        if lower_t not in seen:
            seen.add(lower_t)
            cleaned.append(text)
    return cleaned

def choose_better_title(t1: str, t2: str) -> str:
    """Picks the cleaner, more descriptive title between two duplicates."""
    # Fix known spelling mistakes
    if "kyber" in t1.lower() and "khyber" in t2.lower():
        return t2
    if "kyber" in t2.lower() and "khyber" in t1.lower():
        return t1
    # Prefer title with full descriptive name over terse acronym
    if len(t2) > len(t1) and ("scholarship" in t2.lower() or "foundation" in t2.lower()):
        return t2
    return t1

def parse_db_connection(project_root: str) -> dict:
    """Reads connection string from appsettings.Development.json or appsettings.json."""
    for cfg_name in ["appsettings.Development.json", "appsettings.json"]:
        cfg_path = os.path.join(project_root, cfg_name)
        if os.path.exists(cfg_path):
            try:
                with open(cfg_path, "r", encoding="utf-8") as f:
                    cfg = json.load(f)
                conn_str = cfg.get("ConnectionStrings", {}).get("DefaultConnection", "")
                if conn_str:
                    parts = {}
                    for item in conn_str.split(";"):
                        if "=" in item:
                            k, v = item.split("=", 1)
                            parts[k.strip().lower()] = v.strip()
                    return {
                        "host": parts.get("host", "127.0.0.1"),
                        "port": int(parts.get("port", 5433)),
                        "dbname": parts.get("database", "personalproject"),
                        "user": parts.get("username", "postgres"),
                        "password": parts.get("password", "REDACTED")
                    }
            except Exception:
                pass
    return {
        "host": "127.0.0.1",
        "port": 5433,
        "dbname": "personalproject",
        "user": "postgres",
        "password": "REDACTED"
    }

def sync_to_database(master_list: list, project_root: str):
    """Upserts aggregated schemes directly into the PostgreSQL database."""
    print("\n" + "=" * 65)
    print(" PostgreSQL Database Synchronization Hook")
    print("=" * 65)

    try:
        import psycopg2
        from dateutil import parser as date_parser
    except ImportError as e:
        print(f"[!] Warning: Missing database dependencies ({e}).")
        print("    Run 'pip install psycopg2-binary python-dateutil' to enable DB sync.")
        return

    conn_params = parse_db_connection(project_root)
    try:
        conn = psycopg2.connect(**conn_params, connect_timeout=5)
        cur = conn.cursor()
    except Exception as e:
        print(f"[!] Warning: Could not connect to PostgreSQL ({conn_params['host']}:{conn_params['port']}): {e}")
        print("    Make sure PostgreSQL container is running: sudo docker compose up -d db")
        return

    try:
        # 1. Ensure Standard Eligibilities exist in PostgreSQL
        STANDARD_ELIGIBILITIES = [
            "Undergraduate",
            "Postgraduate",
            "PhD / Doctoral",
            "Intermediate / College",
            "School / Secondary",
            "All Levels / General"
        ]
        cur.execute('SELECT "Id", LOWER("Name") FROM "Eligibilities";')
        elig_map = {name: id_ for id_, name in cur.fetchall()}

        for name in STANDARD_ELIGIBILITIES:
            if name.lower() not in elig_map:
                cur.execute('INSERT INTO "Eligibilities" ("Name") VALUES (%s) RETURNING "Id";', (name,))
                new_id = cur.fetchone()[0]
                elig_map[name.lower()] = new_id

        def map_eligibility_id(level_str: str) -> int:
            lvl = level_str.lower()
            if "phd" in lvl or "doc" in lvl:
                return elig_map.get("phd / doctoral", 3)
            if "post" in lvl or "master" in lvl or "mphil" in lvl:
                return elig_map.get("postgraduate", 2)
            if "under" in lvl or "bs" in lvl or "bachelor" in lvl:
                return elig_map.get("undergraduate", 1)
            if "inter" in lvl or "college" in lvl or "hssc" in lvl:
                return elig_map.get("intermediate / college", 4)
            if "school" in lvl or "matric" in lvl or "second" in lvl:
                return elig_map.get("school / secondary", 5)
            return elig_map.get("all levels / general", 6)

        # 2. Fetch existing schemes to perform clean Upsert
        cur.execute('SELECT "Id", LOWER("Title") FROM "Schemes";')
        existing_schemes = {title.strip(): id_ for id_, title in cur.fetchall()}

        inserted_count = 0
        updated_count = 0

        for item in master_list:
            raw_title = item["title"].strip()
            eligibility_id = map_eligibility_id(item.get("educationLevel", ""))

            # Format comprehensive description with criteria bullets
            desc_parts = [item.get("description", "").strip()]
            criteria = item.get("eligibilityCriteria", [])
            if criteria:
                desc_parts.append("\nEligibility Criteria:\n" + "\n".join(f"• {c}" for c in criteria))
            if item.get("category"):
                desc_parts.append(f"\nCategory: {item['category']}")
            if item.get("officialUrl") and item.get("officialUrl") != item.get("applicationUrl"):
                desc_parts.append(f"\nOfficial Portal: {item['officialUrl']}")
            full_desc = "\n".join(desc_parts)

            # Parse deadline to timestamp with time zone
            dl_str = item.get("deadline", "")
            clean_dl = re.sub(r"(\d+)(st|nd|rd|th)", r"\1", dl_str)
            try:
                deadline_dt = date_parser.parse(clean_dl, fuzzy=True).replace(tzinfo=timezone.utc)
            except Exception:
                # No assumed deadline; rolling/unspecified schemes remain null
                deadline_dt = None

            apply_url = item.get("applicationUrl") or item.get("officialUrl") or ""
            organization = item.get("organization", "Government of Pakistan")
            province = item.get("province", "Federal / National")

            title_key = raw_title.lower()
            if title_key in existing_schemes:
                scheme_id = existing_schemes[title_key]
                cur.execute(
                    '''
                    UPDATE "Schemes"
                    SET "Description" = %s,
                        "Deadline" = %s,
                        "EligibilityId" = %s,
                        "ApplyUrl" = %s,
                        "Organization" = %s,
                        "Province" = %s
                    WHERE "Id" = %s;
                    ''',
                    (full_desc, deadline_dt, eligibility_id, apply_url, organization, province, scheme_id)
                )
                updated_count += 1
            else:
                cur.execute(
                    '''
                    INSERT INTO "Schemes" ("Title", "Description", "Deadline", "EligibilityId", "ApplyUrl", "Organization", "Province")
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                    ''',
                    (raw_title, full_desc, deadline_dt, eligibility_id, apply_url, organization, province)
                )
                inserted_count += 1

        conn.commit()
        print(f"[✓] Database Sync Successful!")
        print(f"  • Inserted : {inserted_count:2d} new schemes")
        print(f"  • Updated  : {updated_count:2d} existing schemes")
        print(f"  • Total DB : {len(existing_schemes) + inserted_count} active schemes in PostgreSQL")
        print("=" * 65)

    except Exception as e:
        conn.rollback()
        print(f"[!] Database sync transaction error: {e}")
    finally:
        cur.close()
        conn.close()

def run_master_aggregation():
    print("=" * 65)
    print(" TaleemHub Pakistan - Master Scheme Aggregator Pipeline")
    print("=" * 65 + "\n")

    scheme_registry = {}  # canonical_key -> scheme_dict
    duplicates_dropped = []
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    for region, filename in DATASET_FILES.items():
        filepath = os.path.join(script_dir, filename)
        if not os.path.exists(filepath):
            print(f"[!] Warning: {filename} not found! Skipping {region}.")
            continue

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                schemes = json.load(f)
        except Exception as e:
            print(f"[!] Error reading {filename}: {e}")
            continue

        for item in schemes:
            raw_title = item.get("title", "").strip()
            if not raw_title or raw_title.lower() in ["click here", "read more"]:
                continue

            canonical_key = generate_canonical_key(raw_title)

            # Special case: Drop aggregate BEEF stub from KP portal since authoritative BEEF dataset is loaded
            if "kp" in filename and "balochistan education endowment fund" in canonical_key:
                duplicates_dropped.append({
                    "title": raw_title,
                    "region": region,
                    "reason": "Authoritative Balochistan (BEEF) dataset already loaded"
                })
                continue

            # Standardize attributes
            description = item.get("description", "").strip()
            if not description or "1947" in description:
                description = f"Official educational scholarship and financial assistance opportunity offered by {item.get('organization', 'Government of Pakistan')}."

            criteria = clean_criteria(item.get("eligibilityCriteria", []))
            level = infer_education_level(raw_title, description, criteria)
            deadline = clean_deadline(item.get("deadline", ""))

            province = item.get("province", region.split(" ")[0])
            organization = item.get("organization", "Government of Pakistan")
            official_url = item.get("officialUrl", "")
            application_url = item.get("applicationUrl", official_url)

            # Special correction for Punjab's Honhaar scholarship
            if "honhaar" in canonical_key:
                province = "Punjab"
                organization = "Government of the Punjab / Higher Education Department"
                application_url = "https://honhaarscholarship.punjabhec.gov.pk"
                official_url = "https://honhaarscholarship.punjabhec.gov.pk"
                deadline = "October 26, 2025"

            scheme_obj = {
                "title": raw_title,
                "organization": organization,
                "province": province,
                "educationLevel": level,
                "category": item.get("category", "Merit & Need-Based"),
                "deadline": deadline,
                "officialUrl": official_url,
                "applicationUrl": application_url,
                "description": description,
                "eligibilityCriteria": criteria,
                "status": "Closed" if ("closed" in description.lower() or "honhaar" in canonical_key) else "Open / Active",
                "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
                "_source": filename,
                "_region": region
            }

            # Check for duplicate
            if canonical_key in scheme_registry:
                existing = scheme_registry[canonical_key]
                duplicates_dropped.append({
                    "title": raw_title,
                    "region": region,
                    "reason": f"Merged into \"{existing['title']}\" ({existing['_region']})"
                })

                # Merge and upgrade to richest data
                existing["title"] = choose_better_title(existing["title"], raw_title)

                # Upgrade description if existing is a placeholder or shorter
                if ("1947" in existing["description"] or len(existing["description"]) < 40) and len(description) > len(existing["description"]):
                    existing["description"] = description

                # Merge criteria
                combined_criteria = existing["eligibilityCriteria"] + criteria
                existing["eligibilityCriteria"] = clean_criteria(combined_criteria)

                # Upgrade deadline if existing was dummy
                if existing["deadline"] == "Open / Check Official Portal" and deadline != "Open / Check Official Portal":
                    existing["deadline"] = deadline

                # Upgrade application URL if missing
                if not existing.get("applicationUrl") and application_url:
                    existing["applicationUrl"] = application_url
            else:
                scheme_registry[canonical_key] = scheme_obj

    # Build finalized master list with unique slugs
    master_list = []
    seen_ids = set()
    stats = {}

    for canonical_key, item in scheme_registry.items():
        base_id = slugify(item["title"])
        scheme_id = base_id
        counter = 1
        while scheme_id in seen_ids:
            scheme_id = f"{base_id}-{counter}"
            counter += 1
        seen_ids.add(scheme_id)

        clean_item = {
            "id": scheme_id,
            "title": item["title"],
            "organization": item["organization"],
            "province": item["province"],
            "educationLevel": item["educationLevel"],
            "category": item["category"],
            "deadline": item["deadline"],
            "officialUrl": item["officialUrl"],
            "applicationUrl": item["applicationUrl"],
            "description": item["description"],
            "eligibilityCriteria": item["eligibilityCriteria"],
            "status": item["status"],
            "lastUpdated": item["lastUpdated"]
        }
        master_list.append(clean_item)

        prov = clean_item["province"]
        stats[prov] = stats.get(prov, 0) + 1

    # 1. Output to scraper/all_pakistan_schemes.json
    output_path = os.path.join(script_dir, "all_pakistan_schemes.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(master_list, f, indent=2, ensure_ascii=False)

    print("--- DEDUPLICATION & MERGE LOG ---")
    for drop in duplicates_dropped:
        print(f"  • [MERGED/DROPPED] \"{drop['title']}\" ({drop['region']}) -> {drop['reason']}")
    print(f"\nTotal Duplicates Eliminated: {len(duplicates_dropped)}")

    print("\n" + "=" * 65)
    print(f"Master Aggregation Complete: {len(master_list)} verified schemes across Pakistan!")
    for prov, cnt in sorted(stats.items()):
        print(f"  • {prov:25}: {cnt:2d} schemes")
    print(f"\n[✓] Master dataset saved successfully to: {output_path}")
    print("=" * 65)

    # 2. Sync to frontend data locations
    frontend_dir = os.path.join(project_root, "fRontEnd", "public", "data")
    os.makedirs(frontend_dir, exist_ok=True)
    frontend_dest = os.path.join(frontend_dir, "all_schemes.json")
    with open(frontend_dest, "w", encoding="utf-8") as f:
        json.dump(master_list, f, indent=2, ensure_ascii=False)
    print(f"[✓] Synced live copy to frontend at: {frontend_dest}")

    # 3. Synchronize directly into PostgreSQL Database
    sync_to_database(master_list, project_root)

if __name__ == "__main__":
    run_master_aggregation()