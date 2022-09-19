require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')

app.use(cors())

const { createClient } = require('@supabase/supabase-js')

// Current Parameters are for testing only
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

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

const insertData = async () => {
  let { data, error } = await supabase
    .from('testingData')
    .insert([
      { id: 6 },
    ])
  if (error) {
    console.error(error)
    return
  }
  console.log(data)
}

insertData()

app.get("/api", (req, res) => {
    res.json("Academic Committee")
})

// console.log(supabase)
// console.log(process.env)
app.listen(8001, () => console.log("Started on local port 8001"))