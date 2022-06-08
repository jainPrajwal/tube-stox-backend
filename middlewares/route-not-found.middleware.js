const { RESPONSE } = require("../utils/common.utils");

const routeNotFoundHandler = (req, res, next) => {
  res.json({
    ...RESPONSE.NOT_FOUND,
    message: `page not found`,
  });
};

module.exports = { routeNotFoundHandler };
