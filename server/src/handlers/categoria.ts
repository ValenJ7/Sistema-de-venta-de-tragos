import { Request, Response } from 'express'
import Categoria from '../models/Categoria'

export const getCategorias = async (req: Request, res: Response) => {
    const categorias = await Categoria.findAll({
        order: [['nombre', 'ASC']]
    })
    res.json({ data: categorias })
}

export const getCategoriaById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const categoria = await Categoria.findByPk(id)

    if (!categoria) {
        return res.status(404).json({
            error: 'Categoría no encontrada'
        })
    }
    res.json({ data: categoria })
}

export const updateCategoria = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const categoria = await Categoria.findByPk(id)

    if (!categoria) {
        return res.status(404).json({
            error: 'Categoría no encontrada'
        })
    }

    // Actualizar
    await categoria.update(req.body)
    res.json({ data: categoria })
}

export const deleteCategoria = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const categoria = await Categoria.findByPk(id)

    if (!categoria) {
        return res.status(404).json({
            error: 'Categoría no encontrada'
        })
    }

    await categoria.destroy()
    res.json({ data: 'Categoría eliminada' })
}

export const createCategoria = async (req: Request, res: Response) => {
    const categoria = await Categoria.create(req.body)
    res.status(201).json({ data: categoria })
}