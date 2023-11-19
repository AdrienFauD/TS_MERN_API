import { InferSchemaType, Schema, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, require: true },
    price: { type: String, require: true },
    discount: { type: Number },
    rating: { type: Number, require: true },
    description: { type: String, require: true },
    stock: { type: Number, require: true },
    seller: { type: String, require: true },
    quantity_sold: { type: Number},
    category: { type: String, require: true },
    images: [String],
    thumbnail: { type: String, require: true }
}, {timestamps : true})

type Product = InferSchemaType<typeof productSchema>

export default model<Product>("Product", productSchema)