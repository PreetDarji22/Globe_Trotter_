# GlobeTrotter 🌍

![GlobeTrotter Banner](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80)

GlobeTrotter is a modern, beautifully designed travel itinerary planning platform. Built for the modern traveler, it allows users to construct day-by-day itineraries, track their budgets, and discover new adventures through a community-driven feed. 

---

## 🎯 Problem Statement  (PS)

**The Problem:** Planning a multi-city trip is chaotic. Travelers often juggle between messy spreadsheets, unorganized notes, and dozens of browser tabs just to figure out what to do and how much it will cost. Furthermore, when friends ask for travel recommendations, there is no easy way to share a complete, copyable itinerary.

**Our Solution:** GlobeTrotter acts as a centralized command center for travel planning. It provides a visual, drag-and-drop-style itinerary builder, automatic budget breakdowns by category (Food, Transit, Sightseeing), and a unique **"Community Forking"** feature that allows users to instantly clone and customize public trips curated by others.

---

## ✨ Core Features

1. **Intelligent Itinerary Builder:** Create trips, add multiple city stops, and visually organize your schedule day-by-day.
2. **Dynamic Cost Breakdown:** Automatically tracks your expenses and visualizes them by category so you never go over budget.
3. **Community Feed & Trip Forking:** Share your best trips with the world. See a public trip you like in the Community Feed? Click **"Fork Itinerary"** to instantly clone all of its cities and activities into your own private workspace to customize!
4. **Activity Search Modal:** A sleek UI to browse and select popular local activities, complete with estimated costs and durations.
5. **Admin Analytics Dashboard:** A real-time data visualization dashboard tracking platform usage, new signups, and most popular destinations.
6. **Secure Authentication:** Full JWT-based login and registration system secured with bcrypt password hashing.

---

## 🛠 Tech Stack

**Frontend**
*   **React (Vite):** Lightning-fast modern frontend framework.
*   **Tailwind CSS:** For pixel-perfect, fully responsive styling and glassmorphism UI components.
*   **Zustand:** Lightweight and fast global state management.
*   **Recharts:** For rendering the beautiful data visualizations in the Admin Dashboard.
*   **Lucide React:** Beautiful, consistent iconography.

**Backend**
*   **Node.js & Express:** Robust backend server handling all API routing.
*   **Prisma ORM:** Type-safe database querying and schema management.
*   **PostgreSQL:** Relational database for storing users, trips, stops, and activities.
*   **JWT & bcrypt:** For secure user authentication and session management.

---

## 🔄 User Workflow

1. **Onboarding:** The user creates an account and is dropped into their personal Dashboard showing their upcoming trips and total spending.
2. **Creating a Trip:** The user clicks "Plan a New Trip", selects their dates, gives it a name, and chooses whether to make it **Public** (shared with the community) or **Private**.
3. **Building the Itinerary:** 
    *   The user adds "Stops" (e.g., Paris for 3 days, Rome for 4 days).
    *   Within each stop, they click "+ Add Activity" to open the Activity Search Modal and add items (like "Eiffel Tower Tour" or "Sushi Tasting") to their timeline.
4. **Tracking Budget:** As activities are added, the visual Cost Breakdown header updates in real-time, grouping expenses by category.
5. **Community Discovery:** A user navigates to the Community tab, finds an amazing "Alps Roadtrip" itinerary posted by someone else, and clicks **"Fork Itinerary"**. This creates a perfect copy in their own dashboard, where they can edit the activities to fit their own budget.

---

## 🚀 How to Run Locally

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL running locally or via a cloud provider (e.g., Supabase/Neon)

### 1. Backend Setup
```bash
cd backend
npm install

# Set up your environment variables
# Create a .env file and add:
# DATABASE_URL="postgresql://user:password@localhost:5432/globetrotter"
# JWT_SECRET="your_secret_key"

# Push the database schema
npx prisma db push

# (Optional) Seed the database with community data
npx tsx src/seedCommunity.ts

# Start the server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

---
*Built with ❤️ for Odoo X LDCE '26*
