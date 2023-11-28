import mongoose from 'mongoose'

const { Schema } = mongoose
const usersCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
    },
    role: {
        type: String,
        default: 'usuario',
    },
})

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel