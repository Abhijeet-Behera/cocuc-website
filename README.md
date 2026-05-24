# Union Church Website

This project is separated into a clean monorepo architecture with two main components:
1. **Frontend**: Next.js React Application
2. **Backend**: Prisma Database Architecture & Data Scripts

---

## 🚀 How to Run the Project

You will need to open **two separate terminals**.

### Terminal 1: Start the Backend & Database Server
Open a terminal, navigate to the backend, and run the dev command. This will sync your database schema, generate the client, and start Prisma Studio (a visual database management server).

```powershell
cd backend
npm run dev
```
*(Prisma Studio will open at http://localhost:5555 to view your data)*

### Terminal 2: Start the Frontend UI Server
Open a second terminal, navigate to the frontend, and run the dev command. This boots up the full Next.js UI and API routes.

```powershell
cd frontend
npm install
npm run dev
```
*(The website will open at http://localhost:3000)*
