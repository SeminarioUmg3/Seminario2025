import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';
import { buscarUsuario,crearUsuario,buscarUsuarioPorNombre } from '../services/auth.app.service.js';
import { loginServicio } from '../services/auth.app.service.js';
import { validationResult } from 'express-validator';
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
    const {nombreUsuario,contrasenia,nombreCompleto, colonia} = req.body;
        const usuarioEncontrado = await buscarUsuarioPorNombre(nombreUsuario);
        if(usuarioEncontrado){
            return res.status(400).json({message: 'Usuario ya existe'});
        }
        const usuarioEncontradoCompleto = await buscarUsuarioPorNombre(nombreCompleto);
        if(usuarioEncontradoCompleto){
            return res.status(400).json({message: 'Nombre de usuario ya existe'});
        }
    
    try {
        const result = await crearUsuario(nombreCompleto, nombreUsuario, contrasenia, colonia);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }   
}
export {
    login,
    register,
}