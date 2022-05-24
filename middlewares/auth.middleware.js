const express = require(`express`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const { UserModel } = require("../models/user.model");
const { RESPONSE } = require("../utils/common.utils");

const authVerify = async (req, res, next) => {
  const token = req.headers.authorization.split(` `)[1];
  console.log(`token found`, token);
  if (!token) {
    res.json(RESPONSE.UNAUTHENTICATED_USER);
    return;
  }
  console.log(`env`, process.env.mySecret);
  try {
    const { _id: userId } = jwt.verify(token, process.env.mySecret);

    try {
      const user = await UserModel.findOne({ _id: userId });

      req.user = user;
      next();
    } catch (error) {
      res.json(RESPONSE.UNAUTHENTICATED_USER);
    }
  } catch (error) {
    res.json({
      ...RESPONSE.INTERNAL_SERVER_ERROR,
      message: `somehting went wrong while searching for user in DB`,
      errorMessage: error.message,
    });
  }
};

module.exports = { authVerify };
