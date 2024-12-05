import cacher from "../cache/cach"
import pointModel from "../DB/models/pints"
import UserModel from "../DB/models/user"
import { response } from "../response"
import interConnection from "./connection"


const connection = new interConnection()


export default class interServiceController {

    async addPoint(req: any, res: any, next: any) {
        console.log(req.body)
        const point = req.body
        const user = await UserModel.findById(point.userId)
        console.log(point.reason)
        const addPoint = await pointModel.findOneAndUpdate({user : user?._id} , {$inc : {points : +point.reason.point }  , $addToSet:{pointsLogs : point.reason}}) 
        await connection.resetCache()
        return next(new response(req , res , 'add point for user' , 200 , null , 'point add successfully!'))
    }

    
}