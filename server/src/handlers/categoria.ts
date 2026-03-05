import { Request, Response } from 'express'
import Categoria from '../models/Categoria'

export const getCategorias = async (req: Request, res: Response) => {
    const categorias = await Categoria.findAll({
        order: [['nombre', 'ASC']]
    })
    res.json({ data: categorias })
}

export const createCategoria = async (req: Request, res: Response) => {
    const categoria = await Categoria.create(req.body)
    res.status(201).json({ data: categoria })
}