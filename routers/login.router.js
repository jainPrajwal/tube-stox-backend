const express = require(`express`);
const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcrypt`);
const { UserModel } = require("../models/user.model");
const { RESPONSE } = require(`../utils/common.utils`);
const router = express.Router();

router.route("/").post(async (req, res) => {
  let { user } = req.body;
  if (user) {
    try {
      const foundUser = await UserModel.findOne({email: user.email});
   
      const isPasswordValid = await bcrypt.compare(
        user.password,
        foundUser.password
      );
      if (!isPasswordValid) {
        res.json({
          ...RESPONSE.UNAUTHENTICATED_USER,
          message: `Invalid Password`,
        });
        return;
      }

      const token = jwt.sign({ _id: foundUser._id }, process.env.mySecret);
      res.json({
        status: 201,
        success: true,
        message: `Login Successful`,
        token,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while loggin in..`,
        errorMessage: error.message,
      });
    }
  } else {
    res.json(RESPONSE.MALFORMED_SYNTAX);
  }
});


module.exports = {router}