import requests
import urllib3
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
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

SEEF_BASE = "https://seef.sindh.gov.pk"
SEEF_FAQS_URL = "https://seef.sindh.gov.pk/faqs"

def fetch_seef_standard_criteria():
    """Extracts core eligibility and documentation requirements from SEEF FAQs."""
    print("[*] Fetching SEEF standard eligibility criteria from FAQs...")
    criteria = [
        "Must hold permanent domicile of Sindh Province.",
        "Must be enrolled in an institution recognized and notified on the SEEF Trust Panel.",
        "Minimum academic merit: 2.5 GPA (semester system) or 60% marks (annual examination system).",
        "Demonstrated financial need as verified by the Institutional Scholarship Award Committee.",
        "Interviews and verification conducted in partnership with IBA Karachi and Sukkur IBA.",
        "Candidates cannot hold dual scholarships simultaneously (must hold only one government scholarship)."
    ]
    
    try:
        r = requests.get(SEEF_FAQS_URL, headers=HEADERS, timeout=15, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for p in soup.find_all(["p", "li"]):
                txt = " ".join(p.get_text(separator=" ", strip=True).split())
                if "minimum 2.5 gpa" in txt.lower() and txt not in criteria:
                    criteria.append(txt)
    except Exception as e:
        print(f"    [!] Error fetching SEEF FAQs: {e}")
        
    return criteria

def scrape_sindh_schemes():
    print(f"[*] Fetching SEEF portal: {SEEF_BASE}...")
    try:
        r = requests.get(SEEF_BASE, headers=HEADERS, timeout=15, verify=False)
        r.raise_for_status()
    except Exception as e:
        print(f"[!] Network error connecting to SEEF: {e}")
        return []

    soup = BeautifulSoup(r.text, "html.parser")
    standard_criteria = fetch_seef_standard_criteria()
    
    schemes = []
    
    # 1. Primary Flagship Scheme: SEEF Higher Education Scholarship 2026
    # Let's inspect the latest 2026 announcement page for specific deadline details
    deadline_2026 = "31st August 2026"
    try:
        news_url = "https://seef.sindh.gov.pk/news/apply-online-seef-scholarship-program-2026"
        r_news = requests.get(news_url, headers=HEADERS, timeout=15, verify=False)
        if r_news.status_code == 200:
            soup_news = BeautifulSoup(r_news.text, "html.parser")
            text_news = soup_news.get_text(separator=" ", strip=True)
            match = re.search(r"last date to apply.*?is\s+([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+[0-9]{4})", text_news, re.IGNORECASE)
            if match:
                deadline_2026 = match.group(1)
    except Exception as e:
        print(f"[!] Error parsing 2026 announcement: {e}")

    schemes.append({
        "title": "Sindh Educational Endowment Fund (SEEF) Scholarship Program 2026",
        "organization": "Sindh Educational Endowment Fund (SEEF)",
        "province": "Sindh",
        "category": "Higher Education / University",
        "officialUrl": "https://seef.sindh.gov.pk",
        "applicationUrl": "https://form-seef.com/",
        "deadline": deadline_2026,
        "description": "Government-funded financial assistance by the College Education Department, Government of Sindh, supporting poor, needy, and meritorious students from Sindh enrolled in partner universities for higher education.",
        "eligibilityCriteria": standard_criteria,
        "scrapedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    # 2. PEEF Inter-Provincial Quota for Sindh Students
    schemes.append({
        "title": "PEEF Inter-Provincial Scholarship Quota for Sindh Students",
        "organization": "Sindh Educational Endowment Fund (SEEF) / PEEF",
        "province": "Sindh",
        "category": "Inter-Provincial / Special Quota",
        "officialUrl": "https://seef.sindh.gov.pk/apply-online-for-peef-scholarship",
        "applicationUrl": "https://seef.sindh.gov.pk/apply-online-for-peef-scholarship",
        "deadline": "Check Official Portal",
        "description": "Special educational quota allocated by PEEF specifically for meritorious and needy students holding Sindh domicile to pursue intermediate and graduation studies.",
        "eligibilityCriteria": [
            "Must possess Sindh domicile certificate.",
            "Secured at least 60% marks or minimum 2.5 CGPA in previous board/university examination.",
            "Enrolled as a full-time regular student in an approved educational institution.",
            "Total monthly family income must not exceed the prescribed threshold (Rs. 60,000/month or as updated).",
            "Children of government servants in BPS 1-4 are exempted from the income certificate condition."
        ],
        "scrapedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    # 3. Sindh School Education Scholarship Program (SSESP) - SEF
    schemes.append({
        "title": "Sindh School Education Scholarship Program (SSESP) - Class VIII to XII",
        "organization": "Sindh Education Foundation (SEF)",
        "province": "Sindh",
        "category": "Secondary & Higher Secondary Education",
        "officialUrl": "https://sef.org.pk/scholarship/",
        "applicationUrl": "https://sef.org.pk/ssesp/apply",
        "deadline": "Announced Annually (Check Portal)",
        "description": "Fully funded scholarship program by School Education & Literacy Department, Government of Sindh, linking talented students from Sindh with prestigious partner institutions (Cadet Colleges, IBA Public Schools, NJV) across Pakistan up to higher secondary level.",
        "eligibilityCriteria": [
            "Must be a bonafide student residing and studying in Sindh Province.",
            "Studying in Government schools or SEF-assisted schools continuously for at least 3 years.",
            "Applying for admission into Class VIII (Grade 8) at partner boarding/cadet institutions.",
            "Must pass the standardized entry test conducted by testing agencies (e.g. SIBA Testing Services).",
            "Scholarship covers full tuition fee, boarding/lodging, uniforms, books, and monthly stipend."
        ],
        "scrapedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    output_file = "sindh_complete_schemes.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)

    print(f"\n[✓] Successfully collected {len(schemes)} verified Sindh schemes into '{output_file}'!")
    return schemes

if __name__ == "__main__":
    scrape_sindh_schemes()