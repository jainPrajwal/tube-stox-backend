const mongoose = require(`mongoose`);
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  payment_id: {
    type: String,
    required: `Payment Id is required`,
  },
  order_id: {
    type: String,
    required: `Order Id is required`,
  },
  payment_signature: {
    type: String,
    required: `Payment Signature is required`,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: `user`,
  },
});

const PaymentModel = new mongoose.model(`payment`, PaymentSchema);

module.exports = { PaymentModel };
