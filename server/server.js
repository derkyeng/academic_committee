const express = require("express")
const app = express()
const cors = require('cors')

app.use(cors())

app.get("/api", (req, res) => {
    res.json("Academic Committee")
})

app.listen(8001, () => console.log("Started on local port 8001"))