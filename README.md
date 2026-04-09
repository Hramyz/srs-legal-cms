# SRS Legal Solutions — Law Firm CMS

A full-featured Law Firm Content Management System built for SRS Legal Solutions.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Auth**: NextAuth.js (credentials provider) with role-based access
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Hramyz/srs-legal-cms.git
cd srs-legal-cms
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the values:
- `DATABASE_URL`: PostgreSQL connection string (Supabase recommended)
- `NEXTAUTH_SECRET`: A random secret string
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for local dev)

### 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 5. Seed the database

```bash
npx prisma db seed
```

### 6. Run the development server

```bash
npm run dev
```

### 7. Login

Open [http://localhost:3000](http://localhost:3000) and login with:
- **Email**: admin@srslegal.com
- **Password**: Admin@123

## Features

- 📊 Dashboard with stats, charts, and recent activity
- 👥 CRM: Cases, Clients, Calendar, Legal Quotes, Enquiries
- ⚖️ Lawyers management with approval workflow
- 💰 Finance: Invoices and Orders
- 🛠️ Services and Categories management
- 📄 Document management
- 🔐 Admin: Users and Roles with permission control

## Navigation

- **Dashboard**: Overview stats and charts
- **CRM**: Cases, Clients, Calendar, Legal Quote, Legal Enquiries
- **Lawyers**: All Lawyers, Lawyer Requests
- **Finance**: Billing, Orders
- **Services**: All Services, Categories
- **Content**: Content management
- **Documents**: Document upload and management
- **Admin**: Users, Roles
