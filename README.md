# Stock Community MVP

A Next.js 14 application for tracking stock market indices and managing personal watchlists.

## Features

- **Market Indices Dashboard**: Real-time charts for KOSPI, KOSDAQ, S&P 500, and NASDAQ
- **Personal Watchlist**: Track up to 5 favorite stocks with price changes
- **User Authentication**: Secure signup/login with JWT tokens
- **Stock Selection**: Interactive interface to add stocks from top 15 companies
- **Market News**: Latest economic news and updates

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Charts**: Recharts
- **Authentication**: JWT with bcrypt
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)

### Running with Docker

1. Clone the repository
2. Start the application:

```bash
docker-compose up
```

The application will be available at `http://localhost:3000`

### Database Setup

The database will be automatically created when you start the Docker containers. To set up the schema:

```bash
# Enter the app container
docker exec -it stock-community-app sh

# Generate Prisma client and push schema
npm run db:generate
npm run db:push
```

### Local Development

If you prefer to run locally:

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start PostgreSQL (via Docker):
```bash
docker-compose up db
```

4. Set up database:
```bash
npm run db:generate
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── watchlist/         # Watchlist pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility libraries
├── prisma/               # Database schema
└── docker-compose.yaml   # Docker configuration
```

## API Endpoints

- `GET /api/auth/me` - Get current user
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add stock to watchlist
- `DELETE /api/watchlist` - Remove stock from watchlist

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## Features Implementation

### Authentication
- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt
- Protected routes and API endpoints

### Watchlist Management
- Maximum 5 stocks per user
- Duplicate prevention
- Real-time price updates (mock data)

### Market Data
- Interactive charts with Recharts
- Mock data for indices and stock prices
- Responsive design with Tailwind CSS

## Production Deployment

1. Update environment variables for production
2. Change JWT_SECRET to a secure random string
3. Configure proper database credentials
4. Build and deploy with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License