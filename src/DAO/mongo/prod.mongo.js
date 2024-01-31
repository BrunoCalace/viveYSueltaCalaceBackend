import prodModel from "./models/prodModel"

export default class Products {
    get = async () => { return prodModel.find() }
    create = async (data) => { return prodModel.create(data) }
    getByID = async (id) => { return prodModel.findById(id) }
    update = async (data) => { return prodModel.updateOne({ _id: data._id }, data) }
}