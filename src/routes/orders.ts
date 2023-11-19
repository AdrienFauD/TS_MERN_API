import express from "express"
import * as OrderController from "../controllers/orders"

const router = express.Router()

router.get("/:userId", OrderController.getUserOrders )


router.post("/", OrderController.createOrder)

export default router