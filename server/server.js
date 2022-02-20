console.clear();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { MongoClient } = require('mongodb')
require('dotenv').config()
app.use(bodyParser.json());

const port = 3000; // Needs to be 3000 because of Nginx

async function main(data, ip) {
    const uri = process.env.uri;
    const client = new MongoClient(uri)

    try {
        await client.connect();
        let i = 0;
        await createData(client, {
            "data": data,
            "time": new Date(),
            "ip": ip
        })
    } catch (e) {
        console.error(e, new Date());
    } finally {
        await client.close();
    }
}

// Functions to alter database

// async function listDatabases(client) {
//     const databasesList = await client.db().admin().listDatabases()
//     console.log(databasesList)
// }

async function createData(client, newListing) {
    const result = await client.db("Pykho").collection("New words").insertOne(newListing);
    console.log("New data appended with the following ID:" + result.insertedId);
}

// Receive data from client

app.post('/server/', function (req, res) {
    if (!req.body.data[0]) {
        console.log(`Post request received but had no data | ${new Date()}`)
        return res.send("No data");
    } else {
        main(req.body.data, req.body.ip)
        console.log(`Post request received | ${new Date()}`)
        return res.send("Request received.");
    }
});

// Start server

app.listen(port, function () {
    console.log(`Server listening on port ${port} | ${new Date()}`);
});