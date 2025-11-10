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
        url: "http://localhost:3000",
        description: "Development server",
      },
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
              description: "The generated API key (only shown once)",
            },
            name: {
              type: "string",
              nullable: true,
              description: "Optional name for the API key",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
            _count: {
              type: "object",
              properties: {
                mataKuliah: {
                  type: "integer",
                  description:
                    "Number of mata kuliah associated with this API key",
                },
              },
            },
          },
        },
        MataKuliah: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for mata kuliah",
            },
            nama: {
              type: "string",
              description: "Name of the mata kuliah",
            },
            deskripsi: {
              type: "string",
              nullable: true,
              description: "Description of the mata kuliah",
            },
            sks: {
              type: "integer",
              minimum: 1,
              description: "SKS (Satuan Kredit Semester) value",
            },
            apiKeyId: {
              type: "string",
              description: "ID of the associated API key",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
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
            tugas: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Tugas",
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
              description: "Unique identifier for tugas",
            },
            nama: {
              type: "string",
              description: "Name of the tugas",
            },
            deskripsi: {
              type: "string",
              nullable: true,
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
              description: "ID of the associated mata kuliah",
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
  apis: ["./app/api/**/*.ts"], // Path to the API docs
};

const specs = swaggerJSDoc(options);
export default specs;
