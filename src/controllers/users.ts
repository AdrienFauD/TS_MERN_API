import { RequestHandler } from "express"
import UserModel from "../models/user"


export const getUsers: RequestHandler = async (req , res, next) => {
    try {
        // throw Error("Error found !!!!")
        const users = await UserModel.find().exec()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export const createUser : RequestHandler = async (req,res,next) => {
    const birth_date = req.body.birth_date
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const gender = req.body.gender
    const email = req.body.email
    const account_creation = req.body.account_creation
    const password = req.body.password

    try{
        const newUser = await UserModel.create({
            birth_date : birth_date,
            first_name : first_name,
            last_name : last_name,
            gender : gender,
            email : email,
            password : password,
            account_creation : account_creation,
        })
        
        res.status(201).json(newUser)
    }catch(error){
        next(error)
    }
}

export const getUser : RequestHandler = async (req,res,next) => {
    const userId = req.params.userId

    try{
        const users = await UserModel.findById(userId).exec()
        res.status(200).json(users)
    }catch(error){
        next(error)
    }
}