import ticketModel from "./models/ticketModel"

export default class Ticket {
    get = async () => { return ticketModel.find() }
    create = async (data) => { return ticketModel.create(data) }
    getByID = async (id) => { return ticketModel.findById(id) }
    update = async (data) => { return ticketModel.updateOne({ _id: data._id }, data) }
}