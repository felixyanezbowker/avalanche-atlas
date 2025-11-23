# Avalanche Atlas

Avalanche Atlas is an avalanche reporting app. Around 100,000 avalanches happen each year and 99% go unreported. Users log avalanches with key details and photos, it gets uploaded to a shared dashbpoard; and then people can refer to it before touring to make better, safer decisions.

## Features

- **Public Dashboard**: View recent avalanche reports without authentication
- **Submit Reports**: Authenticated users can submit detailed avalanche reports with photos
- **Comments**: Add comments and search through them
- **Edit Reports**: Report owners and admins can edit reports
- **Share & Contact**: Share reports and contact reporters directly via email

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript  
- **Backend:** Supabase (Postgres, Auth, Storage)  
- **ORM:** Drizzle  
- **Styling:** Tailwind CSS  

---

## Getting Started

### Prerequisites

- Node.js 18+  
- `pnpm` (or `npm`) installed  
- A Supabase project with database, auth and storage configured

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-user/avalanche-atlas.git
   cd avalanche-atlas
Copy environment variables and fill in your Supabase details:

bash
Copy code
cp .env.local.example .env.local
Install dependencies:

bash
Copy code
pnpm install
# or
npm install
Run the dev server:

bash
Copy code
pnpm dev
# or
npm run dev
Open http://localhost:3000 in your browser.

**## Usage**
Open the home page to see Recent Avalanches ordered by most recent first.
Click a card to open the detail view with full report information.
Sign in and go to Submit to create a new report with location, aspect, elevation, size and photos.
Use the comments section on a report to share extra observations or ask clarifying questions.

**Roadmap**
Map view of avalanche reports
Filters by date, region, aspect and elevation
Multi-country support
Offline-friendly field mode
Push/email alerts for new avalanches in a chosen area

**Contributing**
Contributions, ideas and bug reports are very welcome.
Fork the repo
Create a feature branch: git checkout -b feature/my-change
Commit your changes: git commit -m "feat: add my change"
Push the branch and open a pull request

**Safety Disclaimer**
Avalanche Atlas is an extra information source, not a full avalanche forecast or a guarantee of safety. Always combine this data with official avalanche bulletins, professional training and your own observations. You are responsible for your own decisions in the mountains.

**Licence**
This project is released under the terms described in the LICENSE file.
