import mongoose from 'mongoose'

const prodCollection = 'products'

const prodSchema = new mongoose.Schema({
    title:  {
        type: String,
        unique: true
    },
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnails: String,
    status: Boolean
});

const prodModel = mongoose.model(prodCollection, prodSchema)

export default prodModel