const express = require("express");
const portNumber = 4800;
const app = express(); //make an instance of express
const WebSocket = require("ws");
const server = require("http").createServer(app); // create server
const static = require('node-static'); // to serve files like css, js, html
const wss = new WebSocket.Server({ server });
// access the .env file
require('dotenv').config();

// create a server
app.use(express.static(__dirname + "/public"));
// app.use('/wsC', wsClientRequestRoute);


// thingy for POST and GET request
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies


app.use("/client", clientRoute);
const mongo_connection_url = process.env.MONGO_DB_URI; // calling the environment context

const {MongoClient} = require('mongodb') // reference to the library

const client = new MongoClient(mongo_connection_url, {}); // this is an instance of the client, it does not connect!

async function run() {
    try {
        client.connect().then( async function (){
            await client.db("admin").command({ping:1});
            console.log("success");
        
            const db = await client.db("Presentation");
            
            const fires = await db.collection("forestFires");
            
            
            wss.on('connection', function connection(ws, req) {
        
          
              // regardless of type of message this is always the trigger function
              ws.on('message', async function incoming(message) {
                let jsonParse = JSON.parse(message);
                console.log(jsonParse);
                
                
                // query
                if (jsonParse.eventName === "query1") {
                  console.log("QUERY1");
                  console.log(jsonParse.province); // selected province or territory on the client side
                  console.log(jsonParse.year); // seleceted year on the client side
                  
                  let date = parseInt(jsonParse.year); // make the year an integer instead of a string

        
                  // fire query
                  let allFires = await fires.aggregate([
                    {$match: {$and: [{"Jurisdiction": jsonParse.province}, {"Year": date}]}}, // look at the place and the year
                    {$project: {_id: 0, "Jurisdiction": 1, "fireSizeClass": 1, Year: 1, "numberNull": 1}}, // get the place, the fireSizeClass and the number of fires of this class
                    {$sort: {"fireSizeClass": -1}}, // sort from biggest fires to smallest one (messed up because it is a string ;( )
                  ]).toArray();
                  console.log(allFires);

                  // send back to client side the query response with all the info into the payload.
                  ws.send(JSON.stringify({ eventName: 'response1', payload: allFires }));
                }
        
              })
            })
        })
    } catch(error) {
        console.log(error);
    } finally {
        await client.close() // close the connection
    }
}
run();

// make server listen for incoming messages
server.listen(portNumber, function () {
    console.log("listening on port:: " + portNumber);
});
  
//default route
app.get("/", function (req, res) {
    res.send("<h1>Hello World</h1>");
});
  
function clientRoute(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
}