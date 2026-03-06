import { Router } from "express"
import categoriaRouter from "./categoriaRouter"
import productoRouter from "./productoRouter"

const router: Router = Router()

router.use('/categorias', categoriaRouter)
router.use('/productos', productoRouter)



export default router