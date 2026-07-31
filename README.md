# Just Another Job Tracker

A clean, fast job application tracker built with plain HTML, CSS, Tailwind, and vanilla JavaScript. No frameworks, no backend, no database — just a browser-based tool that helps you actually see what's happening in your job search.

**[Live Demo →](https://just-another-job-tracker.vercel.app/)**

---

## Why this exists

Spreadsheets are fine for listing applications, but they don't tell you anything useful — no visual status tracking, no funnel of where applications actually drop off, no quick way to see response/interview/offer rates. This tracker was built to fix that.

## Features

- **Application tracking** — company, role, salary, location, work mode, applied date, and follow-up reminders
- **Status stages** — Wishlist → Applied → Interviewing → Offer / Rejected / Ghosted, each with its own color-coded pill
- **Status history** — every status change is timestamped automatically, powering the analytics below
- **Search, filter, and sort** — instantly search by company/role/notes, filter by work mode or status, sort by date or company
- **Analytics dashboard**
  - Summary stats: total applications, response rate, interview rate, offer rate
  - Status breakdown donut chart
  - Sankey funnel diagram showing how applications flow between stages
- **Notes & salary details** — kept out of the main table, viewable per-application via a details popup
- **Export / Import** — download your data as a `.json` file and import it elsewhere (e.g. moving from desktop to mobile)
- **Fully responsive** — usable on desktop and mobile, with a horizontally scrollable table and stacked mobile-friendly controls
- **Local-first** — all data is stored in your browser's `localStorage`. Nothing is sent to a server.

## Tech Stack

- HTML, CSS, vanilla JavaScript (no framework)
- [Tailwind CSS](https://tailwindcss.com/) (CLI build)
- [Plotly.js](https://plotly.com/javascript/) for the analytics charts
- [Heroicons](https://heroicons.com/) for icons
- Deployed on [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for the Tailwind CLI build)

### Setup

```bash
# Clone the repo
git https://github.com/AllanPZamora/JustAnotherJobTracker.git
cd JustAnotherJobTracker

# Install dependencies
npm install

# Build Tailwind CSS (one-time build)
npm run build

# Or watch for changes while developing
npm run dev
```

Then open `index.html` in your browser, or serve it with a local dev server (e.g. the Live Server extension in VS Code).

### Deploying

This project is a static site — no server-side code required. It's set up to deploy cleanly on [Vercel](https://vercel.com/):

1. Push your repo to GitHub
2. Import the project in Vercel
3. Set the **Build Command** to `npm run build`
4. The included `vercel.json` sets the output directory to the project root


## Data & Privacy

All application data lives entirely in your browser's `localStorage` — there is no backend, no account, and no data ever leaves your device unless you explicitly export it. This also means:

- Data is specific to one browser on one device
- Clearing your browser data will erase your saved applications
- Use the **Export** button to back up your data, and **Import** to restore it or move it to another device

## License

[AGPL-3.0](https://github.com/AllanPZamora/JustAnotherJobTracker?tab=AGPL-3.0-1-ov-file#) — you're free to use, modify, and share this project, but any modified version (including one run as a public web service) must also be open-sourced under the same license.