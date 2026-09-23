import requests
import urllib3
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time

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

# Non-scholarship titles or URLs to ignore
HEC_NOISE_KEYWORDS = [
    "alumni gateway",
    "approved phd supervisors",
    "guideline for country wise",
    "gallery.aspx",
    "objective.aspx",
    "contactus.aspx"
]

BREADCRUMB_OR_NAV_PHRASES = [
    "hec english",
    "english scholarships",
    "currently selected",
    "sign in",
    "quick links",
    "turn on more accessible mode",
    "click here",
    "download the",
    "faqs",
    "frequently asked questions",
    "scholarship award process",
    "test content weightages",
    "list of foreign universities",
    "list of participating universities",
    "list of qs ranked",
    "agreement documents"
]

def is_valid_hec_scheme(item: dict) -> bool:
    """Returns True if the entry is an actual scholarship scheme."""
    title_lower = item.get("title", "").lower()
    url_lower = item.get("officialUrl", "").lower()

    if any(noise in title_lower or noise in url_lower for noise in HEC_NOISE_KEYWORDS):
        return False
    return True

def is_noise_bullet(text: str, title: str) -> bool:
    t_lower = text.lower().strip()
    title_lower = title.lower().strip()

    # Skip exact title or title + "eligibility criteria"
    if t_lower == title_lower or t_lower == f"{title_lower} eligibility criteria":
        return True

    # Skip breadcrumbs and site menu links
    if any(phrase in t_lower for phrase in BREADCRUMB_OR_NAV_PHRASES):
        return True

    return False

def extract_clean_bullets(soup: BeautifulSoup, title: str = "") -> list:
    """Extracts valid criteria bullets from the main content container while filtering out navigation noise."""
    bullets = []
    
    # Try finding the specific main content area to avoid outer SharePoint nav
    container = (
        soup.find("div", class_="ms-rtestate-field") or
        soup.find("div", id="DeltaPlaceHolderMain") or
        soup.find("div", class_="region-content") or
        soup
    )
    
    for tag in container.find_all(["li", "p"]):
        # Prevent duplicate nested text if tag contains a sublist
        if tag.find(["ul", "ol"]):
            continue
            
        text = tag.get_text(separator=" ", strip=True)
        
        # Must be long enough to be an informative bullet
        if len(text) < 30:
            continue
            
        if is_noise_bullet(text, title):
            continue
            
        clean_text = " ".join(text.split())
        
        if clean_text not in bullets:
            bullets.append(clean_text)
            
    return bullets

def scrape_hec_details(default_url: str, title: str = ""):
    """
    Crawls the main page for description and follows any Eligibility sub-page.
    """
    try:
        r = requests.get(default_url, headers=HEADERS, timeout=15, verify=False)
        if r.status_code != 200:
            return {"description": "", "criteria": []}
            
        soup = BeautifulSoup(r.text, "html.parser")
        
        # 1. Extract Description
        paragraphs = []
        for p in soup.find_all("p"):
            t = " ".join(p.get_text(separator=" ", strip=True).split())
            if 40 < len(t) < 600 and not is_noise_bullet(t, title):
                paragraphs.append(t)
                
        description = paragraphs[0] if paragraphs else "Details available on HEC official portal."
        
        # 2. Check for Eligibility Criteria sub-page
        eligibility_url = None
        for a in soup.find_all("a", href=True):
            link_text = a.get_text(strip=True).lower()
            href = a["href"].lower()
            if "eligibility" in link_text or "criteria" in link_text or "eligibility" in href:
                eligibility_url = urljoin(default_url, a["href"])
                break

        criteria = []
        if eligibility_url and eligibility_url != default_url:
            time.sleep(0.5)
            r_elig = requests.get(eligibility_url, headers=HEADERS, timeout=15, verify=False)
            if r_elig.status_code == 200:
                soup_elig = BeautifulSoup(r_elig.text, "html.parser")
                criteria = extract_clean_bullets(soup_elig, title)
                
        # Fallback to default page if no dedicated criteria page exists
        if not criteria:
            criteria = extract_clean_bullets(soup, title)

        return {
            "description": description,
            "criteria": criteria[:6]  # Clean top 6 bullets
        }
        
    except Exception as e:
        print(f"    [!] Error scraping {default_url}: {e}")
        return {"description": "", "criteria": []}

def run_hec_pipeline():
    try:
        with open("hec_schemes.json", "r", encoding="utf-8") as f:
            schemes = json.load(f)
    except FileNotFoundError:
        print("[!] hec_schemes.json not found! Run hec_scraper.py first.")
        return

    print(f"[*] Starting HEC Deep Scraping Pipeline for {len(schemes)} items...\n")
    
    enriched_schemes = []
    
    for idx, item in enumerate(schemes, start=1):
        title = item["title"]
        url = item["officialUrl"]
        
        if not is_valid_hec_scheme(item):
            print(f"[{idx}/{len(schemes)}] Skipping non-scholarship: {title}")
            continue
            
        print(f"[{idx}/{len(schemes)}] Deep scraping: {title}...")
        details = scrape_hec_details(url, title)
        
        item["description"] = details["description"]
        item["eligibilityCriteria"] = details["criteria"]
        
        enriched_schemes.append(item)
        time.sleep(1)
        
    output_file = "hec_complete_schemes.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(enriched_schemes, f, indent=2, ensure_ascii=False)
        
    print(f"\n[✓] Pipeline complete! Saved {len(enriched_schemes)} enriched HEC schemes to '{output_file}'.")

if __name__ == "__main__":
    run_hec_pipeline()