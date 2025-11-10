# Tugas Tracker API Documentation

## Overview

API untuk mengelola mata kuliah dan tugas dengan sistem autentikasi menggunakan API Key.

## Authentication

Semua endpoint API (kecuali `/api/apikey`) memerlukan header Authorization dengan Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### API Key Management

#### Generate API Key

- **POST** `/api/apikey`
- **Body:**
  ```json
  {
    "name": "Optional API Key Name"
  }
  ```
- **Response:**
  ```json
  {
    "id": "clxxxxx",
    "key": "your_generated_api_key",
    "name": "Optional API Key Name",
    "createdAt": "2023-11-10T15:16:00.000Z"
  }
  ```

#### List API Keys

- **GET** `/api/apikey`
- **Response:**
  ```json
  [
    {
      "id": "clxxxxx",
      "name": "Optional API Key Name",
      "createdAt": "2023-11-10T15:16:00.000Z",
      "updatedAt": "2023-11-10T15:16:00.000Z",
      "_count": {
        "mataKuliah": 2
      }
    }
  ]
  ```

### Mata Kuliah Management

#### Get All Mata Kuliah

- **GET** `/api/matkul`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Response:**
  ```json
  [
    {
      "id": "clxxxxx",
      "nama": "Pemrograman Web",
      "deskripsi": "Mata kuliah tentang pengembangan web",
      "sks": 3,
      "createdAt": "2023-11-10T15:16:00.000Z",
      "updatedAt": "2023-11-10T15:16:00.000Z",
      "_count": {
        "tugas": 5
      }
    }
  ]
  ```

#### Create Mata Kuliah

- **POST** `/api/matkul`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Body:**
  ```json
  {
    "nama": "Pemrograman Web",
    "deskripsi": "Mata kuliah tentang pengembangan web",
    "sks": 3
  }
  ```

#### Get Mata Kuliah by ID

- **GET** `/api/matkul/{id}`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Response:**
  ```json
  {
    "id": "clxxxxx",
    "nama": "Pemrograman Web",
    "deskripsi": "Mata kuliah tentang pengembangan web",
    "sks": 3,
    "createdAt": "2023-11-10T15:16:00.000Z",
    "updatedAt": "2023-11-10T15:16:00.000Z",
    "tugas": [
      {
        "id": "clxxxxx",
        "nama": "Tugas 1",
        "deskripsi": "Membuat website",
        "status": "BELUM_DIKERJAKAN",
        "deadline": "2023-11-20T23:59:59.000Z",
        "createdAt": "2023-11-10T15:16:00.000Z",
        "updatedAt": "2023-11-10T15:16:00.000Z"
      }
    ],
    "_count": {
      "tugas": 1
    }
  }
  ```

#### Update Mata Kuliah

- **PUT** `/api/matkul/{id}`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Body:**
  ```json
  {
    "nama": "Pemrograman Web Lanjut",
    "deskripsi": "Updated description",
    "sks": 4
  }
  ```

#### Delete Mata Kuliah

- **DELETE** `/api/matkul/{id}`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Response:**
  ```json
  {
    "message": "Mata kuliah deleted successfully"
  }
  ```

### Tugas Management

#### Get All Tugas

- **GET** `/api/tugas`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Query Parameters:**
  - `mataKuliahId`: Filter by mata kuliah ID
  - `status`: Filter by status (`BELUM_DIKERJAKAN`, `DIKERJAKAN`, `SELESAI`)
- **Response:**
  ```json
  [
    {
      "id": "clxxxxx",
      "nama": "Tugas 1",
      "deskripsi": "Membuat website",
      "status": "BELUM_DIKERJAKAN",
      "deadline": "2023-11-20T23:59:59.000Z",
      "createdAt": "2023-11-10T15:16:00.000Z",
      "updatedAt": "2023-11-10T15:16:00.000Z",
      "mataKuliah": {
        "id": "clxxxxx",
        "nama": "Pemrograman Web",
        "sks": 3
      }
    }
  ]
  ```

#### Create Tugas

- **POST** `/api/tugas`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Body:**
  ```json
  {
    "nama": "Tugas 1",
    "deskripsi": "Membuat website",
    "mataKuliahId": "clxxxxx",
    "deadline": "2023-11-20T23:59:59.000Z",
    "status": "BELUM_DIKERJAKAN"
  }
  ```

#### Get Tugas by ID

- **GET** `/api/tugas/{id}`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`

#### Update Tugas

- **PUT** `/api/tugas/{id}`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Body:**
  ```json
  {
    "nama": "Updated Tugas Name",
    "deskripsi": "Updated description",
    "deadline": "2023-11-25T23:59:59.000Z",
    "status": "DIKERJAKAN"
  }
  ```

#### Delete Tugas

- **DELETE** `/api/tugas/{id}`
- **Headers:** `Authorization: Bearer YOUR_API_KEY`
- **Response:**
  ```json
  {
    "message": "Tugas deleted successfully"
  }
  ```

## Status Tugas

- `BELUM_DIKERJAKAN`: Tugas belum dikerjakan
- `DIKERJAKAN`: Tugas sedang dikerjakan
- `SELESAI`: Tugas sudah selesai

## Error Responses

- **401 Unauthorized:** Invalid or missing API key
- **404 Not Found:** Resource not found
- **400 Bad Request:** Invalid request data
- **500 Internal Server Error:** Server error

## Example Usage

### Generate API Key

```bash
curl -X POST http://localhost:3000/api/apikey \
  -H "Content-Type: application/json" \
  -d '{"name": "My API Key"}'
```

### Create Mata Kuliah

```bash
curl -X POST http://localhost:3000/api/matkul \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "nama": "Pemrograman Web",
    "deskripsi": "Mata kuliah tentang pengembangan web",
    "sks": 3
  }'
```

### Create Tugas

```bash
curl -X POST http://localhost:3000/api/tugas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "nama": "Tugas 1",
    "deskripsi": "Membuat website",
    "mataKuliahId": "MATA_KULIAH_ID",
    "deadline": "2023-11-20T23:59:59.000Z"
  }'
```
