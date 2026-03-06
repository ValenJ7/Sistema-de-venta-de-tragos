import { Request, Response } from 'express'
import Caja from '../models/Caja'
import Negocio from '../models/Negocio'

export const getCajas = async (req: Request, res: Response) => {
    const cajas = await Caja.findAll({
        order: [['nombre', 'ASC']],
        include: [
            { model: Negocio, attributes: ['nombre'] }
        ]
    })
    res.json({ data: cajas })
}

export const getCajaById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const caja = await Caja.findByPk(id, {
        include: [
            { model: Negocio, attributes: ['nombre'] }
        ]
    })

    if (!caja) {
        return res.status(404).json({
            error: 'Caja no encontrada'
        })
    }
    res.json({ data: caja })
}

export const createCaja = async (req: Request, res: Response) => {
    const caja = await Caja.create(req.body)
    res.status(201).json({ data: caja })
}

export const updateCaja = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const caja = await Caja.findByPk(id)

    if (!caja) {
        return res.status(404).json({
            error: 'Caja no encontrada'
        })
    }

    // Actualizar
    await caja.update(req.body)
    res.json({ data: caja })
}

export const deleteCaja = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const caja = await Caja.findByPk(id)

    if (!caja) {
        return res.status(404).json({
            error: 'Caja no encontrada'
        })
    }

    await caja.destroy()
    res.json({ data: 'Caja eliminada' })
}
