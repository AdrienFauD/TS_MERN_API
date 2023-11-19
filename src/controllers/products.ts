import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import ProductModel from '../models/product';
import UserModel from '../models/user';
import SearchModel from '../models/searchs';

export const getProducts: RequestHandler = async (req, res, next) => {
    try {
        const products = await ProductModel.find().exec()
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

export const getSellerProducts: RequestHandler = async (req, res, next) => {
    const seller = req.params.seller
    const userId = req.session.userId
    try {
        if (!seller || !userId) {
            throw createHttpError(401, "Missing params")
        }
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(401, "Invalid id")
        }
        const sellerId = await UserModel.findOne({ seller: seller })
        if (!sellerId) {
            throw createHttpError(401, "Seller not found")
        }
        if (!sellerId._id.equals(userId)) {
            throw createHttpError(401, "You cannot access thoose products")
        }
        const products = await ProductModel.find({ seller: seller })
        if (!products) {
            throw createHttpError(404, "Products not found")
        }

        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}


export const getProduct: RequestHandler = async (req, res, next) => {
    const productName = req.params.productTitle
    try {
        if (!productName) {
            throw createHttpError(401, "Missing param")
        }
        const product = await ProductModel.findOne({ name: productName }).exec()
        if (!product) {
            throw createHttpError(404, "Product not found")
        }
        res.status(200).json(product)

    } catch (error) {
        next(error)
    }
}
export const getProductId: RequestHandler = async (req, res, next) => {
    const productId = req.params.productId
    try {
        if (!mongoose.isValidObjectId(productId)) {
            throw createHttpError(400, "Invalid ID")
        }
        if (!productId) {
            throw createHttpError(401, "Missing param")
        }
        const product = await ProductModel.findOne({ _id: productId }).exec()

        if (!product) {
            throw createHttpError(404, "Product not found")
        }
        res.status(200).json(product)

    } catch (error) {
        next(error)
    }
}

interface UpdateQueriesBody{

}
interface UpdateQueriesParams{
    
}

export const updateSearchQueries : RequestHandler<UpdateQueriesParams, unknown, UpdateQueriesBody, unknown> = async (req,res,next) => {
    
    try {
        throw createHttpError(409, "Missing somthing")
    } catch (error) {
        next(error)
    }
}

export const searchQuery: RequestHandler = async (req, res, next) => {
    const searchBody: string = req.params.search
    const pipeline = [
        {
            $search: {
                index: "searchProducts",
                text: {
                    query: searchBody,
                    path: ["query"],
                    fuzzy: {},
                },
            },
            $limit: 5
        }
    ]

    try {
        if (!searchBody) {
            throw createHttpError(409, "Missing params")
        }
        const queries = await SearchModel.aggregate(pipeline)
        if (!queries) {
            throw createHttpError(404, "Queries not found")
        }
        res.send(queries)
    } catch (error) {
        next(error)
    }
}


export const searchProduct: RequestHandler = async (req, res, next) => {
    const searchBody: string = req.params.search
    const pipeline = [
        {
            $search: {
                index: "searchProducts",
                text: {
                    query: searchBody,
                    path: ["category", "name", "description"],
                    fuzzy: {},
                },
            },
        }
    ]

    try {
        if (!searchBody) {
            throw createHttpError(401, "Missing param")
        }
        const products = await ProductModel.aggregate(pipeline)
        if (!products) {
            throw createHttpError(404, "Product not found")
        }
        res.send(products)
    } catch (error) {
        next(error)
    }
}

interface CreateProductBody {
    name: string
    price?: string,
    discount?: string,
    rating?: string,
    description?: string,
    stock?: number,
    seller?: string,
    quantity_sold?: string,
    category?: string,
    images?: string[],
    thumbnail?: string
}

export const createProduct: RequestHandler<unknown, unknown, CreateProductBody, unknown> = async (req, res, next) => {
    const name = req.body.name
    const price = req.body.price
    const discount = req.body.discount
    const rating = req.body.rating
    const description = req.body.description
    const stock = req.body.stock
    const seller = req.body.seller
    const images = req.body.images
    const thumbnail = req.body.thumbnail
    const quantity_sold = req.body.quantity_sold

    try {
        if (!name) {
            throw createHttpError(400, "Name must be specified")
        }
        const newProduct = await ProductModel.create({
            name: name,
            price: price,
            discount: discount,
            rating: rating,
            description: description,
            stock: stock,
            seller: seller,
            thumbnail: thumbnail,
            quantity_sold: quantity_sold,
            images: images
        })

        res.status(201).json(newProduct)
    } catch (error) {
        next(error)
    }
}

interface UpdateProductParams {
    productId: string
}
interface UpdateProductBody {
    name?: string,
    description?: string
}

export const updateProduct: RequestHandler<UpdateProductParams, unknown, UpdateProductBody, unknown> = async (req, res, next) => {
    const productId = req.params.productId
    const newName = req.body.name
    const description = req.body.description

    try {
        if (!mongoose.isValidObjectId(productId)) {
            throw createHttpError(400, "Invalid product id")
        }
        if (!newName || !description) {
            throw createHttpError(400, "Parameter missing")
        }
        const product = await ProductModel.findById(productId).exec()
        if (!product) {
            throw createHttpError(404, "Product not found")
        }
        product.name = newName
        product.description = description

        const updatedProduct = await product.save()
        res.status(200).json(updatedProduct)
    } catch (error) {
        next(error)
    }
}

export const deleteProduct: RequestHandler = async (req, res, next) => {
    const productId = req.params.productId

    try {
        if (!mongoose.isValidObjectId(productId)) {
            throw createHttpError(400, 'invalid product id')
        }
        const product = await ProductModel.findById(productId).exec()

        if (!product) {
            throw createHttpError(404, "Product not found")
        }
        await product.deleteOne()

        res.sendStatus(204)

    } catch (error) {
        next(error)
    }
}