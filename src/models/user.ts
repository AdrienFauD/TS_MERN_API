import { Schema, InferSchemaType, model } from "mongoose";

const userSchema = new Schema({
    birth_date : {type : Date, required: true},
    first_name : {type : String, required: true},
    last_name : {type : String, required: true},
    gender : {type : String},
    email : {type : String, required: true},
    password : {type : String, required: true}
})

type User = InferSchemaType<typeof userSchema>

export default model<User>("User", userSchema)