# 🌐 GlobeTrotter — Empowering Personalized Travel Planning

> **Official Hackathon Submission for Odoo X LDCE '26**

![GlobeTrotter Banner](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80)

### 🔗 Live Links
- 🚀 **Live Production Website:** [https://globe-trotter-sooty.vercel.app](https://globe-trotter-sooty.vercel.app)
- ⚡ **Live Backend API:** [https://globe-trotter-1jjk.onrender.com](https://globe-trotter-1jjk.onrender.com)
- 🐙 **GitHub Repository:** [https://github.com/PreetDarji22/Globe_Trotter_](https://github.com/PreetDarji22/Globe_Trotter_)

---

## 🌟 Overall Vision

The overarching vision for **GlobeTrotter** is to become a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. The platform aims to empower users to dream, design, and organize trips with ease by offering an end-to-end travel planning tool that combines flexibility, aesthetics, and interactivity.

It envisions a world where users can explore global destinations, visualize their journeys through structured itineraries, make cost-effective decisions with automated financial breakdowns, connect with travel buddies, and share their travel plans within a vibrant community—making travel planning as exciting as the trip itself.

---

## 🎯 Problem Statement (PS) & Mission

### The Problem
Planning multi-city travel is inherently complex and chaotic. Travelers often juggle between messy spreadsheets, unorganized notes, and dozens of browser tabs to track travel stops, estimate activity costs, and align schedule timelines. Furthermore, when friends or fellow travelers request travel advice, there is no intuitive way to share interactive, copyable itineraries with real activity costs.

### The Mission & Solution
GlobeTrotter solves this by serving as a unified travel planning command center powered by a robust relational database and a responsive, high-aesthetic user interface. Travelers can:
- 📌 **Add & Manage Multi-City Stops:** Define destinations, custom order indices, and stay durations.
- 🗺️ **Discover Destinations & Activities:** Filter global cities and search activities by interest or cost index.
- 💰 **Automate Budget Estimation:** Instant financial breakdown by transport, stay, activities, and meals with overbudget warnings.
- 📅 **Visualize Timelines & Calendars:** Toggle between day-wise List Views, Timeline flows, and Calendar views.
- 🤝 **Connect & Share:** Fork public community itineraries into personal trips with 1 click, like and comment on community posts, and connect with travel buddies.

---

## 🚀 Key Features

### 1. 🔐 Split-Screen Login / Signup & Welcome Toast
- Ultra-modern split-screen design with high-definition travel hero panel and social proof stats.
- JWT authentication with bcrypt password encryption.
- Preset avatar selection modal.
- 1-click **⚡ Instant Demo Login (Mia Chen)** button for fast testing.
- Dynamic **Welcome Toast Banner** upon login (*"Welcome back, Mia! 🌍 Ready for your next journey?"*).

### 2. 📊 Dashboard & Command Hub (`Dashboard.tsx`)
- Central hub displaying upcoming trips, recent plans, and budget summaries.
- Recommended destinations cards and quick-action *"Plan New Trip"* button.

### 3. ➕ Create Trip Screen (`CreateTrip.tsx`)
- Form to initiate new trips with custom title, travel dates, description, and cover photo image URL.

### 4. 🧳 My Trips (Trip Listing) Screen (`TripListing.tsx`)
- Card view of all user trips displaying destination counts, date ranges, view itinerary action, and deletion capability.

### 5. 🛠️ Interactive Itinerary Builder (`BuildItinerary.tsx`)
- Add and manage city stops, travel dates, and activity assignments per stop.

### 6. 📖 Itinerary View Screen (`ItineraryView.tsx`)
- Interactive day-by-day layout with **List View** and **Timeline View** toggles.
- Timed activity cards displaying exact categories, start times, and costs.

### 7. 🏙️ Global City Search (`Search.tsx`)
- Filter global cities by country, region, popularity score, and cost index (`$`, `$$`, `$$$`).

### 8. 🎯 Activity Search & Custom Creator
- Browse 11 recommended preset activities + custom activity creator.
- Instant non-zero cost calculation and immediate database synchronization.

### 9. 💵 Trip Budget & Financial Breakdown
- Interactive **Recharts Pie Chart** categorizing expenses (Sightseeing, Food, Transit, Stay).
- Real-time average cost per day calculation and **Overbudget Alert** warnings.

### 10. 📅 Trip Calendar & Timeline Screen (`CalendarView.tsx`)
- Calendar-based day views and vertical timeline flows.

### 11. 🌐 Community Feed & 1-Click Itinerary Forking (`Community.tsx`)
- 8 pre-seeded public community itineraries across Zurich, Kyoto, Reykjavik, Tokyo, Paris, NYC, Bali, and Rome.
- **1-Click Forking:** Clones public stops and activities into the user's personal *My Trips* database table.
- Community engagement with Likes and Comments.

### 12. 👤 User Profile & Travel Buddies (`Profile.tsx`)
- Update avatar photo URL.
- **Travel Buddies Grid** featuring 6 connected travelers (*Mia Chen*, *Sophia Tanaka*, *Sam Vance*, *Elena Rostova*, *Liam Gallagher*, *Lucas Silva*).
- **Interactive Buddy Profile Modal:** Opens detailed travel stats (*Countries Visited*, *Itineraries*, *Match %*), travel bio, favorite spot, and featured public itineraries.

### 13. 📈 Admin & Analytics Dashboard (`Admin.tsx`)
- Admin metrics tracking total registered users, active trips, popular destinations, and platform activity charts.

---

## 🔄 End-to-End User Workflow

```mermaid
flowchart TD
    A[User Arrives at Login Page] --> B{Existing User?}
    B -- Yes --> C[Sign In via Email/Password or Instant Demo Login]
    B -- No --> D[Create Account & Select Avatar]
    C --> E[Welcome Toast Notification Displayed]
    D --> E
    E --> F[Dashboard Hub]
    
    F --> G[Explore Community Feed]
    G --> H[View Public Itineraries & Comments]
    H --> I[Click 'Fork Itinerary']
    I --> J[Itinerary Cloned into 'My Trips']
    
    F --> K[Click 'Plan New Trip']
    K --> L[Fill Trip Name, Dates & Description]
    L --> M[Itinerary Builder: Add City Stops]
    M --> N[Activity Search: Pick Presets or Add Custom Activities]
    
    N --> O[Itinerary View Screen]
    O --> P[Toggle List / Timeline Views]
    O --> Q[Monitor Recharts Budget Chart & Daily Averages]
    
    F --> R[User Profile Screen]
    R --> S[Browse Connected Travel Buddies]
    S --> T[Click 'View Profile' Modal for Travel Stats & Itineraries]
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript & Vite
- **Deployment Platform:** Vercel Global CDN
- **Styling:** Vanilla CSS & TailwindCSS (custom design system tokens)
- **State Management:** Zustand with LocalStorage Persistence
- **Icons & Visuals:** Lucide React icons & Unsplash curated media
- **Charts:** Recharts (Interactive Pie & Bar budget charts)
- **Routing:** React Router DOM v6

### Backend
- **Runtime:** Node.js (TypeScript with `tsx`)
- **Deployment Platform:** Render Cloud Web Services
- **Server Framework:** Express.js
- **Database:** Supabase PostgreSQL Database
- **ORM / Driver:** Prisma 7 with `@prisma/adapter-pg`
- **Authentication:** JWT (JSON Web Tokens) & `bcrypt` password hashing

---

## 📁 Repository File Structure

```
Globe_Trotter_/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema (User, Trip, TripStop, Activity, Like, Comment, City)
│   │   └── migrations/          # SQL database migrations
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── admin.ts         # Admin stats endpoint
│   │   │   ├── auth.ts          # Login & registration endpoints
│   │   │   ├── community.ts     # Community feed, likes, comments & itinerary forking
│   │   │   ├── itinerary.ts     # Stop & activity management endpoints
│   │   │   └── trips.ts         # User trip CRUD endpoints
│   │   ├── index.ts             # Express server setup
│   │   └── prisma.ts            # Prisma client instance with PostgreSQL pool adapter
│   ├── .env                     # Database URL & JWT secret config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActionBar.tsx    # Bottom navigation bar
│   │   │   ├── Navigation.tsx   # Top navigation shell & Welcome Toast
│   │   │   └── SafeImage.tsx    # Fallback image renderer
│   │   ├── pages/
│   │   │   ├── Admin.tsx        # Admin analytics dashboard
│   │   │   ├── BuildItinerary.tsx # Day-wise itinerary stop builder
│   │   │   ├── CalendarView.tsx # Calendar itinerary view
│   │   │   ├── Community.tsx    # Public feed & itinerary cloning
│   │   │   ├── CreateTrip.tsx   # New trip creation form
│   │   │   ├── Dashboard.tsx    # User command center
│   │   │   ├── ItineraryView.tsx# Day-wise list, timeline & budget chart
│   │   │   ├── Login.tsx        # Split-screen auth screen
│   │   │   ├── Profile.tsx      # User profile & Travel Buddies modal
│   │   │   ├── Search.tsx       # City & activity search
│   │   │   └── TripListing.tsx  # My Trips listing
│   │   ├── store.ts             # Zustand store for state management
│   │   ├── App.tsx              # App routes & protected route wrapper
│   │   └── index.css            # Tailwind & global design tokens
│   ├── vercel.json              # Vercel proxy & SPA routing configuration
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## ⚡ Installation & Getting Started Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL Database** (or Supabase Connection String)

---

### Step 1: Clone the Repository & Navigate
```bash
git clone https://github.com/PreetDarji22/Globe_Trotter_.git
cd Globe_Trotter_
```

---

### Step 2: Set Up Backend Environment Variables & Install
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_SUPABASE_HOST:5432/postgres?sslmode=require"
JWT_SECRET="super-secret-jwt-key"
PORT=5000
```

Run database migrations & client generation:
```bash
npx prisma db push
```

---

### Step 3: Set Up Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

### Step 4: Run the Application

#### Start Backend Server:
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

#### Start Frontend Dev Server:
```bash
cd ../frontend
npm run dev
# Application will run on http://localhost:5173
```

---

### Step 5: Quick Test Credentials

You can use the **⚡ Instant Demo Login** button on the Sign In page or use these credentials:
- **Email:** `mia.chen@globe.com`
- **Password:** `password123`

---

## 📝 License
Built for the **Odoo X LDCE '26 Hackathon**. All rights reserved.
