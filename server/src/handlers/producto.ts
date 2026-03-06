import { Request, Response } from 'express'
import Producto from '../models/Producto'
import Categoria from '../models/Categoria'

export const getProductos = async (req: Request, res: Response) => {
    const productos = await Producto.findAll({
        order: [['nombre', 'ASC']],
        include: [
            { model: Categoria, attributes: ['nombre'] }
        ]
    })
    res.json({ data: productos })
}

export const getProductoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const producto = await Producto.findByPk(id, {
        include: [
            { model: Categoria, attributes: ['nombre'] }
        ]
    })

    if (!producto) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }
    res.json({ data: producto })
}

export const createProducto = async (req: Request, res: Response) => {
    const producto = await Producto.create(req.body)
    res.status(201).json({ data: producto })
}

export const updateProducto = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const producto = await Producto.findByPk(id)

    if (!producto) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    // Actualizar
    await producto.update(req.body)
    res.json({ data: producto })
}

export const deleteProducto = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const producto = await Producto.findByPk(id)

    if (!producto) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    await producto.destroy()
    res.json({ data: 'Producto eliminado' })
}
