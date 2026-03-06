import { Request, Response } from 'express'
import SesionCaja from '../models/SesionCaja'

export const getSesionActiva = async (req: Request, res: Response) => {
    try {
        const { usuario_id } = req.query
        
        if (!usuario_id) {
            return res.status(400).json({ error: 'usuario_id es requerido' })
        }

        const sesion = await SesionCaja.findOne({
            where: {
                usuario_id: Number(usuario_id),
                cierre_fecha: null
            }
        })

        res.json({ data: sesion })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al obtener la sesión activa' })
    }
}

export const createSesion = async (req: Request, res: Response) => {
    try {
        const { usuario_id, caja_id, monto_inicial } = req.body

        // Validar si ya tiene una sesión abierta
        const sesionActiva = await SesionCaja.findOne({
            where: {
                usuario_id,
                cierre_fecha: null
            }
        })

        if (sesionActiva) {
            return res.status(400).json({
                error: 'El usuario ya tiene una sesión de caja abierta'
            })
        }

        const sesion = await SesionCaja.create({
            usuario_id,
            caja_id,
            monto_inicial,
            apertura_fecha: new Date()
        })

        res.status(201).json({ data: sesion })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al abrir la sesión de caja' })
    }
}

export const closeSesion = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const { monto_final_real } = req.body

        const sesion = await SesionCaja.findByPk(id)

        if (!sesion) {
            return res.status(404).json({ error: 'Sesión no encontrada' })
        }

        if (sesion.cierre_fecha) {
            return res.status(400).json({ error: 'La sesión ya se encuentra cerrada' })
        }

        await sesion.update({
            monto_final_real,
            cierre_fecha: new Date()
        })

        res.json({ data: sesion })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al cerrar la sesión de caja' })
    }
}
