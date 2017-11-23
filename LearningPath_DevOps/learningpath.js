var json = $.getJSON("learningpath.json", function (json) {
    //console.log(json);
    ShowDataOnCanvas(json);
    //return json;
});
/*
function ShowDataOnCanvas(obj) {
    var canvas = document.getElementById("pathCanvas");
    var ctx = canvas.getContext("2d");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 25;
    var objLength = obj.length;
    var circles = [];
    for (var i = 0; i < objLength; i++) {
        ctx.fillText(obj.description, 50, 10);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.closePath();
    }
    console.log(obj.description);  
}
*/

var Circle = function (circleX, circleY, radius, color) {

    this.circleX = circleX;
    this.circleY = circleY;
    this.radius = radius;
    this.color = color;

    this.draw = function (pathCanvas) {
        var c = document.getElementById(pathCanvas);
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.circleX, this.circleY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    };
};
function ShowDataOnCanvas(obj) {
    var circles = [];

    //circles.push(new Circle(100, 40, 30, "black"));
    //circles.push(new Circle(205, 40, 30, "red"));
    //circles.push(new Circle(310, 40, 30, "green"));
    //circles.push(new Circle(415, 40, 30, "yellow"));
    //circles.push(new Circle(520, 40, 30, "blue"));
    //circles.push(new Circle(625, 40, 30, "brown"));
    var circleX = 100;
    for (var i = 0; i < obj.length; i++) {
        circles.push(new Circle(circleX, 40, 30, "black"));
        circles[i].draw("pathCanvas");
        circleX += 100;
    }
}