# Business ERP System

A modern, full-stack Enterprise Resource Planning (ERP) system built with Next.js, Prisma, and TypeScript.

## Features

### 🔐 Authentication & Authorization

- Role-based access control (ADMIN, MANAGER, EMPLOYEE)
- Secure authentication with JWT tokens
- Protected API routes and middleware
- Automatic redirection for unauthenticated users

### 👥 Employee Management

- Complete CRUD operations for employees
- Role assignment and management
- Bulk actions (select multiple employees)
- Search and filter functionality

### 📊 Project Management

- Project creation and assignment
- Team member allocation
- Project status tracking
- Timeline management with start/end dates

### ⏱️ Time Tracking

- Time entry logging
- Project-based time tracking
- Detailed time reports
- Historical time data

### 💰 Expense Management

- Expense tracking and reporting
- Expense approval workflow
- Project-based expense allocation
- Status tracking (PENDING, APPROVED, REJECTED)

### 📊 Database Inspector

- Interactive table viewer
- Real-time data filtering
- Column sorting
- JSON data exploration
- Row selection and bulk actions
- Copy functionality
- Responsive design

### 🎨 Modern UI/UX

- Clean, modern interface
- Dark mode support
- Responsive design
- Interactive animations
- Loading states and feedback
- Error handling and notifications

## Tech Stack

- **Frontend**:

  - Next.js 14 (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Heroicons

- **Backend**:

  - Node.js
  - Prisma ORM
  - Neon PostgreSQL Database
  - JWT Authentication

- **Development**:
  - ESLint
  - Prettier
  - TypeScript
  - Git

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Neon PostgreSQL account (free tier available)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd business-erp
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Neon PostgreSQL connection string:

   ```
   DATABASE_URL="postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require"
   ```

4. Initialize the database:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Default Users

After seeding the database, you can log in with these default accounts:

- **Admin**:

  - Email: admin@company.com
  - Password: admin123

- **Manager**:

  - Email: manager@company.com
  - Password: manager123

- **Employee**:
  - Email: employee@company.com
  - Password: employee123

## Project Structure

```
business-erp/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utility functions
│   └── middleware.ts    # Auth middleware
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Seed data
└── public/             # Static assets
```

## Role-Based Access

### Admin

- Full access to all features
- Employee management
- Role management
- System settings
- Database inspection

### Manager

- Project management
- Team management
- Expense approval
- Report access
- Limited employee management

### Employee

- Time tracking
- Expense submission
- Personal dashboard
- Document access

## API Routes

### Authentication

- POST /api/auth/signin
- POST /api/auth/signup
- GET /api/auth/signout

### Employees

- GET /api/employees
- POST /api/employees
- PUT /api/employees/[id]
- DELETE /api/employees/[id]

### Projects

- GET /api/projects
- POST /api/projects
- PUT /api/projects/[id]
- DELETE /api/projects/[id]

### Time Entries

- GET /api/time-entries
- POST /api/time-entries
- PUT /api/time-entries/[id]
- DELETE /api/time-entries/[id]

### Expenses

- GET /api/expenses
- POST /api/expenses
- PUT /api/expenses/[id]
- DELETE /api/expenses/[id]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Neon PostgreSQL for the free cloud database
- All contributors and users of this project
