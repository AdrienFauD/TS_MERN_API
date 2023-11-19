import express from "express"
import * as ProductController from "../controllers/products"
import { requiresAuth } from "../middlewares/auth"

const router = express.Router()

router.get("/", ProductController.getProducts)

router.get("/:productId", ProductController.getProductId)

router.get("/search_title/:productTitle", ProductController.getProduct)

router.get("/seller_edit/:seller", requiresAuth, ProductController.getSellerProducts)

router.get("/search/product/:search", ProductController.searchProduct)

router.get("/search/query/:query", ProductController.searchQuery)

router.post("/", ProductController.createProduct)

router.patch("/:productId", ProductController.updateProduct)

router.delete("/:productId", requiresAuth, ProductController.deleteProduct)

export default router