import { Router } from "express"
import categoriaRouter from "./categoriaRouter"
import productoRouter from "./productoRouter"
import cajaRouter from "./cajaRouter"
import rolRouter from "./rolRouter"
import usuarioRouter from "./usuarioRouter"

const router: Router = Router()

router.use('/categorias', categoriaRouter)
router.use('/productos', productoRouter)
router.use('/cajas', cajaRouter)
router.use('/roles', rolRouter)
router.use('/usuarios', usuarioRouter)



export default router