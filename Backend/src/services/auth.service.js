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
async function crearUsuario(nombreCompleto, nombreUsuario, contrasenia) {
    try {
        
    
    const result = await prisma.$transaction(async (tx) => {
        const hashedPassword = await bcrypt.hash(contrasenia, SALT_ROUNDS);
        const role = await tx.roles.findFirst({
            where: {
                nombre: ROLES.ADMIN
            }
        });
        const usuario = await tx.usuarios.create({
            data: {
                nombre_completo: nombreCompleto,
                nombre_usuario: nombreUsuario,
                contrasenia: hashedPassword,
                rol_id: role.id,
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

async function actualizarUsuarioServicio(id, nombre_completo, nombre_usuario, estado, rol_id, zona_id) {
    try {
        const existingUser = await prisma.usuarios.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!existingUser) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }

        const updateData = {
            nombre_completo,
            nombre_usuario,
            estado,
            rol_id: rol_id ? parseInt(rol_id) : undefined,
            zona_id: zona_id ? parseInt(zona_id) : undefined
        };

        const user = await prisma.usuarios.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        
        return user;
    } catch (error) {
        throw error;
    }
}

async function eliminarUsuarioServicio(id) {
    try {
        const existingUser = await prisma.usuarios.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!existingUser) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }

        const user = await prisma.usuarios.delete({
            where: { id: parseInt(id) }
        });
        
        return { message: 'Usuario eliminado correctamente', user: existingUser };
    } catch (error) {
        throw error;
    }
}

async function obtenerListaUsuarios() {
    try {
        const users = await prisma.usuarios.findMany(
            {
                orderBy: {
                    id: 'desc'
                },select: {
                    id: true,
                    nombre_completo: true,
                    nombre_usuario: true,
                    estado: true,
                    fecha_registro: true,
                    roles: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    },
                    zonas: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    }
                }
            }
        );
        return users;
    } catch (error) {
        throw error;
    }
}

async function obtenerUsuarioId(id) {
    try {
        const user = await prisma.usuarios.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                nombre_completo: true,
                nombre_usuario: true,
                estado: true,
                fecha_registro: true,
                roles: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                zonas: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });
        if (!user) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }
        return user;
    } catch (error) {
        throw error;
    }
}

async function crearRol(nombre) {
    try {
        const role = await prisma.roles.create({
            data: { nombre }
        });
        return { message: 'Rol creado correctamente'};
    } catch (error) {
        throw error;
    }
}

async function actualizarRol(id, nombre) {
    try {
        const existeRole = await prisma.roles.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!existeRole) {
            throw { status: 404, message: 'Rol no encontrado' };
        }
        const role = await prisma.roles.update({
            where: { id: parseInt(id) },
            data: { nombre }
        });
        return { message: 'Rol actualizado correctamente'};
    } catch (error) {
        throw error;
    }
}

async function eliminarRol(id) {
    try {
        const existeRole = await prisma.roles.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!existeRole) {
            throw { status: 404, message: 'Rol no encontrado' };
        }
        const role = await prisma.roles.delete({
            where: { id: parseInt(id) }
        });
        if (!role) {
            throw { status: 404, message: 'Rol no encontrado' };
        }
        return { status: 200, message: 'Rol eliminado correctamente'};
    } catch (error) {
        throw error;
    }
}

async function obtenerListaRoles() {
    try {
        const roles = await prisma.roles.findMany(
            {
                orderBy: {
                    id: 'desc'
                }
            }
        );
        return roles;
    } catch (error) {
        throw error;
    }
}

async function obtenerRolId(id) {
    try {
        const role = await prisma.roles.findUnique({
            where: { id: parseInt(id) }
        });
        if (!role) {
            throw { status: 404, message: 'Rol no encontrado' };
        }
        return role;
    } catch (error) {
        throw error;
    }
}
export {
    buscarUsuario,
    loginServicio,
    crearUsuario,
    buscarUsuarioPorNombre,
    actualizarUsuarioServicio,
    eliminarUsuarioServicio,
    obtenerListaUsuarios,
    obtenerUsuarioId,
    crearRol,
    actualizarRol,
    eliminarRol,
    obtenerListaRoles,
    obtenerRolId
    
}