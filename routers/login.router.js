const express = require(`express`);
const jwt = require(`jsonwebtoken`);
const { RESPONSE } = require(`../utils/common.utils`);
const router = express.Router();

router.route(
  "/".post(async (req, res) => {
    let { user } = req.body;
    if (user) {
      try {
        //   const user = 
      } catch (error) {
        res.json({
          ...RESPONSE.INTERNAL_SERVER_ERROR,
          message: `something wen wrong while loggin in..`,
          errorMessage: error.message,
        });
      }
    } else {
      res.json(RESPONSE.MALFORMED_SYNTAX);
    }
  })
);
