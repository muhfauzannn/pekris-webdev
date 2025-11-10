// Static Swagger specification for production
export const staticSwaggerSpec = {
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
      url: "https://pekris-webdev.vercel.app",
      description: "Production server",
    },
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
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        description: "Check if the API is running properly",
        tags: ["System"],
        security: [],
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "healthy",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                    },
                    version: {
                      type: "string",
                      example: "1.0.0",
                    },
                    uptime: {
                      type: "number",
                      description: "Server uptime in seconds",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/stats": {
      get: {
        summary: "Get dashboard statistics",
        description:
          "Get overall statistics including total mata kuliah, tugas, and status breakdown",
        tags: ["System"],
        responses: {
          "200": {
            description: "Statistics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalMataKuliah: {
                      type: "integer",
                      description: "Total number of mata kuliah",
                    },
                    totalTugas: {
                      type: "integer",
                      description: "Total number of tugas",
                    },
                    tugasStats: {
                      type: "object",
                      properties: {
                        BELUM_DIKERJAKAN: {
                          type: "integer",
                        },
                        DIKERJAKAN: {
                          type: "integer",
                        },
                        SELESAI: {
                          type: "integer",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/matkul": {
      get: {
        summary: "Get all mata kuliah",
        description: "Retrieve all mata kuliah with optional tugas count",
        tags: ["Mata Kuliah"],
        parameters: [
          {
            name: "include",
            in: "query",
            description: "Include related data (tugas)",
            required: false,
            schema: {
              type: "string",
              enum: ["tugas"],
            },
          },
        ],
        responses: {
          "200": {
            description: "List of mata kuliah",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/MataKuliah",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create new mata kuliah",
        description: "Create a new mata kuliah",
        tags: ["Mata Kuliah"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
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
                },
                required: ["nama", "sks"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Mata kuliah created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MataKuliah",
                },
              },
            },
          },
          "400": {
            description: "Bad request - Invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/matkul/{id}": {
      get: {
        summary: "Get mata kuliah by ID",
        description: "Retrieve a specific mata kuliah by its ID",
        tags: ["Mata Kuliah"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Mata kuliah ID",
            schema: {
              type: "string",
            },
          },
          {
            name: "include",
            in: "query",
            description: "Include related data (tugas)",
            required: false,
            schema: {
              type: "string",
              enum: ["tugas"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Mata kuliah found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MataKuliah",
                },
              },
            },
          },
          "404": {
            description: "Mata kuliah not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update mata kuliah",
        description: "Update an existing mata kuliah",
        tags: ["Mata Kuliah"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Mata kuliah ID",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
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
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Mata kuliah updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MataKuliah",
                },
              },
            },
          },
          "404": {
            description: "Mata kuliah not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "400": {
            description: "Bad request - Invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete mata kuliah",
        description: "Delete a mata kuliah and all its associated tugas",
        tags: ["Mata Kuliah"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Mata kuliah ID",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Mata kuliah deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Mata kuliah deleted successfully",
                    },
                    deletedTugasCount: {
                      type: "integer",
                      description: "Number of tugas that were also deleted",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Mata kuliah not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/tugas": {
      get: {
        summary: "Get all tugas",
        description:
          "Retrieve all tugas with optional filtering and mata kuliah information",
        tags: ["Tugas"],
        parameters: [
          {
            name: "status",
            in: "query",
            description: "Filter by status",
            required: false,
            schema: {
              type: "string",
              enum: ["BELUM_DIKERJAKAN", "DIKERJAKAN", "SELESAI"],
            },
          },
          {
            name: "mataKuliahId",
            in: "query",
            description: "Filter by mata kuliah ID",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "include",
            in: "query",
            description: "Include related data (mataKuliah)",
            required: false,
            schema: {
              type: "string",
              enum: ["mataKuliah"],
            },
          },
        ],
        responses: {
          "200": {
            description: "List of tugas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Tugas",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create new tugas",
        description: "Create a new tugas for a mata kuliah",
        tags: ["Tugas"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nama: {
                    type: "string",
                    description: "Name of the tugas",
                  },
                  deskripsi: {
                    type: "string",
                    description: "Description of the tugas",
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
                  status: {
                    type: "string",
                    enum: ["BELUM_DIKERJAKAN", "DIKERJAKAN", "SELESAI"],
                    description: "Status of the tugas",
                    default: "BELUM_DIKERJAKAN",
                  },
                },
                required: ["nama", "mataKuliahId", "deadline"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Tugas created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tugas",
                },
              },
            },
          },
          "400": {
            description: "Bad request - Invalid input or mata kuliah not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/tugas/{id}": {
      get: {
        summary: "Get tugas by ID",
        description: "Retrieve a specific tugas by its ID",
        tags: ["Tugas"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Tugas ID",
            schema: {
              type: "string",
            },
          },
          {
            name: "include",
            in: "query",
            description: "Include related data (mataKuliah)",
            required: false,
            schema: {
              type: "string",
              enum: ["mataKuliah"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Tugas found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tugas",
                },
              },
            },
          },
          "404": {
            description: "Tugas not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update tugas",
        description: "Update an existing tugas",
        tags: ["Tugas"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Tugas ID",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
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
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Tugas updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tugas",
                },
              },
            },
          },
          "404": {
            description: "Tugas not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "400": {
            description: "Bad request - Invalid input or mata kuliah not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete tugas",
        description: "Delete a tugas",
        tags: ["Tugas"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Tugas ID",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Tugas deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Tugas deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Tugas not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
};
