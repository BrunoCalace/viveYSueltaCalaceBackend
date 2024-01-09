import mongoose from 'mongoose';

const { Schema } = mongoose;
const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: Number,
  purchaser: String,
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;