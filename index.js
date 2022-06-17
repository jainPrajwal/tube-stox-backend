const PORT = 8081;
const express = require(`express`);
const { intiliazeDatabase } = require("./db/db.connect");
const app = express();
const dotenv = require(`dotenv`);
const cors = require(`cors`);

const { router: videos } = require(`./routers/videos.router`);
const { router: playlists } = require("./routers/playlists.router");
const { router: signup } = require(`./routers/signup.router`);
const { router: login } = require("./routers/login.router");
const { router: profile } = require(`./routers/profile.router`);

const { authVerify } = require(`./middlewares/auth.middleware`);
const {
  routeNotFoundHandler,
} = require("./middlewares/route-not-found.middleware");
const { errorHandler } = require("./middlewares/error.middleware");
dotenv.config();

app.use(express.json());
app.use(cors()); 

intiliazeDatabase();
app.get(`/`, (req, res) => {
  res.json({
    success: true,
    message: `up and running`,
  });
});

app.use(`/videos`, videos);
app.use(`/playlists`, authVerify, playlists);
app.use(`/signup`, signup);
app.use(`/login`, login);
app.use(`/profile`, authVerify, profile);

// DONT MOVE
app.use(routeNotFoundHandler);

app.use(errorHandler);
app.listen(process.env.PORT || PORT, () => {
  console.log(`running on port`, PORT);
});
