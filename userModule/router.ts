import { Router, Request, Response } from 'express';


import userControlers from './controllers';
import { forgetRole, loginRule, refreshRule, registerRole, resetRole } from './validators';
import middleWare from '../middleware/middleware';
import messanger from '../rabbitMq/rabbitMq';

const controller = new userControlers()

// const rabbit = new messanger().connect()

const router = Router();

const middleware = new middleWare()
const adminAuth = new middleWare().adminAuth


router.post('/register' , registerRole , controller.register)

router.post('/login' , loginRule , controller.login)

router.get('/refresh-token' , refreshRule ,controller.refreshToken)

router.get('/check-token' ,middleware.auth ,controller.checkToken)

router.patch('/update' , middleware.auth ,controller.updateUser)

router.get('/forget-password' , forgetRole , controller.forgetPassword)

router.put('/check-code/:email/:code' , controller.checkCode)

router.put('/reset-password' , resetRole, middleware.auth ,controller.resetPassword)

router.get('/get-user' , middleware.auth ,controller.getUser)

router.get('/get-points-rank' , middleware.auth ,controller.getRankPoints)

export default router