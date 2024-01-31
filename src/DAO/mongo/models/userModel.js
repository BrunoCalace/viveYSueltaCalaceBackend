import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

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

userSchema.methods.changePassword = async function(newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    this.password = hashedPassword
    await this.save()
};

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel