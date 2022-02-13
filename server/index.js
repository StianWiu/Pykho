const express = require("express");
const app = express();
const port = 4200;

const { MongoClient } = require('mongodb')
const config = require("dotenv").config();

async function main(data) {
  const uri = process.env.URI;

  const client = new MongoClient(uri)

  try {
    await client.connect();
    console.log("Connected correctly to server");
    let i = 0;
    await createData(client, {
      "data": data
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
  const result = await client.db("not_added").collection("not_added").insertOne(newListing);
  console.log("New data appended with the following ID:" + result.insertedId);
}

var cors = require('cors')
app.use(cors())
app.use(express.json())


app.post('/', (req, res) => {
  main(req.body.data)
  return res.send("Data received");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
