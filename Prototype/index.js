const express = require("express");
const portNumber = 4400;
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
        
            const db = await client.db("Final");
            
            // db source: https://cwrc.ca/rsc-src/
            const canadianLibraries = await db.collection("libraries");
            // db source: https://ciffc.net/national
            const forestFires = await db.collection("forestFires");
            
            
            wss.on('connection', function connection(ws, req) {
        
          
              // regardless of type of message this is always the trigger function
              ws.on('message', async function incoming(message) {
        
            
                let jsonParse = JSON.parse(message);
                console.log(jsonParse);
                
                // queries
                if (jsonParse.eventName === "query1") {
                //   console.log("QUERY1");
                  console.log(jsonParse.payload);
                  //  sendInitMessage(ws,req);
        
        
                  // 1st query:
                  let firesLocation = await forestFires.aggregate([
                    {$match: {field_fire_size: {$gt: 1000}}}, // look at the libraries
                    {$project: {_id: 0, field_latitude: 1, field_longitude: 1, field_fire_size: 1}}, // get coordinates
                    // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                  ]).toArray();
                  // console.log(firesLocation);

                  let libraryLocation = await canadianLibraries.aggregate([
                    {$match: {subGroup: "Public libraries"}}, // look at the libraries
                    {$project: {_id: 0, latitude: 1, longitude: 1, latLng: 1, population: 1}}, // get coordinates
                    // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                  ]).toArray();
                  // console.log(libraryLocation);
                  // ws.send(libraryLocation);
                  ws.send(JSON.stringify({ eventName: 'response1', library: libraryLocation, fire: firesLocation }));
                }
        
                if (jsonParse.eventName === "query2"){
                  console.log("QUERY2");
                  

                  let firesLocation2 = await forestFires.aggregate([
                    {$match: {field_fire_size: {$gt: 1000}}}, // look at the libraries
                    {$project: {_id: 0, field_latitude: 1, field_longitude: 1, field_fire_size: 1}}, // get coordinates
                    // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                  ]).toArray();
                  // console.log(firesLocation2);

                  
                  let libraryLocation2 = await canadianLibraries.aggregate([
                    {$match: {subGroup: "Public libraries"}}, // look at the libraries
                    {$project: {_id: 0, latitude: 1, longitude: 1, latLng: 1}}, // get coordinates
                    // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                  ]).toArray();
                  // console.log(libraryLocation2);
                  // ws.send(libraryLocation);
                  ws.send(JSON.stringify({ eventName: 'response2', library: libraryLocation2, fire: firesLocation2 }));
                }
        
                if (jsonParse.eventName === "query3"){
                  console.log("QUERY3");
                  
                  // 3rd query:
                  let librarySize = await canadianLibraries.aggregate([
                    {$match: {subGroup: "Public libraries"}},
                    {$project: {_id: 0, longitude: 1, population: 1}},
                    // {$sort: {average_rating: -1}}, // highest ratings first
                    // {$limit: 10} // no more than 10 results
                  ]).toArray();
                  console.log(librarySize);
                  ws.send(JSON.stringify({ eventName: 'response3', payload: librarySize }));
                }
        
                if (jsonParse.eventName === "query4"){
                  console.log("QUERY4");
                  
                  // 4th query (changing up the way I do it just for fun hehe):
                  const options = {
                    projection: {title: 1, average_rating: 1, language_code: 1, description: 1} // info given back
                  }
              
                  let germanOrHighRating = await myBooks.find({$or: [{language_code: 'ger'}, {average_rating: "4.90"}]}, options)
                  .sort({title: 1})
                  .limit(20)
                  .toArray();
                  console.log(germanOrHighRating);
                  ws.send(JSON.stringify({ eventName: 'response4', payload: germanOrHighRating }));
                }
        
                if (jsonParse.eventName === "query5"){
                  console.log("QUERY5");
                  
                  // 5th query:
                  const option2 = {
                    projection: {title: 1, publication_year: 1, average_rating: 1, description: 1} // the information the query will give me back
                  }
              
                  let newBooks = await myBooks.find( {publication_year: '2017'}, option2)
                  .sort({title: 1}) // sort results by alphabetical order
                  .limit(5) // 5 max
                  .toArray();
                  console.log(newBooks);
                  ws.send(JSON.stringify({ eventName: 'response5', payload: newBooks })); // send back the response to the client side
                }
        
        
              })
            })
        })
    } catch(error) {
        // console.error()
        console.log(error);
    } finally {
        await client.close() // always good practice to close the connection
    }
}
run();

// make server listen for incoming messages
server.listen(portNumber, function () {
    console.log("listening on port:: " + portNumber);
});
  
//default route
app.get("/", function (req, res) {
    res.send("<h1>Hello World~~</h1>");
});
  
function clientRoute(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
}