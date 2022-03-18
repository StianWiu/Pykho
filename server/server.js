console.clear();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb')
// const bcrypt = require('bcryptjs');
// const randomstring = require("randomstring")
require('dotenv').config()
app.use(bodyParser.json());
const uri = process.env.uri; // Grab URI from .env file
const port = 3001; // Needs to be 3001 because of Nginx

// Comment this when in production
// var cors = require('cors')
// app.use(cors())

// Connect server to database

const client = new MongoClient(uri)
try {
    client.connect()
    console.log("Connected to database")
} catch (e) {
    console.log("Error connecting to database")
}

// Receive data from client

app.post('/api/score/save', async function (req, res) {
    // Create document in database Pykho and collection Scores
    const result = await client.db("Pykho").collection("Scores").insertOne({
        "username": req.body.username,
        "points": req.body.points,
        "difficulty": req.body.difficulty,
        "twitchUsername": req.body.twitchUsername,
        "enteredWords": req.body.enteredWords,
        "time": new Date(),
    });
    res.send(result.insertedId);
});

app.post('/api/score/get', async function (req, res) {
    // Find document in database with received id
    if (req.body.id.length === 24) {
        const result = await client.db("Pykho").collection("Scores").find({ _id: ObjectId(req.body.id) }).toArray()
        if (result[0]) {
            res.send(result)
        } else {
            res.send("Could not find score")
        }
    } else {
        res.send("Invalid score ID")
    }
});

app.post('/api/new-words', async function (req, res) {
    if (!req.body.data[0]) {
        console.log(`Post request received but had no data | ${new Date()}`)
        return res.send("No data");
    } else {
        const client = new MongoClient(uri)

        try {
            await client.connect();
            await createData(client, {
                "data": req.body.data,
                "time": new Date(),
                "ip": req.body.ip
            })
        } catch (e) {
            console.error(e, new Date());
        } finally {
            await client.close();
        }

        console.log(`Post request received | ${new Date()}`)
        return res.send("Request received.");
    }
});

// app.post('/api/account/register', async function (req, res) {
//     console.log(`Account creation request received | ${new Date()}`)
//     if (req.body.username && req.body.password) {
//         var salt = bcrypt.genSaltSync(10);
//         var password_hash = bcrypt.hashSync(req.body.password, salt);

//         const client = new MongoClient(uri)
//         try {
//             await client.connect();

//             if (await client.db("Pykho").collection("Accounts").findOne({ username: req.body.username }) === null) {
//                 let token = randomstring.generate({ length: 33, charset: "hex", })
//                 while (await client.db("Pykho").collection("Accounts").findOne({ token: token })) {
//                     token = randomstring.generate({ length: 33, charset: "hex", })
//                 }
//                 await client.db("Pykho").collection("Accounts").insertOne({
//                     "username": req.body.username,
//                     "password": password_hash,
//                     "created": new Date(),
//                     "token": token,
//                 });
//                 return res.send({ username: req.body.username, token: token });
//             } else {
//                 return res.send("username already exists");
//             }
//         } catch (e) {
//             console.error(e, new Date());
//         } finally {
//             await client.close();
//         }
//     } else {
//         return res.send("No data")
//     }
// });

// app.post('/api/account/login', async function (req, res) {
//     console.log(`Login request received | ${new Date()}`)
//     if (req.body.username && req.body.password) {
//         const client = new MongoClient(uri)
//         try {
//             await client.connect();
//             const account = await client.db("Pykho").collection("Accounts").findOne({ username: req.body.username })
//             if (account) {
//                 if (bcrypt.compareSync(req.body.password, account.password)) {
//                     return res.send({ username: req.body.username, token: account.token });
//                 } else {
//                     return res.send("Incorrect password.");
//                 }
//             } else {
//                 return res.send("Username does not exist.");
//             }
//         } catch (e) {
//             console.error(e, new Date());
//         } finally {
//             await client.close();
//         }
//     } else {
//         return res.send("No data")
//     }
// });

// app.post('/api/account/login/token', async function (req, res) {
//     console.log(`Login request received | ${new Date()}`)
//     if (req.body.username && req.body.token) {
//         const client = new MongoClient(uri)
//         try {
//             await client.connect();
//             const account = await client.db("Pykho").collection("Accounts").findOne({ username: req.body.username })
//             if (account) {
//                 if (account.token === req.body.token) {
//                     return res.send("Login successful.");
//                 } else {
//                     return res.send("Incorrect password.");
//                 }
//             } else {
//                 return res.send("Username does not exist.");
//             }
//         } catch (e) {
//             console.error(e, new Date());
//         } finally {
//             await client.close();
//         }
//     } else {
//         return res.send("No data")
//     }
// });

app.post('/api/twitch/test', async function (req, res) {
    if (!req.body.username) {
        return res.send("No data");
    } else {
        return res.send(await checkTwitch(req.body.username));
    }
});

app.post('/api/twitch/start', async function (req, res) {
    if (!req.body.username) {
        return res.send("No data");
    } else {
        if (await client.db("Pykho").collection("Twitch-stash").findOne({ username: req.body.username }) === null) {
            return res.send(await startChat(req.body.username));
        } else {
            return res.send("Channel is already being monitored.")
        }
    }
});

app.post('/api/twitch/get', async function (req, res) {
    if (!req.body.username) {
        return res.send("No data");
    } else {
        return res.send(await getChat(req.body.username));
    }
});

setInterval(async function () {
    try {
        const collection = client.db("Pykho").collection("Twitch-stash");
        // Find all documents in collection Twitch-stash
        // Check if lastRequest was less than 30 seconds ago, if not remove from collection
        const docs = await collection.find({}).toArray();
        for (let i = 0; i < docs.length; i++) {
            if (new Date() - docs[i].lastRequest > 30000) {
                console.log(`Removing ${docs[i].username} from Twitch-stash`);
                await stopChat(docs[i].username);
            }
        }
    } catch (e) {
        console.error(e, new Date());
    }
}, 60000);

// Functions

// Write missing words to database
async function createData(client, newListing) {
    const result = await client.db("Pykho").collection("New words").insertOne(newListing);
    console.log("New data appended with the following ID:" + result.insertedId);
}

const startChat = async (channel) => {
    const TwitchBot = require('twitch-bot')
    await client.db("Pykho").collection("Twitch-stash").insertOne({
        "username": channel,
        "time": new Date(),
        "messages": [],
        "totalMessages": 0,
    })
    console.log(`Started monitoring chat for ${channel}'s channel | ${new Date()}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const Bot = new TwitchBot({
        username: 'pykhodev',
        oauth: `oauth:${process.env.oauth}`,
        channels: [`${channel}`]
    })

    Bot.on('error', err => {
        console.log(err)
    })

    Bot.on('message', async chatter => {
        const client = new MongoClient(uri)
        try {
            await client.connect();
            const account = await client.db("Pykho").collection("Twitch-stash").findOne({ username: channel })
            if (account) {
                await client.db("Pykho").collection("Twitch-stash").updateOne({ username: channel }, { $push: { messages: [chatter.username, chatter.message] } })
                await client.db("Pykho").collection("Twitch-stash").updateOne({ username: channel }, { $set: { totalMessages: account.totalMessages + 1 } })
            } else {
                return Bot.close()
            }
        } catch (e) {
            console.error(e, new Date());
        }
    })

    return "Chat logging started."
}

const stopChat = async (channel) => {
    console.log(`Stopped monitoring ${channel}'s chat | ${new Date()}`);
    try {
        await client.connect();
        await client.db("Pykho").collection("Twitch-stash").deleteOne({ "username": channel })
    } catch (e) {
        console.error(e, new Date());
    }
    return "Chat logging stopped."
}

const getChat = async (channel) => {
    try {
        await client.connect();
        const account = await client.db("Pykho").collection("Twitch-stash").findOne({ username: channel })
        // set lastRequest to current time
        await client.db("Pykho").collection("Twitch-stash").updateOne({ username: channel }, { $set: { lastRequest: new Date() } })
        if (await client.db("Pykho").collection("Twitch-stash").findOne({ username: channel })) {
            const messages = account.messages
            await client.db("Pykho").collection("Twitch-stash").updateOne({ username: channel }, { $set: { messages: [] } })
            return messages
        } else {
            return "No data"
        }
    } catch (e) {
        console.error(e, new Date());
    }
}

// Check if correct username is inputted by user
const checkTwitch = async (channel) => {
    const TwitchBot = require('twitch-bot')
    const Bot = new TwitchBot({
        username: 'pykhodev',
        oauth: `oauth:${process.env.oauth}`,
        channels: [`${channel}`]
    })
    Bot.on('error', err => {
        console.log(err)
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
    Bot.say('If you see this your channel is connected! If you did not expect to see this message someone connected your chat to pykho.dev')
    await new Promise(resolve => setTimeout(resolve, 1500))
    Bot.say('CorgiDerp')
    await new Promise(resolve => setTimeout(resolve, 5000))
    Bot.close()
    return;
}

// const resetTokens = async () => {
//     const milliseconds = Date.now();
//     const seconds = Math.floor(milliseconds / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);
//     try {
//         await client.connect();
//         const reset = await client.db("Pykho").collection("Variables").findOne({ name: "last-reset" })
//         if (reset.reset + 10 < days) {
//             const result = await client.db("Pykho").collection("Accounts").updateMany({}, { $set: { token: randomstring.generate({ length: 33, charset: "hex", }) } });
//             console.log(`${result.modifiedCount} tokens were reset | ${new Date()}`);
//             await client.db("Pykho").collection("Variables").updateOne({ name: "last-reset" }, { $set: { reset: days } });
//         } else {
//             console.log("Token reset requested but not needed | " + new Date());
//             return;
//         }
//     } catch (e) {
//         console.error(e, new Date());
//     }
// }

// resetTokens()
// setInterval(function () {
//     resetTokens()
// }, 3600000);


// Start server
app.listen(port, function () {
    console.log(`Server listening on port ${port} | ${new Date()}`);
});