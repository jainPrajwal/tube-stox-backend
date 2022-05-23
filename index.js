const PORT = 8081;
const express = require(`express`);
const { intiliazeDatabase } = require("./db/db.connect");

const app = express();
const dotenv = require(`dotenv`)


dotenv.config()
intiliazeDatabase();

app.get(`/`, (req, res) => {
  res.json({
    success: true,
    message: `up and running`,
  });
});

app.listen(PORT, () => {
  console.log(`running on port`, PORT);
});
