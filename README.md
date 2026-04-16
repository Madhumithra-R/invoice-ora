# Invoiceora - AI Invoice Management System

![Invoiceora](https://via.placeholder.com/800x400.png?text=Invoiceora+SaaS)

Build a production-ready full stack SaaS web application for creating and managing invoices with AI parsing capabilities.

## Features
- **Ultra-modern SaaS UI**: Designed with Glassmorphism, tailored gradients, and engaging micro-interactions.
- **Authentication**: JWT-based login & registration.
- **Dashboard**: Track your revenue, pending amounts, and see visual charts.
- **Invoice Management**: Create, edit, delete invoices.
- **PDF Generation**: Instantly download invoices as professional PDFs.
- **AI PDF Parsing (Mocked)**: Upload an invoice PDF and automatically extract vendor names, dates, and amounts.

## Tech Stack
- Frontend: React + Vite, TailwindCSS, Framer Motion, Recharts
- Backend: Node.js, Express, MongoDB (Mongoose), jsonwebtoken
- Tools: Multer, pdf-parse, jspdf

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder (you can refer to `.env.example` in the root):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/invoiceora
JWT_SECRET=supersecretjwtkey
```
Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 3. Usage
Open `http://localhost:5173` in your browser. Register a new user account, login, and explore the Dashboard!

## Clean Modular Architecture
The repository uses a split structure for maximum scalability:
- `/backend`: Contains `controllers`, `models`, `routes`, and `middleware`.
- `/frontend`: Features a standard React structure with `components`, `pages`, and centralized styling via `index.css` and `tailwind.config.js`.
