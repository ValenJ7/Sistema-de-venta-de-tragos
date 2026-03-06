import { Router } from "express"
import { body, param, query } from "express-validator"
import {
    getSesionActiva,
    createSesion,
    closeSesion
} from "../handlers/sesionCaja"
import { handleInputErrors } from "../middleware"

const router: Router = Router()

/**
 * @swagger
 * components:
 *      schemas:
 *          SesionCaja:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      example: 1
 *                  caja_id:
 *                      type: integer
 *                      example: 1
 *                  usuario_id:
 *                      type: integer
 *                      example: 1
 *                  apertura_fecha:
 *                      type: string
 *                      format: date-time
 *                  cierre_fecha:
 *                      type: string
 *                      format: date-time
 *                  monto_inicial:
 *                      type: number
 *                      example: 5000
 *                  monto_final_real:
 *                      type: number
 *                      example: 8000
 */

/**
 * @swagger
 * /api/sesiones/activa:
 *      get:
 *          summary: Obtiene la sesión activa del usuario
 *          tags:
 *              - Sesiones de Caja
 *          parameters:
 *              - in: query
 *                name: usuario_id
 *                required: true
 *                schema:
 *                    type: integer
 *                description: ID del usuario para buscar su sesión activa
 *          responses:
 *              200:
 *                  description: Sesión activa (o null si no hay una)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/SesionCaja'
 *              400:
 *                  description: usuario_id es requerido
 */
router.get('/activa',
    query('usuario_id').isInt().withMessage('usuario_id debe ser un entero'),
    handleInputErrors,
    getSesionActiva
)

/**
 * @swagger
 * /api/sesiones:
 *      post:
 *          summary: Abre una nueva sesión de caja
 *          tags:
 *              - Sesiones de Caja
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              usuario_id:
 *                                  type: integer
 *                              caja_id:
 *                                  type: integer
 *                              monto_inicial:
 *                                  type: number
 *                      example:
 *                          usuario_id: 1
 *                          caja_id: 1
 *                          monto_inicial: 5000
 *          responses:
 *              201:
 *                  description: Sesión abierta correctamente
 *              400:
 *                  description: El usuario ya tiene una sesión abierta o datos inválidos
 */
router.post('/',
    body('usuario_id').isInt().withMessage('usuario_id es requerido y debe ser un entero'),
    body('caja_id').isInt().withMessage('caja_id es requerido y debe ser un entero'),
    body('monto_inicial').isDecimal().withMessage('monto_inicial es requerido y debe ser un valor decimal'),
    handleInputErrors,
    createSesion
)

/**
 * @swagger
 * /api/sesiones/{id}:
 *      put:
 *          summary: Cierra una sesión de caja
 *          tags:
 *              - Sesiones de Caja
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                    type: integer
 *                description: ID de la sesión a cerrar
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              monto_final_real:
 *                                  type: number
 *                      example:
 *                          monto_final_real: 8500.50
 *          responses:
 *              200:
 *                  description: Sesión cerrada correctamente
 *              400:
 *                  description: La sesión ya está cerrada o datos inválidos
 *              404:
 *                  description: Sesión no encontrada
 */
router.put('/:id',
    param('id').isInt().withMessage('ID no válido'),
    body('monto_final_real').isDecimal().withMessage('monto_final_real es requerido y debe ser un valor decimal'),
    handleInputErrors,
    closeSesion
)

export default router
