window.onload = function(){
    console.log("client js loaded in ws example");

    myID = Date.now();
    console.log(myID);

    let ws = new WebSocket("ws://localhost:4400");

    //1: when the connection is open (setup)
    ws.onopen = function () {

        document.querySelector("#button_1").addEventListener("click", function (event) {
            event.preventDefault();
            //A:::make a request for A text
            ws.send(JSON.stringify({ eventName: 'query1', payload: '' }));
            console.log("sent1");
        })

        document.querySelector("#button_2").addEventListener("click", function (event) {
            event.preventDefault();
            //A:::make a request for A text
            ws.send(JSON.stringify({ eventName: 'query2', payload: '' }));
            console.log("sent2");
        })

        document.querySelector("#button_3").addEventListener("click", function (event) {
            event.preventDefault();
            //A:::make a request for A text
            ws.send(JSON.stringify({ eventName: 'query3', payload: '' }));
            console.log("sent3");
        })

        document.querySelector("#button_4").addEventListener("click", function (event) {
            event.preventDefault();
            //A:::make a request for A text
            ws.send(JSON.stringify({ eventName: 'query4', payload: '' }));
            console.log("sent4");
        })

        document.querySelector("#button_5").addEventListener("click", function (event) {
            event.preventDefault();
            //A:::make a request for A text
            ws.send(JSON.stringify({ eventName: 'query5', payload: '' }));
            console.log("sent5");
        })


// *****************************************
// send back / recieve from the server side
// *****************************************


        ws.onmessage = function (event) {
            let jsonParse = JSON.parse(event.data);

            // console.log("Message is received..." + jsonParse.payload);
            // console.log("hello");
            
            if(jsonParse.eventName === "response1"){
                document.querySelector("#main").innerHTML = ``; // empty the #main div

                document.querySelector("#main").innerHTML = `<h1 id="queryTitle">Books that 50 People Rated!</h1>`;
                
                //B::: put into A
                for(let i = 0; i < jsonParse.payload.length; i++){
                    // create a div around each query object
                    const newDiv = document.createElement("div");
                    newDiv.id = `div${i}`; // giving the div an ID
                    newDiv.classList.add(`queriesDiv`); // and a class


                    // using the rating to give the div's background a colour
                    let ratingAsFloat = parseFloat(jsonParse.payload[i].average_rating); // transforming the average_rating string into a float
                    let greenColourMapFromRating = scale(ratingAsFloat, 2.50, 3.50, 0, 200); // map the rating to the amount of greens I want
                    let redColourMapFromRating = scale(ratingAsFloat, 2.50, 3.50, 255, 100); // map the rating to the amount of red I want
                    
                    // add the newly created element and its content into the DOM
                    const currentDiv = document.getElementById("main");
                    currentDiv.appendChild(newDiv); // append the div to the #main div in my html
                    
                    // All the info I want to display :)
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h3> ${jsonParse.payload[i].title} </h3>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h5> <span>${jsonParse.payload[i].ratings_count} people rated this book </span>  |  <span>Average rating of <i>${jsonParse.payload[i].average_rating}</i></span></h5>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<p> ${jsonParse.payload[i].description} </p>`;
                    
                    // set the background colour of the div according to the rating of the book (it goes from green to red)
                    document.querySelector(`#${newDiv.id}`).style.backgroundColor = `rgb(${redColourMapFromRating}, ${greenColourMapFromRating}, 50)`;
                    
                    console.log(jsonParse.payload[i]);
                }
            }

            if(jsonParse.eventName === "response2"){
                document.querySelector("#main").innerHTML = ``;

                document.querySelector("#main").innerHTML = `<h1 id="queryTitle">Hardcover Books!</h1>`;

                for(let i = 0; i < jsonParse.payload.length; i++){
                    // a tag to click on the div and open the link to the goodread page
                    const clickableDiv = document.createElement("a");
                    clickableDiv.id = `a${i}`;
                    clickableDiv.classList.add(`secQueryClickableDivs`);
                    clickableDiv.setAttribute("href", jsonParse.payload[i].link);
                    clickableDiv.setAttribute("target", "_blank");
                    const currentDiv = document.getElementById("main");
                    currentDiv.appendChild(clickableDiv);

                    // div itself
                    const newDiv = document.createElement("div");
                    newDiv.id = `div${i}`;
                    newDiv.classList.add(`secQueryDivs`);
                    clickableDiv.appendChild(newDiv);

                    // text displayed from the query result
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h3> ${jsonParse.payload[i].title} </h3>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<p> ${jsonParse.payload[i].format}</p>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<hr>`

                    console.log(jsonParse.payload[i]);
                }
            }

            if(jsonParse.eventName === "response3"){
                document.querySelector("#main").innerHTML = ``;

                document.querySelector("#main").innerHTML = `<h1 id="queryTitle">Top 10 Horror and Sci-Fi Books!</h1>`;

                for(let i = 0; i < jsonParse.payload.length; i++){
                    const newDiv = document.createElement("div");
                    newDiv.id = `div${i}`;
                    newDiv.classList.add(`thirdQueryDiv`);
                    const currentDiv = document.getElementById("main");
                    currentDiv.appendChild(newDiv);

                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h1 class="topTen"> ${i+1} </h1>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h3> ${jsonParse.payload[i].title} </h3>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h4>Average rating of ${jsonParse.payload[i].average_rating}</h4>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<hr>`;
                    console.log(jsonParse.payload[i]);
                }
            }

            if(jsonParse.eventName === "response4"){
                document.querySelector("#main").innerHTML = ``;

                document.querySelector("#main").innerHTML = `<h1 id="queryTitle">Ten Books in German or with a Rating of 4.90!</h1>`;

                for(let i = 0; i < jsonParse.payload.length; i++){
                    const newDiv = document.createElement("div");
                    newDiv.id = `div${i}`;
                    newDiv.classList.add(`fourthQueryDiv`);
                    const currentDiv = document.getElementById("main");
                    currentDiv.appendChild(newDiv);

                    // using the rating to give the div's box shadow a colour
                    let ratingAsFloat = parseFloat(jsonParse.payload[i].average_rating); // transforming the average_rating string into a float
                    let redColourMapFromRating = scale(ratingAsFloat, 2.50, 5.00, 50, 255); // map the rating to the amount of greens I want
                    let greenColourMapFromRating = scale(ratingAsFloat, 2.50, 5.00, 50, 153);
                    let blueColourMapFromRating = scale(ratingAsFloat, 2.50, 5.00, 0, 51);

                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h3> ${jsonParse.payload[i].title} </h3>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h4> Language: ${jsonParse.payload[i].language_code}   |    Average rating of ${jsonParse.payload[i].average_rating}</h4>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<p> ${jsonParse.payload[i].description} </p>`;

                    document.querySelector(`#${newDiv.id}`).style.boxShadow = `5px 10px 8px 10px rgb(${redColourMapFromRating}, ${greenColourMapFromRating}, ${blueColourMapFromRating})`;

                    console.log(jsonParse.payload[i]);
                }
            }

            if(jsonParse.eventName === "response5"){
                document.querySelector("#main").innerHTML = ``;

                document.querySelector("#main").innerHTML = `<h1 id="queryTitle">2019 Books!</h1>`;

                for(let i = 0; i < jsonParse.payload.length; i++){
                    const newDiv = document.createElement("div");
                    newDiv.id = `div${i}`;
                    newDiv.classList.add(`fifthQueryDiv`);
                    const currentDiv = document.getElementById("main");
                    currentDiv.appendChild(newDiv);

                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h3> ${jsonParse.payload[i].title} </h3>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<h4> <span> Publication year: ${jsonParse.payload[i].publication_year} </span>  |  <span>Average rating of ${jsonParse.payload[i].average_rating}</span></h4>`;
                    document.querySelector(`#${newDiv.id}`).innerHTML += `<p> ${jsonParse.payload[i].description} </p>`;
                    console.log(jsonParse.payload[i]);
                }
            }
        };

    } //on open
  //when websocket closes
  ws.onclose = function () {

    // websocket is closed.
    console.log("Connection is closed...");
  };
}


function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}