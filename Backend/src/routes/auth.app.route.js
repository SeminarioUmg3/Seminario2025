import { login, register} from "../controllers/auth.app.controller.js";
import { body } from "express-validator";
import { Router } from "express";
const routerAuthApp = Router();
const authValidation = [
    body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
]
const registerValidation = [
    body('nombreCompleto').notEmpty().withMessage('El nombre completo es requerido'),
    body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
]
 /**
    * @swagger
    * /api/auth/app/login:
    *   post:
    *     tags:
    *       - App
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
 routerAuthApp.post('/login',authValidation,login);

 /**
  * @swagger
  * /api/auth/app/register:
  *   post:
  *     summary: Registro de usuario
  *     tags:
  *       - App
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
  *               colonia:
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
 routerAuthApp.post('/register', registerValidation, register);
 export { routerAuthApp };``