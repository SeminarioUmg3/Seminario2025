import express from 'express';
import {test} from '../controllers/controller.js';
const router = express.Router();

router.get('/test', test);


export {router};

