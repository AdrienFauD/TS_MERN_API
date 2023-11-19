import express from "express";
import * as CartModel from "../controllers/carts"
import { requiresAuth } from "../middlewares/auth";

const router = express.Router()

router.get("/:cartId", requiresAuth, CartModel.getCart)

router.patch("/:cartId",requiresAuth, CartModel.updateCart)

router.patch("/empty/:userId",requiresAuth, CartModel.emptyCart)


export default router