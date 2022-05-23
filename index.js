const PORT = 8081;
const express = require(`express`);
const { intiliazeDatabase } = require("./db/db.connect");
const app = express();
const dotenv = require(`dotenv`);
const cors = require(`cors`);

const { router: videos } = require(`./routers/videos.router`);
const { router: playlists } = require("./routers/playlists.router");

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
app.use(`/playlists`, playlists);

app.listen(PORT, () => {
  console.log(`running on port`, PORT);
});
