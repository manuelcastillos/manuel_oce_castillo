"""
Fetches the Outlook public ICS calendar and saves events to data/calendar_events.json
Run: python scripts/fetch_calendar.py
"""
import json, urllib.request
from pathlib import Path
from datetime import datetime, timedelta
import icalendar
import recurring_ical_events

ICS_URL = (
    "https://outlook.office365.com/owa/calendar/"
    "059f58253820411286047bf197467719@uv.cl/"
    "e1ace145710a4e07bc1f95f0f09437da15098587006899194286/calendar.ics"
)
OUT = Path(__file__).parent.parent / "data" / "calendar_events.json"

def main():
    print(f"Fetching: {ICS_URL}")
    req = urllib.request.Request(ICS_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        ics_data = r.read()

    # Parse ICS
    cal = icalendar.Calendar.from_ical(ics_data)

    # We want events from 2 months ago to 1 year in the future
    now = datetime.now()
    start_date = now - timedelta(days=60)
    end_date = now + timedelta(days=365)

    # recurring_ical_events expands all RRULEs in that window
    events_expanded = recurring_ical_events.of(cal).between(start_date, end_date)

    out_events = []
    for ev in events_expanded:
        summary = str(ev.get('SUMMARY', ''))
        location = str(ev.get('LOCATION', ''))
        
        desc_prop = ev.get('DESCRIPTION')
        desc = str(desc_prop) if desc_prop else ""
        desc = desc[:200].replace('\n', ' ').strip()

        dtstart = ev.get('DTSTART')
        dtend = ev.get('DTEND')

        if not dtstart or not summary:
            continue

        start_val = dtstart.dt
        end_val = dtend.dt if dtend else None

        # Format dates
        if hasattr(start_val, 'isoformat'):
            start_str = start_val.isoformat()
        else:
            # datetime.date
            start_str = start_val.strftime("%Y-%m-%d")

        if end_val:
            if hasattr(end_val, 'isoformat'):
                end_str = end_val.isoformat()
            else:
                end_str = end_val.strftime("%Y-%m-%d")
        else:
            end_str = None

        out_events.append({
            "summary": summary,
            "start": start_str,
            "end": end_str,
            "location": location,
            "description": desc
        })

    # Sort
    out_events.sort(key=lambda e: e["start"])

    # Write to file
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out_events, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {len(out_events)} events -> {OUT}")

if __name__ == "__main__":
    main()
