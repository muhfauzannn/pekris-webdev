import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tugas Tracker API",
      version: "1.0.0",
      description:
        "REST API untuk mengelola mata kuliah dan tugas dengan sistem autentikasi API Key",
      contact: {
        name: "API Support",
        email: "support@tugastracker.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://pekris-webdev.vercel.app"
            : "http://localhost:3000",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              url: "https://pekris-webdev.vercel.app",
              description: "Production server",
            },
          ]
        : []),
    ],
    tags: [
      {
        name: "Mata Kuliah",
        description: "Mata kuliah management endpoints",
      },
      {
        name: "Tugas",
        description: "Tugas management endpoints",
      },
      {
        name: "System",
        description: "System health and information endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your API key generated from the homepage",
        },
      },
      schemas: {
        ApiKey: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the API key",
            },
            key: {
              type: "string",
              description: "The API key value",
            },
            name: {
              type: "string",
              description: "Optional name for the API key",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["key"],
        },
        MataKuliah: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the mata kuliah",
            },
            nama: {
              type: "string",
              description: "Name of the mata kuliah",
            },
            deskripsi: {
              type: "string",
              description: "Description of the mata kuliah",
            },
            sks: {
              type: "integer",
              description: "Number of credits (SKS)",
              minimum: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            tugas: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Tugas",
              },
            },
            _count: {
              type: "object",
              properties: {
                tugas: {
                  type: "integer",
                  description: "Number of tugas in this mata kuliah",
                },
              },
            },
          },
          required: ["nama", "sks"],
        },
        Tugas: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the tugas",
            },
            nama: {
              type: "string",
              description: "Name of the tugas",
            },
            deskripsi: {
              type: "string",
              description: "Description of the tugas",
            },
            status: {
              type: "string",
              enum: ["BELUM_DIKERJAKAN", "DIKERJAKAN", "SELESAI"],
              description: "Status of the tugas",
            },
            deadline: {
              type: "string",
              format: "date-time",
              description: "Deadline for the tugas",
            },
            mataKuliahId: {
              type: "string",
              description: "ID of the mata kuliah this tugas belongs to",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            mataKuliah: {
              type: "object",
              properties: {
                id: { type: "string" },
                nama: { type: "string" },
                sks: { type: "integer" },
              },
            },
          },
          required: ["nama", "mataKuliahId", "deadline"],
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    process.env.NODE_ENV === "production"
      ? "./app/api/**/*.js" // In production, look for compiled JS files
      : "./app/api/**/*.ts", // In development, look for TS files
  ],
};

const specs = swaggerJSDoc(options);
export default specs;
