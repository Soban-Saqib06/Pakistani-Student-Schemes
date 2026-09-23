import json
import re
import os
from datetime import datetime

DATASET_FILES = [
    # Order matters: Authoritative primary portals come first!
    ("Punjab (PEEF)", "peef_complete_schemes.json", "Punjab"),
    ("Federal / National (HEC)", "hec_complete_schemes.json", "Federal / National"),
    ("Sindh (SEEF/SEF)", "sindh_complete_schemes.json", "Sindh"),
    ("Balochistan (BEEF)", "beef_complete_schemes.json", "Balochistan"),
    ("Khyber Pakhtunkhwa (KP)", "kp_complete_schemes.json", "Khyber Pakhtunkhwa")
]

def normalize_title(title: str) -> str:
    """Creates a fingerprint of a title for deduplication."""
    t = title.lower()
    # Remove filler words
    for word in ["scholarships", "scholarship", "program", "programme", "scheme", "the", "for", "students", "of"]:
        t = re.sub(rf"\b{word}\b", "", t)
    # Remove punctuation & extra whitespace
    t = re.sub(r"[^\w\s]", "", t)
    return " ".join(t.split())

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text).strip("-")
    return text[:60]

def infer_education_level(title: str, description: str, criteria: list) -> str:
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
    if not deadline_str:
        return "Open / Check Official Portal"
    d = deadline_str.strip()
    if "1947" in d or "check official" in d.lower():
        return "Open / Check Official Portal"
    return d

def clean_criteria(criteria_list: list) -> list:
    cleaned = []
    seen = set()
    for c in criteria_list:
        text = " ".join(c.strip().split())
        if len(text) < 15 or "1947" in text:
            continue
        lower_t = text.lower()
        if lower_t not in seen:
            seen.add(lower_t)
            cleaned.append(text)
    return cleaned

def is_duplicate(candidate_norm_title, candidate_url, existing_schemes) -> bool:
    """Checks if scheme is already represented by an authoritative entry."""
    for s in existing_schemes:
        # 1. Exact URL match
        if candidate_url and s["officialUrl"] == candidate_url:
            return True
            
        # 2. Normalized Title exact match
        existing_norm = normalize_title(s["title"])
        if candidate_norm_title == existing_norm:
            return True

        # 3. High substring overlap in title
        if len(candidate_norm_title) > 8 and len(existing_norm) > 8:
            if candidate_norm_title in existing_norm or existing_norm in candidate_norm_title:
                # If they also share the same province or one is Federal/HEC
                if s["province"] == "Federal / National" or "hec" in candidate_norm_title or "beef" in candidate_norm_title:
                    return True
                    
    return False

def run_master_aggregation():
    print("=" * 60)
    print("TaleemHub Pakistan - Deduplicated Master Scheme Aggregator")
    print("=" * 60 + "\n")

    master_list = []
    seen_ids = set()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    stats = {}

    for region_name, filename, default_province in DATASET_FILES:
        filepath = os.path.join(script_dir, filename)
        if not os.path.exists(filepath):
            print(f"[!] File not found: {filename}, skipping.")
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            schemes = json.load(f)

        added_count = 0
        skipped_duplicates = 0

        for item in schemes:
            raw_title = item.get("title", "").strip()
            if not raw_title or raw_title.lower() in ["click here", "read more"]:
                continue

            official_url = item.get("officialUrl", "").strip()
            norm_title = normalize_title(raw_title)

            # Check for duplicate
            if is_duplicate(norm_title, official_url, master_list):
                skipped_duplicates += 1
                continue

            base_id = slugify(raw_title)
            scheme_id = base_id
            counter = 1
            while scheme_id in seen_ids:
                scheme_id = f"{base_id}-{counter}"
                counter += 1
            seen_ids.add(scheme_id)

            description = item.get("description", "").strip()
            if not description:
                description = f"Educational scholarship opportunity offered by {item.get('organization', 'Government of Pakistan')}."

            criteria = clean_criteria(item.get("eligibilityCriteria", []))
            level = infer_education_level(raw_title, description, criteria)
            deadline = clean_deadline(item.get("deadline", ""))

            # Fix province if secondary portal misattributed it
            province = item.get("province", default_province)
            if "punjab" in raw_title.lower() and "hec" not in raw_title.lower():
                province = "Punjab"
            elif "balochistan" in raw_title.lower() and "hec" not in raw_title.lower() and default_province != "Federal / National":
                province = "Balochistan"

            standardized_scheme = {
                "id": scheme_id,
                "title": raw_title,
                "organization": item.get("organization", "Government of Pakistan"),
                "province": province,
                "educationLevel": level,
                "category": item.get("category", "Merit & Need-Based"),
                "deadline": deadline,
                "officialUrl": official_url,
                "applicationUrl": item.get("applicationUrl", official_url),
                "description": description,
                "eligibilityCriteria": criteria,
                "status": "Closed" if "closed" in description.lower() else "Open / Active",
                "lastUpdated": datetime.now().strftime("%Y-%m-%d")
            }

            master_list.append(standardized_scheme)
            added_count += 1

        stats[region_name] = {"added": added_count, "duplicates_removed": skipped_duplicates}
        print(f"[✓] {region_name:24}: Added {added_count:2d} schemes (Filtered {skipped_duplicates:2d} duplicates)")

    # Save to all_pakistan_schemes.json
    output_path = os.path.join(script_dir, "all_pakistan_schemes.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(master_list, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 60)
    print(f"[✓] Total Unique Schemes: {len(master_list)}")
    print("=" * 60)

    # Sync to frontend data folder
    project_root = os.path.dirname(script_dir)
    target_dirs = [
        os.path.join(project_root, "data"),
        os.path.join(project_root, "public", "data")
    ]
    for d in target_dirs:
        if os.path.exists(d):
            dest = os.path.join(d, "all_schemes.json")
            with open(dest, "w", encoding="utf-8") as f:
                json.dump(master_list, f, indent=2, ensure_ascii=False)
            print(f"[✓] Live synced to: {dest}")

if __name__ == "__main__":
    run_master_aggregation()