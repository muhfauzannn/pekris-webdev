"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [apiKeyName, setApiKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateApiKey = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/apikey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: apiKeyName || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate API key");
      }

      const data = await response.json();
      setApiKey(data.key);
    } catch (err) {
      setError("Failed to generate API key. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="flex py-10 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full justify-center max-w-md flex-col items-center gap-8 p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <Image
          src="/logo.png"
          alt="Tugas Tracker Logo"
          width={250}
          height={100}
          className="mb-4"
        />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Tugas Tracker API
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Generate API key untuk mengakses backend
          </p>
        </div>

        <div className="w-full space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Nama API Key (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={apiKeyName}
              onChange={(e) => setApiKeyName(e.target.value)}
              placeholder="Masukkan nama untuk API key"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <button
            onClick={generateApiKey}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {isLoading ? "Generating..." : "Generate API Key"}
          </button>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-md">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {apiKey && (
            <div className="space-y-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-md">
                <p className="text-green-700 dark:text-green-300 text-sm font-medium mb-2">
                  API Key berhasil dibuat!
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded border break-all">
                    {apiKey}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {apiKey && (
          <a
            href="/docs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            View API Documentation
          </a>
        )}
      </main>
    </div>
  );
}
