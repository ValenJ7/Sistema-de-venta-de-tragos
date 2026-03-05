import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Categorias',
                description: 'Operaciones relacionadas con las categorías de productos'
            },
            {
                name: 'Productos',
                description: 'Operaciones relacionadas con los productos del POS'
            }
        ],
        info: {
            title: 'POS Discoteca API / TypeScript / Sequelize',
            version: "1.0.0",
            description: "API Docs para el sistema de ventas de tragos"
        }
    },
    // Archivos donde Swagger buscará las anotaciones (comentarios con @swagger)
    apis: ['./src/router.ts'] 
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;