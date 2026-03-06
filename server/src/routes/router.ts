import { Router } from "express"
import categoriaRouter from "./categoriaRouter"
import productoRouter from "./productoRouter"
import cajaRouter from "./cajaRouter"

const router: Router = Router()

router.use('/categorias', categoriaRouter)
router.use('/productos', productoRouter)
router.use('/cajas', cajaRouter)



export default router