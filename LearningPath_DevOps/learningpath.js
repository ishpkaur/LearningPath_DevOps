$(document).ready(function() {
    var data = $.getJSON("learningpath.json", function(json) {
            showDataOnCanvas(json);
        });
    var c = document.getElementById("pathCanvas");
    var ctx = c.getContext("2d");

    var Circle = function (circleX, circleY, radius, color, description) {

        this.circleX = circleX;
        this.circleY = circleY;
        this.radius = radius;
        this.color = color;
        this.drawCircle = function() {
            ctx.beginPath();
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            multiFillText(description, circleX, circleY - 55, 12, 80);
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
        }

        this.drawBadge = function(spikes, outerRadius, innerRadius,backgroundColor, strokeColor) {
            var rot = Math.PI / 2 * 3;
            var x = this.circleX;
            var y = this.circleY;
            var step = Math.PI / spikes;


            ctx.save();
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
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
            ctx.fillStyle = backgroundColor;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            ctx.save();
            ctx.font = "16px";
            //ctx.textBaseline = "middle";
            multiFillText(description, circleX, circleY, 12, 80);
            ctx.restore();
        }

    };

    function showDataOnCanvas(obj) {
        var circles = [];

        var circleX = 60;
        var circleY = 70;
        for (var i = 0; i < obj.length; i++) {
            var lineLeftX = circleX + 15;
            if (Array.isArray(obj[i])) {
                if (i === 0) {
                    circleY += 180;
                } else {
                    circleY += 120;
                }
                circleX = 60;
                for (var j = 0; j < obj[i].length; j++) {
                    lineLeftX = circleX + 15;
                    circles.push(new Circle(circleX, circleY, 15, "black", obj[i][j].description));
                    if (obj[i][j].type === "circle") {
                        circles[circles.length - 1].drawCircle();
                        if ((j + 1) !== obj[i].length) {
                            circles[i].drawLine(lineLeftX, lineLeftX + 50, circleY, obj[i][j].color);
                        }
                            
                    }
                    if (obj[i][j].type === "badge") {
                        circles[circles.length - 1].drawBadge(16, 35, 25, "silver", obj[i][j].color);
                        if ((j + 1) !== obj[i].length) {
                            circles[i].drawLine(lineLeftX + 15, lineLeftX + 50, circleY, obj[i][j].color);
                        }
                    }
                    circleX += 80;
                }
                continue;
            }
            
            circles.push(new Circle(circleX, circleY, 15, "black", obj[i].description));
            if (obj[i].type === "circle") {
                circles[i].drawCircle();
                if ((i + 1) !== obj.length) {
                    circles[i].drawLine(lineLeftX, lineLeftX + 50, circleY, obj[i].color);
                }
                
            }
                
            if (obj[i].type === "badge")
                circles[i].drawBadge(16, 35, 25, "#CD853F", obj[i].color);
            circleX += 80;
        }
    }


    var multiFillText = function (text, x, y, lineHeight, fitWidth) {
        var draw = x !== null && y !== null;

        text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
        sections = text.split("\n");

        var i,
            str,
            wordWidth,
            words,
            currentLine = 0,
            maxHeight = 0,
            maxWidth = 0;

        var printNextLine = function (str) {
            if (draw) {
                ctx.fillText(str, x, y + (lineHeight * currentLine));
            }

            currentLine++;
            wordWidth = ctx.measureText(str).width;
            if (wordWidth > maxWidth) {
                maxWidth = wordWidth;
            }
        };

        for (i = 0; i < sections.length; i++) {
            words = sections[i].split(' ');
            index = 1;

            while (words.length > 0 && index <= words.length) {

                str = words.slice(0, index).join(' ');
                wordWidth = ctx.measureText(str).width;

                if (wordWidth > fitWidth) {
                    if (index === 1) {
                        str = words.slice(0, 1).join(' ');
                        words = words.splice(1);
                    } else {
                        str = words.slice(0, index - 1).join(' ');
                        words = words.splice(index - 1);
                    }

                    printNextLine(str);

                    index = 1;
                } else {
                    index++;
                }
            }
            if (index > 0) {
                printNextLine(words.join(' '));
            }
        }

        maxHeight = lineHeight * (currentLine);

        if (!draw) {
            return {
                height: maxHeight,
                width: maxWidth
            };
        }
    };

    var multiMeasureText = function (text, lineHeight, fitWidth) {
        return multiFillText(text, null, null, lineHeight, fitWidth);
    }
});