import { Router } from "express";
import middleWare from "../middleware/middleware";
import adminController from "./controller";



const adminRouter = Router()
const adminAuth = new middleWare().adminAuth
const controller = new adminController()


adminRouter.get('get-all-users' , )

adminRouter.get('/get-user' , )

adminRouter.get('/get-region-users' , )

adminRouter.get('/get-region-users' , )

export default adminRouter;