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
    try:
        req = urllib.request.Request(ICS_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            ics_data = r.read()
    except Exception as e:
        print(f"ERROR fetching ICS: {e}")
        return

    # Parse ICS
    try:
        cal = icalendar.Calendar.from_ical(ics_data)
    except Exception as e:
        print(f"ERROR parsing ICS: {e}")
        return

    # We want to look back further to catch the start of recurring series
    # and look forward enough for the academic year.
    now = datetime.now()
    start_date = now - timedelta(days=365) # 1 year back
    end_date = now + timedelta(days=730)   # 2 years forward
    
    print(f"Expanding events from {start_date.date()} to {end_date.date()}...")

    # recurring_ical_events expands all RRULEs in that window
    try:
        events_expanded = recurring_ical_events.of(cal).between(start_date, end_date)
    except Exception as e:
        print(f"ERROR expanding events: {e}")
        return

    print(f"Found {len(events_expanded)} occurrences in total.")

    out_events = []
    for ev in events_expanded:
        summary = str(ev.get('SUMMARY', ''))
        location = str(ev.get('LOCATION', ''))
        
        # Check if it's a recurring instance
        is_recurring = 'RECURRENCE-ID' in ev
        
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
            "description": desc,
            "recurring": is_recurring
        })

    # Sort
    out_events.sort(key=lambda e: e["start"])

    # Write to file
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out_events, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {len(out_events)} events -> {OUT}")
    
    # Print a few recurring examples to verify
    rec_count = sum(1 for e in out_events if e.get('recurring'))
    print(f"  - Total recurring instances: {rec_count}")
    if rec_count > 0:
        print("  - Examples of recurring events found:")
        for e in [x for x in out_events if x.get('recurring')][:3]:
            print(f"    * {e['summary']} on {e['start'][:10]}")

if __name__ == "__main__":
    main()
