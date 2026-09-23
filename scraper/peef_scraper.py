import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9"
}
NOISE_KEYWORDS = {
    "success-stories",
    "success stories",
    "monitoring-update",
    "monitoring & evaluation",
    "scholarship-update",
    "m & e update",
    "gallery",
    "tender",
    "news"    
}

def is_valid_scholarship(item:dict) -> bool:
    """returns true if the item is a scholarship"""
    title_lower = item.get("title", "").lower()
    url_lower = item.get("officialUrl","").lower()

    if any(keyword in title_lower or keyword in url_lower for keyword in NOISE_KEYWORDS):
        return False

    return True


def extract_details(url: str):
    """Visits scheme links to extract specfic info"""
    try:
        r = requests.get(url,headers= HEADERS, timeout= 15, verify= False)
        if r.status_code != 200:
            return {"description": "", "criteria": []}
        soup = BeautifulSoup(r.text,"html.parser")

        main_content = (
            soup.find("div", class_ ="region-content") or
            soup.find("div", id = "block-system-main") or
            soup.find("article") or 
            soup.find("body")
        )

        bullets = []
        if main_content:
            for li in main_content.find_all("li"):
                text = li.text.strip()

                if len(text) > 15 and not any(nav in text.lower() for nav in ["home","about us","contact"]):
                    bullets.append(text)

            paragraphs = []
            for elem in main_content.find_all(["p", "div"]):
                # Look for div with class field-item or plain p
                classes = elem.get("class", [])
                if elem.name == "p" or "field-item" in classes:
                    t = elem.text.strip()
                    # Only take paragraphs that look like descriptive text
                    if 40 < len(t) < 500 and not any(t.startswith(b) for b in bullets):
                        paragraphs.append(t)

            return {
            "description": paragraphs[0] if paragraphs else "Detailed guidelines available on PEEF official portal.",
            "criteria": bullets[:6]
        }
    except Exception as e:
        print(f"[!] Error extracting details: {e}")
        return {"description": "", "criteria": []}

def run_pipeline():
    try:
        with open("peef_schemes.json","r",encoding="utf-8") as f:
            schemes = json.load(f)
    except FileNotFoundError:
        print(f"[!] peef_schemes.json not found! Run the scraper first.")
        return

    print(f"[*] Starting Deep Scraping Pipeline for {len(schemes)} schemes\n")

    enriched_schemes = []

    for idx,item in enumerate(schemes,start =1):
        if not is_valid_scholarship(item):
            print(f"[{idx}/{len(schemes)}] Skipping non-scholarship page: {item['title']}")
            continue
        print(f"[{idx}/{len(schemes)}] Processing: {item["title"]}")
        url = item["officialUrl"]

        if any(skip in url for skip in ["success-stories," "monitoring-update","scholarship-update"]):
            print("-> Skipping non-scholarship informational page.")
            continue

        print(f"-> Crawling {url} ....")
        details = extract_details(url)

        item["description"] = details["description"]
        item["eligibilityCriteria"] = details["criteria"]
        
        enriched_schemes.append(item)
        print(f"-> Extracted {len(details['criteria'])} eligibility criteria rules.")

        time.sleep(1)

    output_filename = "peef_complete_schemes.json"
    with open(output_filename, "w",encoding="utf-8") as f:
        json.dump(enriched_schemes,f,indent=2,ensure_ascii=False)

    print(f"\n[#] Pipeline Complete. Saved {len(enriched_schemes)} enriched scheems to {output_filename}")

if __name__ == "__main__":
    run_pipeline()