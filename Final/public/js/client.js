window.onload = function(){
    console.log("client js loaded in ws example");

    myID = Date.now();
    console.log(myID);

    let ws = new WebSocket("ws://localhost:4400");

    
    let librarySound = new Audio('/../assets/sound/Sound1.mp3');
    let fireSound = new Audio('/../assets/sound/Sound2.mp3');
    let siteSound = new Audio('/../assets/sound/Sound3.mp3');

        
    //1: when the connection is open (setup)
    ws.onopen = function () {
        ws.send(JSON.stringify({ eventName: 'query4', payload: '' }));
            console.log("sent4");
            
        document.querySelector("#button_1").addEventListener("click", function (event) {
            event.preventDefault();

            ws.send(JSON.stringify({ eventName: 'query1', payload: '' }));
            console.log("sent1");
        })
        
        document.querySelector("#button_2").addEventListener("click", function (event) {
            event.preventDefault();

            ws.send(JSON.stringify({ eventName: 'query2', payload: '' }));
            console.log("sent2");
        })
        
        document.querySelector("#button_3").addEventListener("click", function (event) {
            event.preventDefault();
            
            ws.send(JSON.stringify({ eventName: 'query3', payload: '' }));
            console.log("sent3");
        })

        document.querySelector("#button_4").addEventListener("click", function (event) {
            event.preventDefault();
            
            ws.send(JSON.stringify({ eventName: 'query4', payload: '' }));
            console.log("sent4");
        })
                        
                        
// *****************************************
// send back / recieve from the server side
// *****************************************
                        
                        
        ws.onmessage = function (event) {
            let jsonParse = JSON.parse(event.data);
            
            
            // *****************************************
            // RESPONSE 1
            // *****************************************

            if(jsonParse.eventName === "response1"){
                document.getElementById('libraries' ).checked = true;
                document.getElementById('fires').checked = false;
                document.getElementById('sites').checked = false;

                document.getElementById("librariesLabel").innerHTML = 'Libraries';
                document.getElementById("firesLabel").innerHTML = 'Forest Fires';
                document.getElementById("sitesLabel").innerHTML = 'Sites';

                const textSection = document.getElementById("extra");
                textSection.innerHTML = '';
                let libP = document.createElement("p");
                libP.classList.add("lib-para");
                libP.innerText = "Canadian Libraries";
                textSection.appendChild(libP);

                let fireP = document.createElement(`p`);
                fireP.classList.add("hidden");
                fireP.innerText = "Canadian Forest Fires";
                textSection.appendChild(fireP);

                let siteP = document.createElement(`p`);
                siteP.classList.add("hidden");
                siteP.innerText = "Interesting Sites";
                textSection.appendChild(siteP);


                let optionDiv = document.getElementById("extra");
                const expButton = document.createElement("INPUT");
                expButton.setAttribute("type", "button");
                expButton.setAttribute("value", "Explanation");
                expButton.id = 'exp-button';
                optionDiv.appendChild(expButton);

                let mapExplanation = document.createElement("p");
                mapExplanation.id = "mapExp";
                textSection.appendChild(mapExplanation);
                

                

                // create a div for the map
                document.getElementById("main").innerHTML = ''; // empty the "main" div
                const newDiv = document.createElement("div"); // create a new div
                newDiv.id = `map`; // give it an ID
                const currentDiv = document.getElementById("main"); // get the "main" div
                currentDiv.appendChild(newDiv); // add the new div to the already existing "main"

                // my own library layer
                let libraryList = L.layerGroup([]);
                // create the circles for all the libraries
                for(let i = 0; i < jsonParse.library.length; i++){
                    // the coordinates that we got from the dataset
                    let lat = parseFloat(jsonParse.library[i].latitude);
                    let lng = parseFloat(jsonParse.library[i].longitude);
                    console.log(lat);
                    // create the circle for that  library
                    let circle = L.circle([lat, lng], {
                        color: 'rgb(0, 227, 163)',
                        weight: 1,
                        fillColor: 'rgb(24, 237, 177)',
                        fillOpacity: 0.5,
                        radius: 1000
                    }).addTo(libraryList); // add it to the library layer
                }

                // my own forest fires layer
                let fireList = L.layerGroup([]);
                // create the circles for all the fires
                for(let i = 0; i < jsonParse.fire.length; i++){
                    let lat = parseFloat(jsonParse.fire[i].field_latitude);
                    let lng = parseFloat(jsonParse.fire[i].field_longitude);
                    let circleSize = jsonParse.fire[i].field_fire_size * 200000 / 1102834 //1 102 834

                    let circle = L.circle([lat, lng], {
                        color: 'rgb(255, 0, 0)',
                        weight: 0.5,
                        fillColor: 'rgb(255, 0, 0)',
                        fillOpacity: 0.5,
                        radius: circleSize
                    }).addTo(fireList); // add it to the library layer
                }

                // console.log(jsonParse.sites);

                // my sites layer
                let sitesList = L.layerGroup([]);
                // create the circles for all the sites
                for(let i = 0; i < jsonParse.sites.length; i++){
                    // the coordinates that we got from the dataset
                    let latitude = jsonParse.sites[i].lat;
                    let longitude = jsonParse.sites[i].lng;
                    console.log(latitude);
                    // create the circle for that site
                    let circle = L.circle([latitude, longitude], {
                        color: 'rgb(0, 100, 250)',
                        weight: 0.5,
                        fillColor: 'rgb(12, 150, 255)',
                        fillOpacity: 0.5,
                        radius: 20000
                    }).addTo(sitesList); // add it to the sites layer

                }

                // Open Street Map
                tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                })
                
                // create the map with the correct starting coordinates, zoom and the layers we want
                let map = L.map('map',{
                    center: [60.878580, -101.822486],
                    zoom: 4,
                    layers: [tileLayer, libraryList, fireList, sitesList] // first is Open Street Map, my libraries, then the forest fires
                });
                map.removeLayer(fireList);
                map.removeLayer(sitesList);
                
                // Libraries check box display and hide
                let librariesCheckBox = document.getElementById("libraries");
                librariesCheckBox.addEventListener("click", function (event) {
                    if(librariesCheckBox.checked === true){ // if the libraries check box is checked
                        map.addLayer(libraryList); // display the libraries
                        librarySound.pause();
                        libP.classList.remove("hidden");
                        libP.classList.add("lib-para");
                    }else if(librariesCheckBox.checked === false){ // if the libraries check box is not checked
                        map.removeLayer(libraryList); // hide the libraries
                        libP.classList.add("hidden");
                        libP.classList.remove("lib-para");
                    }

                })

                // Forest fire check box display and hide
                let firesCheckBox = document.getElementById("fires");
                firesCheckBox.addEventListener("click", function (event) {
                    if(firesCheckBox.checked === true){ // if the fire check box is checked
                        map.addLayer(fireList); // display the fires
                        fireSound.pause();
                        fireP.classList.remove("hidden");
                        fireP.classList.add("fire-para");
                    }else if(firesCheckBox.checked === false){ // if the fire check box is not checked
                        map.removeLayer(fireList); // hide the fires
                        fireP.classList.add("hidden");
                        fireP.classList.remove("fire-para");
                    }
                })

                // Canadian sites check box display and hide
                let sitesCheckBox = document.getElementById("sites");
                sitesCheckBox.addEventListener("click", function (event) {
                    if(sitesCheckBox.checked === true){ // if the sites check box is checked
                        map.addLayer(sitesList); // display the sites
                        siteSound.pause();
                        siteP.classList.remove("hidden");
                        siteP.classList.add("site-para");  
                    }else if(sitesCheckBox.checked === false){ // if the sites check box is not checked
                        map.removeLayer(sitesList); // hide the sites
                        siteP.classList.add("hidden");
                        siteP.classList.remove("site-para"); 
                    }
                })

                document.querySelector("#exp-button").addEventListener("click", function (event) {
                    event.preventDefault();
                    if(librariesCheckBox.checked === false && firesCheckBox.checked === false && sitesCheckBox.checked === false){
                        mapExplanation.innerText = "A map :)";
                    }
                    if(librariesCheckBox.checked === true){
                        mapExplanation.innerText = "1. This map shows public libraries accross the country.";
                    }
                    if(firesCheckBox.checked === true){
                        mapExplanation.innerText = "2. This map shows forest fires that burned in 2023 with their size being represeted by the size of the circles.";
                    }
                    if(sitesCheckBox.checked === true){
                        mapExplanation.innerText = "3. This map shows different interesting canadian sites such as historic sites, campgrounds, waterfalls, and many more.";
                    }
                    if(librariesCheckBox.checked === true && firesCheckBox.checked === true){
                        mapExplanation.innerText = "4. When looking at this map we can notice that forest fires rarely overlap with libraries and never overlap with areas densely populated by libraries. From this observation, we can conclude that libraries play an important role in preventing forest fires.";
                    }
                    if(firesCheckBox.checked === true && sitesCheckBox.checked === true){
                        mapExplanation.innerText = "5. This map shows forest fires and ineresting canadian sites. We can see that forest fires do not overlap with these sites, we can therefore suppose that these sites either prevent forest fires or have something that protects them from that threat.";
                    }
                    if(librariesCheckBox.checked === true && sitesCheckBox.checked === true){
                        mapExplanation.innerText = "6. In this map, we can see that libraries and interesting canadian sites like historic sites often overlap with libraries or are close by except for a few exceptions. It seems right to believe that libraries are the cause for the presence of historic milestones and other canadian wonders.";
                    }
                    if(librariesCheckBox.checked === true && firesCheckBox.checked === true && sitesCheckBox.checked === true){
                        mapExplanation.innerText = "This map seems to prove our hypothesis from the 5th explanation (see forest fires and sites), about sites being protected from forest fires by libraries.";
                    }
                })
            }

            // *****************************************
            // RESPONSE 2
            // *****************************************

            if(jsonParse.eventName === "response2"){
                // set up the check marks in the check boxes
                document.getElementById('libraries' ).checked = true;
                document.getElementById('fires').checked = true;
                document.getElementById('sites').checked = true;

                document.getElementById("librariesLabel").innerHTML = 'Orange';
                document.getElementById("firesLabel").innerHTML = 'Tomato';
                document.getElementById("sitesLabel").innerHTML = 'Blueberry';

                document.getElementById("extra").innerHTML = '';

                document.getElementById("main").innerHTML = '';
                const newDiv = document.createElement("div");
                newDiv.id = `map2`;
                const currentDiv = document.getElementById("main");
                currentDiv.appendChild(newDiv);

                // my own library layer
                let libraryList = L.layerGroup([]);
                // create the circles for all the libraries
                for(let i = 0; i < jsonParse.library.length; i++){
                    // the coordinates that we got from the dataset
                    let lat = parseFloat(jsonParse.library[i].latitude);
                    let lng = parseFloat(jsonParse.library[i].longitude);
                    
                    let randomLat = Math.floor(Math.random() * (5 - -5 + 1) ) - 5 + lat;
                    let randomLng = Math.floor(Math.random() * (5 - -5 + 1) ) - 5 + lng;

                    let randCircleSize = Math.random() * 1.4; 

                    // create the circle for that  library
                    let circle = L.circle([randomLat - 60, randomLng + 95], {
                        color: 'rgb(227, 163, 0)',
                        weight: 0,
                        fillColor: 'rgb(237, 177, 24)',
                        fillOpacity: 0.1,
                        radius: randCircleSize
                    }).addTo(libraryList); // add it to the library layer
                }

                // my own forest fires layer
                let fireList = L.layerGroup([]);
                // create the circles for all the fires
                for(let i = 0; i < jsonParse.fire.length; i++){
                    let lat = parseFloat(jsonParse.fire[i].field_latitude);
                    let lng = parseFloat(jsonParse.fire[i].field_longitude);
                    let circleSize = jsonParse.fire[i].field_fire_size * 1 / 1102834 //1 102 834

                    let randomLat = Math.floor(Math.random() * (9 - -6 + 1) ) - 6 + lat;
                    let randomLng = Math.floor(Math.random() * (5 - -5 + 1) ) - 5 + lng;

                    let circle = L.circle([randomLat - 60, randomLng + 95], {
                        color: 'rgb(255, 0, 0)',
                        weight: 0,
                        fillColor: 'rgb(255, 0, 0)',
                        fillOpacity: 0.3,
                        radius: circleSize + 0.5
                    }).addTo(fireList); // add it to the fire layer
                }

                // my sites layer
                let sitesList = L.layerGroup([]);
                // create the circles for all the sites
                for(let i = 0; i < jsonParse.sites.length; i++){
                    // the coordinates that we got from the dataset
                    let latitude = jsonParse.sites[i].lat;
                    let longitude = jsonParse.sites[i].lng;

                    let randomLat = Math.floor(Math.random() * (12 - -12 + 1) ) - 12 + latitude;
                    let randomLng = Math.floor(Math.random() * (2 - -2 + 1) ) - 2 + longitude;
                    
                    // create the circle for that site
                    let circle = L.circle([randomLat - 60, randomLng + 95], {
                        color: 'rgb(0, 100, 250)',
                        weight: 0,
                        fillColor: 'rgb(12, 150, 255)',
                        fillOpacity: 0.05,
                        radius: 1
                    }).addTo(sitesList); // add it to the sites layer
                }

                // create the map with the correct starting coordinates, zoom and the layers we want
                let map = L.map('map2',{
                    center: [60.878580, -101.822486],
                    crs: L.CRS.Simple,
                    minZoom: 3,
                    layers: [libraryList, fireList, sitesList] // library layer, forest fires layer
                });
                let bounds = [[-111.5, -85], [101.5, 85]];
                let image = L.imageOverlay('../assets/grey.png', bounds).addTo(map);
                map.fitBounds(bounds);
                // create my own map background. I want just the dots with a grey background

                // map.removeLayer(fireList);
                // map.removeLayer(libraryList);
                
                // Libraries check box display and hide
                let librariesCheckBox = document.getElementById("libraries");
                librariesCheckBox.addEventListener("click", function (event) {
                    if(librariesCheckBox.checked === true){ // if the libraries check box is checked
                        map.addLayer(libraryList); // display the libraries
                        librarySound.pause();
                    }else if(librariesCheckBox.checked === false){ // if the libraries check box is not checked
                        map.removeLayer(libraryList); // hide the libraries
                    }

                })

                // Forest fires check box display and hide
                let firesCheckBox = document.getElementById("fires");
                firesCheckBox.addEventListener("click", function (event) {
                    if(firesCheckBox.checked === true){ // if the fire check box is checked
                        map.addLayer(fireList); // display the fires
                        fireSound.pause();
                    }else if(firesCheckBox.checked === false){ // if the fire check box is not checked
                        map.removeLayer(fireList); // hide the fires
                    }
                })

                // Canadian sites check box display and hide
                let sitesCheckBox = document.getElementById("sites");
                sitesCheckBox.addEventListener("click", function (event) {
                    if(sitesCheckBox.checked === true){ // if the sites check box is checked
                        map.addLayer(sitesList); // display the sites
                        siteSound.pause();
                    }else if(sitesCheckBox.checked === false){ // if the sites check box is not checked
                        map.removeLayer(sitesList); // hide the sites
                    }
                })
            }



            // *****************************************
            // RESPONSE 3
            // *****************************************

            if(jsonParse.eventName === "response3"){
                // set up the check marks in the check boxes
                document.getElementById('libraries' ).checked = false;
                document.getElementById('fires').checked = false;
                document.getElementById('sites').checked = false;

                document.getElementById("librariesLabel").innerHTML = '1';
                document.getElementById("firesLabel").innerHTML = '2';
                document.getElementById("sitesLabel").innerHTML = '3';

                document.getElementById("extra").innerHTML = '';
                let optionDiv = document.getElementById("extra");
                const playButton = document.createElement("INPUT");
                playButton.setAttribute("type", "button");
                playButton.setAttribute("value", "Play");
                playButton.id = 'play-button';
                optionDiv.appendChild(playButton);

                document.getElementById("main").innerHTML = '';
                const newDiv = document.createElement("div");
                newDiv.id = `konvaParent`;
                const currentDiv = document.getElementById("main");
                currentDiv.appendChild(newDiv);


                let myWidth = window.innerWidth;
                let myHeight = 800;

                let stage = new Konva.Stage({
                    container: 'konvaParent',
                    width: myWidth,
                    height: myHeight,
                });
                

                let libraries = new Konva.Layer();
                let fires = new Konva.Layer();
                let sites = new Konva.Layer();

                stage.add(libraries);
                stage.add(fires);
                stage.add(sites);

                libraries.hide();
                fires.hide();
                sites.hide();
                

                // create ellipses for the libraries 
                for(let i = 0; i < jsonParse.library.length; i++){
                    let lng = -parseFloat(jsonParse.library[i].longitude);
                    let circlePosX = (lng - 52) * myWidth / 90;

                    let population = parseFloat(jsonParse.library[i].population);
                    let circleSize = population * 10000 / 97475;
                    // let circleBlue = population * 1000 / 90192;
                    
                    function generateNode() {
                        return new Konva.Ellipse({
                        x: circlePosX,
                        y: myHeight / 2,
                        radiusX: 0.5,
                        radiusY: circleSize,
                        fill: `rgb(233, 199, 255)`,
                        strokeWidth: 0.5,
                        visible: "inherit",
                        });
                    }

                    libraries.add(generateNode());

                }

                for(let i = 0; i < jsonParse.fire.length; i++){
                    let lng = -parseFloat(jsonParse.fire[i].field_longitude);
                    let circlePosX = (lng - 52) * myWidth / 90;

                    // let population = parseFloat(jsonParse.fire[i].population);
                    let circleSize = jsonParse.fire[i].field_fire_size * 350 / 1000000;
                    // let circleBlue = population * 1000 / 90192;
                    
                    function generateNode() {
                        return new Konva.Ellipse({
                        x: circlePosX,
                        y: myHeight / 2,
                        radiusX: 0.5,
                        radiusY: circleSize,
                        // fill: `rgb(213, 150, 255)`,
                        fill: `rgb(199, 117, 250)`,
                        // stroke: 'rgb(228, 190, 250)',
                        strokeWidth: 0.5,
                        visible: "inherit",
                        });
                    }

                    fires.add(generateNode());

                }

                for(let i = 0; i < jsonParse.sites.length; i++){
                    let lng = -parseFloat(jsonParse.sites[i].lng);
                    let circlePosX = (lng - 52) * myWidth / 90;

                    let circleSize = jsonParse.sites[i].lat * 100 / 69.1372830452447; // smallest latitude: 43.8247969776765
                    
                    function generateNode() {
                        return new Konva.Ellipse({
                        x: circlePosX,
                        y: myHeight / 2,
                        radiusX: 0.3,
                        radiusY: circleSize,
                        fill: `rgb(169, 40, 252)`,
                        strokeWidth: 0.5,
                        visible: "inherit",
                        });
                    }
                    sites.add(generateNode());
                }

                // Libraries check box display and hide
                let librariesCheckBox = document.getElementById("libraries");
                librariesCheckBox.addEventListener("click", function (event) {
                    if(librariesCheckBox.checked === true){ // if the libraries check box is checked
                        libraries.show();
                        librarySound.play();
                    }else if(librariesCheckBox.checked === false){ // if the libraries check box is not checked
                        libraries.hide();
                        librarySound.pause();
                    }

                });

                // Forest fires check box display and hide
                let firesCheckBox = document.getElementById("fires");
                firesCheckBox.addEventListener("click", function (event) {
                    if(firesCheckBox.checked === true){ // if the fire check box is checked
                        fires.show(fires); // display the fires
                        fireSound.play();
                    }else if(firesCheckBox.checked === false){ // if the fire check box is not checked
                        fires.hide(); // hide the fires
                        fireSound.pause();
                    }
                });

                // Canadian sites check box display and hide
                let sitesCheckBox = document.getElementById("sites");
                sitesCheckBox.addEventListener("click", function (event) {
                    if(sitesCheckBox.checked === true){ // if the sites check box is checked
                        sites.show(); // display the sites
                        siteSound.play();
                    }else if(sitesCheckBox.checked === false){ // if the sites check box is not checked
                        sites.hide(); // hide the sites
                        siteSound.pause();
                    }
                });




                // code for responsive konva canvas: https://konvajs.org/docs/sandbox/Responsive_Canvas.html
                function fitStageIntoParentContainer() {
                    let container = document.getElementById('konvaParent');

                    // now we need to fit stage into parent container
                    let containerWidth = container.offsetWidth;
                    let containerHeight = container.offsetHeight;
            
                    // but we also make the full scene visible
                    // so we need to scale all objects on canvas
                    let scaleX = containerWidth / myWidth;
                    let scaleY = containerHeight / myHeight;

                    stage.width(myWidth * scaleX);
                    stage.height(myHeight * scaleY);
                    stage.scale({ x: scaleX, y: scaleY});
                }
            
                fitStageIntoParentContainer();
                // adapt the stage on any window resize
                window.addEventListener('resize', fitStageIntoParentContainer);




                document.querySelector("#play-button").addEventListener("click", function (event) {
                    event.preventDefault();
                    if(librariesCheckBox.checked === true){
                        librarySound.play();
                    }
                    if(firesCheckBox.checked === true){
                        fireSound.play();
                    }
                    if(sitesCheckBox.checked === true){
                        siteSound.play();
                    }
                })

                
            }



            // *****************************************
            // RESPONSE 4
            // *****************************************

            if(jsonParse.eventName === "response4"){
                // set up the check marks in the check boxes
                document.getElementById('libraries' ).checked = false;
                document.getElementById('fires').checked = false;
                document.getElementById('sites').checked = false;

                document.getElementById("librariesLabel").innerHTML = '';
                document.getElementById("firesLabel").innerHTML = '';
                document.getElementById("sitesLabel").innerHTML = '';

                
                document.getElementById("extra").innerHTML = '';
                document.getElementById("main").innerHTML = '';
                const newDiv = document.createElement("div");
                newDiv.id = `konvaParent`;
                const currentDiv = document.getElementById("main");
                currentDiv.appendChild(newDiv);


                let myWidth = window.innerWidth;
                let myHeight = 800;

                let stage = new Konva.Stage({
                    container: 'konvaParent',
                    width: myWidth,
                    height: myHeight,
                });
                

                let libraries = new Konva.Layer();
                let myLibraries = [];
                let fires = new Konva.Layer();
                let theFires = [];
                let sites = new Konva.Layer();
                let theSites = [];

                stage.add(libraries);
                stage.add(fires);
                stage.add(sites);

                libraries.hide();
                fires.hide();
                sites.hide();
                

                // create ellipses for the libraries 
                for(let i = 0; i < jsonParse.library.length; i++){
                    let circlePosX = Math.floor(Math.random() * myWidth);
                    let circlePosY = Math.floor(Math.random() * myHeight);
                    let circleR = Math.floor(Math.random() * 255);
                    let circleSize = jsonParse.library[i].population * 100 / 1475;
                    
                    let circle = new Konva.Ellipse({
                        x: circlePosX,
                        y: circlePosY,
                        radiusX: circleSize,
                        radiusY: circleSize,
                        fill: `rgb(${circleR}, 200, 60)`,
                        strokeWidth: 0.5,
                        opacity: 0.06,
                        visible: "inherit",
                    });

                    myLibraries.push(circle);
                    libraries.add(circle);
                }
                
                
                let libAnim = new Konva.Animation(function (frame){
                    for(let i = 0; i < myLibraries.length; i++){
                        let xVelocity = Math.floor(Math.random() * (100 - -100) + -100);
                        let yVelocity = Math.floor(Math.random() * (100 - -100) + -100);
                        let xDist = xVelocity * (frame.timeDiff / 1000);
                        let yDist = yVelocity * (frame.timeDiff / 1000);
                        myLibraries[i].move({x: xDist, y: yDist});
                    }
                }, libraries);


                for(let i = 0; i < jsonParse.fire.length; i++){
                    let circlePosX = Math.floor(Math.random() * myWidth);
                    let circlePosY = Math.floor(Math.random() * myHeight);
                    let circleG = jsonParse.fire[i].field_fire_size * 255 / 1000000;
                    let circleSize = Math.floor(Math.random() * 50);
                    
                    let circle = new Konva.Ellipse({
                        x: circlePosX,
                        y: circlePosY,
                        radiusX: circleSize,
                        radiusY: circleSize,
                        fill: `rgb(199, ${circleG}, 255)`,
                        strokeWidth: 0.5,
                        opacity: 0.07,
                        visible: "inherit",
                    });

                    theFires.push(circle)
                    fires.add(circle);

                }

                let fireAnim = new Konva.Animation(function (frame){
                    for(let i = 0; i < theFires.length; i++){
                        let xVelocity = Math.floor(Math.random() * (100 - -100) + -100);
                        let yVelocity = Math.floor(Math.random() * (100 - -100) + -100);
                        let xDist = xVelocity * (frame.timeDiff / 1000);
                        let yDist = yVelocity * (frame.timeDiff / 1000);
                        theFires[i].move({x: xDist, y: yDist});
                    }
                }, fires);

                for(let i = 0; i < jsonParse.sites.length; i++){
                    let circlePosX = Math.floor(Math.random() * myWidth);
                    let circlePosY = Math.floor(Math.random() * myHeight);
                    let scaledLat = scale(jsonParse.sites[i].lat, 43.8247969776765, 69.1372830452447, 0, 255);
                    let circleSize = Math.floor(Math.random() * 50);
                    
                    let circle = new Konva.Ellipse({
                        x: circlePosX,
                        y: circlePosY,
                        radiusX: circleSize,
                        radiusY: circleSize,
                        fill: `rgb(${scaledLat}, 50, 150)`,
                        strokeWidth: 0.5,
                        opacity: 0.03,
                        visible: "inherit",
                    });
                    theSites.push(circle)
                    sites.add(circle);
                }

                let sitesAnim = new Konva.Animation(function (frame){
                    for(let i = 0; i < theSites.length; i++){
                        let xVelocity = Math.floor(Math.random() * (100 - -100) + -100);
                        let yVelocity = Math.floor(Math.random() * (100 - -100) + -100);
                        let xDist = xVelocity * (frame.timeDiff / 1000);
                        let yDist = yVelocity * (frame.timeDiff / 1000);
                        theSites[i].move({x: xDist, y: yDist});
                    }
                }, sites);

                // Libraries check box display and hide
                let librariesCheckBox = document.getElementById("libraries");
                librariesCheckBox.addEventListener("click", function (event) {
                    if(librariesCheckBox.checked === true){ // if the libraries check box is checked
                        libAnim.start();
                        libraries.show();
                        librarySound.pause();
                    }else if(librariesCheckBox.checked === false){ // if the libraries check box is not checked
                        libAnim.stop();
                        libraries.hide();
                    }

                });

                // Forest fires check box display and hide
                let firesCheckBox = document.getElementById("fires");
                firesCheckBox.addEventListener("click", function (event) {
                    if(firesCheckBox.checked === true){ // if the fire check box is checked
                        fireAnim.start();
                        fires.show(fires); // display the fires
                        fireSound.pause();
                    }else if(firesCheckBox.checked === false){ // if the fire check box is not checked
                        fireAnim.stop();
                        fires.hide(); // hide the fires
                    }
                });

                // Canadian sites check box display and hide
                let sitesCheckBox = document.getElementById("sites");
                sitesCheckBox.addEventListener("click", function (event) {
                    if(sitesCheckBox.checked === true){ // if the sites check box is checked
                        sitesAnim.start();
                        sites.show(); // display the sites
                        siteSound.pause();
                    }else if(sitesCheckBox.checked === false){ // if the sites check box is not checked
                        sitesAnim.stop();
                        sites.hide(); // hide the sites
                    }
                });




                // code for responsive konva canvas: https://konvajs.org/docs/sandbox/Responsive_Canvas.html
                function fitStageIntoParentContainer() {
                    let container = document.getElementById('konvaParent');

                    // now we need to fit stage into parent container
                    let containerWidth = container.offsetWidth;
                    let containerHeight = container.offsetHeight;
            
                    // but we also make the full scene visible
                    // so we need to scale all objects on canvas
                    let scaleX = containerWidth / myWidth;
                    let scaleY = containerHeight / myHeight;

                    stage.width(myWidth * scaleX);
                    stage.height(myHeight * scaleY);
                    stage.scale({ x: scaleX, y: scaleY});
                }
            
                fitStageIntoParentContainer();
                // adapt the stage on any window resize
                window.addEventListener('resize', fitStageIntoParentContainer);
                
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