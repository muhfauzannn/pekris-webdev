"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Suppress React warnings for third-party libraries
if (typeof window !== "undefined") {
  const originalConsoleWarn = console.warn;
  console.warn = (message, ...args) => {
    if (
      typeof message === "string" &&
      (message.includes("UNSAFE_componentWillReceiveProps") ||
        message.includes("componentWillReceiveProps") ||
        message.includes("ModelCollapse"))
    ) {
      return; // Suppress the warning
    }
    originalConsoleWarn(message, ...args);
  };
}

// Use custom wrapper to handle React compatibility issues
const SwaggerUI = dynamic(() => import("./SwaggerWrapper"), { ssr: false });
import "swagger-ui-react/swagger-ui.css";
import "./swagger.css";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch("/api/swagger");
        const swaggerSpec = await response.json();
        setSpec(swaggerSpec);
      } catch (error) {
        console.error("Failed to fetch swagger spec:", error);
      }
    };

    fetchSpec();
  }, []);

  if (!spec) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tugas Tracker API Documentation
          </h1>
          <p className="text-xl text-gray-600">
            REST API untuk mengelola mata kuliah dan tugas dengan sistem
            autentikasi API Key
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              🔑 Generate API Key
            </Link>
            <a
              href="https://github.com/yourusername/pekris-webdev/blob/main/QUICK_START.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              🚀 Quick Start Guide
            </a>
            <a
              href="/api/swagger"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              📄 OpenAPI JSON
            </a>
          </div>

          <div className="mt-6 max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Getting Started
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Generate an API key from the homepage</li>
                <li>
                  Use the &quot;Authorize&quot; button below to set your Bearer
                  token
                </li>
                <li>Try out the endpoints directly in this documentation</li>
                <li>Check the Quick Start Guide for detailed examples</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="swagger-container">
          <SwaggerUI
            spec={spec}
            docExpansion="list"
            defaultModelsExpandDepth={2}
            defaultModelExpandDepth={2}
            deepLinking={true}
            displayOperationId={false}
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
          />
        </div>
      </div>
    </div>
  );
}
