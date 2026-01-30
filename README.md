# Healthcare Compliance Deadline Tracker

A modern web application for tracking healthcare regulatory deadlines. Built for small medical practices to stay on top of HIPAA, CMS, and state licensing requirements.

## Features

- **Calendar View** - Visual calendar display of all upcoming deadlines
- **Federal Register Integration** - Live data from the Federal Register API
- **State Licensing Tracking** - CME and renewal deadlines for FL, CA, SC, MD, NJ
- **Smart Filtering** - Filter by category, state, or search terms
- **Priority Indicators** - Urgent/upcoming/passed status for each deadline
- **Source Links** - Direct links to official documents

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Calendar**: FullCalendar
- **Icons**: Lucide React
- **Data**: Federal Register API (public)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Data Sources

### Federal Register API
- **Endpoint**: `https://www.federalregister.gov/api/v1/`
- **Access**: Public, no API key required
- **Data**: HIPAA rules, CMS regulations, NPRMs, compliance deadlines

### State Medical Licensing
Currently tracking 5 states with static data:
- Florida (FL)
- California (CA)
- South Carolina (SC)
- Maryland (MD)
- New Jersey (NJ)

### Future Integrations
- **FSMB APIs** - Physician licensing data (requires partnership)
- **CMS Blue Button** - Medicare claims data (requires OAuth)

## Project Structure

```
src/
├── app/
│   ├── api/deadlines/    # API route for deadline data
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/
│   ├── DeadlineCalendar.tsx  # FullCalendar wrapper
│   ├── DeadlineCard.tsx      # Individual deadline card
│   ├── DeadlineModal.tsx     # Detail popup
│   ├── FilterBar.tsx         # Category/state filters
│   ├── StateLicensingPanel.tsx # State info display
│   └── UpcomingDeadlines.tsx   # Priority list view
├── lib/
│   ├── federal-register.ts   # Federal Register API
│   ├── state-licensing.ts    # State licensing data
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript definitions
```

## API Reference

### GET /api/deadlines

Returns all deadlines from both Federal Register and state licensing sources.

**Response:**
```json
{
  "deadlines": [...],
  "cached": false,
  "lastUpdated": "2026-01-30T13:52:49.720Z"
}
```

## Deadline Categories

- **HIPAA** - Privacy and security rules
- **CMS/Medicare** - Medicare/Medicaid regulations
- **Interoperability** - TEFCA, FHIR requirements
- **Licensing/CME** - State medical licensing
- **OIG** - Office of Inspector General
- **Other** - General healthcare regulations

## Extending the Application

### Adding More States

Edit `src/lib/state-licensing.ts` and add entries to the `stateLicensingData` array.

### Adding New Data Sources

1. Create a new file in `src/lib/` for the API integration
2. Add the fetch function to `src/app/api/deadlines/route.ts`
3. Merge results with existing deadlines

### Customizing Categories

Edit `src/types/index.ts` to modify the `DeadlineCategory` type, then update the color mapping in `src/lib/utils.ts`.

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## License

MIT
