const mongoose = require("mongoose");

const OrderDeleveryStatusSchema = new mongoose.Schema({
    delivery_status: {
    type: String,
  },
  OrderId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("OrderDeleveryStatus",OrderDeleveryStatusSchema);
