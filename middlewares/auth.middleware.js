const jwt = require(`jsonwebtoken`);
const { UserModel } = require("../models/user.model");
const { RESPONSE } = require("../utils/common.utils");

const authVerify = async (req, res, next) => {
  const token = req.headers.authorization?.split(` `)[1];

  if (!token) {
    res.status(401).json(RESPONSE.UNAUTHENTICATED_USER);
    return;
  }

  try {
    const { _id: userId } = jwt.verify(token, process.env.mySecret);

    try {
      const user = await UserModel.findOne({ _id: userId });

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json(RESPONSE.UNAUTHENTICATED_USER);
    }
  } catch (error) {
    res.status(500).json({
      ...RESPONSE.INTERNAL_SERVER_ERROR,
      message: `something went wrong while searching for user in DB`,
      errorMessage: error.message,
    });
  }
};

module.exports = { authVerify };
