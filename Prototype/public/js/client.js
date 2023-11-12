window.onload = function(){
    console.log("client js loaded in ws example");

    myID = Date.now();
    console.log(myID);

    let ws = new WebSocket("ws://localhost:4400");

    
    let tileLayer;
       
    // let theMap = L.map('map').setView([62.878580, -101.822486], 4);
    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 19,
        //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        // }).addTo(theMap);
        
        //1: when the connection is open (setup)
        ws.onopen = function () {
            
            document.querySelector("#button_1").addEventListener("click", function (event) {
                event.preventDefault();
                //A:::make a request for A
                ws.send(JSON.stringify({ eventName: 'query1', payload: '' }));
                console.log("sent1");
            })
            
            document.querySelector("#button_2").addEventListener("click", function (event) {
                event.preventDefault();
                ws.send(JSON.stringify({ eventName: 'query2', payload: '' }));
                console.log("sent2");
                // map.removeLayer(tileLayer);
            })
            
            document.querySelector("#button_3").addEventListener("click", function (event) {
                    event.preventDefault();
                    //A:::make a request for A text
                    ws.send(JSON.stringify({ eventName: 'query3', payload: '' }));
                    console.log("sent3");
                })
                
                // document.querySelector("#button_4").addEventListener("click", function (event) {
                    //     event.preventDefault();
                    //     //A:::make a request for A text
                    //     ws.send(JSON.stringify({ eventName: 'query4', payload: '' }));
                    //     console.log("sent4");
                    // })
                    
                    // document.querySelector("#button_5").addEventListener("click", function (event) {
                        //     event.preventDefault();
                        //     //A:::make a request for A text
                        //     ws.send(JSON.stringify({ eventName: 'query5', payload: '' }));
                        //     console.log("sent5");
                        // })
                        
                        
// *****************************************
// send back / recieve from the server side
// *****************************************
                        
                        
        ws.onmessage = function (event) {
            let jsonParse = JSON.parse(event.data);
            
            // console.log("Message is received..." + jsonParse.payload);
            // console.log("hello");
            
            if(jsonParse.eventName === "response1"){
                document.getElementById("main").innerHTML = '';
                const newDiv = document.createElement("div");
                newDiv.id = `map`;
                const currentDiv = document.getElementById("main");
                currentDiv.appendChild(newDiv);

                let map = L.map('map').setView([60.878580, -101.822486], 4);
                tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                })
                tileLayer.addTo(map);

                //B::: put into A
                for(let i = 0; i < jsonParse.library.length; i++){
                    let lat = parseFloat(jsonParse.library[i].latitude);
                    let lng = parseFloat(jsonParse.library[i].longitude);
                    let circleSize = jsonParse.library[i].population // "97,475"

                    let circle = L.circle([lat, lng], {
                        color: 'rgb(0, 227, 163)',
                        fillColor: 'rgb(24, 237, 177)',
                        fillOpacity: 0.5,
                        radius: 1000
                    }).addTo(map);

                    // console.log(jsonParse.payload[i]);
                }

                for(let i = 0; i < jsonParse.fire.length; i++){
                    let lat = parseFloat(jsonParse.fire[i].field_latitude);
                    let lng = parseFloat(jsonParse.fire[i].field_longitude);
                    let circleSize = jsonParse.fire[i].field_fire_size * 200000 / 1102834 //1 102 834

                    let circle = L.circle([lat, lng], {
                        color: 'rgb(255, 0, 0)',
                        fillColor: 'rgb(255, 0, 0)',
                        fillOpacity: 0.5,
                        radius: circleSize
                    }).addTo(map);

                    console.log(circleSize);
                }
            }

            if(jsonParse.eventName === "response2"){
                document.getElementById("main").innerHTML = '';
                const newDiv = document.createElement("div");
                newDiv.id = `map2`;
                const currentDiv = document.getElementById("main");
                currentDiv.appendChild(newDiv);

                let map = L.map('map2', {
                    crs: L.CRS.Simple,
                    minZoom: 4
                });

                // create my own map background. I want just the dots with a grey background
                let bounds = [[-101.5, -85], [101.5, 85]];
                let image = L.imageOverlay('../assets/grey.png', bounds).addTo(map);
                map.fitBounds(bounds);

                for(let i = 0; i < jsonParse.library.length; i++){
                    let lat = parseFloat(jsonParse.library[i].latitude);
                    let lng = parseFloat(jsonParse.library[i].longitude);

                    let circle = L.circle([lat - 60, lng + 95], {
                        color: 'rgb(227, 163, 0)',
                        fillColor: 'rgb(237, 177, 24)',
                        fillOpacity: 0.5,
                        radius: 0.1
                    }).addTo(map);

                    // console.log(jsonParse.payload[i]);
                }
                for(let i = 0; i < jsonParse.fire.length; i++){
                    let lat = parseFloat(jsonParse.fire[i].field_latitude);
                    let lng = parseFloat(jsonParse.fire[i].field_longitude);
                    let circleSize = jsonParse.fire[i].field_fire_size * 0.5 / 1102834 //1 102 834

                    let circle = L.circle([lat - 60, lng + 95], {
                        color: 'rgb(255, 0, 0)',
                        fillColor: 'rgb(255, 0, 0)',
                        fillOpacity: 0.5,
                        radius: circleSize
                    }).addTo(map);

                    console.log(circleSize);
                }
            }

            if(jsonParse.eventName === "response3"){
                document.getElementById("main").innerHTML = '';
                // let newCanvas = document.createElement("canvas");
                // let canvas = document.getElementById('canvas')
                // canvas.width = 350     // 350px
                // canvas.height = 200    // 200px
                // canvas.id = `abstract1`;


                // let myWidth = 1000;
                let myWidth = window.innerWidth;
                let myHeight = 800;
                // let NUMBER = 200;

                let stage = new Konva.Stage({
                    container: 'main',
                    width: myWidth,
                    height: myHeight,
                });
                let layer = new Konva.Layer();
                stage.add(layer);

                for(let i = 0; i < jsonParse.payload.length; i++){
                    let lng = -parseFloat(jsonParse.payload[i].longitude);
                    let circlePosX = (lng - 52) * myWidth / 90;

                    let population = parseFloat(jsonParse.payload[i].population);
                    let circleSize = population * 10000 / 97475;
                    // let circleBlue = population * 1000 / 90192;
                    
                    function generateNode() {
                        return new Konva.Ellipse({
                        x: circlePosX,
                        y: myHeight / 2,
                        // x: width * Math.random(),
                        // y: height * Math.random(),
                        radiusX: 2,
                        radiusY: circleSize,
                        fill: `rgb(213, 150, 255)`,
                        stroke: 'rgb(228, 190, 250)',
                        strokeWidth: 0.5,
                        });
                    }

                    // for (let i = 0; i < NUMBER; i++) {
                    layer.add(generateNode());
                    // console.log(circleBlue);
                    // }

                }

                
                // https://stackoverflow.com/questions/10652513/html5-dynamically-create-canvas
                // newCanvas.style.zIndex = 8;
                // newCanvas.style.position = "absolute";
                // newCanvas.style.border = "1px solid";
                
                // const currentDiv = document.getElementById("main");
                // currentDiv.appendChild(canvas);
                
                // console.log(abstract1);
                


                // let context = canvas.getContext("2d");
                // canvas.width = 10000;
                // canvas.height = 1000;



                // context.fillStyle = "lightblue";
                // // context.fillRect(10, 10, 100, 100);
                // context.rect(10, 10, 100, 100);

                // var ctx = c.getContext("2d");


                // context.moveTo(50, 50);
                // context.lineTo(200, 100);
                // context.stroke();

                
            }

            // if(jsonParse.eventName === "response2"){
            //     document.getElementById("main").innerHTML = '';
            // }

            // if(jsonParse.eventName === "response2"){
            //     document.getElementById("main").innerHTML = '';
            // }
            // if(jsonParse.eventName === "response2"){
            //     document.getElementById("main").innerHTML = '';
            // }
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