import { RequestHandler } from "express"
import UserModel from "../models/user"
import * as CartController from "../controllers/carts"
import createHttpError from "http-errors"
import bcrypt from "bcrypt"


export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec()
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

interface SignUpBody {
    username?: string
    email?: string,
    password?: string,
    userId: string
}

export const signIn: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const email = req.body.email
    const username = req.body.username
    const passwordRaw = req.body.password

    try {

        if (!username || !email || !passwordRaw) {
            throw createHttpError(409, "Parameters missing")
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec()

        if (existingUsername) {
            throw createHttpError(409, "This username already exist. Please choose another username or log in instead.")
        }
        const existingEmail = await UserModel.findOne({ email: email }).exec()

        if (existingEmail) {
            throw createHttpError(409, "This email already exist. Please choose another email or log in instead.")
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10)

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        })
        req.session.userId = newUser._id

        await CartController.createCart(req, res, next)
        res.status(201).json({ newUser })
    } catch (error) {
        next(error)
    }
}

interface LogInBody {
    username?: string,
    password?: string
}

export const login: RequestHandler<unknown, unknown, LogInBody, unknown> = async (req, res, next) => {

    const username = req.body.username
    const password = req.body.password

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameter(s) missing")
        }
        const user = await UserModel.findOne({ username: username }).select("+ password +email").exec()
        if (!user) {
            throw createHttpError(400, "Invalid credentials")
        }

        const passworMatched = await bcrypt.compare(password, user.password)
        if (!passworMatched) {
            throw createHttpError(401, "Invalid credentials")
        }

        req.session.userId = user._id
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }

}

export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error)
        } else {
            res.sendStatus(200)
        }
    })
}