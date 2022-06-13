const { UserModel } = require("../models/user.model");
const { RESPONSE } = require("../utils/common.utils");
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);

function signupUser() {
  return async (req, res) => {
    let { user } = req.body;
    try {
      if (user) {
        const userWithSameEmailId = await UserModel.findOne({
          email: user.email,
        });

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
            const token = jwt.sign(
              { _id: savedUser._id },
              process.env.mySecret,
              {
                expiresIn: `24h`,
              }
            );

            if (!token) {
              await UserModel.deleteOne({ _id: savedUser._id });
              res.json({
                ...RESPONSE.INTERNAL_SERVER_ERROR,
                message: `User Registration Failed`,
                errorMessage: error.message,
              });
              return;
            }

            // create default playlists for user i.e. history and watch later when the user signs up
            const history = {
              owner: savedUser._id,
              name: "history",
              isDefault: true,
              type: "history",
              videos: [],
            };
            const watchlater = {
              owner: savedUser._id,
              name: "watchlater",
              isDefault: true,
              type: "watchlater",
              videos: [],
            };

            const liked = {
              owner: savedUser._id,
              name: "liked",
              isDefault: true,
              type: "liked",
              videos: [],
            };

            await new PlaylistModel(history).save();
            await new PlaylistModel(watchlater).save();
            await new PlaylistModel(liked).save();

            res.json({
              success: true,
              message: `User Registered Successfully`,
              user: {
                name: savedUser.name,
                email: savedUser.email,
                avatar: savedUser.avatar,
              },
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
  };
}

function loginUser() {
  return async (req, res) => {
    let { user } = req.body;
    if (user) {
      try {
        const foundUser = await UserModel.findOne({ email: user.email });

        if (foundUser) {
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
        } else
          res.json({
            ...RESPONSE.UNAUTHENTICATED_USER,
            message: `Invalid Email`,
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
  };
}

module.exports = { signupUser, loginUser };
