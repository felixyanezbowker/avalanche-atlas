# Avalanche Atlas

Avalanche Atlas is an avalanche reporting app. Around 100,000 avalanches happen each year and 99% go unreported. Users log avalanches with key details and photos, it gets uploaded to a shared dashbpoard; and then people can refer to it before touring to make better, safer decisions.

## Features

- **Public Dashboard**: View recent avalanche reports without authentication
- **Submit Reports**: Authenticated users can submit detailed avalanche reports with photos
- **Comments**: Add comments and search through them
- **Edit Reports**: Report owners and admins can edit reports
- **Share & Contact**: Share reports and contact reporters

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **ORM**: Drizzle ORM with PostgreSQL (via Supabase)
- **Backend**: Supabase (Auth, Database, Storage)
- **Styling**: Tailwind CSS (desktop-first, responsive)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase project with:
  - Database (PostgreSQL)
  - Authentication enabled (with Google OAuth configured)
  - Storage bucket named `avalanche-photos` with public read access

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
     - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep secret!)
     - `DATABASE_URL`: Your PostgreSQL connection string

3. Set up the database:
   - Run Drizzle migrations to create tables:
   ```bash
   npm run db:generate
   npm run db:push
   ```
   Or manually create the tables using the schema definitions in `src/db/schema/`

4. Set up Supabase Storage:
   - Create a storage bucket named `avalanche-photos`
   - Set it to public read access
   - Configure CORS if needed

5. Configure Google OAuth (optional):
   - In Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your OAuth credentials
   - **Important**: Add authorized redirect URL: `http://localhost:3000/auth/callback` (or `http://localhost:3001/auth/callback` if using port 3001)
   - In Google Cloud Console, add redirect URI: `https://nfvmwjkrfigdojbjexkv.supabase.co/auth/v1/callback`
   - See `OAUTH_SETUP.md` for detailed instructions

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Schema

The app uses two main tables:

- **avalanches**: Stores avalanche reports with location, size, trigger type, photos, etc.
- **comments**: Stores user comments on avalanche reports

See `src/db/schema/` for full schema definitions.

## Project Structure

```
avalanche-atlas/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page (recent avalanches)
│   ├── login/             # Authentication
│   ├── submit/            # Submit new report
│   └── avalanche/[id]/    # Detail and edit pages
├── src/
│   ├── actions/           # Server actions (CRUD operations)
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth)
│   ├── db/               # Drizzle ORM schemas and migrations
│   └── lib/              # Utilities (Supabase clients)
└── public/               # Static assets
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Security Notes

- Public read access: Anyone can view avalanche reports without authentication
- Authentication required: Only authenticated users can submit, edit, or comment
- Admin access: Users with "admin" in their email can edit any report
- Service role key: Keep `SUPABASE_SERVICE_ROLE_KEY` secret and never expose it client-side

## License

See LICENSE file for details.
