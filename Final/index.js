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
            // db source: https://open.canada.ca/data/en/dataset/cf5c266c-3a6a-4a3b-aed1-2ddd6e49d5e6/resource/3cdca7bf-b422-4e3b-8b96-b1259f4f65ce
            const historicSites = await db.collection("canadianSites");
            
            
            wss.on('connection', function connection(ws, req) {
        
          
              // regardless of type of message this is always the trigger function
              ws.on('message', async function incoming(message) {
        
            
                let jsonParse = JSON.parse(message);
                console.log(jsonParse);
                
                // queries
                if (jsonParse.eventName === "query1") {
        
        
                  // 1st query:
                  
                  let libraryLocation = await canadianLibraries.aggregate([
                    {$match: {subGroup: "Public libraries"}}, // look at the libraries
                    {$project: {_id: 0, latitude: 1, longitude: 1, latLng: 1, population: 1}}, // get coordinates
                    // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                  ]).toArray();
                  // console.log(libraryLocation);
                  
                  let firesLocation = await forestFires.aggregate([
                    {$match: {field_fire_size: {$gt: 15000}}}, // look at the libraries
                    {$project: {_id: 0, field_latitude: 1, field_longitude: 1, field_fire_size: 1}}, // get coordinates
                    // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                  ]).toArray();
                  
                  let historicSitesLocation = await historicSites.aggregate([
                    {$match: {OBJECTID: {$gt: 0}}},
                    {$project: {_id: 0, Name_e: 1, Principal_type: 1, lat: 1, lng: 1}}
                  ]).toArray();
                  
                  ws.send(JSON.stringify({ eventName: 'response1', library: libraryLocation, fire: firesLocation, sites: historicSitesLocation }));
                }
        
                if (jsonParse.eventName === "query2"){
                  console.log("QUERY2");
                  

                  let firesLocation2 = await forestFires.aggregate([
                    {$match: {field_fire_size: {$gt: 1500}}}, // look at the libraries
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
                
                  let historicSitesLocation = await historicSites.aggregate([
                    {$match: {OBJECTID: {$gt: 0}}},
                    {$project: {_id: 0, Name_e: 1, Principal_type: 1, lat: 1, lng: 1}}
                  ]).toArray();

                  ws.send(JSON.stringify({ eventName: 'response2', library: libraryLocation2, fire: firesLocation2, sites: historicSitesLocation }));
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
                  // console.log(librarySize);
                  
                  let firesSize = await forestFires.aggregate([
                    {$match: {field_fire_size: {$gt: 15000}}}, // look at the libraries
                    {$project: {_id: 0, field_latitude: 1, field_longitude: 1, field_fire_size: 1}}, // get coordinates
                    // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                  ]).toArray();
                  
                  let historicSitesSize = await historicSites.aggregate([
                    {$match: {OBJECTID: {$gt: 0}}},
                    {$project: {_id: 0, Name_e: 1, Principal_type: 1, lat: 1, lng: 1}}
                  ]).toArray();

                  ws.send(JSON.stringify({ eventName: 'response3', library: librarySize, fire: firesSize, sites: historicSitesSize }));
                }



                if (jsonParse.eventName === "query4") {
                    // 4th query:
                    
                    let libraryLocation = await canadianLibraries.aggregate([
                      {$match: {subGroup: "Public libraries"}}, // look at the libraries
                      {$project: {_id: 0, latitude: 1, longitude: 1, latLng: 1, population: 1, startDate: 1}}, // get coordinates
                      // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                    ]).toArray();
                    // console.log(libraryLocation);
                    
                    let firesLocation = await forestFires.aggregate([
                      {$match: {field_fire_size: {$gt: 15000}}}, // look at the libraries
                      {$project: {_id: 0, field_latitude: 1, field_longitude: 1, field_fire_size: 1}}, // get coordinates
                      // {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
                    ]).toArray();
                    
                    let historicSitesLocation = await historicSites.aggregate([
                      {$match: {OBJECTID: {$gt: 0}}},
                      {$project: {_id: 0, Name_e: 1, Principal_type: 1, lat: 1, lng: 1}}
                    ]).toArray();
                    
                    ws.send(JSON.stringify({ eventName: 'response4', library: libraryLocation, fire: firesLocation, sites: historicSitesLocation }));
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