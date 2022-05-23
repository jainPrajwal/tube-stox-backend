const PORT = 8081;
const express = require(`express`);

const app = express();

app.get(`/`, (req,res) => {
    res.json({
        success: true,
        message: `up and running`
    })
})

app.listen(PORT,() => {
    console.log(`running on port`, PORT)
})