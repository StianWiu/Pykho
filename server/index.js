const express = require("express");
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb')
require('dotenv').config()
async function main(data) {
  const uri = process.env.uri;
  const client = new MongoClient(uri)

  try {
    await client.connect();
    console.log("Connected correctly to server");
    let i = 0;
    await createData(client, {
      "data": data,
      "time": new Date()
    })
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases()
  console.log(databasesList)
}

async function createData(client, newListing) {
  const result = await client.db("Pykho").collection("New words").insertOne(newListing);
  console.log("New data appended with the following ID:" + result.insertedId);
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
});

app.use(express.json())


app.post('/server/', (req, res) => {
  if (!req.body.data[0]) {
    return res.send("No data");
  } else {
    main(req.body.data)
    return res.send("Data received");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

