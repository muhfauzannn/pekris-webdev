import Link from "next/link";

export default function ApiDocsIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          API Documentation
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Pilih format dokumentasi yang Anda inginkan
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual Documentation */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Manual Documentation
            </h2>
            <p className="text-gray-600 mb-4">
              Dokumentasi API yang mudah dibaca dengan interface yang bersih dan
              interaktif. Dilengkapi dengan contoh request/response dan cURL
              commands.
            </p>
            <Link
              href="/docs/manual"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              Lihat Manual Docs
            </Link>
            <div className="mt-3 text-sm text-gray-500">
              ✅ Mudah dibaca
              <br />
              ✅ Interface yang bersih
              <br />
              ✅ Contoh cURL command
              <br />✅ Filter berdasarkan kategori
            </div>
          </div>

          {/* Swagger Documentation */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">🔧</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Swagger UI Documentation
            </h2>
            <p className="text-gray-600 mb-4">
              Dokumentasi API standar dengan Swagger UI. Memungkinkan testing
              langsung dari browser dengan interface yang familiar.
            </p>
            <Link
              href="/docs/swagger"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              Lihat Swagger Docs
            </Link>
            <div className="mt-3 text-sm text-gray-500">
              ⚠️ Memerlukan konfigurasi
              <br />
              ✅ Testing interaktif
              <br />
              ✅ Standar industri
              <br />✅ Auto-generated
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              🏠 Kembali ke Home
            </Link>
            <Link
              href="/api/health"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              🔍 Test API Health
            </Link>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Butuh bantuan? Baca{" "}
            <Link
              href="/QUICK_START.md"
              className="text-blue-600 hover:underline"
            >
              Quick Start Guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
