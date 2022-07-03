const express = require(`express`);
const Razorpay = require(`razorpay`);
const crypto = require(`crypto`);
const { PaymentModel } = require("../models/payment.model");

const router = express.Router();

router
  .get(`/`, async (req, res) => {
    const { user } = req;
    try {
      const foundPayment = await PaymentModel.find({ user: user._id });
      if (!foundPayment) {
        res.status(404).json({
          status: 404,
          success: false,
          message: `Payment Not Found`,
        });
        return;
      }

      res.status(200).json({
        status: 200,
        success: true,
        message: `Payment Details found`,
        payment: foundPayment,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: `somehting went wrong while fethcing the patment details`,
        errorMessage: error.message,
      });
    }
  })
  .post(`/`, async (req, res) => {
    const { user } = req;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 50000,
      currency: `INR`,
      receipt: `receipt_order_1234`,
    };

    const order = await instance.orders.create(options);
    if (!order) {
      res.status(500).json({
        status: 500,
        success: false,
        message: `something went wrong while generating order`,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: `order generated successfully`,
      order,
    });
  });

router.post(`/verify`, async (req, res) => {
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;

  const { user } = req;

  let body = orderCreationId + "|" + razorpayPaymentId;

  let expectedSignature = crypto
    .createHmac(`sha256`, process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest(`hex`);

  if (expectedSignature === razorpaySignature) {
    const paymentToBeSavedToDatabase = {
      order_id: orderCreationId,
      payment_id: razorpayPaymentId,
      payment_signature: razorpaySignature,
      user: user._id,
    };

    try {
      const savedPayment = await PaymentModel(
        paymentToBeSavedToDatabase
      ).save();
      res.status(201).json({
        status: 201,
        message: `Yay!`,
        payment: savedPayment,
      });
    } catch (error) {
      console.error(
        `somehting went wrrong while saveing payment to database`,
        error
      );
    }
  } else {
    console.error(`somehthing went wrong :(`);
    res.status(500).json({
      message: `:(`,
    });
  }
});

module.exports = { router };
