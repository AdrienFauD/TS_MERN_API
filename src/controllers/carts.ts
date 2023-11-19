import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import CartModel from "../models/cart";
import ProductModel from "../models/product";
import { assertIsDefined } from "../util/assertIsDefined";

export const getCart: RequestHandler = async (req, res, next) => {
    const cartId = req.params.cartId
    const authenticatedUser = req.session.userId

    try {
        assertIsDefined(authenticatedUser)

        if (!mongoose.isValidObjectId(cartId) || !mongoose.isValidObjectId(authenticatedUser)) {
            throw createHttpError(400, "Invalid cart id")
        }
        const cart = await CartModel.findOne({ userId: authenticatedUser }).exec()
        if (!cart) {
            throw createHttpError(404, "Cart not found")
        }
        if (!cart.userId.equals(authenticatedUser)) {
            throw createHttpError(401, "You cannot access this cart")
        }

        res.status(200).json(cart)
    } catch (error) {
        next(error)
    }
}

interface CreateCartBody {
    userId: string
}

export const createCart: RequestHandler<unknown, unknown, CreateCartBody, unknown> = async (req, res, next) => {
    const userId = req.session.userId

    try {

        if (!userId) {
            throw createHttpError(400, " Missing parameters")
        }
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user")
        }
        const user = await CartModel.findById(userId).exec()
        if (user) {
            throw createHttpError(409, "User already have a cart")
        }


        await CartModel.create({
            userId: userId,
            products: {}
        })
    } catch (error) {
        next(error)
    }
}


type UpdateCartParams = {
    cartId: string
}
interface UpdateCartBody {
    products: mongoose.Types.ObjectId
    productIteration: number
}


export const updateCart: RequestHandler<UpdateCartParams, unknown, UpdateCartBody, unknown> = async (req, res, next) => {
    const newProductId = req.body.products
    const iteration = req.body.productIteration
    const authenticatedUser = req.session.userId

    try {

        assertIsDefined(authenticatedUser)

        if (!mongoose.isValidObjectId(newProductId)) {
            throw createHttpError(400, "Invalid params")
        }
        if (!newProductId || !iteration) {
            throw createHttpError(404, "Must specify a product")
        }
        const product = await ProductModel.findById(newProductId).exec()
        if (!product) {
            throw createHttpError(404, "Product does not exist")
        }
        const cartUser = await CartModel.findOne({ userId: authenticatedUser }).select("+products").exec()

        if (!cartUser) {
            throw createHttpError(404, "Cart not found")
        }

        const indexProductInCart = cartUser.products.findIndex((products) => products[0] === newProductId)
        console.log(indexProductInCart)

        if (indexProductInCart < 0) {
            if (iteration < 0) throw createHttpError(409, "Cart cannot have negative quantities")
            cartUser.products.push([newProductId, iteration])
        } else {
            cartUser.products[indexProductInCart][1] += iteration
        }

        const updatedCart = await cartUser.save()
        res.status(201).json(updatedCart)
    } catch (error) {
        next(error)
    }
}


export const emptyCart: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId
    const authenticatedUser = req.session.userId

    try {
        assertIsDefined(authenticatedUser)

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid cart ID")
        }
        const cart = await CartModel.findOne({ userId: userId }).exec()
        if (!cart) {
            throw createHttpError(404, "Cart not found")
        }

        if (!cart.userId.equals(authenticatedUser)) {
            throw createHttpError(401, "Cannot access this cart")
        }

        cart.products = []
        const updatedCart = await cart.save()
        res.status(201).json(updatedCart)
    } catch (error) {
        next(error)
    }
}