# Taskify

Taskify is a comprehensive, full-stack productivity suite built primarily for personal use. It was uniquely designed and **vibe coded** from the ground up to feature an elegant, dark-mode glassmorphic aesthetic (Obsidian Kinetic) that expands responsively from a mobile-friendly view to an ultra-wide desktop setup.

## 🚀 Tech Stack

**Frontend:**
- React 18 & TypeScript
- Vite (Build Tooling)
- Tailwind CSS (Styling & Glassmorphism)
- Zustand (State Management)
- Framer Motion (Micro-animations & Route Transitions)
- Lucide React (Iconography)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Database)
- JSON Web Tokens (JWT) & Bcrypt (Authentication/Security)
- Zod (Schema Validation)

## 💡 Features & Usage

1. **Authentication**: Secure your environment by creating an account. The suite utilizes encrypted passwords and JWT to lock down all your targets.
2. **Dynamic Dashboard**: Split between `Today's Focus` and `Plan Tomorrow`. Focus on granular progression every day. Tasks automatically roll over at midnight.
3. **Macro Target Tracking**: Link daily tasks to massive overarching macro-targets, visually tracking progress through a central ring-based metrics screen.
4. **Schedule & Objectives**: Set overarching monthly global goals, mapped onto a flexible calendar layout.
5. **Analytics Engine**: The platform analyzes all historical database records to pull your consistency trajectory and your aggregate macro goal completion rates.

## 🛠️ How to Replicate

Taskify requires a dual-run environment for its frontend client and backend server.

### 1. Prerequisites
- Node.js installed on your machine.
- A local MongoDB instance running locally (e.g. `mongodb://127.0.0.1:27017/taskify`).

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Run `npm install` to load all packages.
3. Create a `.env` file inside the `backend` directory with your secrets:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskify
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Run `npm run dev` to start the backend server on port 5000.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Run `npm install` to load all UI/UX packages.
3. Because the frontend relies on Vite proxies (acting as an interceptor for `/api` to port 5000), no intricate environment variable mapping is required out of the box unless deploying for production.
4. Run `npm run dev` and open your browser to the local Vite port (usually `http://localhost:5173`).

---
*Taskify was heavily vibe coded to match a specific stylistic workflow.*
