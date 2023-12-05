import mongoose from 'mongoose'

const { Schema } = mongoose
const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      },
      cantidad: Number
    }
  ]
});

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel