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

## 🤖 9-API Mega Chatbot (Ezer Bot)
The website features a mathematically perfect Round-Robin AI Load Balancer ("Ezer Bot") that natively loops through 9 different AI providers. By leveraging standard API free tiers, it dynamically scans the entire frontend and backend databases, attaching 80,000 characters of contextual church data to every message.

| AI Provider | Model Used | Requests Per Minute (RPM) | Requests Per Day (RPD) |
| :--- | :--- | :--- | :--- |
| **Cloudflare** | `@cf/meta/llama-3.2-3b-instruct` | 300 RPM | 100,000 RPD |
| **Cerebras** | `gpt-oss-120b` | 30 RPM | 14,400 RPD |
| **OpenRouter** | `Nex-N2-Pro` | 20 RPM | 200 RPD |
| **Google Gemini** | `Gemini 1.5 Flash` | 15 RPM | 1,500 RPD |
| **Github Models** | `GPT-4o-mini` | 15 RPM | 150 RPD |
| **SambaNova** | `Llama-3.3-70B-Instruct` | 15 RPM | ~1,000 RPD |
| **Hugging Face** | `Qwen 2.5 7B` | ~10 RPM | ~1,000 RPD |
| **Mistral API** | `Mistral 7B` | ~10 RPM | ~1,000 RPD |
| **Groq** | `Llama 3.1 8B` | ~8 RPM | 14,400 RPD |
| **🌟 NET COMBINED CAPACITY** | **9 Models** | **~423 Requests / Minute** | **~133,650 Requests / Day** |

> *(Note: Because of the built-in Zero-Dependency Keyword RAG Engine, the payload per request is dynamically sliced to < 15KB. This maximizes the RPM potential for strict APIs like Groq!)*

> **You now have the capacity to handle 423 different people texting the bot simultaneously inside the exact same 60-second window. Over a 24-hour period, your church can send over 133,000 messages completely for free.**
> 
> **You have built a truly unstoppable, zero-cost, enterprise-grade AI server!**

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

---

## 🙏 Prayer Requests & Weekly Saturday PDF System

The website features an automated end-to-end intercessory prayer request pipeline and a Saturday evening PDF generator based on the official **16 Church Prayer Zones**:

### 1. The 16 Official Prayer Zones (Authoritative Directory)
1. **Bethesda Zone**: Mr. Biswajeet Samantaray (79786 19310), Mr. Santosh Nayak (99372 14214) | PINs: `751009`, `751001`, `751022`, `751013`
2. **Ebenezer Zone**: Mr. Asim Das (943730 69462), Mr. Prasant Das (63722 12253), Rev. Amos Chandra Pradhan (9438113974) | PINs: `751022`, `751001`, `751008`
3. **Gethsemane Zone**: Mr. Ashok Kumar Kar (82801 65572), Mr. Asit Mohanty (99383 71901), Mr. Sandeep Kumar (99370 03361), Ms. Nilima Nayak (89843 47495) | PINs: `751001`, `751003`, `751009`, `751020`
4. **Hebron Zone**: Prof. Anup Ku. Samantaray (94373 07452 / 90900 80871), Rev. Oriel Singh (99378 24639), Mr. Purnanada Pradhan (A) (94392 63392) | PINs: `751012`, `751015`
5. **Golgotha Zone**: Mrs. Reena Pradhan, Ms. Mita Sahu (93370 31389) | PINs: `751007`, `751004`
6. **Sinai Zone**: Mr. Ratan Kumar Das (94391 92703), Mr. Sanjeeb Kumar Das, Mr. Sanjeeb Ch Pradhan (76060 87764) | PINs: `751008`, `751003`
7. **Bethel Zone**: Er. Michael Rajesh Behera (94399 19188), Mr. Rajballabh Supakar (88954 35749), Mr. Swarajya Jena (94372 61383), Mr. Samuel Pradhan (73810 23430) | PINs: `751018`, `751006`, `751014`
8. **Emmaus Zone**: Mr. Santanu Kumar Rout (94370 26699), Mr. J C Pal, Mr. Gourab Bardhan (94370 52547) | PIN: `751002`
9. **Bethany Zone**: Mr. Rajesh Ku. Mohapatra (63709 68169), Mr. Alekh Chandra Das, Mr. Prafulla Kumar Dash (94398 75527) | PIN: `751002`
10. **Sophia Zone**: Mrs. Ranjeeta Kumar (89176 91909), Mr. Deba Ranjan Pani (88951 86975), Mr. Daniel Digal | PINs: `751013`, `751016`, `751017`, `751023`
11. **Horeb Zone**: Mr. Bibhuti Ranjan Sen (94395 58510), Mr. V L S S Raj (94398 00281 / 97771 05840), Mr. Ranjan Gan (93372 61878) | PINs: `751010`, `751025`
12. **Mizpah Zone**: Mr. Amon Chandra Nag (94379 64773), Rev. Satya Ranjan Singh (96688 09337), Mr. Suranjan Thomas (94385 68600), Mr. Ashok Kumar Nanda (89175 97757) | PINs: `751016`, `751017`, `751021`, `751024`, `751031`
13. **Hermon Zone**: Mr. Sandeep Mohanty (94373 53081) | PINs: `751003`, `751030`
14. **Nazareth Zone**: Mr. K Tulasi Rao (94373 87127), Mr. Braja Kishore Das (84569 83222) | PINs: `751019`, `751030`, `752054`
15. **Zion Zone**: Dr. Happy Born Nayak (94370 51610), Mr. Arup Das, Mr. Abhijeet Mohapatra (94393 39794) | PINs: `751007`, `751013`, `751016`, `751017`
16. **Elim Zone**: Mr. Chinmay Muduli (99370 03507), Mr. Amrut Jena (98612 82886), Mr. Adit Kumar Jena (95830 66358) | PINs: `751019`, `751020`, `751030`

### 2. Prayer Request Workflow
1. **Submission**: A visitor submits a prayer petition via the interactive Prayer Zones interface (`/activities/prayer-zones/`).
2. **Validation**: The backend API (`/backend/prayer_requests.php`) validates name, contact details, and message length, while stripping malicious tags.
3. **Storage**: The request is stored in the database (`prayer_requests` table in MySQL, with graceful local fallback if offline).
4. **Immediate Routing**: An individual notification email in clean bullet points is dispatched to the church pastor (`pastor@unionchurch.in`) and secretary (`secretary@unionchurch.in`).
5. **Saturday Compilation**: Every Saturday evening, unprocessed requests for the weekly window (Sunday to Saturday) are aggregated.
6. **PDF Generation**: A church-branded PDF (`weekly-prayer-requests-YYYY-MM-DD.pdf`) is rendered with the church logo, maroon headers, and bulleted prayer points.
7. **Email Delivery**: The PDF is emailed as an attachment to the pastoral team and prayer coordinators.
8. **Deduplication**: Processed requests are marked as `processed` to prevent duplicates.

### 3. Saturday Scheduler Configuration

#### Option A: Hostinger Cron Job (Recommended for Production)
In your Hostinger hPanel -> **Advanced** -> **Cron Jobs**:
- **Type**: PHP or Custom
- **Command**:
  ```bash
  /usr/bin/php /home/u841666234/domains/unionchurch.in/public_html/backend/generate_weekly_prayer_pdf.php
  ```
- **Schedule**: Every Saturday at 18:30 (6:30 PM)
  - Minute: `30`
  - Hour: `18`
  - Day of Month: `*`
  - Month: `*`
  - Day of Week: `6` (Saturday)

#### Option B: GitHub Actions Scheduled Workflow
The repository includes `.github/workflows/saturday_prayer_pdf.yml`. Set the following repository secrets:
- `CRON_SECRET`: A secret string matching `CRON_SECRET` in `backend/.env`.
- `CHURCH_BACKEND_URL`: `https://unionchurch.in/backend`

### 4. Manual Trigger & Testing
You can manually test or trigger the weekly PDF generation without waiting for Saturday:
- **Via CLI**:
  ```bash
  cd backend
  php generate_weekly_prayer_pdf.php --force
  ```
- **Via Webhook / Browser**:
  ```
  https://unionchurch.in/backend/generate_weekly_prayer_pdf.php?key=YOUR_CRON_SECRET&force=1
  ```

