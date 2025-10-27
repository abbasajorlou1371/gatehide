# Environment Configuration for GateHide Frontend

## Production Setup

To configure the frontend for production deployment:

### 1. Environment Variables

Create a `.env.production` file in the frontend directory with:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.gatehide.com
```

### 2. Local Development

For local development, create a `.env.local` file with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3. Build and Start

```bash
# Build the application
npm run build

# Start in production mode on port 3000
npm start
```

The application will now:
- Run on port 3000 in production
- Send API requests to `https://api.gatehide.com`
- Handle image uploads from the production API domain
