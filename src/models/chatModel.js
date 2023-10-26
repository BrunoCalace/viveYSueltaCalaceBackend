import mongoose from 'mongoose'

const chatCollection = 'messages'

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
})

const chatModel = mongoose.model(chatCollection, messageSchema)

export default chatModel