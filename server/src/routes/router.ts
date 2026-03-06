import { Router } from "express"
import categoriaRouter from "./categoriaRouter"

const router: Router = Router()

router.use('/categorias', categoriaRouter)



export default router