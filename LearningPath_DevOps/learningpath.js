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
    var radius = 50;
    ctx.fillText(obj.description, 50, 10);
    ctx.beginPath();
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