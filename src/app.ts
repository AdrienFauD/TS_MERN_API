import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import usersRoutes from "./routes/users"
import productRoutes from "./routes/products"
import cartRoutes from "./routes/carts"
import orderRoutes from "./routes/orders"
import createHttpError, { isHttpError } from "http-errors"
import session from "express-session"
import env from "./util/validateEnv"
import MongoStore from "connect-mongo"

const app = express()

app.use(express.json())

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.ATLAS_URI
    })

}))

app.use('/api/tree/users', usersRoutes)

app.use('/api/tree/products', productRoutes)

app.use('/api/tree/carts', cartRoutes)

app.use('/api/tree/orders', orderRoutes)

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"))
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error)
    let errorMessage = "An error occurred: "
    let statusCode = 500
    if (isHttpError(error)) {
        statusCode = error.status
        errorMessage += error.message
    }
    res.status(statusCode).json({ error: errorMessage })
})

export default app