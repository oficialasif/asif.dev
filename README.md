# Modern Portfolio

A modern, full-stack portfolio application built with Next.js and Express.js.

## Project Structure

```
Modern_Port/
├── frontend/          # Next.js application
│   ├── src/          # Source code (components, pages, API routes)
│   ├── public/       # Static assets
│   └── ...           # Next.js configuration files
├── backend/          # Express.js API server
│   ├── src/          # Backend source code
│   └── ...           # Backend configuration files
└── README.md
```

## Getting Started

This project consists of two separate applications that work together:

### Frontend (Next.js)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend (Express.js)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The backend API will run on the configured port (check `backend/.env` for configuration).

## Environment Variables

- **Frontend**: Create a `.env.local` file in the `frontend/` directory
- **Backend**: Create a `.env` file in the `backend/` directory

Refer to the respective directories for required environment variables.

## Development

- Frontend uses Next.js 16 with App Router
- Backend uses Express.js with TypeScript
- Both applications can run concurrently during development

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)

## Deploy

- **Frontend**: Deploy to [Vercel](https://vercel.com/new) or any Next.js-compatible platform
- **Backend**: Deploy to any Node.js hosting service
