import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "settlement", "failed"],
    default: "pending",
  },
  payment_type: {
    type: String,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
