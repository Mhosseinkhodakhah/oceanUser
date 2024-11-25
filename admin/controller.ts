import UserModel from "../DB/models/user";
import { response } from "../response";





export default class adminController {

    async getAllUsers(req: any, res: any, next: any) {
        const users = await UserModel.find()
        return next(new response(req, res, 'get all users by admin', 200, null, users))
    }

    


}