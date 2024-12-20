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

router.get('/test' , (req:any , res:any , next:any)=>{
    res.status(200).send('test passed')
})

router.post('/login' , loginRule , controller.login)

router.patch('/update' , middleware.auth ,controller.updateUser)

router.put('/forget-password' , forgetRole , controller.forgetPassword)

router.put('/check-code/:email/:code' , controller.checkCode)

router.put('/reset-password' , resetRole, middleware.auth ,controller.resetPassword)


export default router