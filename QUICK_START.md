# Tugas Tracker API - Quick Start Guide

## 🚀 Quick Start

### Step 1: Generate API Key

```bash
curl -X POST http://localhost:3000/api/apikey \
  -H "Content-Type: application/json" \
  -d '{"name": "My First API Key"}'
```

**Response:**

```json
{
  "id": "clkw7x8y30000c5z9v8w2m3n4",
  "key": "abc123def456ghi789jkl012mno345pq",
  "name": "My First API Key",
  "createdAt": "2023-11-10T10:00:00.000Z"
}
```

### Step 2: Create Mata Kuliah

```bash
curl -X POST http://localhost:3000/api/matkul \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abc123def456ghi789jkl012mno345pq" \
  -d '{
    "nama": "Pemrograman Web",
    "deskripsi": "Mata kuliah tentang pengembangan aplikasi web modern",
    "sks": 3
  }'
```

**Response:**

```json
{
  "id": "clkw7x8y30001c5z9v8w2m3n4",
  "nama": "Pemrograman Web",
  "deskripsi": "Mata kuliah tentang pengembangan aplikasi web modern",
  "sks": 3,
  "apiKeyId": "clkw7x8y30000c5z9v8w2m3n4",
  "createdAt": "2023-11-10T10:05:00.000Z",
  "updatedAt": "2023-11-10T10:05:00.000Z",
  "_count": {
    "tugas": 0
  }
}
```

### Step 3: Create Tugas

```bash
curl -X POST http://localhost:3000/api/tugas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abc123def456ghi789jkl012mno345pq" \
  -d '{
    "nama": "Membuat Landing Page",
    "deskripsi": "Buat landing page responsif dengan HTML, CSS, dan JavaScript",
    "mataKuliahId": "clkw7x8y30001c5z9v8w2m3n4",
    "deadline": "2023-11-25T23:59:59.000Z",
    "status": "BELUM_DIKERJAKAN"
  }'
```

**Response:**

```json
{
  "id": "clkw7x8y30002c5z9v8w2m3n4",
  "nama": "Membuat Landing Page",
  "deskripsi": "Buat landing page responsif dengan HTML, CSS, dan JavaScript",
  "status": "BELUM_DIKERJAKAN",
  "deadline": "2023-11-25T23:59:59.000Z",
  "mataKuliahId": "clkw7x8y30001c5z9v8w2m3n4",
  "createdAt": "2023-11-10T10:10:00.000Z",
  "updatedAt": "2023-11-10T10:10:00.000Z",
  "mataKuliah": {
    "id": "clkw7x8y30001c5z9v8w2m3n4",
    "nama": "Pemrograman Web",
    "sks": 3
  }
}
```

### Step 4: Update Tugas Status

```bash
curl -X PUT http://localhost:3000/api/tugas/clkw7x8y30002c5z9v8w2m3n4 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abc123def456ghi789jkl012mno345pq" \
  -d '{
    "nama": "Membuat Landing Page",
    "deskripsi": "Buat landing page responsif dengan HTML, CSS, dan JavaScript",
    "deadline": "2023-11-25T23:59:59.000Z",
    "status": "DIKERJAKAN"
  }'
```

### Step 5: Get All Tugas

```bash
curl -X GET http://localhost:3000/api/tugas \
  -H "Authorization: Bearer abc123def456ghi789jkl012mno345pq"
```

## 📊 Status Tugas

- **BELUM_DIKERJAKAN**: Tugas belum mulai dikerjakan
- **DIKERJAKAN**: Tugas sedang dalam progress
- **SELESAI**: Tugas sudah selesai dikerjakan

## 🔐 Authentication

Semua endpoint API (kecuali `/api/apikey`) memerlukan Bearer token di header:

```
Authorization: Bearer YOUR_API_KEY
```

## 🎯 Best Practices

1. **Simpan API Key dengan aman** - API key hanya ditampilkan sekali saat dibuat
2. **Gunakan HTTPS di production** - Jangan kirim API key melalui HTTP biasa
3. **Set deadline yang realistis** - Gunakan format ISO 8601 untuk tanggal
4. **Update status tugas secara berkala** - Tracking progress yang akurat

## 🔍 Filtering Tugas

Anda bisa filter tugas berdasarkan:

- **Mata Kuliah**: `?mataKuliahId=YOUR_MATKUL_ID`
- **Status**: `?status=DIKERJAKAN`
- **Kombinasi**: `?mataKuliahId=ID&status=SELESAI`

```bash
# Filter tugas yang sedang dikerjakan
curl -X GET "http://localhost:3000/api/tugas?status=DIKERJAKAN" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Filter tugas berdasarkan mata kuliah
curl -X GET "http://localhost:3000/api/tugas?mataKuliahId=YOUR_MATKUL_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 🚨 Error Handling

API akan mengembalikan status code dan pesan error yang jelas:

- **400**: Bad Request - Data input tidak valid
- **401**: Unauthorized - API key tidak valid atau missing
- **404**: Not Found - Resource tidak ditemukan
- **500**: Internal Server Error - Error dari server

## 📱 Ready to Use!

Dokumentasi lengkap tersedia di [http://localhost:3000/docs](http://localhost:3000/docs)
