# Business ERP System

A comprehensive business resource planning system built with Next.js, TypeScript, and Prisma.

## Features

- 📊 Dashboard with key metrics and analytics
- 👥 Employee management
- 📋 Project management
- ⏱️ Time tracking
- 💰 Expense management
- 📈 Reports and analytics

## Tech Stack

- **Frontend:**

  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - Headless UI
  - React Query
  - React Hook Form
  - Zod for validation

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - SQLite (can be easily switched to PostgreSQL)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd business-erp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
business-erp/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility functions and configurations
│   └── types/              # TypeScript type definitions
├── prisma/                  # Database schema and migrations
└── public/                 # Static assets
```

## Development

- Run tests: `npm test`
- Build for production: `npm run build`
- Start production server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
