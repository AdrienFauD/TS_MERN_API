import { InferSchemaType, Schema, model } from "mongoose";

const searchsSchema = new Schema({
    createdAt: { type: Date, default: Date.now, required : true },
    query : {type : String, required : true},
    search_iteration : {type : Number}
})

type Search = InferSchemaType<typeof searchsSchema>


export default model<Search>("Order", searchsSchema)