require('dotenv').config()
const express = require("express")
const jsonParser = require("body-parser").json();
const app = express()
const cors = require('cors')

app.use(cors())

const { createClient } = require('@supabase/supabase-js')

// Current Parameters are for testing only
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getData = async () => {
  let { data, error } = await supabase
    .from('testingData')
    .select('*')
  if (error) {
    console.error(error)
    return
  }
  console.log(data)
}

const insertData = async (name) => {
  let { data, error } = await supabase
    .from('testingData')
    .insert([
      { id: randomInteger(0, 1000),
        teacherName: name},
    ])
  if (error) {
    console.error(error)
    return
  }
  console.log(data)
}

app.get("/api", (req, res) => {
    getData()
    res.json("Academic Committee")
})

app.post("/post", jsonParser, (req, res) => {
  console.log(req.body.id)
  let name = req.body.id
  insertData(name)
})

// console.log(supabase)
// console.log(process.env)
app.listen(8001, () => console.log("Started on local port 8001"))