# FinanceTracker - Personal Finance Management Application

A comprehensive personal finance tracking application built with React, Express.js, and PostgreSQL. Track transactions, visualize spending patterns, and manage your financial health with an intuitive dashboard.

## Features

### Stage 1: Basic Transaction Tracking ✅
- Add/Edit/Delete transactions with amount, date, and description
- Transaction list view with sorting and filtering
- Monthly expenses bar chart visualization
- Comprehensive form validation

### Stage 2: Categories ✅
- Predefined categories for transactions (Food, Transportation, Shopping, etc.)
- Category-wise pie chart visualization
- Dashboard with summary cards showing:
  - Total balance
  - Monthly income and expenses
  - Savings rate
  - Recent transactions

### Stage 3: Advanced Features ✅
- Real-time data persistence with PostgreSQL
- Interactive charts with Recharts
- Responsive design with mobile support
- Professional UI with shadcn/ui components

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Recharts** for data visualization
- **React Query** for state management
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Neon serverless hosting
- **Drizzle ORM** for database operations
- **Zod** for request validation

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd finance-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
DATABASE_URL=your-postgresql-connection-string
```

4. Push database schema
```bash
npm run db:push
```

5. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
3. Deploy automatically on push to main branch

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── lib/        # Utility functions
│   │   └── hooks/      # Custom React hooks
├── server/           # Backend Express application
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database configuration
├── shared/           # Shared types and schemas
│   └── schema.ts     # Database schema and validation
└── vercel.json       # Vercel deployment configuration
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/analytics/summary` - Get dashboard summary
- `GET /api/analytics/categories` - Get category breakdown
- `GET /api/analytics/monthly-expenses` - Get monthly expense data

## Database Schema

### Transactions Table
- `id` - Primary key
- `amount` - Transaction amount (decimal)
- `description` - Transaction description
- `category` - Transaction category
- `date` - Transaction date
- `type` - Transaction type (income/expense)
- `createdAt` - Creation timestamp

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.