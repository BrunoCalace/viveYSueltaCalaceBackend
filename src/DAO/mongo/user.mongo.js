import userModel from "./models/userModel"

export default class User {
    get = async () => { return userModel.find() }
    create = async (data) => { return userModel.create(data) }
    getByID = async (id) => { return userModel.findById(id) }
    update = async (data) => { return userModel.updateOne({ _id: data._id }, data) }
}