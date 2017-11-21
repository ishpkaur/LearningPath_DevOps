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
    var circle_Count = 3;
    var distance_Between = canvas.width / (circle_Count + 1);
    for (var i = 0; i < circle_Count; i++) {
        ctx.fillText(obj.description, 50, 10);
        ctx.beginPath();
        ctx.arc(distance_Between * (i + 1), centerY, radius, 0, 2 * Math.PI, true);
        //ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.closePath();
    }
    console.log(obj.description);
    // console.log(json);
}
// console.log(json);