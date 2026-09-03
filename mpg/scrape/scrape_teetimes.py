"""
General Chronogolf Tee Times & Prices Scraper

Can scrape tee times and pricing for ANY club / course and date on Chronogolf.

Usage examples:
  # Using a full URL:
  python scrape_teetimes.py --url "https://www.chronogolf.ca/club/tsawwassen-springs-golf?date=2026-09-02"
  
  # Or course slug and date:
  python scrape_teetimes.py --course tsawwassen-springs-golf --date 2026-09-02

  # Default (Tsawwassen Springs Golf, today or current target date):
  python scrape_teetimes.py

Outputs a formatted report as a .txt file in the script directory.
"""

import os
import sys
import json
import re
import argparse
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime

DEFAULT_COURSE_SLUG = "tsawwassen-springs-golf"
DEFAULT_DATE = "2026-09-02"
DEFAULT_BASE_URL = "https://www.chronogolf.ca"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

def fetch_url(url):
    """Fetch content with standard browser headers."""
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode("utf-8")

def parse_url_or_args(url_input, course_input, date_input):
    """
    Determine target course slug, date, and full page URL from input arguments.
    """
    if url_input:
        parsed = urllib.parse.urlparse(url_input)
        base = f"{parsed.scheme}://{parsed.netloc}" if parsed.scheme and parsed.netloc else DEFAULT_BASE_URL
        
        # Extract slug from path: /club/<slug>
        match = re.search(r'/club/([^/?#]+)', parsed.path)
        slug = match.group(1) if match else course_input or DEFAULT_COURSE_SLUG
        
        # Extract date from query string or fallback
        query_params = urllib.parse.parse_qs(parsed.query)
        if "date" in query_params:
            date_str = query_params["date"][0]
        else:
            date_str = date_input or datetime.now().strftime("%Y-%m-%d")
            
        canonical_url = f"{base}/club/{slug}?date={date_str}"
        return base, slug, date_str, canonical_url
    else:
        slug = course_input or DEFAULT_COURSE_SLUG
        date_str = date_input or DEFAULT_DATE
        canonical_url = f"{DEFAULT_BASE_URL}/club/{slug}?date={date_str}"
        return DEFAULT_BASE_URL, slug, date_str, canonical_url

def get_club_metadata(html):
    """Extract club JSON configuration embedded in Next.js page data."""
    match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.DOTALL)
    if not match:
        raise ValueError("Could not locate __NEXT_DATA__ in club page HTML.")
    
    data = json.loads(match.group(1))
    club_info = data.get("props", {}).get("pageProps", {}).get("club", {})
    if not club_info:
        raise ValueError("Club information not found in page data.")
    return club_info

def fetch_teetimes(base_url, club_id, affiliation_type_id, date_str, referer_url):
    """Fetch tee times for a club and date using Chronogolf's marketplace API."""
    api_url = (
        f"{base_url}/marketplace/clubs/{club_id}/teetimes"
        f"?date={date_str}&affiliation_type_ids[]={affiliation_type_id}"
    )
    req = urllib.request.Request(
        api_url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
            "Referer": referer_url,
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))

def format_time_12h(time_str):
    """Convert 'HH:MM' string to friendly 12-hour format with AM/PM."""
    try:
        t = datetime.strptime(time_str, "%H:%M")
        return t.strftime("%I:%M %p").lstrip("0")
    except Exception:
        return time_str

def scrape_chronogolf(target_url=None, course_slug=None, target_date=None, output_dir=None, include_past=True):
    """
    Main scraping routine for any Chronogolf course and date.
    """
    base_url, slug, date_str, full_url = parse_url_or_args(target_url, course_slug, target_date)
    
    print(f"Scraping club page: {full_url}")
    html = fetch_url(full_url)
    club = get_club_metadata(html)
    
    club_id = club.get("id")
    club_name = club.get("name", slug.replace("-", " ").title())
    currency = club.get("currencyCode", "CAD")
    affiliation_id = club.get("defaultAffiliationTypeId", 3089)
    address = club.get("address", "")
    city = club.get("city", "")
    province = club.get("province", "")
    courses = club.get("courses", [])
    course_name = courses[0].get("name", club_name) if courses else club_name

    print(f"Course Name: {club_name} (Club ID: {club_id})")
    print(f"Date: {date_str} | Affiliation ID: {affiliation_id}")

    raw_teetimes = fetch_teetimes(base_url, club_id, affiliation_id, date_str, full_url)
    print(f"Total scheduled slots found: {len(raw_teetimes)}")

    # Filter available tee times
    # Note: Chronogolf returns all slots for the day. Past slots earlier today are considered past.
    now = datetime.now()
    is_today = (date_str == now.strftime("%Y-%m-%d"))

    available = []
    past_count = 0
    sold_out_count = 0

    for item in raw_teetimes:
        is_out = item.get("out_of_capacity", False)
        is_frozen = item.get("frozen", False)
        raw_time = item.get("start_time", "")
        
        # Check if the slot is earlier than now on the current day
        is_past = False
        if is_today and raw_time:
            try:
                slot_dt = datetime.strptime(f"{date_str} {raw_time}", "%Y-%m-%d %H:%M")
                if slot_dt < now:
                    is_past = True
                    past_count += 1
            except Exception:
                pass

        if is_out or is_frozen:
            sold_out_count += 1
        elif is_past and not include_past:
            # Skip past times if requested
            continue
        else:
            item["_is_past"] = is_past
            available.append(item)

    # Prepare formatted text output
    separator = "=" * 74
    sub_sep = "-" * 74
    lines = []

    lines.append(separator)
    lines.append(f"  {club_name.upper()} - TEE TIMES REPORT")
    lines.append(f"  Date: {date_str}")
    if address or city or province:
        lines.append(f"  Location: {address}, {city}, {province}")
    lines.append(f"  Course: {course_name}")
    lines.append(f"  Source: {full_url}")
    lines.append(f"  Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(separator)
    lines.append("")
    lines.append("Summary:")
    lines.append(f"  - Total scheduled slots: {len(raw_teetimes)}")
    lines.append(f"  - Available / open slots: {len(available)}")
    lines.append(f"  - Sold out / frozen:     {sold_out_count}")
    if is_today:
        lines.append(f"  - Slots already past:    {past_count}")
    lines.append("")

    if not available:
        lines.append("No open tee times found for this date/criteria.")
    else:
        header = f"{'Time':<12} {'Hole':<8} {'Format':<10} {'Price/Player (' + currency + ')':<22} {'Status':<10}"
        lines.append(header)
        lines.append(sub_sep)
        for tt in available:
            raw_time = tt.get("start_time", "")
            time_display = format_time_12h(raw_time)
            hole = f"Hole {tt.get('hole', 1)}"
            fmt = tt.get("format", "normal").capitalize()
            
            fees = tt.get("green_fees", [])
            if fees:
                price_val = fees[0].get("price") or fees[0].get("green_fee") or fees[0].get("subtotal")
                price_display = f"${price_val:.2f}" if price_val is not None else "N/A"
            else:
                price_display = "N/A"

            status = "Past" if tt.get("_is_past") else "Open"
            lines.append(f"{time_display:<12} {hole:<8} {fmt:<10} {price_display:<22} {status:<10}")

    lines.append(separator)
    lines.append("")

    if not output_dir:
        output_dir = os.path.dirname(os.path.abspath(__file__))

    # Sanitize filename
    safe_slug = re.sub(r'[^a-zA-Z0-9_-]', '_', slug)
    filename = f"{safe_slug}_teetimes_{date_str}.txt"
    file_path = os.path.join(output_dir, filename)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    # Post-process: Read the written .txt file and eliminate any entry where price is N/A
    with open(file_path, "r", encoding="utf-8") as f:
        file_lines = f.readlines()

    filtered_lines = []
    removed_na_count = 0
    in_table = False

    for line in file_lines:
        line_stripped = line.strip()
        if line_stripped.startswith("----"):
            in_table = True
            filtered_lines.append(line)
            continue
        elif line_stripped.startswith("====") and in_table:
            in_table = False
            filtered_lines.append(line)
            continue

        if in_table:
            # Check if this row has "N/A" in the price column
            # Matches table format: Time, Hole, Format, Price, Status
            if re.search(r'\bN/A\b', line):
                removed_na_count += 1
                continue

        filtered_lines.append(line)

    # Adjust the available/open slots summary count if any N/A entries were stripped
    if removed_na_count > 0:
        updated_lines = []
        for line in filtered_lines:
            match = re.match(r'(\s*-\s*Available\s*/\s*open\s*slots:\s*)(\d+)', line)
            if match:
                prefix = match.group(1)
                curr_count = int(match.group(2))
                new_count = max(0, curr_count - removed_na_count)
                updated_lines.append(f"{prefix}{new_count}\n")
            else:
                updated_lines.append(line)
        filtered_lines = updated_lines

    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(filtered_lines)

    print(f"\nFiltered out {removed_na_count} entries with N/A price from report.")
    print(f"Successfully wrote report to:")
    print(file_path)
    return file_path

def main():
    parser = argparse.ArgumentParser(description="Scrape tee times and pricing for any golf course on Chronogolf.")
    parser.add_argument(
        "--url",
        "-u",
        help="Full Chronogolf club URL (e.g., https://www.chronogolf.ca/club/tsawwassen-springs-golf?date=2026-09-02)"
    )
    parser.add_argument(
        "--course",
        "-c",
        help=f"Course slug (e.g., 'tsawwassen-springs-golf', 'fraserview-golf-course'). Default: {DEFAULT_COURSE_SLUG}",
        default=None
    )
    parser.add_argument(
        "--date",
        "-d",
        help=f"Target date in YYYY-MM-DD format. Default: {DEFAULT_DATE}",
        default=None
    )
    parser.add_argument(
        "--no-past",
        action="store_true",
        help="Exclude tee times earlier in the day if scraping today's date."
    )
    parser.add_argument(
        "--output-dir",
        "-o",
        help="Directory where output .txt file will be stored. Default: script directory.",
        default=None
    )

    args = parser.parse_args()

    scrape_chronogolf(
        target_url=args.url,
        course_slug=args.course,
        target_date=args.date,
        output_dir=args.output_dir,
        include_past=not args.no_past,
    )

if __name__ == "__main__":
    main()
