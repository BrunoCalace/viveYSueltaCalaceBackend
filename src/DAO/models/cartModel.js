import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({

    id: String,
    title: String,
    price: Number,
    cantidad: Number,

})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel