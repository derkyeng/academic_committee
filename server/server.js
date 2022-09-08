const express = require("express")
const app = express()

app.get("/api", (req, res) => {
    res.json("test")
})

app.listen(8001, () => console.log("Started on local port 8001"))