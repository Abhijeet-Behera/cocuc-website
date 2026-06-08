# Union Church Website

This project utilizes a modern, separated architecture with three main components:
1. **Frontend**: Next.js React Application (Static Export)
2. **Backend**: Lightweight PHP API (Authentication, Blogs, Announcements)
3. **Database**: MySQL hosted on Hostinger

![System Architecture](frontend/public/architecture_diagram.png)

---

## 🏗️ System Architecture & Workflow

- **Next.js Frontend (`/frontend`)**: A highly optimized static React application. It handles routing, UI animations (via GSAP and Framer Motion), and consumes API endpoints. It is compiled into static HTML/JS files (`/out`) for rapid deployment.
- **PHP API (`/backend`)**: A robust, lightweight RESTful backend using pure PHP. It securely handles JWT-based authentication, integrates with Google OAuth for YouTube Events, manages admin sessions, and provides CRUD operations for blogs and church announcements.
- **MySQL Database**: A relational database running on Hostinger. It acts as the source of truth for user credentials, dynamic content, and activity logs.

### 🗄️ Database Schema
The database currently consists of four core tables:
- `users`: Stores administrator details, hashed passwords, and designations (Pastor, Secretary, Developer).
- `blogs`: Stores church blog posts with rich content and thumbnail paths.
- `announcements`: Stores important church announcements and optional media.
- `broadcasts`: Stores broadcast messages for the community.

---

## 🚀 How to Run the Project Locally

You will need to open **two separate terminals**.

### Terminal 1: Start the Backend (PHP Built-in Server)
Open a terminal, navigate to the backend, and start the local PHP server. Make sure `db_config.php` has `DB_HOST` pointing to the Hostinger Remote MySQL IP if developing locally.

```powershell
cd backend
php -S localhost:8000
```
*(The API will be available at http://localhost:8000)*

### Terminal 2: Start the Frontend UI Server
Open a second terminal, navigate to the frontend, and run the dev command. This boots up the full Next.js UI and API routes.

```powershell
cd frontend
npm install
npm run dev
```
*(The website will open at http://localhost:3000)*

---

## 📦 Deployment Workflow (Hostinger SSH)

To deploy updates to the live server at `unionchurch.in` without uploading the massive `node_modules` folder, follow this streamlined terminal workflow from your Windows Command Prompt (`cmd`):

### 1. Build & Zip Frontend
Navigate to the frontend folder, compile the production build, and create a lightweight zip file of the output:
```cmd
cd /d e:\church-website\frontend
npm run build
cd out
tar.exe -a -c -f build.zip *
```

### 2. Zip Backend
Navigate to the backend folder and package the PHP API scripts:
```cmd
cd /d e:\church-website\backend
tar.exe -a -c -f backend.zip *
```

### 3. Upload via SCP
Securely copy both generated `.zip` files directly to the server's `public_html` directory:
```cmd
cd /d e:\church-website
scp -P 65002 frontend\out\build.zip u841666234@217.21.91.190:~/domains/unionchurch.in/public_html/
scp -P 65002 backend\backend.zip u841666234@217.21.91.190:~/domains/unionchurch.in/public_html/backend/
```

### 4. Extract on the Server via SSH
Log into Hostinger, extract the contents, and instantly apply the updates:
```cmd
ssh -p 65002 u841666234@217.21.91.190
```
*(After logging in, run the following commands):*
```bash
cd domains/unionchurch.in/public_html
unzip -o build.zip && rm build.zip
cd backend
unzip -o backend.zip && rm backend.zip
exit
```
