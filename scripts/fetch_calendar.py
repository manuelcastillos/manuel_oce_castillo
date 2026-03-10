"""
Fetches the Outlook public ICS calendar and saves events to data/calendar_events.json
Run: python scripts/fetch_calendar.py
"""
import json, re, urllib.request
from pathlib import Path
from datetime import datetime, timezone

ICS_URL = (
    "https://outlook.office365.com/owa/calendar/"
    "059f58253820411286047bf197467719@uv.cl/"
    "e1ace145710a4e07bc1f95f0f09437da15098587006899194286/calendar.ics"
)
OUT = Path(__file__).parent.parent / "data" / "calendar_events.json"


def unfold(text: str) -> str:
    return re.sub(r"\r?\n[ \t]", "", text)


def parse_dt(raw: str):
    raw = re.sub(r"^.*?:", "", raw)  # strip TZID=...: prefix
    raw = raw.rstrip("Z").strip()
    if len(raw) == 8:
        return f"{raw[:4]}-{raw[4:6]}-{raw[6:8]}"
    try:
        return datetime(
            int(raw[0:4]), int(raw[4:6]), int(raw[6:8]),
            int(raw[9:11]) if len(raw) > 10 else 0,
            int(raw[11:13]) if len(raw) > 12 else 0,
            tzinfo=timezone.utc
        ).isoformat()
    except Exception:
        return raw[:10]


def get_field(block: str, key: str) -> str:
    block = unfold(block)
    m = re.search(rf"(?m)^{key}(?:;[^:\r\n]*)?:(.*?)$", block)
    return m.group(1).strip() if m else ""


def clean(s: str) -> str:
    return s.replace("\\,", ",").replace("\\n", " ").replace("\\;", ";").strip()


def main():
    print(f"Fetching: {ICS_URL}")
    req = urllib.request.Request(ICS_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        text = r.read().decode("utf-8", errors="ignore")

    blocks = re.split(r"BEGIN:VEVENT", text)[1:]
    events = []
    for block in blocks:
        block = block.split("END:VEVENT")[0]
        summary  = clean(get_field(block, "SUMMARY"))
        location = clean(get_field(block, "LOCATION"))
        desc     = clean(get_field(block, "DESCRIPTION"))[:200]
        start_raw = get_field(block, "DTSTART")
        end_raw   = get_field(block, "DTEND")
        start = parse_dt(start_raw) if start_raw else None
        end   = parse_dt(end_raw)   if end_raw   else None
        if not start or not summary:
            continue
        events.append({"summary": summary, "start": start,
                        "end": end, "location": location, "description": desc})

    events.sort(key=lambda e: e["start"])
    OUT.write_text(json.dumps(events, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Saved %d events -> %s" % (len(events), OUT))



if __name__ == "__main__":
    main()
