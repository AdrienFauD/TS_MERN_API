import { InferSchemaType, Schema, model } from "mongoose";

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    products: [[Schema.Types.Mixed]]
})

type Cart = InferSchemaType<typeof cartSchema>

export default model<Cart>("Cart", cartSchema)


