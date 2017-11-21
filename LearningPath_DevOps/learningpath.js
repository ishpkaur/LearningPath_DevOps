var json = $.getJSON("learningpath.json", function (json) {
    //console.log(json);
    ShowDataOnCanvas(json);
    //return json;
});

function ShowDataOnCanvas(obj) {
    var canvas = document.getElementById("pathCanvas");
    var ctx = canvas.getContext("2d");

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 25;
    ctx.fillText(obj.description, 50, 10);
    ctx.beginPath();
    //ctx.arc(distance_Between * (i + 1), centerY, radius, 0, 2 * Math.PI, true);
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    console.log(obj.description);
    // console.log(json);
}
// console.log(json);

// $(document).ready(function() {
function init() {
    if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make; // for conciseness in defining templates

    // a collection of colors
    var colors = {
        blue: "#00B5CB",
        orange: "#F47321",
        green: "#C8DA2B",
        gray: "#888",
        white: "#F5F5F5",
        yellow: "#f4e842"
    }

    // The first Diagram showcases what the Nodes might look like "in action"
    myDiagram = $(go.Diagram,
        "myDiagramDiv",
        {
            initialContentAlignment: go.Spot.Center,
            "undoManager.isEnabled": true,
            layout: $(go.TreeLayout)
        });

    // "icons" is defined in icons.js

    // A data binding conversion function. Given an icon name, return a Geometry.
    // This assumes that all icons want to be filled.
    // This caches the Geometry, because the Geometry may be shared by multiple Shapes.
    function geoFunc(geoname) {
        var geo = icons[geoname];
        if (geo === undefined) geo = "heart"; // use this for an unknown icon name
        if (typeof geo === "string") {
            geo = icons[geoname] = go.Geometry.parse(geo, true); // fill each geometry
        }
        return geo;
    }

    // Define a simple template consisting of the icon surrounded by a filled circle
    myDiagram.nodeTemplate =
        $(go.Node,
            "Auto",
            $(go.Shape,
                "Circle",
                { fill: "lightcoral", strokeWidth: 4, stroke: colors["gray"], width: 60, height: 60 },
                new go.Binding("fill", "color")),
            $(go.Shape,
                { margin: 3, fill: colors["white"], strokeWidth: 0 },
                new go.Binding("geometry", "geo", geoFunc)),
            // Each node has a tooltip that reveals the name of its icon
            {
                toolTip:
                    $(go.Adornment,
                        "Auto",
                        $(go.Shape, { fill: "LightYellow", stroke: colors["gray"], strokeWidth: 2 }),
                        $(go.TextBlock,
                            { margin: 8, stroke: colors["gray"], font: "bold 16px sans-serif" },
                            new go.Binding("text", "geo")))
            }
        );

    // Define a Link template that routes orthogonally, with no arrowhead
    myDiagram.linkTemplate =
        $(go.Link,
            { routing: go.Link.Orthogonal, corner: 5, toShortLength: -2, fromShortLength: -2 },
            $(go.Shape, { strokeWidth: 5, stroke: colors["yellow"] })); // the link shape

    // Create the model data that will be represented by Nodes and Links
    myDiagram.model = new go.GraphLinksModel(
        [
            { key: 1, geo: "file", color: colors["blue"] },
            { key: 2, geo: "alarm", color: colors["orange"] },
            { key: 3, geo: "lab", color: colors["blue"] },
            { key: 4, geo: "earth", color: colors["blue"] },
            { key: 5, geo: "heart", color: colors["green"] },
            { key: 6, geo: "arrow-up-right", color: colors["blue"] },
            { key: 7, geo: "html5", color: colors["orange"] },
            { key: 8, geo: "twitter", color: colors["orange"] }
        ],
        [
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
            { from: 4, to: 5 },
            { from: 4, to: 6 },
            { from: 3, to: 7 },
            { from: 3, to: 8 }
        ]);


    // The second Diagram showcases every icon in icons.js
    myDiagram2 = $(go.Diagram,
        "myDiagram2",
        { // share node templates between both Diagrams
            nodeTemplate: myDiagram.nodeTemplate,
            // simple grid layout
            layout: $(go.GridLayout)
        });

    // Convert the icons collection into an Array of JavaScript objects
    var nodeArray = [];
    for (var k in icons) {
        nodeArray.push({ geo: k, color: colors["blue"] });
    }
    myDiagram2.model.nodeDataArray = nodeArray;
}
// document.ready});