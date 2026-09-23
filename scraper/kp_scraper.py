import requests
import urllib3
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time
import re
from datetime import datetime

# Disable insecure HTTPS warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9"
}

BASE_URL = "https://scholarships.kpitb.online"
INDEX_URL = "https://scholarships.kpitb.online/scholarships"

# Test form inputs or dummy admin slugs to ignore
NOISE_SLUGS = [
    "autocomplete", "textarea", "checkbox-group", "login", "register"
]

def get_kp_scheme_cards():
    """Extracts all unique scholarship cards from the KPITB directory."""
    print(f"[*] Discovering KP scholarships from {INDEX_URL}...")
    try:
        r = requests.get(INDEX_URL, headers=HEADERS, timeout=15, verify=False)
        r.raise_for_status()
    except Exception as e:
        print(f"[!] Error fetching KP portal: {e}")
        return []

    soup = BeautifulSoup(r.text, "html.parser")
    schemes_dict = {}

    for card in soup.find_all("div", class_=lambda c: c and "card" in c):
        h = card.find(["h2", "h3", "h4", "h5"])
        a = card.find("a", href=True)
        if not h or not a:
            continue

        raw_href = a.get("href", "").strip()
        if "/scholarships/" not in raw_href:
            continue

        full_url = urljoin(BASE_URL, raw_href)
        title = h.get_text(separator=" ", strip=True)

        # Skip form builder artifacts
        if any(dummy in full_url.lower() for dummy in NOISE_SLUGS):
            continue

        if len(title) > 3 and full_url not in schemes_dict:
            schemes_dict[full_url] = title

    print(f"[*] Found {len(schemes_dict)} unique KP scholarship schemes.")
    return schemes_dict

def scrape_kp_scheme_details(url: str, title: str):
    """Deep-scrapes a KP scheme detail page for criteria, deadline, and description."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=15, verify=False)
        if r.status_code != 200:
            return {"description": "", "criteria": [], "deadline": "Check Official Portal"}

        soup = BeautifulSoup(r.text, "html.parser")
        
        # 1. Description
        paragraphs = []
        for p in soup.find_all("p"):
            txt = " ".join(p.get_text(separator=" ", strip=True).split())
            if 30 < len(txt) < 500 and not any(k in txt.lower() for k in ["copyright", "navigation", "help"]):
                paragraphs.append(txt)

        description = paragraphs[0] if paragraphs else f"Official financial assistance program for students in Khyber Pakhtunkhwa ({title})."

        # 2. Extract Deadline
        deadline = "Check Official Portal"
        page_text = soup.get_text(separator=" ", strip=True)
        deadline_match = re.search(r"(?:deadline|apply before)[:\s]+([A-Za-z]+\s+[0-9]{1,2},?\s+[0-9]{4}|[0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})", page_text, re.IGNORECASE)
        if deadline_match:
            deadline = deadline_match.group(1).strip()
        if "1947" in deadline:
            deadline = "Open / Check Official Portal"

        # 3. Extract Eligibility / Requirements
        criteria = []
        # Marks percentage check
        marks_match = re.search(r"Minimum\s+([0-9\.]+%)\s+marks\s+required", page_text, re.IGNORECASE)
        if marks_match:
            criteria.append(f"Minimum {marks_match.group(1)} marks required in previous qualifying examination.")

        # Document bullets and list items
        for li in soup.find_all("li"):
            txt = " ".join(li.get_text(separator=" ", strip=True).split())
            if 15 < len(txt) < 150 and not any(k in txt.lower() for k in ["home", "login", "contact", "about"]):
                if txt not in criteria:
                    criteria.append(txt)

        if not criteria:
            criteria.append("Applicants must be bonafide residents/domiciled in Khyber Pakhtunkhwa.")
            criteria.append("Enrolled in an approved public or private educational institution.")

        return {
            "description": description,
            "deadline": deadline,
            "criteria": criteria[:6]
        }

    except Exception as e:
        print(f"    [!] Error scraping {url}: {e}")
        return {"description": "", "criteria": [], "deadline": "Check Official Portal"}

def run_kp_pipeline():
    schemes_dict = get_kp_scheme_cards()
    if not schemes_dict:
        print("[!] No KP schemes found.")
        return

    schemes = []

    # 1. Add CM Free Laptop Distribution Scheme
    schemes.append({
        "title": "Chief Minister's Free Laptop Distribution Scheme (Digital Empowerment)",
        "organization": "Government of Khyber Pakhtunkhwa / KPITB",
        "province": "Khyber Pakhtunkhwa",
        "category": "Digital Empowerment / Merit Award",
        "officialUrl": "https://scholarships.kpitb.online/student/laptop",
        "applicationUrl": "https://scholarships.kpitb.online/student/laptop",
        "deadline": "Open for Current Cycle",
        "description": "Government of Khyber Pakhtunkhwa digital empowerment initiative distributing free brand-new high-spec laptops to meritorious undergraduate and postgraduate students of KP public universities and colleges.",
        "eligibilityCriteria": [
            "Must possess Khyber Pakhtunkhwa domicile.",
            "Enrolled as a regular student in an approved Public Sector University or Government College in KP.",
            "Must have secured high academic merit / CGPA in the preceding academic examinations.",
            "Students studying under self-finance or evening programs may be subject to quota rules."
        ],
        "scrapedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    print(f"[*] Deep scraping {len(schemes_dict)} KP scholarships...\n")
    for idx, (url, title) in enumerate(schemes_dict.items(), start=1):
        print(f"[{idx}/{len(schemes_dict)}] Deep scraping: {title}...")
        details = scrape_kp_scheme_details(url, title)

        schemes.append({
            "title": title,
            "organization": "Higher Education Department KP / KPITB",
            "province": "Khyber Pakhtunkhwa",
            "category": "Provincial / Merit & Need-Based",
            "officialUrl": url,
            "applicationUrl": url,
            "deadline": details["deadline"],
            "description": details["description"],
            "eligibilityCriteria": details["criteria"],
            "scrapedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        time.sleep(0.5)

    output_file = "kp_complete_schemes.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)

    print(f"\n[✓] Successfully collected {len(schemes)} enriched KP schemes into '{output_file}'!")

if __name__ == "__main__":
    run_kp_pipeline()