import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import usersRoutes from "./routes/users"

const app = express()

app.use(express.json())

app.use('/api/users', usersRoutes)


app.use((req,res,next)=>{
    next(Error('Endpoint not found '))
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error)
    let errorMessage = "An error occurred: "
    if (error instanceof Error) errorMessage += error.message
    res.status(500).json({ error : errorMessage })
})

export default app