var json = $.getJSON("learningpath.json", function (json) {
    ShowDataOnCanvas(json);
});

var lineWidth = 5;
var cols = 3;
var rows = 2;
var distance = 50;

var Circle = function (circleX, circleY, radius, color, description) {

    this.circleX = circleX;
    this.circleY = circleY;
    this.radius = radius;
    this.color = color;

    this.draw = function (pathCanvas) {
        var c = document.getElementById(pathCanvas);
        var ctx = c.getContext("2d");
        ctx.fillText(description, circleX, 10, 100);
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.circleX, this.circleY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    };
};

function ShowDataOnCanvas(obj) {
    var circles = [];
    var circleX = 100;
    for (var i = 0; i < obj.length; i++) {
        circles.push(new Circle(circleX, 40, 20, "black", obj[i].description));
        circles[i].draw("pathCanvas");
        circleX += 100;
    }
}