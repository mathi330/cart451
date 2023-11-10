/*
dataset found her: 
https://www.kaggle.com/datasets/jordi313/goodreads-books-json


----------------------------------------------------------------
----------------------------------------------------------------


what to put in the terminal to import a database to mongodb:

the syntax for mongoimprt:
mongoimport <options> <connection-string> <file> 

1st element: db: name of the database I will import into (Exercise1)
2nd element: collection: name of the collection inside of the database (neo)
3rd element: the file and file path
4th element: the URI to my mongodb

mongoimport --db Exercise1 --collection books --file "/Users/mathildedavan/Desktop/goodreads_books.json" --uri "mongodb+srv://<ID>:<password>@cluster0.r715bes.mongodb.net/?retryWrites=true&w=majority"

*/



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

    const db = await client.db("Exercise1");
    
    const myBooks = await db.collection("books");
    
    
    wss.on('connection', function connection(ws, req) {

  
      // regardless of type of message this is always the trigger function
      ws.on('message', async function incoming(message) {

    
        let jsonParse = JSON.parse(message);
        console.log(jsonParse);
        
        // queries
        if (jsonParse.eventName === "query1") {
          console.log("QUERY1");
          //console.log(jsonParse.payload);
          //  sendInitMessage(ws,req);


          // 1st query:
          let ratingsInfo = await myBooks.aggregate([
            {$match: {$and: [{ratings_count: "50"},{average_rating: {$lte: "3.50"}}]}}, // entries that have 50 ratings and have a rating of less than or equal to 3.20
            {$project: {_id: 0, title: 1, description: 1, ratings_count: 1, average_rating: 1}}, // show only the title, description, number of reviews, and the average rating
            {$sort: {average_rating: -1}}, // sort them from the highest rating to the lowest rating
          ]).toArray();
          console.log(ratingsInfo);
          // ws.send(ratingsInfo);
          ws.send(JSON.stringify({ eventName: 'response1', payload: ratingsInfo }));
        }

        if (jsonParse.eventName === "query2"){
          console.log("QUERY2");
          
          // 2nd query:
          let harcoverBooks = await myBooks.aggregate([
            {$match: {$and: [{is_ebook: "false"}, {format: "Hardcover"}] } },
            {$project: {_id: 0, title: 1, format: 1, link: 1}},
            {$sort: {title: 1}},
            {$limit: 50}
          ]).toArray();
          console.log(harcoverBooks);
          ws.send(JSON.stringify({ eventName: 'response2', payload: harcoverBooks }));
        }

        if (jsonParse.eventName === "query3"){
          console.log("QUERY3");
          
          // 3rd query:
          let bookType = await myBooks.aggregate([
            {$match: {$and: [{"popular_shelves.name": "sci-fi"}, {"popular_shelves.name": "horror"}]}},
            {$project: {_id: 0, title: 1, average_rating: 1}},
            {$sort: {average_rating: -1}}, // highest ratings first
            {$limit: 10} // no more than 10 results
          ]).toArray();
          console.log(bookType);
          ws.send(JSON.stringify({ eventName: 'response3', payload: bookType }));
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
    res.send("<h1>Hello world</h1>");
});
  
function clientRoute(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
}