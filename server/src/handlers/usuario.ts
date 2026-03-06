import { Request, Response } from 'express'
import Usuario from '../models/Usuario'
import Rol from '../models/Rol'
import Negocio from '../models/Negocio'
import SesionCaja from '../models/SesionCaja'

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [
                { model: Rol, attributes: ['nombre'] },
                { model: Negocio, attributes: ['nombre'] }
            ],
            order: [['nombre', 'ASC']]
        })
        res.json({ data: usuarios })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al obtener los usuarios' })
    }
}

export const getUsuarioById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const usuario = await Usuario.findByPk(id, {
            include: [
                { model: Rol, attributes: ['nombre'] },
                { model: Negocio, attributes: ['nombre'] }
            ]
        })

        if (!usuario) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        res.json({ data: usuario })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al obtener el usuario' })
    }
}

export const createUsuario = async (req: Request, res: Response) => {
    try {
        // La encriptación de password se manejará después según lo solicitado
        const usuario = await Usuario.create(req.body)
        res.status(201).json({ data: usuario })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al crear el usuario' })
    }
}

export const updateUsuario = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const usuario = await Usuario.findByPk(id)

        if (!usuario) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        await usuario.update(req.body)
        res.json({ data: usuario })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al actualizar el usuario' })
    }
}

export const deactivateUsuario = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const usuario = await Usuario.findByPk(id)

        if (!usuario) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        // Logical delete
        usuario.activo = false
        await usuario.save()
        
        res.json({ data: 'Usuario desactivado correctamente' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al desactivar el usuario' })
    }
}

export const deleteUsuario = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const usuario = await Usuario.findByPk(id)

        if (!usuario) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        // Safety check: Check if user has associated SesionCaja
        const sessionsCount = await SesionCaja.count({ where: { usuario_id: id } })
        if (sessionsCount > 0) {
            return res.status(400).json({
                error: 'No se puede eliminar físicamente el usuario porque tiene sesiones de caja asociadas. Use la desactivación en su lugar.'
            })
        }

        await usuario.destroy()
        res.json({ data: 'Usuario eliminado físicamente' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error al eliminar el usuario' })
    }
}
