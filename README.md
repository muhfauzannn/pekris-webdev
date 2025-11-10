# Tugas Tracker API

REST API untuk mengelola mata kuliah dan tugas dengan sistem autentikasi API Key. Dibangun dengan Next.js, Prisma ORM, dan PostgreSQL.

## Features

- ✨ **API Key Authentication** - Generate dan kelola API keys
- 📚 **Mata Kuliah Management** - CRUD operations mata kuliah
- 📝 **Tugas Management** - CRUD operations tugas dengan status tracking
- 🔐 **Secure Authentication** - Bearer token authentication
- 🎯 **Status Tracking** - Belum Dikerjakan, Dikerjakan, Selesai
- 📅 **Deadline Management** - Set dan track deadline tugas
- 📊 **Statistics** - Get summary statistics for your data
- 🚀 **Swagger Documentation** - Interactive API documentation

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** API Key with bcryptjs hashing
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Documentation:** Swagger UI

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL server

### Installation

1. Clone dan install:

```bash
git clone [repository-url]
cd pekris-webdev
pnpm install
```

2. Setup environment (.env):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

3. Setup database:

```bash
npx prisma migrate dev
```

4. Start server:

```bash
pnpm dev
```

5. Buka [http://localhost:3000](http://localhost:3000) untuk generate API Key.
6. Buka [http://localhost:3000/docs](http://localhost:3000/docs) untuk Swagger documentation.

## API Endpoints

### Authentication

- `POST /api/apikey` - Generate API key
- `GET /api/apikey` - List API keys

### Mata Kuliah

- `GET /api/matkul` - Get all mata kuliah
- `POST /api/matkul` - Create mata kuliah
- `GET /api/matkul/{id}` - Get by ID
- `PUT /api/matkul/{id}` - Update
- `DELETE /api/matkul/{id}` - Delete

### Tugas

- `GET /api/tugas` - Get all tugas (with filtering)
- `POST /api/tugas` - Create tugas
- `GET /api/tugas/{id}` - Get by ID
- `PUT /api/tugas/{id}` - Update
- `DELETE /api/tugas/{id}` - Delete

### System

- `GET /api/health` - Health check
- `GET /api/stats` - Get statistics summary

📚 **Dokumentasi API Lengkap:**

- **Swagger UI**: http://localhost:3000/docs (Interactive API Documentation)
- **Quick Start Guide**: [QUICK_START.md](./QUICK_START.md)
- **API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Status Tugas

- `BELUM_DIKERJAKAN` - Belum dikerjakan
- `DIKERJAKAN` - Sedang dikerjakan
- `SELESAI` - Sudah selesai

## Quick Example

```bash
# 1. Generate API Key
curl -X POST http://localhost:3000/api/apikey \
  -H "Content-Type: application/json" \
  -d '{"name": "My API Key"}'

# 2. Create Mata Kuliah
curl -X POST http://localhost:3000/api/matkul \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Pemrograman Web",
    "deskripsi": "Web development course",
    "sks": 3
  }'

# 3. Get Statistics
curl -X GET http://localhost:3000/api/stats \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production app
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Management

```bash
# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name

# View data with Prisma Studio
npx prisma studio
```

## License

MIT License
