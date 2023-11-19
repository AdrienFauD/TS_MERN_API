import express from "express"
import * as UsersController from '../controllers/users'
import { requiresAuth } from "../middlewares/auth"

const router = express.Router()

router.get("/", requiresAuth, UsersController.getAuthenticatedUser)

router.post("/logout", UsersController.logout)

router.post("/signin", UsersController.signIn)

router.post("/login", UsersController.login)

export default router