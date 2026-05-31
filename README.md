# Ali Hamad — Portfolio

Full-stack portfolio with admin panel, persistent database, and media storage.

---

## Project Structure

```
ali-portfolio/          ← React frontend (deploy to Vercel)
portfolio-backend/      ← FastAPI backend (deploy to Railway)
```

---

## Quick Start

### 1. Frontend
```bash
cd ali-portfolio
npm install
# create .env from .env.example and fill VITE_API_URL
npm run dev
```

### 2. Backend
```bash
cd portfolio-backend
pip install -r requirements.txt
# create .env from .env.example and fill all variables
uvicorn app.main:app --reload
```

---

## Deploy

### Backend → Railway
1. Push `portfolio-backend/` to a GitHub repo
2. Connect to Railway → add all env variables from `.env.example`
3. Railway gives you a URL like `https://xxx.up.railway.app`

### Frontend → Vercel
1. Push `ali-portfolio/` to a GitHub repo
2. Connect to Vercel → add `VITE_API_URL` = your Railway URL
3. Deploy → get your live URL

---

## Environment Variables

### Backend (`portfolio-backend/.env`)
| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (change `postgresql://` to `postgresql+asyncpg://`) |
| `ADMIN_PASSWORD` | Choose your own strong password |
| `JWT_SECRET` | Run: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `UPLOADCARE_PUBLIC_KEY` | uploadcare.com → Dashboard → API Keys |
| `UPLOADCARE_SECRET_KEY` | uploadcare.com → Dashboard → API Keys |

### Frontend (`ali-portfolio/.env`)
| Variable | Value |
|---|---|
| `VITE_API_URL` | Your Railway backend URL |

---

## Admin Panel
- Visit your portfolio URL
- Click **⚙ Admin** in the nav
- Enter your `ADMIN_PASSWORD`
- Add/edit/delete projects, upload photos & videos, edit bio and skills

## Tech Stack
- **Frontend**: React 18, Vite, custom CSS
- **Backend**: FastAPI, SQLAlchemy async, PostgreSQL
- **Database**: Supabase (PostgreSQL)
- **Media**: Uploadcare CDN
- **Auth**: JWT (server-side, password never in browser)
- **Deploy**: Vercel (frontend) + Railway (backend)
