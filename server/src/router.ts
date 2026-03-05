import { Router } from "express"
import { body, param } from "express-validator"
import { createCategoria, getCategorias } from "./handlers/categoria"
import { handleInputErrors } from "./middleware"

const router: Router = Router()

/**
 * @swagger
 * components:
 *      schemas:
 *          Categoria:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      example: 1
 *                  nombre:
 *                      type: string
 *                      example: "Bebidas"
 */

/**
 * @swagger
 * /api/categorias:
 *      get:
 *          summary: Obtiene todas las categorías
 *          tags:
 *              - Categorias
 *          responses:
 *              200:
 *                  description: Lista de categorías
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Categoria'
 */
router.get('/categorias', getCategorias)

/**
 * @swagger
 * /api/categorias:
 *      post:
 *          summary: Crea una nueva categoría
 *          tags:
 *              - Categorias
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              nombre:
 *                                  type: string
 *                  example: "Tragos"
 *          responses:
 *              201:
 *                  description: Categoría creada
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      $ref: '#/components/schemas/Categoria'
 */
router.post('/categorias',
    body('nombre')
        .notEmpty().withMessage('El nombre de la categoría no puede ir vacío'),
    handleInputErrors,
    createCategoria
)

export default router