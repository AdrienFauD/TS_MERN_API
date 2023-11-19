import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import OrderModel from "../models/orders";

export const getUserOrders: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId
    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user")
        }
        const orders = await OrderModel.findById(userId).exec()
        if (!orders) {
            throw createHttpError(400, "No orders found")
        }
        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
}

interface CreateOrderBody {
    user_id: string,
    cart_id: string[],
    payment_method: string,
    order_status: string,
}

export const createOrder: RequestHandler<unknown, unknown, CreateOrderBody, unknown> = async (req, res, next) => {
    const userId = req.body.user_id
    const cartId = req.body.cart_id
    const paymentMethod = req.body.payment_method
    const orderStatus = req.body.order_status

    try {
        if(!userId || !cartId || !paymentMethod || orderStatus){
            throw createHttpError(400, "Param missing")
        }
        const order = await OrderModel.create({
            user_id: userId,
            cart_id: cartId,
            payment_method: paymentMethod,
            order_status: orderStatus,
        })
        res.status(201).json(order)
    } catch (error) {
        next(error)
    }
}