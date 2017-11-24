$(document).ready(function() {
    var data = $.getJSON("learningpath.json", function(json) {
            showDataOnCanvas(json);
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
            ctx.textAlign = "center";
            var test = getLines(ctx, description, 40);
            ctx.fillText(test, circleX, circleY - 30);
            ctx.strokeStyle = this.color;
            ctx.arc(this.circleX, this.circleY, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        };

        this.drawLine = function (lineLeftX, lineRightX, posY, lineColor) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(lineLeftX, posY);
            ctx.lineTo(lineRightX, posY);
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.restore();
            //ctx.closePath();
        }

        this.drawBadge = function(spikes, outerRadius, innerRadius) {
            var rot = Math.PI / 2 * 3;
            var x = this.circleX;
            var y = this.circleY;
            var step = Math.PI / spikes;

            ctx.save();
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
            ctx.strokeStyle = "blue";
            ctx.stroke();
            ctx.fillStyle = "skyblue";
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }

    };

    function showDataOnCanvas(obj) {
        var circles = [];

        var circleX = 100;
        var circleY = 40;
        for (var i = 0; i < obj.length; i++) {
            var lineLeftX = circleX + 20;
            if (Array.isArray(obj[i])) {
                circleY += 100;
                circleX = 100;
                for (var j = 0; j < obj[i].length; j++) {
                    lineLeftX = circleX + 20;
                    // var index = i + j;
                    circles.push(new Circle(circleX, circleY, 20, "black", obj[i][j].description));
                    if (obj[i][j].type === "circle") {
                        circles[circles.length - 1].drawCircle();
                        if ((j + 1) !== obj[i].length) {
                            circles[i].drawLine(lineLeftX, lineLeftX + 60, circleY, obj[i][j].color);
                        }
                            
                    }
                        
                    circleX += 100;
                }
                continue;
            }
            
            circles.push(new Circle(circleX, circleY, 20, "black", obj[i].description));
            if (obj[i].type === "circle") {
                circles[i].drawCircle();
                if ((i + 1) !== obj.length) {
                    circles[i].drawLine(lineLeftX, lineLeftX + 60, circleY, obj[i].color);
                }
                
            }
                
            if (obj[i].type === "badge")
                circles[i].drawBadge(20, 30, 25);circleX += 100;
            
        }
    }

    function getLines(contx, text, maxWidth) {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];

        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = contx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
});