import app from "./app"
import env from "./util/validateEnv"
import mongoose from "mongoose"

const port = env.PORT
const atlas_URI = env.ATLAS_URI


mongoose.connect(atlas_URI)
    .then(() => {
        console.log("Mongoose connected")
        app.listen(port!, () => {
            console.log("Server running on port " + port)
        })
    })
    .catch(console.error)
