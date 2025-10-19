# Equipment Maintenance Tracker

A full-stack web application for managing equipment and tracking maintenance logs across multiple facilities.  
Built with **Next.js**, **Express.js**, **Prisma**, **MySQL**, and **JWT Authentication**.

---

## Features

- **Role-based authentication** (Admin / Technician)
- **Equipment management**
  - Create, update, and delete equipment
  - Track next maintenance dates
- **Maintenance logs**
  - Add, edit, and delete maintenance entries
  - Automatically linked to corresponding equipment
- **User-aware actions**
  - Only admins can modify or delete equipment
  - Technician can log maintenance activities
- **Responsive modern UI**
  - Built with Tailwind CSS for clean, consistent styling
  - Fully functional on mobile and desktop

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | Next.js (App Router), React, Tailwind CSS       |
| Backend    | Express.js, Prisma ORM                          |
| Database   | MySQL                                           |
| Auth       | JSON Web Tokens (JWT)                           |
| Deployment | Vercel (frontend) / Render or Railway (backend) |

---

## ⚙️ Installation & Setup

### Clone the repository

```bash
git clone https://github.com/yourusername/equipment-maintenance-tracker.git
cd equipment-maintenance-tracker
```

### Install dependencies

```bash
# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install
```

### Configure environment variables

```bash
# Backend .env
DATABASE_URL="mysql://username:password@localhost:3306/maintenance_db"
JWT_SECRET="your_jwt_secret_here"
PORT=5000

# Frontend .env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Initialize database

```bash
# Inside /server
pnpx prisma migrate dev --name init
pnpx prisma db seed
```

### Run development servers

```bash
# Run backend
cd backend
npm run dev

# Run frontend
cd ../frontend
npm run dev
```

Your app should now be live on:

Frontend → http://localhost:3000
Backend API → http://localhost:5000/api

## Future Improvements

- Dashboard analytics (maintenance frequency, cost trends)
- Email or in-app notifications for upcoming maintenance
- Export maintenance reports to CSV or PDF
- Dark mode UI
- User and Role management via admin panel
