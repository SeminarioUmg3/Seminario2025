import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { buscarUsuario,crearUsuario,buscarUsuarioPorNombre } from '../services/auth.service.js';
import { loginServicio } from '../services/auth.service.js';
import { validationResult } from 'express-validator';
import { obtenerListaUsuarios, obtenerUsuarioId, actualizarUsuarioServicio, eliminarUsuarioServicio } from '../services/auth.service.js';
import { crearRol, actualizarRol, eliminarRol, obtenerListaRoles, obtenerRolId } from '../services/auth.service.js';
const prisma = new PrismaClient();
const configJwt = {
    secret: process.env.SECRET_KEY,
    expiresIn: process.env.EXPIRES_IN,
    refreshIn: process.env.REFRESH_IN
}

const login = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {nombreUsuario,contrasenia} = req.body;
    const usuarioEncontrado = await buscarUsuario(nombreUsuario);
    if(!usuarioEncontrado){
        return res.status(404).json({message: 'credenciales incorrectas'});
    }
    const contraseniaValida = await bcrypt.compare(contrasenia, usuarioEncontrado.contrasenia);
    if(!contraseniaValida){
        return res.status(403).json({message: 'Credenciales incorrectas'});
    }
   try {
       const result = await loginServicio(nombreUsuario);
       return res.status(200).json(result);
   } catch (error) {
       return res.status(error.status).json({message: error.message});
   }
}


const register = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {nombreUsuario,contrasenia,nombreCompleto} = req.body;
        const usuarioEncontrado = await buscarUsuarioPorNombre(nombreUsuario);
        if(usuarioEncontrado){
            return res.status(400).json({message: 'Usuario ya existe'});
        }
        const usuarioEncontradoCompleto = await buscarUsuarioPorNombre(nombreCompleto);
        if(usuarioEncontradoCompleto){
            return res.status(400).json({message: 'Nombre de usuario ya existe'});
        }
    
    try {
        const result = await crearUsuario(nombreCompleto, nombreUsuario, contrasenia);
       
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status).json({message: error.message});
    }   
}
const obtenerUsuarios = async (req, res) => {
    try {
        const users = await obtenerListaUsuarios();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message: 'Error al obtener usuarios'});
    }
}
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({message: 'ID de usuario inválido'});
        }
        
        const user = await obtenerUsuarioId(id);
        return res.status(200).json(user);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({message: error.message});
        }
        return res.status(500).json({message: 'Error al obtener usuario'});
    }
}

const actualizarUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({message: 'ID de usuario inválido'});
        }
        
        const { nombre_completo, rol_id, estado, nombre_usuario, zona_id } = req.body;
        
        if (!nombre_completo && !rol_id && !estado && !nombre_usuario && !zona_id) {
            return res.status(400).json({message: 'Debe proporcionar al menos un campo para actualizar'});
        }
        
        const user = await actualizarUsuarioServicio(id, nombre_completo, nombre_usuario, estado, rol_id, zona_id);
        return res.status(200).json({
            message: 'Usuario actualizado correctamente'
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({message: error.message});
        }
        return res.status(500).json({message: 'Error al actualizar usuario'});
    }
}
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({message: 'ID de usuario inválido'});
        }
        
        const result = await eliminarUsuarioServicio(id);
        return res.status(200).json({message: 'Usuario eliminado correctamente'});
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({message: error.message});
        }
        return res.status(500).json({message: 'Error al eliminar usuario'});
    }
}

const crearRoles = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { nombre } = req.body;
        const result = await crearRol(nombre);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status).json({message: error.message});
    }
}
const actualizarRolId = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const result = await actualizarRol(id, nombre);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status).json({message: error.message});
    }
}
const eliminarRolId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await eliminarRol(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status).json({message: error.message});
    }
}

const obtenerListadoRoles = async (req, res) => {
    try {
        const result = await obtenerListaRoles();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status).json({message: error.message});
    }
}
const obtenerRolPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await obtenerRolId(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status).json({message: error.message});
    }
}


export {
    login,
    register,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    crearRoles,
    actualizarRolId,
    eliminarRolId,
    obtenerListadoRoles,
    obtenerRolPorId
}