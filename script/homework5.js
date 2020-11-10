var workspaceSVG;
var workspaceWidth;
var workspaceHeight;
var workspaceInnerHeight;
var workspaceInnerWidth;
var workspaceMargin = { top: 20, right: 20, bottom: 20, left: 20 };

var legendSVG;
var legendWidth;
var legendHeight;
var legendInnerHeight;
var legendInnerWidth;
var legendMargin = { top: 20, right: 20, bottom: 20, left: 20 };

var infoSVG;
var infoWidth;
var infoHeight;
var infoInnerHeight;
var infoInnerWidth;
var infoMargin = { top: 20, right: 20, bottom: 20, left: 20 };

var dogJson = [];
var flightJson = [];
var clusterJson = [];

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {

    // Setting dimensions for workspace SVG
    workspaceSVG = d3.select('.workspace');
    workspaceWidth = +workspaceSVG.style('width').replace('px','');
    workspaceHeight = +workspaceSVG.style('height').replace('px','');;
    workspaceInnerHeight = workspaceWidth - workspaceMargin.left - workspaceMargin.right;
    workspaceInnerWidth = workspaceHeight - workspaceMargin.top - workspaceMargin.bottom;

    // Setting dimensions for legend SVG
    legendSVG = d3.select(".legend");
    legendWidth = +legendSVG.style('width').replace('px','');
    legendHeight = +legendSVG.style('height').replace('px','');;
    legendInnerHeight = legendWidth - legendMargin.left - legendMargin.right;
    legendInnerWidth = legendHeight - legendMargin.top - legendMargin.bottom;

    // Setting dimensions for info SVG
    infoSVG = d3.select(".info");
    infoWidth = +infoSVG.style('width').replace('px','');
    infoHeight = +infoSVG.style('height').replace('px','');;
    infoInnerHeight = infoWidth - infoMargin.left - infoMargin.right;
    infoInnerWidth = infoHeight - infoMargin.top - infoMargin.bottom;
  
    // Loading both datasets before everything
    Promise.all([d3.json('data/dogs-final.json'), d3.json('data/flights-final.json'), d3.json('data/clusters-final.json')]).then(function(values){
        dogJson = values[0];
        flightJson = values[1];
        clusterJson = values[2]
        drawSVG();
        drawLegend();
        drawInfo();
        
        // Initial text for info section
        infoSVG.append("text")
            .attr("class", "info")
            .text("Hover to fill Me!!")
            .attr("transform", "translate(" + 90 + "," + (infoHeight/2) + ")")
            .style("font-size","45px");  
    })
  
});

function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
       return 0;  
    }  
}

function drawInfo(){
    // Adding Title for Info section
    infoSVG.append("text")
            .text("INFORMATION")
            .attr("transform", "translate(" + 180 + "," + 50 + ")")
            .style("font-size","25px");
}

function drawLegend(){
    // Adding Title for Legend
    legendSVG.append("text")
            .text("HOW TO READ")
            .attr("transform", "translate(" + 180 + "," + 30 + ")")
            .style("font-size","25px");

    // Mission legend variables
    radius = [20, 25, 30, 35, 55];
    mission = [1, 2, 3, 4, 7];
    z = [160, 150, 140, 130, 90]

    for (var i = 0; i < radius.length; i++){
        r = radius[i];
        x = 130;
        y = 150-r+2;
        points = [270, z];
        legendSVG.append("circle")
            .attr("transform", "translate(" + x + "," + y + ")")
            .attr("r", r)
            .attr("stroke", "black")
            .attr("stroke-width", "1.5")
            .attr("fill", "none");
        legendSVG.append("text")
            .attr("transform", "translate(" + 127 + "," + (z[i]-50) + ")")
            .text(mission[i])
            .style("font-size","8.5px")
            .style("fill", "black")
            .style("font-family","'Trebuchet MS', sans-serif")
            .style("margin-bottom","10px");
    }

    legendSVG.append("text")
            .text("Dogs in larger circles flew")
            .attr("transform", "translate(" + 40 + "," + 170 + ")")
            .style("font-size","15px");

    legendSVG.append("text")
            .text("on more missions")
            .attr("transform", "translate(" + 70 + "," + 190 + ")")
            .style("font-size","15px");

    // Gradient definition for circles
    var defs = workspaceSVG.append("defs");
    // Green radient for survied dogs
    var gradient = defs.append("radialGradient")
                    .attr("id", "greenGradient")
                    .attr("x1", "0%")
                    .attr("x2", "100%")
                    .attr("y1", "0%")
                    .attr("y2", "100%");
    gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", "#ffffff")
            .attr("stop-opacity", 1);
    gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#59de00")
            .attr("stop-opacity", 1);
    // Red radient for survied dogs
    var gradient = defs.append("radialGradient")
                    .attr("id", "redGradient")
                    .attr("x1", "0%")
                    .attr("x2", "100%")
                    .attr("y1", "0%")
                    .attr("y2", "100%");
    gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", "#ffffff")
            .attr("stop-opacity", 1);
    gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#de0021")
            .attr("stop-opacity", 1);

    x = 290;
    y = 90;
    radius = 25;
    // Append circle
    legendSVG.append("circle")
        .attr("transform", "translate(" + x + "," + y + ")")
        .attr("r", radius)
        .attr("stroke", "black")
        .attr("stroke-width", "1.5")
        .attr("fill", "url(#greenGradient)");

    // Append images
    legendSVG.append("svg:image")
        .attr("xlink:href",  img)
        .attr("transform", "translate(" + (x-radius-5) + "," + (y-radius-5) + ")")
        .attr("height", radius*2+10)
        .attr("width", radius*2+10);

    x = 410;
    y = 90;
    radius = 25;
    // Append circle
    legendSVG.append("circle")
        .attr("transform", "translate(" + x + "," + y + ")")
        .attr("r", radius)
        .attr("stroke", "black")
        .attr("stroke-width", "1.5")
        .attr("fill", "url(#redGradient)");

    // Append images
    legendSVG.append("svg:image")
        .attr("xlink:href",  img)
        .attr("transform", "translate(" + (x-radius-5) + "," + (y-radius-5) + ")")
        .attr("height", radius*2+10)
        .attr("width", radius*2+10);

    // Append Link
    legendSVG.append("line")
        .attr("x1", 315)
        .attr("y1", 90)
        .attr("x2", 385)
        .attr("y2", 90)
        .attr("height","15px")
        .attr("stroke", "black")
        .attr("opacity", "0.8")
        .attr("stroke-width", "10")
        .attr("fill", "black")
        .style("z-index", "-1");
    
    legendSVG.append("text")
        .text("Survived")
        .attr("transform", "translate(" + 264 + "," + 130 + ")")
        .style("font-size","15px");

    legendSVG.append("text")
        .text("Died")
        .attr("transform", "translate(" + 395 + "," + 130 + ")")
        .style("font-size","15px");
    
    legendSVG.append("text")
        .text("Directly connected dogs")
        .attr("transform", "translate(" + 270 + "," + 170 + ")")
        .style("font-size","15px");
    
    legendSVG.append("text")
        .text("flew together")
        .attr("transform", "translate(" + 300 + "," + 190 + ")")
        .style("font-size","15px");
}

function addText(x, y, clusterID){
    // Append Cluster ID
    workspaceSVG.append("g")
        .attr("class", "clusterID")
        .attr("transform", "translate(" + x + "," + y + ")")
        .style("outline", "1px dashed #1C1B2D")
        .append("text")
        .text("\xa0Cluster ID - "+clusterID+"\xa0")
        .style("font-size","15px")
        .style("font-family","'Trebuchet MS', sans-serif")
        .on('mouseover', function() {
            infoSVG.selectAll(".info").remove()
            d3.select(this)
                .style("outline", "2px dashed white")
                .style("cursor", "pointer");
            fillClusterInfo(clusterID);
        })
        .on('mousemove',function() {
            infoSVG.selectAll(".info").remove()
            d3.select(this)
                .style("outline", "2px dashed white")
                .style("cursor", "pointer"); 
            fillClusterInfo(clusterID);
        })
        .on('mouseout', function() {
            d3.select(this)
                .style("outline", "1px dashed #1C1B2D")
                .style("cursor", "default"); 
            infoSVG.selectAll(".info").remove()
            infoSVG.append("text")
                .attr("class", "info")
                .text("Hover to fill Me!!")
                .attr("transform", "translate(" + 90 + "," + (infoHeight/2) + ")")
                .style("font-size","45px");  
        })
        .on('click', function() {
            infoSVG.selectAll(".info").remove()
            d3.select(this)
                .style("outline", "2px dashed white")
                .style("cursor", "pointer"); 
            fillClusterInfo(clusterID);
        });
}

function drawLink(x1, y1, x2, y2){
    workspaceSVG.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("height","15px")
        .attr("stroke", "black")
        .attr("opacity", "0.8")
        .attr("stroke-width", "10")
        .attr("fill", "black")
        .style("z-index", "-1");
}

function drawLinks(){
    // Cluster-1
    drawLink(50, 150, 120, 100);
    drawLink(50, 150, 120, 200);
    // Cluster-2
    drawLink(200, 150, 320, 150);
    // Cluster-3
    drawLink(400, 100, 400, 200);
    // Cluster-4
    drawLink(490, 150, 610, 150);
    // Cluster-5
    drawLink(690, 100, 780, 120);
    drawLink(730, 200, 780, 120);
    drawLink(730, 200, 875, 150);
    drawLink(950, 100, 875, 150);
    drawLink(950, 200, 875, 150);
    // Cluster-6
    drawLink(150, 380, 260, 360);
    drawLink(370, 380, 260, 360);
    drawLink(480, 360, 370, 380);
    drawLink(150, 380, 50, 460);
    drawLink(150, 380, 50, 350);
    drawLink(250, 360, 210, 470);
    drawLink(300, 470, 210, 470);
    // Cluster-8
    drawLink(570, 375, 570, 475);
    // Cluster-9
    drawLink(680, 350, 810, 400);
    drawLink(680, 470, 810, 400);
    drawLink(680, 350, 680, 470);
    drawLink(810, 400, 940, 350);
    drawLink(810, 400, 940, 470);
    // Cluster-10
    drawLink(1050, 375, 1050, 475);
    // Cluster-11
    drawLink(80, 610, 80, 710);
    // Cluster-12
    drawLink(180, 660, 280, 660);
    // Cluster-13
    drawLink(380, 610, 380, 710);
    // Cluster-16
    drawLink(750, 610, 750, 710);
    // Cluster-17
    drawLink(840, 665, 920, 615);
    drawLink(940, 705, 920, 615);
    drawLink(940, 705, 1020, 675);
    drawLink(1090, 625, 1020, 675);
}

function drawCircle(x, y, radius, gradientID, img, dog){

    // Append circle
    workspaceSVG.append("circle")
        .attr("class", "dogCircle")
        .attr("transform", "translate(" + x + "," + y + ")")
        .attr("r", radius)
        .attr("stroke", "black")
        .attr("stroke-width", "1.5")
        .attr("fill", gradientID);

    img_1 = "img/paw-4.png";

    // Append images
    workspaceSVG.append("svg:image")
        .attr("class", "pawImage")
        .attr("xlink:href",  img)
        .attr("transform", "translate(" + (x-radius-5) + "," + (y-radius-5) + ")")
        .attr("height", radius*2+10)
        .attr("width", radius*2+10)
        .on('mouseover', function() {
            d3.select(this)
                .attr("xlink:href",  img_1)
                .style("cursor", "pointer");
            infoSVG.selectAll(".info").remove()
            fillInfo(dog);
        })
        .on('mousemove',function() {
            d3.select(this)
                .attr("xlink:href",  img_1)
                .style("cursor", "pointer");
            infoSVG.selectAll(".info").remove()
            fillInfo(dog);
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr("xlink:href",  img)
                .style("cursor", "default");
            infoSVG.selectAll(".info").remove()
            infoSVG.append("text")
                .attr("class", "info")
                .text("Hover to fill Me!!")
                .attr("transform", "translate(" + 90 + "," + (infoHeight/2) + ")")
                .style("font-size","45px");  
        })
        .on('click', function() {
            d3.select(this)
                .attr("xlink:href",  img_1)
                .style("cursor", "pointer");
            infoSVG.selectAll(".info").remove()
            fillInfo(dog);
        });

    size = dog.length;
    // Append dog names
    workspaceSVG.append("text")
        .attr("transform", "translate(" + (x-size*4) + "," + (y-radius-8) + ")")
        .text(dog)
        .style("font-family","'Trebuchet MS', sans-serif")
        .style("fill", "white");

}

function drawSVG(){
    var dogName="";
    var circleJson = []

    // Create a json with number of circles and their radius : one per dog
    for (var i = 0; i < dogJson.length; i++) {
        record = {}
        if (dogName==""){
            dogName = dogJson[i]["name"];
            record["name"] = dogName;
            record["flight"] = dogJson[i]["flight"];
            record["circle_r"] = dogJson[i]["mission"];
            record["clusterID"] = 0;
            if (dogJson[i]["fate"].includes("Died")){
                record["fill"] = "red";
            }
            else{
                record["fill"] = "green";
            }
            circleJson.push(record);
        } else if (dogName == dogJson[i]["name"])
            continue;
        else{
            dogName = dogJson[i]["name"];
            record["name"] = dogName;
            record["flight"] = dogJson[i]["flight"];
            record["circle_r"] = dogJson[i]["mission"];
            record["clusterID"] = 0;
            if (dogJson[i]["fate"].includes("Died")){
                record["fill"] = "red";
            }
            else{
                record["fill"] = "green";
            }
            circleJson.push(record);
        }
    }

    // Appending cluster ID for each dog
    for (var i = 0; i < circleJson.length; i++) {
        ID = 0;
        dog = circleJson[i]["name"];
        // console.log(circleJson[i])
        for (var j = 0 ; j < clusterJson.length; j++){
            ID = clusterJson[j]["clusterID"];
            cluster = clusterJson[j]["clusterItems"];
            if (cluster.includes(dog)){
                circleJson[i]["clusterID"] = ID;
                break;
            }    
        }
    }

    // Sorting the json by cluster ID
    circleJson.sort(sortByProperty("clusterID"));

    // Gradient definition for circles
    var defs = workspaceSVG.append("defs");
    // Green radient for survied dogs
    var gradient = defs.append("radialGradient")
                    .attr("id", "greenGradient")
                    .attr("x1", "0%")
                    .attr("x2", "100%")
                    .attr("y1", "0%")
                    .attr("y2", "100%");
    gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", "#ffffff")
            .attr("stop-opacity", 1);
    gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#59de00")
            .attr("stop-opacity", 1);
    // Red radient for survied dogs
    var gradient = defs.append("radialGradient")
                    .attr("id", "redGradient")
                    .attr("x1", "0%")
                    .attr("x2", "100%")
                    .attr("y1", "0%")
                    .attr("y2", "100%");
    gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", "#ffffff")
            .attr("stop-opacity", 1);
    gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#de0021")
            .attr("stop-opacity", 1);

    // Appending Links
    drawLinks();

    // Drawing Circles
    n = circleJson.length
    for(var i = 0; i < n; i++){
        radius = circleJson[i]["circle_r"];
        img = "img/paw-2.png";
        dog = circleJson[i]["name"];
        flight = circleJson[i]["flight"];
        fill = circleJson[i]["fill"];
        clusterID = circleJson[i]["clusterID"];
        if (fill=="green"){
            gradientID = "url(#greenGradient)";
        }
        if (fill=="red"){
            gradientID = "url(#redGradient)";
        }
        switch(radius){
            case 1: radius = 20;
                    break;
            case 2: radius = 25;
                    break;
            case 3: radius = 30;
                    break;
            case 4: radius = 35;
                    break;
            case 7: radius = 55;
                    break;
        }
        
        // Drawing each cluster
        switch(clusterID){
            case 1: if(dog=="Dezik"){
                        drawCircle(50, 150, radius, gradientID, img, dog);
                        addText(35, 250, clusterID);
                    } else if (dog=="Tsygan"){
                        drawCircle(120, 200, radius, gradientID, img, dog);
                    } else if (dog=="Lisa"){
                        drawCircle(120, 100, radius, gradientID, img, dog);
                    }
                    break;
            case 2: if(dog=="Chizhik"){
                        drawCircle(200, 150, radius, gradientID, img, dog);
                        addText(210, 210, clusterID);
                    } else if (dog=="Mishka"){
                        drawCircle(320, 150, radius, gradientID, img, dog);
                    }
                    break;
            case 3: if(dog=="Smeliy"){
                        drawCircle(400, 100, radius, gradientID, img, dog);
                        addText(355, 250, clusterID);
                    } else if (dog=="Ryzhik"){
                        drawCircle(400, 200, radius, gradientID, img, dog);
                    }
                    break;
            case 4: if(dog=="Neputeviy"){
                        drawCircle(490, 150, radius, gradientID, img, dog);
                        addText(500, 210, clusterID);
                    } else if (dog=="ZIB"){
                        drawCircle(610, 150, radius, gradientID, img, dog);
                    }
                    break;
            case 5: if(dog=="Bulba"){
                        drawCircle(950, 100, radius, gradientID, img, dog);
                        addText(800, 250, clusterID);
                    } else if (dog=="Damka"){
                        drawCircle(780, 120, radius, gradientID, img, dog);
                    } else if (dog=="Mishka-2"){
                        drawCircle(690, 100, radius, gradientID, img, dog);
                    } else if (dog=="Ryzhik-2"){
                        drawCircle(730, 200, radius, gradientID, img, dog);
                    } else if (dog=="Lisa-2"){
                        drawCircle(875, 150, radius, gradientID, img, dog);
                    } else if (dog=="Ryzhik-3"){
                        drawCircle(950, 200, radius, gradientID, img, dog);
                    }
                    break;
            case 6: if(dog=="Dzhoyna"){
                        drawCircle(300, 470, radius, gradientID, img, dog);
                        addText(200, 520, clusterID);
                    } else if (dog=="Damka-2"){
                        drawCircle(250, 360, radius, gradientID, img, dog);
                    } else if (dog=="Belka"){
                        drawCircle(150, 380, radius, gradientID, img, dog);
                    } else if (dog=="Albina"){
                        drawCircle(480, 360, radius, gradientID, img, dog);
                    } else if (dog=="Strelka"){
                        drawCircle(50, 460, radius, gradientID, img, dog);
                    } else if (dog=="Modnitsa"){
                        drawCircle(50, 350, radius, gradientID, img, dog);
                    } else if (dog=="Kozyavka"){
                        drawCircle(370, 380, radius, gradientID, img, dog);
                    } else if (dog=="Ryzhaya"){
                        drawCircle(210, 470, radius, gradientID, img, dog);
                    }
                    break;
            case 7: if(dog=="Laika"){
                        drawCircle(1065, 160, radius, gradientID, img, dog);
                        addText(1020, 210, clusterID);
                    }
                    break;
            case 8: if(dog=="Pushok"){
                        drawCircle(570, 375, radius, gradientID, img, dog);
                        addText(525, 520, clusterID);
                    } else if (dog=="Palma"){
                        drawCircle(570, 475, radius, gradientID, img, dog);
                    }
                    break;
            case 9: if(dog=="Palma-2"){
                        drawCircle(680, 350, radius, gradientID, img, dog);
                        addText(765, 520, clusterID);
                    } else if (dog=="Kusachka"){
                        drawCircle(810, 400, radius, gradientID, img, dog);
                    } else if (dog=="Snezhinka"){
                        drawCircle(940, 350, radius, gradientID, img, dog);
                    } else if (dog=="Neva"){
                        drawCircle(940, 470, radius, gradientID, img, dog);
                    } else if (dog=="Malyok"){
                        drawCircle(680, 470, radius, gradientID, img, dog);
                    }
                    break;            
            case 10: if(dog=="Pestraya"){
                        drawCircle(1050, 375, radius, gradientID, img, dog);
                        addText(1005, 520, clusterID);
                    } else if (dog=="Belyanka"){
                        drawCircle(1050, 475, radius, gradientID, img, dog);
                    }
                    break;
            case 11: if(dog=="Lisichka"){
                        drawCircle(80, 610, radius, gradientID, img, dog);
                        addText(35, 760, clusterID);
                    } else if (dog=="Bars"){
                        drawCircle(80, 710, radius, gradientID, img, dog);
                    }
                    break;
            case 12: if(dog=="Mushka"){
                        drawCircle(180, 660, radius, gradientID, img, dog);
                        addText(180, 710, clusterID);
                    } else if (dog=="Pchyolka"){
                        drawCircle(280, 660, radius, gradientID, img, dog);
                    }
                    break;
            case 13: if(dog=="Shutka"){
                        drawCircle(380, 610, radius, gradientID, img, dog);
                        addText(335, 760, clusterID);
                    } else if (dog=="Kometka"){
                        drawCircle(380, 710, radius, gradientID, img, dog);
                    }
                    break;
            case 14: if(dog=="Chernuskha"){
                        drawCircle(500, 660, radius, gradientID, img, dog);
                        addText(450, 710, clusterID);
                    }
                    break;
            case 15: if(dog=="Zvezdochka"){
                        drawCircle(630, 660, radius, gradientID, img, dog);
                        addText(580, 710, clusterID);
                    }
                    break;
            case 16: if(dog=="Ugolyok"){
                        drawCircle(750, 610, radius, gradientID, img, dog);
                        addText(705, 760, clusterID);
                    } else if (dog=="Veterok"){
                        drawCircle(750, 710, radius, gradientID, img, dog);
                    }
                    break;
            case 17: if(dog=="Malyshka"){
                        drawCircle(940, 705, radius, gradientID, img, dog);
                        addText(930, 760, clusterID);
                    } else if (dog=="Linda"){
                        drawCircle(920, 615, radius, gradientID, img, dog);
                    } else if (dog=="Knopka"){
                        drawCircle(1020, 675, radius, gradientID, img, dog);
                    } else if (dog=="Rita"){
                        drawCircle(840, 665, radius, gradientID, img, dog);
                    } else if (dog=="Zhulba"){
                        drawCircle(1090, 625, radius, gradientID, img, dog);
                    }
                    break;
        }
    }
}

function fillInfo(dog){

    // Initializing hover variables
    var gender;
    var flights = [];
    var fate;
    var noOfMission;
    var clusterID;
    var clusterItems;
    var note;

    for(var i = 0; i < dogJson.length; i++){  
        if(dog == dogJson[i]["name"]){
            gender = dogJson[i]["gender"];
            flights.push(dogJson[i]["flight"]);
            fate = dogJson[i]["fate"];
            noOfMission = dogJson[i]["mission"];
            note = dogJson[i]["note"];
        }
    }

    for(var i = 0; i < clusterJson.length; i++){
        if(clusterJson[i]["clusterItems"].includes(dog)){
            clusterID = clusterJson[i]["clusterID"];
            clusterItems = clusterJson[i]["clusterItems"];
            break;
        }
    }
    
    // Appending Name on Hover
    infoSVG.append("text")
            .attr("class", "info")
            .text("Name")
            .attr("transform", "translate(" + 30 + "," + 100 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text("-")
            .attr("transform", "translate(" + 170 + "," + 100 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(dog)
            .attr("transform", "translate(" + 190 + "," + 100 + ")")
            .style("font-size","20px")
            .style("fill", "#333152");
    
    // Appending Gender on Hover
    infoSVG.append("text")
            .attr("class", "info")
            .text("Gender")
            .attr("transform", "translate(" + 30 + "," + 140 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text("-")
            .attr("transform", "translate(" + 170 + "," + 140 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(gender)
            .attr("transform", "translate(" + 190 + "," + 140 + ")")
            .style("font-size","20px")
            .style("fill", "#333152");

    // Appending Mission Count on Hover
    infoSVG.append("text")
            .attr("class", "info")
            .text("No. of Mission")
            .attr("transform", "translate(" + 30 + "," + 180 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text("-")
            .attr("transform", "translate(" + 170 + "," + 180 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(noOfMission)
            .attr("transform", "translate(" + 190 + "," + 180 + ")")
            .style("font-size","20px")
            .style("fill", "#333152");
    
    // Appending Fate on Hover
    infoSVG.append("text")
            .attr("class", "info")
            .text("Fate")
            .attr("transform", "translate(" + 30 + "," + 220 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text("-")
            .attr("transform", "translate(" + 170 + "," + 220 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(fate)
            .attr("transform", "translate(" + 190 + "," + 220 + ")")
            .style("font-size","20px")
            .style("fill", "#333152");
            
    // Appending ClusterID on Hover
    infoSVG.append("text")
            .attr("class", "info")
            .text("Cluster ID")
            .attr("transform", "translate(" + 30 + "," + 260 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text("-")
            .attr("transform", "translate(" + 170 + "," + 260 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(clusterID)
            .attr("transform", "translate(" + 190 + "," + 260 + ")")
            .style("font-size","20px")
            .style("fill", "#333152");

    // Appending ClusterItems on Hover
    infoSVG.append("text")
            .attr("class", "info")
            .text("Flew with")
            .attr("transform", "translate(" + 30 + "," + 300 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text("-")
            .attr("transform", "translate(" + 170 + "," + 300 + ")")
            .style("font-size","20px");
    
    x = 190;
    y = 300;
    n = clusterItems.length
    if(n==1){
        infoSVG.append("text")
                .attr("class", "info")
                .text("- None -")
                .attr("transform", "translate(" + x + "," + y + ")")
                .style("font-size","20px")
                .style("fill", "#333152");
    }
    else{
        for (var i = 0; i < n; i++){
            if(dog!=clusterItems[i]){
                infoSVG.append("text")
                        .attr("class", "info")
                        .text(clusterItems[i])
                        .attr("transform", "translate(" + x + "," + y + ")")
                        .style("font-size","20px")
                        .style("fill", "#333152");
                x += 120;
                if(x>390 && i!=n-1){
                    x = 190;
                    y += 40;
                }
            }
        }
        if(dog=="Snezhinka"||dog=="Tsygan"){
            y -= 40;
        }
    }

    y += 40;

    // Appending Flights on Hover
    infoSVG.append("text")
            .attr("class", "info")
            .text("Flights")
            .attr("transform", "translate(" + 30 + "," + y + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text("-")
            .attr("transform", "translate(" + 170 + "," + y + ")")
            .style("font-size","20px");
    x = 190;
    n = flights.length;
    for (var i = 0; i < flights.length; i++){
        infoSVG.append("text")
            .attr("class", "info")
            .text(flights[i])
            .attr("transform", "translate(" + x + "," + y + ")")
            .style("font-size","20px")
            .style("fill", "#333152");
        x += 120;
        if(x>390 && i!=n-1){
            x = 190;
            y += 40;
        }
    }
}

function fillClusterInfo(clusterID){

    var clusterItems;
    var femaleDogs = [];
    var maleDogs = [];
    var aliveDogs = [];
    var deadDogs = [];

    // Adding Cluster ID
    infoSVG.append("text")
            .attr("class", "info")
            .text("Cluster ID - ")
            .attr("transform", "translate(" + 195 + "," + 100 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(clusterID)
            .attr("transform", "translate(" + 305 + "," + 100 + ")")
            .style("font-size","20px")
            .style("fill", "#D93563");

    n = clusterJson.length;
    for (var i = 0; i < n; i++){
        if(clusterID==clusterJson[i]["clusterID"]){
            clusterItems = clusterJson[i]["clusterItems"];
        }
    }

    // Adding Cluster Members
    infoSVG.append("text")
            .attr("class", "info")
            .text("Cluster Members")
            .attr("transform", "translate(" + 30 + "," + 140 + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(":")
            .attr("transform", "translate(" + 190 + "," + 140 + ")")
            .style("font-size","20px");
    
    x = 220;
    y = 140;
    n = clusterItems.length;
    for (var i = 0; i < clusterItems.length; i++){
        infoSVG.append("text")
            .attr("class", "info")
            .text(clusterItems[i])
            .attr("transform", "translate(" + x + "," + y + ")")
            .style("font-size","20px")
            .style("fill", "#333152");
        x += 120;
        if(x>390 && i!=n-1){
            x = 220;
            y += 40;
        }
    }

    for (var i = 0; i < clusterItems.length; i++){
        dogName = clusterItems[i];
        for (var j = 0; j < dogJson.length; j++){
            if(dogName == dogJson[j]["name"]){
                if(dogJson[j]["gender"]=="Female" && !femaleDogs.includes(dogName)){
                    femaleDogs.push(dogName);
                }
                if(dogJson[j]["gender"]=="Male" && !maleDogs.includes(dogName)){
                    maleDogs.push(dogName)
                }
                if(dogJson[j]["fate"].includes("Survived") && !aliveDogs.includes(dogName)){
                    aliveDogs.push(dogName)
                }
                if(dogJson[j]["fate"].includes("Died") && !deadDogs.includes(dogName)){
                    deadDogs.push(dogName)
                }
            }
        }
    }

    // Adding Gender Info
    y += 40;
    // For Female Dogs
    infoSVG.append("text")
            .attr("class", "info")
            .text("Female Dogs")
            .attr("transform", "translate(" + 30 + "," + y + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(":")
            .attr("transform", "translate(" + 190 + "," + y + ")")
            .style("font-size","20px");
    
    x = 220;
    n = femaleDogs.length;
    if(n==0){
        infoSVG.append("text")
                .attr("class", "info")
                .text("- None -")
                .attr("transform", "translate(" + x + "," + y + ")")
                .style("font-size","20px")
                .style("fill", "#333152");
    }
    else{
        for (var i = 0; i < n; i++){
            if(clusterID==6){
                infoSVG.append("text")
                    .attr("class", "info")
                    .text("All")
                    .attr("transform", "translate(" + x + "," + y + ")")
                    .style("font-size","20px")
                    .style("fill", "#333152");
            }
            else{
                infoSVG.append("text")
                    .attr("class", "info")
                    .text(femaleDogs[i])
                    .attr("transform", "translate(" + x + "," + y + ")")
                    .style("font-size","20px")
                    .style("fill", "#333152");
                x += 120;
                if(x>390 && i!=n-1){
                    x = 220;
                    y += 40;
                }
            }
        }
    }
    y += 40;
    // For Male Dogs
    infoSVG.append("text")
            .attr("class", "info")
            .text("Male Dogs")
            .attr("transform", "translate(" + 30 + "," + y + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(":")
            .attr("transform", "translate(" + 190 + "," + y + ")")
            .style("font-size","20px");
    
    x = 220;
    n = maleDogs.length;
    if(n==0){
        infoSVG.append("text")
                .attr("class", "info")
                .text("- None -")
                .attr("transform", "translate(" + x + "," + y + ")")
                .style("font-size","20px")
                .style("fill", "#333152");
    }
    else{
        for (var i = 0; i < n; i++){
            infoSVG.append("text")
                .attr("class", "info")
                .text(maleDogs[i])
                .attr("transform", "translate(" + x + "," + y + ")")
                .style("font-size","20px")
                .style("fill", "#333152");
            x += 120;
            if(x>390 && i!=n-1){
                x = 220;
                y += 40;
            }
        }
    }
    // Adding Fate Info
    y += 40;
    // For Alive Dogs
    infoSVG.append("text")
            .attr("class", "info")
            .text("Survived")
            .attr("transform", "translate(" + 30 + "," + y + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(":")
            .attr("transform", "translate(" + 190 + "," + y + ")")
            .style("font-size","20px");
    x = 220;
    n = aliveDogs.length;
    if(n==0){
        infoSVG.append("text")
                .attr("class", "info")
                .text("- None -")
                .attr("transform", "translate(" + x + "," + y + ")")
                .style("font-size","20px")
                .style("fill", "#333152");
    }
    else{
        for (var i = 0; i < n; i++){
            infoSVG.append("text")
                .attr("class", "info")
                .text(aliveDogs[i])
                .attr("transform", "translate(" + x + "," + y + ")")
                .style("font-size","20px")
                .style("fill", "#333152");
            x += 120;
            if(x>390 && i!=n-1){
                x = 220;
                y += 40;
            }
        }
    }

    y += 40;
    // For Dead Dogs
    infoSVG.append("text")
            .attr("class", "info")
            .text("Died")
            .attr("transform", "translate(" + 30 + "," + y + ")")
            .style("font-size","20px");
    infoSVG.append("text")
            .attr("class", "info")
            .text(":")
            .attr("transform", "translate(" + 190 + "," + y + ")")
            .style("font-size","20px");
    x = 220;
    n = deadDogs.length;
    if(n==0){
        infoSVG.append("text")
                .attr("class", "info")
                .text("- None -")
                .attr("transform", "translate(" + x + "," + y + ")")
                .style("font-size","20px")
                .style("fill", "#333152");
    }
    else{
        for (var i = 0; i < n; i++){
            infoSVG.append("text")
                .attr("class", "info")
                .text(deadDogs[i])
                .attr("transform", "translate(" + x + "," + y + ")")
                .style("font-size","20px")
                .style("fill", "#333152");
            x += 120;
            if(x>390 && i!=n-1){
                x = 220;
                y += 40;
            }
        }
    }
}