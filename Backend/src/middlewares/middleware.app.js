import {configJwt} from '../config/config.jwt.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/client.js';
async function verifyTokenApp(req,res,next){
    let token = req.headers['authorization']
    //console.log('token',token);

    token = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    //console.log('token parseado',token);
    if(!token){
        return res.status(401).json({message: 'No autorizado'});
    }
    try {
        const decoded = await jwt.verify(token, configJwt.secret);
        const prisma = new PrismaClient();  
        const usuarioEncontrado = await prisma.usuarios.findFirst({
            where: {
                id: decoded.id
            }
        });
        if(!usuarioEncontrado){
            return res.status(401).json({message: 'No autorizado'});
        }
        if(decoded.rol != 'USER'){
            return res.status(401).json({message: 'No autorizado'});
        }
        if (decoded.estado != 'ACTIVO'){
            return res.status(401).json({message: 'No autorizado'});
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Error en verifyTokenApp:', error);
        return res.status(401).json({message: 'Unauthorized'});
    }
}

export {verifyTokenApp};