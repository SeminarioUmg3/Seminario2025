import jwt from 'jsonwebtoken'; 
import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';
import { configJwt } from '../config/config.jwt.js';
const prisma = new PrismaClient();
const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
}
const SALT_ROUNDS = 10;
async function buscarUsuario(nombreUsuario) {
    try{
      
        const usuarioEncontrado = await prisma.usuarios.findFirst({
            where: {
                nombre_usuario: nombreUsuario
            },
            select: {
                id: true,
                nombre_completo: true,
                nombre_usuario: true,
                contrasenia: true,
                rol_id: true,
                estado: true,
                roles: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        }); 
        if(!usuarioEncontrado){
            return null;
        }

        return usuarioEncontrado;
    }catch(error){
        throw error;
    }
}
async function buscarUsuarioPorNombre(nombreUsuario) {
    try {
        const usuarioEncontrado = await prisma.usuarios.findFirst({
            where: {nombre_usuario: nombreUsuario}
        });
        if(!usuarioEncontrado){
            return null;
        }
        return usuarioEncontrado;
    }catch(error){
        throw error
    }
}

async function buscarZonaPorNombre(nombreColonia) {
    try {
        const zonaEncontrada = await prisma.zonas.findFirst({
            where: {
                nombre:{
                  equals: nombreColonia,
                  mode: 'insensitive'  
                } 
            },
            select: {
                id: true,
                nombre: true,
            }
        });
            return zonaEncontrada;
    } catch (error) {
        throw error;
    }
}
async function loginServicio(nombreUsuario) {
    
    try{
        const usuarioEncontrado = await buscarUsuario(nombreUsuario);
        const token = jwt.sign({
            id: usuarioEncontrado.id, 
            rol: usuarioEncontrado.roles.nombre, 
            estado: usuarioEncontrado.estado,
            nombre_completo: usuarioEncontrado.nombre_completo,
            nombre_usuario: usuarioEncontrado.nombre_usuario
        }, configJwt.secret, {expiresIn: configJwt.expiresIn});
        const refreshToken = jwt.sign({
            id: usuarioEncontrado.id, 
            rol: usuarioEncontrado.roles.nombre, 
            estado: usuarioEncontrado.estado,
            nombre_completo: usuarioEncontrado.nombre_completo,
            nombre_usuario: usuarioEncontrado.nombre_usuario
        }, configJwt.secret, {expiresIn: configJwt.refreshIn});
        return {accessToken: token, refreshToken: refreshToken};
    }catch(error){
        throw error;
    }
}
async function crearUsuario(nombreCompleto, nombreUsuario, contrasenia, nombreColonia) {
    try {
    const result = await prisma.$transaction(async (tx) => {
        const hashedPassword = await bcrypt.hash(contrasenia, SALT_ROUNDS);
        const role = await tx.roles.findFirst({
            where: {
                nombre: ROLES.USER
            }
        });

        const zona = await buscarZonaPorNombre(nombreColonia);
        if(!zona){
            const error = new Error('La zona especificada no existe');
            error.status = 400;
            throw error;
        }
        const usuario = await tx.usuarios.create({
            data: {
                nombre_completo: nombreCompleto,
                nombre_usuario: nombreUsuario,
                contrasenia: hashedPassword,
                rol_id: role.id,
                zona_id: zona.id,
                estado: 'ACTIVO',
            }
        });
        return usuario;
    });
    const token = await loginServicio(result.nombre_usuario);
        return {
            message: 'Usuario creado correctamente',
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        };
    } catch (error) {
        throw error;
    }

}
export {
    buscarUsuario,
    loginServicio,
    crearUsuario,
    buscarUsuarioPorNombre,
    buscarZonaPorNombre,
}