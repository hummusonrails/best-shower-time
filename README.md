<p align="center">
  <img src=".github/banner.svg" alt="Best Shower Time" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-FFEEC8.svg?style=flat-square&labelColor=1E1E1C" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Next.js-16-FFEEC8.svg?style=flat-square&labelColor=1E1E1C" alt="Next.js 16">
  <img src="https://img.shields.io/badge/TypeScript-5-FFEEC8.svg?style=flat-square&labelColor=1E1E1C" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind-v4-FFEEC8.svg?style=flat-square&labelColor=1E1E1C" alt="Tailwind v4">
</p>

<p align="center">
  <strong>Real-time rocket alert analysis to help Israelis decide when it's safe to shower.</strong>
  <br>
  <a href="#quick-start">Quick Start</a> · <a href="https://github.com/hummusonrails/best-shower-time/issues">Report a Bug</a>
</p>

---

During active conflict, Israelis need to quickly assess whether it's safe to take a shower or use the bathroom — activities where you can't easily reach a safe room. This app analyzes live alert data from Pikud HaOref to give a clear safety recommendation based on your estimated activity duration and location.

## What It Does

- **Scores safety in real time** using a weighted algorithm (time since last alert, average gaps, frequency trends, alert density)
- **Filters by location** with 16 predefined regions and a searchable database of 1,362 cities in both Hebrew and English
- **Adapts to your activity** — pick shower or toilet and adjust the duration slider to get a personalized recommendation
- **Visualizes the last 24 hours** of alert activity in an hourly timeline chart
- **Supports Hebrew and English** with full RTL layout, persisted in localStorage
- **Auto-refreshes every 30 seconds** so the recommendation stays current

## Quick Start

```bash
git clone https://github.com/hummusonrails/best-shower-time.git
cd best-shower-time
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

| Layer          | Tool                  | Notes                                      |
| :------------- | :-------------------- | :----------------------------------------- |
| Framework      | Next.js 16 (App Router) | Server-side API route for alert data caching |
| Language       | TypeScript            | Strict types throughout                    |
| Styling        | Tailwind CSS v4       | Dark editorial theme with corner bracket frames |
| Charts         | Recharts              | 24h alert timeline bar chart               |
| Data source    | Tzeva Adom API        | `api.tzevaadom.co.il` — no geo-restriction |
| City names     | pikud-haoref-api      | 1,362 Hebrew↔English city mappings         |
| Deployment     | Vercel                | Zero-config deployment                     |

<details>
<summary><strong>Prerequisites</strong></summary>

- [Node.js](https://nodejs.org/) 18+
- npm

</details>

## Project Structure

```
best-shower-time/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Main page — fetches alerts, manages state
│   ├── globals.css             # Tailwind theme, bracket frames, slider
│   └── api/alerts/route.ts     # Proxies Tzeva Adom API with 30s cache
├── components/
│   ├── Header.tsx              # Title + language toggle
│   ├── SafetyVerdict.tsx       # Score gauge + verdict message
│   ├── ActivitySelector.tsx    # Shower/toilet + duration slider
│   ├── LocationSelector.tsx    # Region buttons + bilingual city search
│   ├── StatsGrid.tsx           # 2×2 stat cards
│   ├── AlertTimeline.tsx       # Recharts 24h bar chart
│   ├── HowItWorks.tsx          # Collapsible explanation
│   └── Footer.tsx              # Attribution + last updated
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── safety.ts               # Safety scoring algorithm
│   ├── i18n.ts                 # EN/HE translations
│   ├── LanguageContext.tsx      # Language state + RTL
│   ├── regions.ts              # 16 region definitions
│   └── cityNames.ts            # 1,362 Hebrew↔English city mappings
```

## Safety Algorithm

The score (0–100) is a weighted combination of four signals:

| Signal                  | Weight | Safer when…              |
| :---------------------- | :----- | :----------------------- |
| Time since last alert   | 40%    | Longer gap               |
| Average gap (6h window) | 25%    | Larger average           |
| Frequency trend         | 20%    | Decreasing               |
| 24h alert count         | 15%    | Fewer alerts             |

The score is compared against your activity duration to produce a verdict: **Safe**, **Risky**, or **Dangerous**.

## Contributing

Found a bug or have a suggestion? [Open an issue](https://github.com/hummusonrails/best-shower-time/issues) or submit a PR.

## License

[MIT](LICENSE) — Ben Greenberg

---

<p align="center">
  Made by <a href="https://www.hummusonrails.com/">Ben Greenberg</a>
</p>
