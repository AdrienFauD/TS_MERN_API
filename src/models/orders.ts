import { InferSchemaType, Schema, model } from "mongoose";

const ordersSchema = new Schema({
    createdAt: { type: Date, default: Date.now, required : true },
    paymentMethod: { type: String},
    orderStatus: { type: String, required : true},
    cartId: { type: Schema.Types.ObjectId },
    customerId: { type: Schema.Types.ObjectId },
})

type Order = InferSchemaType<typeof ordersSchema>


export default model<Order>("Order", ordersSchema)