import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                cantidad: Number,
            },
        ]
    }
});

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel