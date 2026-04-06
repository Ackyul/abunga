import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Abunga API',
      version: '1.0.0',
      description: 'API REST del E-commerce de snacks naturales Abunga',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Local' },
      { url: 'http://16.59.39.194:3001', description: 'Producción' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            price: { type: 'number' },
            fruta: { type: 'string', nullable: true },
            img: { type: 'string', nullable: true },
            variants: { type: 'object', nullable: true },
            categoryId: { type: 'integer', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            total: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  productId: { type: 'integer' },
                  quantity: { type: 'integer' },
                  price: { type: 'number' },
                  product: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    paths: {
      // ── AUTH ──────────────────────────────────────────────────────────
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registrar nuevo usuario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Juan Pérez' },
                    email: { type: 'string', example: 'juan@example.com' },
                    password: { type: 'string', example: '123456' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuario creado exitosamente' },
            400: { description: 'Datos inválidos o email ya registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Iniciar sesión',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'juan@example.com' },
                    password: { type: 'string', example: '123456' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login exitoso, devuelve token JWT' },
            401: { description: 'Credenciales incorrectas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      // ── PRODUCTS ──────────────────────────────────────────────────────
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'Obtener todos los productos',
          responses: {
            200: { description: 'Lista de productos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } },
          },
        },
        post: {
          tags: ['Products'],
          summary: 'Crear producto (Admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'price'],
                  properties: {
                    name: { type: 'string', example: 'Láminas de Mango' },
                    price: { type: 'number', example: 10.5 },
                    fruta: { type: 'string', example: 'Mango' },
                    img: { type: 'string', example: 'https://...' },
                    categoryId: { type: 'integer', example: 1 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Producto creado' },
            400: { description: 'Faltan campos requeridos' },
            401: { description: 'No autorizado' },
            403: { description: 'Solo administradores' },
          },
        },
      },
      '/api/products/{id}': {
        put: {
          tags: ['Products'],
          summary: 'Actualizar producto (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          responses: {
            200: { description: 'Producto actualizado' },
            400: { description: 'ID inválido' },
            404: { description: 'Producto no encontrado' },
          },
        },
        delete: {
          tags: ['Products'],
          summary: 'Eliminar producto (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Producto eliminado' },
            400: { description: 'ID inválido' },
            404: { description: 'Producto no encontrado' },
          },
        },
      },
      '/api/products/sync': {
        post: {
          tags: ['Products'],
          summary: 'Sincronizar lista de productos (Admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'object' } },
              },
            },
          },
          responses: {
            201: { description: 'Productos sincronizados' },
          },
        },
      },
      // ── CATEGORIES ────────────────────────────────────────────────────
      '/api/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Obtener todas las categorías',
          responses: {
            200: { description: 'Lista de categorías', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } },
          },
        },
        post: {
          tags: ['Categories'],
          summary: 'Crear categoría (Admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Frutas' },
                    description: { type: 'string', example: 'Snacks de frutas naturales' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Categoría creada' },
            400: { description: 'Nombre requerido o ya existe' },
          },
        },
      },
      '/api/categories/{id}': {
        delete: {
          tags: ['Categories'],
          summary: 'Eliminar categoría (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Categoría eliminada' },
            400: { description: 'ID inválido' },
            404: { description: 'Categoría no encontrada' },
          },
        },
      },
      // ── USERS ─────────────────────────────────────────────────────────
      '/api/users': {
        get: {
          tags: ['Users'],
          summary: 'Obtener todos los usuarios (Admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de usuarios', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
          },
        },
      },
      // ── ORDERS ────────────────────────────────────────────────────────
      '/api/orders': {
        post: {
          tags: ['Orders'],
          summary: 'Crear pedido tras pago exitoso',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['cartItems'],
                  properties: {
                    cartItems: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          name: { type: 'string' },
                          price: { type: 'number' },
                          quantity: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Pedido creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
            400: { description: 'Carrito vacío' },
            401: { description: 'No autenticado' },
          },
        },
      },
      '/api/orders/my': {
        get: {
          tags: ['Orders'],
          summary: 'Obtener mis pedidos',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de pedidos del usuario', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
            401: { description: 'No autenticado' },
          },
        },
      },
      // ── STRIPE ────────────────────────────────────────────────────────
      '/api/stripe/checkout/{orderId}': {
        get: {
          tags: ['Stripe'],
          summary: 'Obtener link de pago Stripe por ID de orden',
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID de la orden creada' }],
          responses: {
            200: { description: 'URL de pago de Stripe', content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' }, url: { type: 'string' } } } } } },
            400: { description: 'ID inválido o orden sin items' },
            500: { description: 'Orden no encontrada o error de Stripe' },
          },
        },
      },
      // ── UPLOAD ────────────────────────────────────────────────────────
      '/api/upload': {
        post: {
          tags: ['Upload'],
          summary: 'Subir imagen de producto',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    image: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'URL de la imagen subida', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string' } } } } } },
            400: { description: 'No se proporcionó imagen' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
