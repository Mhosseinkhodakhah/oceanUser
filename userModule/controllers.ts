import { body, validationResult } from "express-validator"
import UserModel from "../DB/models/user"
import { response } from "../response"
import { tokenizationInterface, user } from "./interfaces"
import userService from "./userServices"
import bcrypt from 'bcrypt'
import pointModel from "../DB/models/pints"
import cacher from "../cache/cach"
const services = new userService()


export default class userControlers {

    async register(req: any, res: any, next: any) {
        const body = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return next(new response(req, res, 'register', 400, error['errors'][0].msg, null))
        }
        const exist = await UserModel.exists({ email: req.body.email })
        if (exist) {
            return next(new response(req, res, 'register', 401, 'this email already has been used ', null))
        }
        const hash = await bcrypt.hash(req.body.password, 10)
        body.password = hash
        const user = await UserModel.create(body)
        const point = await pointModel.create({ user: user._id })
        await UserModel.findByIdAndUpdate(user._id , {points : point._id })
        const data: tokenizationInterface = {
            id: (user._id).toString(),
            email: body.email,
            fullName: body.fullName,
            country: body.country,
            language: body.language
        }
        const token = await services.tokenize(data)
        console.log(token)
        const refreshToken = await services.refreshTokenize({email : data.email})
        const newData = { ...data, token: token  , refreshToken : refreshToken}
        await cacher.reset()
        return next(new response(req, res, 'register', 200, null, { user: newData }))
    }


    async login(req: any, res: any, next: any) {
        console.log('here1')
        const existance = await UserModel.exists({ email: req.body.email })
        if (!existance) {
            // return res.status(200).json('this user is not exist')
            return next(new response(req, res, 'login', 404, 'username or password is wrong', null))
        }
        console.log('here2')
        const user = await UserModel.findOne({ email: req.body.email })
        if (user) {
            console.log('here3')
            const password = user?.password
            const compare = await bcrypt.compare(req.body.password, password)
            console.log(compare)
            if (!compare) {
                return next(new response(req, res, 'login', 403, 'the password is incorrect', null))
            }

            const data = {
                id: (user?._id),
                email: user?.email,
                fullName: user?.fullName,
                country: user?.country,
                language: user?.language
            }
            const token = await services.tokenize(data)
            const refreshToken = await services.refreshTokenize({email : data.email})
            const newData = { ...data, token: token , refreshToken : refreshToken }
            return next(new response(req, res, 'login', 200, null, { user: newData }))
        }
    }


    async checkToken(req: any, res: any, next: any) {
        const user = await UserModel.findById(req.user.id)
        return next(new response(req, res, 'check token', 200, null, { user: user }))
    }

    async updateUser(req: any, res: any, next: any) {
        const existance = await UserModel.exists({ _id: req.user.id })
        if (!existance) {
            return next(new response(req, res, 'update', 404, 'user is not exist on database', null))
        }

        await UserModel.findByIdAndUpdate(req.user.id, req.body)
        const updated = await UserModel.findById(req.user.id)
        await cacher.reset()
        return next(new response(req, res, 'update user', 200, null, { user: updated }))
    }


    async refreshToken(req: any, res: any, next: any) {
        const body = req.body
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'refresh token', 400, bodyError['errors'][0].msg, null))
        }
        console.log(req.body)
        const verify : any = await services.checkRefreshToken(req.body.refreshToken)
        // console.log(verify)
        if (!verify) {
            return next(new response(req, res, 'refresh token', 401, 'token expired', null))
        }
        const user = await UserModel.findOne({email : verify.email})
        const data = {
            id: (user?._id)?.toString(),
            email: user?.email,
            fullName: user?.fullName,
            country: user?.country,
            language: user?.language
        }
        const token = await services.tokenize(data)
        const newData = { ...data, token: token }
        return next(new response(req, res, 'refresh token', 200, null, { user: newData }))
    }



    async forgetPassword(req: any, res: any, next: any) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'forget password', 400, bodyError['errors'][0].msg, null))
        }
        const code : string = await services.codeGenerator()
        const { email } = req.body
        const sendEmail = await services.sendEmail(email, code)
        console.log('1111')
        await UserModel.findOneAndUpdate({ email: email } , { resetPasswordToken: code })
        console.log('2222')
        return next(new response(req, res, 'forget password', 200, null, 'the code send to your email successfully! please check your email.'))
    }


    async checkCode(req: any, res: any, next: any) {
        const code = req.params.code;
        const email = req.params.email;
        const user = await UserModel.findOne({ email: email }).select('-password')
        if (!user) {
            return next(new response(req, res, 'check otp code!', 404, 'email not found!', null))
        }
        if (user.resetPasswordToken !== code) {
            return next(new response(req, res, 'check otp code!', 401, 'wrong code!', null))
        }
        const data: tokenizationInterface = {
            id: (user._id).toString(),
            email: user?.email,
            fullName: user?.fullName,
            country: user?.country,
            language: user?.language
        }
        const token = await services.tokenize(data)
        const newData = { ...data, token: token }
        return next(new response(req, res, 'check otp code!', 200, null, { user: newData }))
    }

    async resetPassword(req: any, res: any, next: any) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'reset password', 400, bodyError['errors'][0].msg, null))
        }
        const user = await UserModel.findById(req.user.id)
        const hash = await bcrypt.hash(req.body.password, 10)
        console.log('hashhhhh >>>>>', hash)
        await UserModel.findByIdAndUpdate(user?._id, { password: hash })
        return next(new response(req, res, 'reset password', 200, null, 'the password successfully updated!'))
    }


    async getUser(req: any, res: any, next: any) {
        const user = await UserModel.findById(req.user.id).populate('points').select(['-password' , '-resetPasswordToken'])
      
        return next(new response(req, res, 'get user', 200, null, { user: user }))
    }



    async getRankPoints(req: any, res: any, next: any) {
        const points = await pointModel.find().sort({'points' : -1}).populate('user' , 'userName fullName email country')
        console.log('point', points)
        return next(new response(req, res, 'get user point', 200, null, { points: points }))
    }
    

    async getUserPoint(req: any, res: any, next: any){
        const point = await UserModel.findById(req.user.id)
        return next (new response(req , res , 'get user point' , 200 , null , point?.points))
    }

}

