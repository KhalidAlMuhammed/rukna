# Rukna - Local Guide & Experience Platform

Rukna is a web platform that connects tourists with local guides and unique cultural experiences in the Asir region of Saudi Arabia. It's designed to provide authentic, off-the-beaten-path adventures for travelers while empowering local communities.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- Supabase account
- Google Cloud project for OAuth

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/rukna.git
    cd rukna
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the following:

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

    # NextAuth
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your-next-auth-secret # Generate a secret: `openssl rand -hex 32`
    
    # Google OAuth
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    ```

    You can find the Supabase keys in your Supabase project settings. The `SUPABASE_SERVICE_ROLE_KEY` is required for the user creation flow. You can get Google OAuth credentials from the Google Cloud Console.

4.  **Set up the database:**

    Run the SQL script in `supabase-setup.sql` and the migrations in the Supabase SQL Editor to create the necessary tables and policies.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Guide Profiles:** Detailed profiles for local guides, including bios, specialties, and ratings.
- **Experience Listings:** Curated experiences hosted by locals, from cultural workshops to adventure tours.
- **Booking System:** Simple and secure booking process for tourists.
- **User Authentication:** Secure sign-up and login for both tourists and guides using Google OAuth.
- **Bilingual Support:** Full English and Arabic (Aseeri dialect) localization.

## Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS with shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** NextAuth.js
- **Deployment:** Vercel

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
