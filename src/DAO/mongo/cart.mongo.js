import cartModel from "./models/cartModel"

export default class Cart {
    get = async () => { return cartModel.find() }
    create = async (data) => { return cartModel.create(data) }
    getByID = async (id) => { return cartModel.findById(id) }
    update = async (data) => { return cartModel.updateOne({ _id: data._id }, data) }
}