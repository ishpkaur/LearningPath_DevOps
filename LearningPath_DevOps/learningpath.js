$(document).ready(function() {
    var json = $.getJSON("learningpath.json",
        function(json) {
            ShowDataOnCanvas(json);
        });
    var c = document.getElementById("pathCanvas");
    var ctx = c.getContext("2d");
    var Circle = function(circleX, circleY, radius, color, description) {

        this.circleX = circleX;
        this.circleY = circleY;
        this.radius = radius;
        this.color = color;

        this.drawCircle = function() {
            ctx.beginPath();
            ctx.fillText(description, circleX, circleY - 30);
            ctx.fillStyle = "black";
            ctx.strokeStyle = this.color;
            ctx.arc(this.circleX, this.circleY, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        };
        this.drawLines = function () {


        };
        this.drawBadge = function(spikes, outerRadius, innerRadius) {
            ctx.save();
            var rot = Math.PI / 2 * 3;
            var x = this.circleX;
            var y = this.circleY;
            var step = Math.PI / spikes;

            ctx.strokeSyle = "#000";
            ctx.beginPath();
            ctx.moveTo(this.circleX, this.circleY - outerRadius);
            for (var i = 0; i < spikes; i++) {
                x = this.circleX + Math.cos(rot) * outerRadius;
                y = this.circleY + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = this.circleX + Math.cos(rot) * innerRadius;
                y = this.circleY + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(this.circleX, this.circleY - outerRadius);
            ctx.closePath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "orange";
            ctx.stroke();
            ctx.fillStyle = "rgba(154, 71, 14, 0.4)";
            ctx.fill();
            ctx.restore();
        }

    };

    function ShowDataOnCanvas(obj) {
        var circles = [];

        var circleX = 100;
        var circleY = 40;
        for (var i = 0; i < obj.length; i++) {
            if (Array.isArray(obj[i])) {
                circleY += 100;
                circleX = 100;
                for (var j = 0; j < obj[i].length; j++) {
                    var index = i + j;
                    circles.push(new Circle(circleX, circleY, 20, "black", obj[i][j].description));
                    if (obj[i][j].type === "circle")
                        circles[index].drawCircle();
                    circleX += 100;
                }
                continue;
            }
            circles.push(new Circle(circleX, circleY, 20, "black", obj[i].description));
            if (obj[i].type === "circle")
                circles[i].drawCircle();
            if (obj[i].type === "badge")
                circles[i].drawBadge(20, 30, 25);
            circleX += 100;
        }
    }
});