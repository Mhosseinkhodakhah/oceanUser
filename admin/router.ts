import { Router } from "express";
import middleWare from "../middleware/middleware";
import adminController from "./controller";


const adminRouter = Router()
const adminAuth = new middleWare().adminAuth
const controller = new adminController()

export default adminRouter;