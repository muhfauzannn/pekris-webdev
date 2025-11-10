"use client";

import { useState } from "react";
import Link from "next/link";

const endpoints = [
  {
    method: "POST",
    path: "/api/apikey",
    summary: "Generate API Key",
    description: "Create a new API key for authentication",
    auth: false,
    body: {
      name: "string (optional) - Name for the API key"
    },
    example: {
      request: `curl -X POST http://localhost:3000/api/apikey \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My API Key"}'`,
      response: `{
  "id": "clxxxxx",
  "key": "your_generated_api_key",
  "name": "My API Key",
  "createdAt": "2023-11-10T15:16:00.000Z"
}`
    }
  },
  {
    method: "GET",
    path: "/api/apikey",
    summary: "List API Keys",
    description: "Get all API keys for the authenticated user",
    auth: true,
    example: {
      request: `curl -X GET http://localhost:3000/api/apikey \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      response: `[
  {
    "id": "clxxxxx",
    "name": "My API Key",
    "createdAt": "2023-11-10T15:16:00.000Z",
    "_count": { "mataKuliah": 2 }
  }
]`
    }
  },
  {
    method: "GET",
    path: "/api/matkul",
    summary: "Get All Mata Kuliah",
    description: "Retrieve all mata kuliah",
    auth: true,
    example: {
      request: `curl -X GET http://localhost:3000/api/matkul \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      response: `[
  {
    "id": "clxxxxx",
    "nama": "Pemrograman Web",
    "deskripsi": "Mata kuliah web development",
    "sks": 3,
    "_count": { "tugas": 5 }
  }
]`
    }
  },
  {
    method: "POST",
    path: "/api/matkul",
    summary: "Create Mata Kuliah",
    description: "Create a new mata kuliah",
    auth: true,
    body: {
      nama: "string (required) - Name of mata kuliah",
      deskripsi: "string (optional) - Description",
      sks: "integer (required) - Number of credits"
    },
    example: {
      request: `curl -X POST http://localhost:3000/api/matkul \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nama": "Pemrograman Web",
    "deskripsi": "Web development course",
    "sks": 3
  }'`,
      response: `{
  "id": "clxxxxx",
  "nama": "Pemrograman Web",
  "deskripsi": "Web development course",
  "sks": 3,
  "createdAt": "2023-11-10T15:16:00.000Z"
}`
    }
  },
  {
    method: "GET",
    path: "/api/tugas",
    summary: "Get All Tugas",
    description: "Retrieve all tugas with optional filtering",
    auth: true,
    params: {
      status: "string (optional) - Filter by status",
      mataKuliahId: "string (optional) - Filter by mata kuliah"
    },
    example: {
      request: `curl -X GET "http://localhost:3000/api/tugas?status=BELUM_DIKERJAKAN" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      response: `[
  {
    "id": "clxxxxx",
    "nama": "Tugas UTS",
    "status": "BELUM_DIKERJAKAN",
    "deadline": "2023-11-15T23:59:59.000Z",
    "mataKuliah": {
      "nama": "Pemrograman Web"
    }
  }
]`
    }
  },
  {
    method: "POST",
    path: "/api/tugas",
    summary: "Create Tugas",
    description: "Create a new tugas",
    auth: true,
    body: {
      nama: "string (required) - Name of tugas",
      deskripsi: "string (optional) - Description",
      deadline: "string (required) - ISO date string",
      mataKuliahId: "string (required) - ID of mata kuliah",
      status: "string (optional) - BELUM_DIKERJAKAN | DIKERJAKAN | SELESAI"
    },
    example: {
      request: `curl -X POST http://localhost:3000/api/tugas \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nama": "Tugas UTS",
    "deadline": "2023-11-15T23:59:59.000Z",
    "mataKuliahId": "clxxxxx"
  }'`,
      response: `{
  "id": "clxxxxx",
  "nama": "Tugas UTS",
  "deadline": "2023-11-15T23:59:59.000Z",
  "status": "BELUM_DIKERJAKAN",
  "createdAt": "2023-11-10T15:16:00.000Z"
}`
    }
  }
];

export default function ManualApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<number | null>(null);
  const [apiKey, setApiKey] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tugas Tracker API Documentation
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Manual API documentation dengan contoh lengkap
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              🔑 Generate API Key
            </Link>
            <Link
              href="/docs"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              ← Kembali ke Docs
            </Link>
          </div>
        </div>

        {/* Authentication */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">🔐 Authentication</h2>
          <p className="text-gray-600 mb-4">
            Semua endpoint (kecuali /api/apikey POST dan /api/health) memerlukan header Authorization:
          </p>
          <div className="bg-gray-50 p-4 rounded border mb-4">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Masukkan API key untuk testing"
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => copyToClipboard(`Authorization: Bearer ${apiKey}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              disabled={!apiKey}
            >
              Copy Header
            </button>
          </div>
        </div>

        {/* Base URL */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">🌐 Base URL</h2>
          <div className="space-y-2">
            <div className="bg-gray-50 p-3 rounded">
              <strong>Development:</strong> <code>http://localhost:3000</code>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Production:</strong> <code>https://pekris-webdev.vercel.app</code>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-lg shadow border">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedEndpoint(selectedEndpoint === index ? null : index)}
              >
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded font-semibold text-sm ${
                    endpoint.method === "GET" ? "bg-blue-100 text-blue-800" :
                    endpoint.method === "POST" ? "bg-green-100 text-green-800" :
                    endpoint.method === "PUT" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="font-mono text-lg">{endpoint.path}</code>
                  {endpoint.auth && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      🔒 Auth Required
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{endpoint.summary}</p>
                <p className="text-gray-500 text-sm mt-1">{endpoint.description}</p>
              </div>

              {selectedEndpoint === index && (
                <div className="border-t p-4">
                  {/* Parameters */}
                  {endpoint.params && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Query Parameters:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        {Object.entries(endpoint.params).map(([key, desc]) => (
                          <div key={key} className="mb-1">
                            <code className="font-mono">{key}</code>: {desc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {endpoint.body && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Request Body:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        {Object.entries(endpoint.body).map(([key, desc]) => (
                          <div key={key} className="mb-1">
                            <code className="font-mono">{key}</code>: {desc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Request Example:</h4>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                        <pre className="text-sm whitespace-pre-wrap">{endpoint.example.request}</pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Response Example:</h4>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                        <pre className="text-sm whitespace-pre-wrap">{endpoint.example.response}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">📚 Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/API_DOCUMENTATION.md"
              target="_blank"
              className="bg-blue-50 border border-blue-200 rounded p-4 hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-semibold text-blue-900">📄 Full Documentation</h3>
              <p className="text-blue-700 text-sm">Complete API documentation in Markdown</p>
            </a>
            <a
              href="/QUICK_START.md"
              target="_blank"
              className="bg-green-50 border border-green-200 rounded p-4 hover:bg-green-100 transition-colors"
            >
              <h3 className="font-semibold text-green-900">🚀 Quick Start Guide</h3>
              <p className="text-green-700 text-sm">Get started with the API quickly</p>
            </a>
            <Link
              href="/api/health"
              className="bg-purple-50 border border-purple-200 rounded p-4 hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-semibold text-purple-900">🔍 Health Check</h3>
              <p className="text-purple-700 text-sm">Test API connectivity</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
