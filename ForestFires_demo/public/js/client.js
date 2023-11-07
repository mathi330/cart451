window.onload = function(){
    console.log("client js loaded in ws example");

    myID = Date.now();
    console.log(myID);

    let ws = new WebSocket("ws://localhost:4800");


// *****************************************
// SEND to the server side
// *****************************************

    //1: when the connection is open (setup)
    ws.onopen = function () {
        document.querySelector("#getOption").addEventListener("click", function (event) {
            let selectedProvince = document.querySelector("#province").value; // value of the province selector
            let selectedYear = document.querySelector("#year").value; // value of the year selector

            //send the value to the server side for the query
            ws.send(JSON.stringify({ eventName: 'query1', province: selectedProvince, year: selectedYear }));
        })


// *****************************************
// RECEIVE from the server side
// *****************************************


        ws.onmessage = function (event) {
            let jsonParse = JSON.parse(event.data); // parse data :)
            
            if(jsonParse.eventName === "response1"){ // if the eventName of the JSON is response1, then do ...
                
                document.getElementById("forestFires").innerHTML = ``; // empty the "forestFires" div.

                // go through the data sent back
                for(let i = 0; i < jsonParse.payload.length; i++){
                    let sizeGraph = 100 * jsonParse.payload[i].numberNull / 2908; // 2908 is the max number of forest fires so far (British Columbia, 1994)
                    // css for my "graph" divs (fond out I could do that here: https://alvarotrigo.com/blog/change-css-javascript/)
                    const myStyles = `
                    display: block;
                    width: ${sizeGraph}%;
                    height: 6vh;
                    margin-left: auto;
                    margin-right: auto;
                    background-color: red;
                    border: 2px;
                    margin: 20px;
                    padding-left: 10px;
                    padding-bottom: 10px;
                    `;  

                    // create a new div and append it to the "forestFires" div
                    const newDiv = document.createElement("div");
                    newDiv.id = `div${i}`;
                    newDiv.classList.add(`allDivs`);
                    const currentDiv = document.getElementById("forestFires");
                    currentDiv.appendChild(newDiv);
                    
                    // apply the style to the div
                    document.querySelector(`#div${i}`).style.cssText = myStyles;


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