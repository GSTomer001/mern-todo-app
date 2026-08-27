# 📝 MERN Todo App

A full-stack Todo application built with the MERN stack:

- **M**ongoDB – document database (via Mongoose)
- **E**xpress.js – REST API backend
- **R**eact – modern responsive UI (built with **Vite**)
- **N**ode.js – JavaScript runtime

## Folder Structure

```
├── backend/                 # Express REST API
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Request handlers (CRUD logic)
│   ├── models/Todo.js       # Mongoose schema
│   ├── routes/todoRoutes.js # API route definitions
│   ├── server.js            # App entry point
│   └── .env                 # Port + Mongo URI config
├── frontend/                # React (Vite) single-page app
│   ├── src/
│   │   ├── api/todoApi.js        # Fetch wrapper for REST calls
│   │   ├── components/           # TodoForm, TodoItem, TodoList
│   │   ├── App.jsx               # Root component & state
│   │   └── main.jsx              # React entry point
│   └── vite.config.js       # Dev server + /api proxy
└── README.md
```

## Prerequisites

- **Node.js** (v18+)
- **MongoDB**

### MongoDB option A — portable (no install, no admin)

If MongoDB isn't installed system-wide, a portable copy is used.
Download the **Windows ZIP** of MongoDB Community Server
(https://www.mongodb.com/try/download/community) and extract it to:

```
%LOCALAPPDATA%\mongodbLocal\mongodb-win32-x86_64-windows-<version>\
```

(it must contain `bin\mongod.exe`). Then start it:

```powershell
.\backend\scripts\start-mongodb.ps1
```

or manually:

```powershell
& "$env:LOCALAPPDATA\mongodbLocal\mongodb-win32-x86_64-windows-8.0.7\bin\mongod.exe" `
  --dbpath "$env:LOCALAPPDATA\mongodbLocal\data\db" --port 27017 --bind_ip 127.0.0.1
```

To stop it: `.\backend\scripts\stop-mongodb.ps1`

### MongoDB option B — install locally or use Atlas

- Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  and start the service, **or**
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  and set `MONGO_URI` in `backend/.env` to its connection string.

## Run the Backend

```bash
cd backend
npm install
npm run dev        # nodemon, auto-restarts on change (or: npm start)
```

The API runs at `http://localhost:5000` — but only once "MongoDB Connected"
appears. If the database is unreachable, the server prints clear
troubleshooting steps and exits instead of pretending to be up.

## Run the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> The Vite dev server proxies `/api` to `http://localhost:5000`, so the browser
> talks to a single origin — no CORS configuration needed in development.

> **Windows PowerShell tip:** if `npm` gives an error like *"npm.ps1 cannot be
> loaded because running scripts is disabled"*, use `npm.cmd` instead, e.g.
> `npm.cmd run dev`, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Frontend shows "Failed to execute 'json'... / Unexpected end of JSON input" | Backend wasn't running. Start MongoDB + `node server.js` in backend/, then refresh. |
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB isn't running — use `.\backend\scripts\start-mongodb.ps1`. |
| Port 5000 already in use | Another process is using it; change `PORT` in `backend/.env`. |

## REST API

| Method   | Endpoint          | Description              |
|----------|-------------------|--------------------------|
| `GET`    | `/api/todos`      | List all todos          |
| `POST`   | `/api/todos`      | Create a todo           |
| `PUT`    | `/api/todos/:id`  | Update a todo           |
| `DELETE` | `/api/todos/:id`  | Delete a todo           |

Example request body for `POST` / `PUT`:

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

## Deploy to Vercel

This repo is Vercel-ready: the React app builds to `frontend/dist` and the
Express API runs as Vercel serverless functions (`api/`), reusing the exact
same controllers/models as the local backend.

1. **Database** – Vercel can't reach your local MongoDB, so create a free
   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and copy its
   connection string (cluster → *Connect* → *Drivers*, replace `<password>`).
2. **Project** – Import the repo `GSTomer001/mern-todo-app` on Vercel
   (Framework Preset: **Other**, Build Command: `cd frontend && npm install && npm run build`,
   Output Directory: `frontend/dist` — these are already in `vercel.json`).
3. **Environment variable** – Add `MONGO_URI` = your Atlas connection string
   (Production + Preview). In Atlas allow the IP `0.0.0.0/0` (Network Access).
4. **Deploy** – Vercel builds and serves:
   - `https://<project>.vercel.app` → the React app
   - `/api/todos`, `/api/todos/:id`, `/api/health` → serverless API functions

> If the site shows the **login page** instead of the app, your project has
> *Deployment Protection* enabled — turn off *Vercel Authentication* under
> Settings → Deployment Protection.

## Production Build

```bash
cd frontend
npm run build        # outputs to frontend/dist
npm run preview      # preview the production build
```