require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
// Current Parameters are for testing only
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const express = require("express")
const app = express()
const cors = require('cors')

app.use(cors())

app.get("/api", (req, res) => {
    res.json("Academic Committee")
})

console.log(supabase)
console.log(process.env)
app.listen(8001, () => console.log("Started on local port 8001"))