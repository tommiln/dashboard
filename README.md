# World Dashboard 🌍

A fully automated, live-updating world dashboard featuring:
- 🕰️ Current times in New York, London, Brussels, Helsinki, and Singapore
- 🌅 Sunrise, 🌇 Sunset, and Day length data for each city
- 🗓️ Apple-style Calendar with week numbers, bold holidays, and today’s highlight
- 📅 Personal Important Dates (editable by you)
- 🇺🇸 🇬🇧 🇸🇬 Official Bank Holidays with tooltips and bold date highlights
- 🌐 Real-time timezone comparison tool, extended range
- 🎨 Clean, Apple-inspired design with light/dark mode and smooth transitions
- ⚙️ Auto-refreshing data daily and yearly holiday updates
- 🚀 Fully automated GitHub Pages deploy pipeline

## Cities Included:
- **New York** 🇺🇸
- **London** 🇬🇧
- **Brussels** 🇧🇪
- **Helsinki** 🇫🇮
- **Singapore** 🇸🇬 (your local time)

## Usage:
- Work on your local files
- Simply push changes to GitHub — the site auto-deploys!

## Deployment:
This project uses GitHub Pages and is auto-deployed from the `main` branch. No manual uploads needed anymore.

Live site: [https://tommiln.github.io/dashboard/](https://tommiln.github.io/dashboard/)

## Important Dates:
To add or remove your personal important dates:
1. Open `/data/important-dates.json`
2. Add your dates in the format:
```json
{
  "date": "2025-07-12",
  "name": "Flight to New York",
  "notes": "SQ24 at 12:10 PM, Terminal 3"
}