const express = require(`express`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const { UserModel } = require("../models/user.model");
const { RESPONSE } = require("../utils/common.utils");
const router = express.Router();

router.route(`/`).post(async (req, res) => {
  let { user } = req.body;
  try {
    if (user) {
      const userWithSameEmailId = await UserModel.findOne({ email: user.email });

      if (userWithSameEmailId) {
        res.json(RESPONSE.CONFLICTING_RESOURCE);
        return;
      }

      //gen salt
      const salt = await bcrypt.genSalt(10);

      // hash the password with salt
      user.password = await bcrypt.hash(user.password, salt);

      // save the user
      const savedUser = await new UserModel(user).save();
      if (savedUser) {
        try {
          const token = jwt.sign({ _id: savedUser._id }, process.env.mySecret, {
            expiresIn: `24h`,
          });

          if (!token) {
            await UserModel.deleteOne({ _id: savedUser._id });
            res.json({
              ...RESPONSE.INTERNAL_SERVER_ERROR,
              message: `User Registration Failed`,
              errorMessage: error.message,
            });
            return;
          }

          res.json({
            success: true,
            message: `User Registered Successfully`,
            user: savedUser,
            token,
          });
        } catch (error) {
          await UserModel.deleteOne({ _id: savedUser._id });
          res.json({
            status: 500,
            message: `error generating token`,
          });
        }
      } else {
        res.json(RESPONSE.MALFORMED_SYNTAX);
      }
    } else {
      res.json(RESPONSE.MALFORMED_SYNTAX);
    }
  } catch (error) {
    console.log(`error ocucred while saving user to the DB`, error);
    res.json({
      ...RESPONSE.INTERNAL_SERVER_ERROR,
      message: `User Registration Failed`,
      errorMessage: error.message,
    });
  }
});

module.exports = { router };
