import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = '1h';
const REFRESH_IN = '7d';
const configJwt = {
    secret: SECRET_KEY,
    expiresIn: EXPIRES_IN,
    refreshIn: REFRESH_IN
}

export {
    configJwt
}