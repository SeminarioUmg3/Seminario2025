import { login, register, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from "../controllers/auth.controller.js";
import { crearRoles, actualizarRolId, eliminarRolId, obtenerListadoRoles, obtenerRolPorId } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { Router } from "express";
import { verifyToken } from "../middlewares/middleware.js";
const routerAuth = Router();
const users = Router();
const roles = Router();
const authValidation = [
    body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
]
const registerValidation = [
    body('nombreCompleto').notEmpty().withMessage('El nombre completo es requerido'),
    body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
]
const rolesValidation = [
    body('nombre').notEmpty().withMessage('El nombre del rol es requerido'),
]
const usersValidation = [
    body('nombreCompleto').notEmpty().withMessage('El nombre completo es requerido'),
    body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('rol_id').notEmpty().withMessage('El rol es requerido'),
    body('estado').notEmpty().withMessage('El estado es requerido'),
    body('zona_id').notEmpty().withMessage('La zona es requerida'),
]
 /**
    * @swagger
    * /api/auth/login:
    *   post:
    *     tags:
    *       - Auth
    *     summary: Inicio de sesión
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               nombreUsuario:
    *                 type: string
    *               contrasenia:
    *                 type: string
    *     responses:
    *       200:
    *         description: Inicio de sesión exitoso
    *       401:
    *         description: Credenciales inválidas
    *       403:
    *         description: Usuario inactivo o no encontrado
    *       500:
    *         description: Error interno del servidor
    */
 routerAuth.post('/login',authValidation,login);

 /**
  * @swagger
  * /api/auth/register:
  *   post:
  *     summary: Registro de usuario
  *     tags:
  *       - Auth
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               nombreCompleto:
  *                 type: string
  *               nombreUsuario:
  *                 type: string
  *               contrasenia:
  *                 type: string
  *              
  *     responses:
  *       200:
  *         description: Registrado correctamente
  *       400:
  *         description: El usuario ya existe
  *       500:
  *         description: Error interno del servidor
  */
 routerAuth.post('/register', registerValidation, register);

 /**
  * @swagger
  * /api/usuarios/obtenerUsuarios:
  *   get:
  *     summary: Obtener usuarios
  *     tags:
  *       - Auth
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: Usuarios encontrados
  *       500:
  *         description: Error interno del servidor
  */
 users.get('/obtenerUsuarios', verifyToken, obtenerUsuarios);

 /**
  * @swagger
  * /api/usuarios/obtenerUsuarioId/{id}:
  *   get:
  *     summary: Obtener usuario por ID
  *     tags:
  *       - Auth
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del usuario
  *     responses:
  *       200:
  *         description: Usuario encontrado
  *       404:
  *         description: Usuario no encontrado
  *       500:
  *         description: Error interno del servidor
  */
 users.get('/obtenerUsuarioId/:id', verifyToken, obtenerUsuarioPorId);

 /**
  * @swagger
  * /api/usuarios/actualizarUsuario/{id}:
  *   put:
  *     summary: Actualizar usuario
  *     tags:
  *       - Auth
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del usuario
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               nombre_completo:
  *                 type: string
  *               nombre_usuario:
  *                 type: string
  *               rol_id:
  *                 type: integer
  *               estado:
  *                 type: string
  *               zona_id:
  *                 type: integer
  *     responses:
  *       200:
  *         description: Usuario actualizado correctamente
  *       400:
  *         description: Debe proporcionar al menos un campo para actualizar
  *       404:
  *         description: Usuario no encontrado
  *       500:
  *         description: Error interno del servidor
  */
 users.put('/actualizarUsuario/:id',usersValidation, verifyToken, actualizarUsuario);

 /**
  * @swagger
  * /api/usuarios/eliminarUsuario/{id}:
  *   delete:
  *     summary: Eliminar usuario
  *     tags:
  *       - Auth
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del usuario
  *     responses:
  *       200:
  *         description: Usuario eliminado correctamente
  *       404:
  *         description: Usuario no encontrado
  *       500:
  *         description: Error interno del servidor
  */
 users.delete('/eliminarUsuario/:id', verifyToken, eliminarUsuario);

 /**
  * @swagger
  * /api/roles/crearRoles:
  *   post:
  *     summary: Crear rol
  *     tags:
  *       - Roles
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               nombre:
  *                 type: string
  *     responses:
  *       200:
  *         description: Rol creado correctamente
  *       500:
  *         description: Error interno del servidor
  */
 roles.post('/crearRol', rolesValidation, verifyToken, crearRoles);
  
 /**
  * @swagger
  * /api/roles/actualizarRolId/{id}:
  *   put:
  *     summary: Actualizar rol
  *     tags:
  *       - Roles
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del rol
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               nombre:
  *                 type: string
  *     responses:
  *       200:
  *         description: Rol actualizado correctamente
  *       500:
  *         description: Error interno del servidor
  */
 roles.put('/actualizarRolId/:id', rolesValidation, verifyToken, actualizarRolId);

 /**
  * @swagger
  * /api/roles/eliminarRolId/{id}:
  *   delete:
  *     summary: Eliminar rol
  *     tags:
  *       - Roles
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del rol
  *     responses:
  *       200:
  *         description: Rol eliminado correctamente
  *       404:
  *         description: Rol no encontrado
  *       500:
  *         description: Error interno del servidor
  */
 roles.delete('/eliminarRolId/:id', verifyToken, eliminarRolId);

 /**
  * @swagger
  * /api/roles/obtenerListadoRoles:
  *   get:
  *     summary: Obtener listado de roles
  *     tags:
  *       - Roles
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: Listado de roles obtenido correctamente
  *       500:
  *         description: Error interno del servidor
  */
 roles.get('/obtenerListadoRoles', verifyToken, obtenerListadoRoles);

 /**
  * @swagger
  * /api/roles/obtenerRolId/{id}:
  *   get:
  *     summary: Obtener rol por ID
  *     tags:
  *       - Roles
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del rol
  *     responses:
  *       200:
  *         description: Rol obtenido correctamente
  *       404:
  *         description: Rol no encontrado
  *       500:
  *         description: Error interno del servidor
  */
 roles.get('/obtenerRolId/:id', verifyToken, obtenerRolPorId);

export {
    routerAuth,
    users,
    roles
}
