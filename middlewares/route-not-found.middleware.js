const { RESPONSE } = require("../utils/common.utils");

const routeNotFoundHandler = (req, res, next) => {
 res.status(404).json({
    ...RESPONSE.NOT_FOUND,
    message: `page not found`,
  });
};

module.exports = { routeNotFoundHandler };
