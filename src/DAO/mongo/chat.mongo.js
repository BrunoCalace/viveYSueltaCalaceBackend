import chatModel from "./models/chatModel"

export default class Chat {
    get = async () => { return chatModel.find() }
    create = async (data) => { return chatModel.create(data) }
    getByID = async (id) => { return chatModel.findById(id) }
    update = async (data) => { return chatModel.updateOne({ _id: data._id }, data) }
}