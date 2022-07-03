const { RESPONSE } = require("../utils/common.utils");

const errorHandler = (req, res, next) => {
 res.status(500).json({
    ...RESPONSE.INTERNAL_SERVER_ERROR,
    message: `some unknown error occured`,
    errorMessage: `generic error..!`,
  });
};

module.exports = { errorHandler };
