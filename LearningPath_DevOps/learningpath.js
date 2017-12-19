"use strict";

$(document).ready(function() {
    
    var data = $.getJSON("learningpath.json", function(json) {
        init(json);  
    });
});

function init(data) {
    var c = document.getElementById("pathCanvas");
    var ctx = c.getContext("2d");
    var scale = 1;
    var zoom = 0.25;
    var zoomFactor;
    var iw = c.width;
    var ih = c.height;
    c.addEventListener('mouseout', showDataOnCanvas, false);
    c.addEventListener('mousemove', move, false);

    var circleBadgeList = showDataOnCanvas(data);
    circleBadgeList.forEach(function(circlesBadges) {
        if (Array.isArray(circlesBadges)) {
            circlesBadges.forEach(function(circleBadge) {
                if (circleBadge.type === "circle") {
                    circleBadge.drawCircle();
                }

                if (circleBadge.type === "badge" || circleBadge.type === "goldbadge") {
                    circleBadge.drawBadge();
                }
            });
        }

        if (circlesBadges.type === "circle") {
            circlesBadges.drawCircle();
        }

        if (circlesBadges.type === "badge" || circlesBadges.type === "goldbadge") {
            circlesBadges.drawBadge();
        }
    });


    $("#pathCanvas").on("click", function (evt) {
        var mousePos = getMousePos(c, evt);
        circleBadgeList.forEach(function (circlesBadges) {
            if (Array.isArray(circlesBadges)) {
                circlesBadges.forEach(function (circleBadge) {
                    if (Math.pow(mousePos.x - circleBadge.circleX, 2) + Math.pow(mousePos.y - circleBadge.circleY, 2) < Math.pow(circleBadge.radius, 2)) {
                        console.log("You clicked circle with ID: " + circleBadge.Id);
                    }
                }); 
            }
            
            if (Math.pow(mousePos.x - circlesBadges.circleX, 2) + Math.pow(mousePos.y - circlesBadges.circleY, 2) < Math.pow(circlesBadges.radius, 2)) {
                console.log("You clicked circle with ID: " + circlesBadges.Id);
            }
        });
        // console.log("Mouse position: " + mousePos.x + "," + mousePos.y);
    });
    
    function move(e) {
        var pos = getMousePos(c, e);
        var x = pos.x;
        var y = pos.y;
        ctx.scale(-x, -y, iw, ih);  //still to implement
       // ctx.showDataOnCanvas(data, -x, -y, iw, ih);
    }
    function getMousePos(c, evt) {
        var rect = c.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    function scale() {
        ctx.showDataOnCanvas(); // still to implement
    }
    //$("#zoomIn").on("click", function () {
    //    //var w = parseInt(c.style.width);
    //    //var h = parseInt(c.style.height);
    //    //w = w * 1.1;
    //    //h = h * 1.1;
    //    //c.style.width = w + "px";
    //    //c.style.height = h + "px";
    //    scale += .1;
    //    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //    ctx.canvas.width = ctx.canvas.width * scale;
    //    ctx.canvas.height = ctx.canvas.height * scale;
    //    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //    ctx.scale(scale, scale);


    //    $.getJSON("learningpath.json", function (json) {
    //        showDataOnCanvas(json);
    //    });
    //});

    //$("#zoomOut").on("click", function () {
    //    //var scale = 1 / 1.1;
    //    scale -= .1;

    //    //var w = parseInt(c.style.width);
    //    //var h = parseInt(c.style.height);
    //    //w = w * scale;
    //    //h = h * scale;
    //    //c.style.width = w + "px";
    //    //c.style.height = h + "px";
    //    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //    ctx.canvas.width = ctx.canvas.width / scale;
    //    ctx.canvas.height = ctx.canvas.height / scale;
    //    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //    ctx.scale(scale, scale);


    //    $.getJSON("learningpath.json", function (json) {
    //        showDataOnCanvas(json);
    //    });
    //});

    function drawPinkRectangle(posX, posY, color) {
        posX = posX - 70;
        posY = posY - 60;
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(posX, posY, 140, 120);
        ctx.restore();
    };

    function multiFillText(text, x, y, lineHeight, fitWidth) {
        var draw = x !== null && y !== null;

        text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
        var sections = text.split("\n");

        var i,
            str,
            wordWidth,
            words,
            currentLine = 0,
            maxHeight = 0,
            maxWidth = 0;

        var printNextLine = function (str) {
            if (draw) {
                ctx.fillText(str, x, y + lineHeight * currentLine);
            }

            currentLine++;
            wordWidth = ctx.measureText(str).width;
            if (wordWidth > maxWidth) {
                maxWidth = wordWidth;
            }
        };

        for (i = 0; i < sections.length; i++) {
            words = sections[i].split(' ');
            var index = 1;

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

        maxHeight = lineHeight * currentLine;

        if (!draw) {
            return {
                height: maxHeight,
                width: maxWidth
            };
        }
    };

    function multiMeasureText(text, lineHeight, fitWidth) {
        return multiFillText(text, null, null, lineHeight, fitWidth);
    };

    function drawSplitLines(posX, posY, lineColor, pathCount) {
        var endPosY = pathCount * 120 + (posY + 130);
        ctx.save();

        // Go down from badge
        ctx.beginPath();
        ctx.moveTo(posX - 80, posY + 35);
        ctx.lineTo(posX - 80, posY + 100);
        ctx.strokeStyle = lineColor;
        ctx.stroke();

        // Go left
        ctx.moveTo(posX - 80, posY + 100);
        ctx.lineTo(100 - 50, posY + 100);
        ctx.strokeStyle = lineColor;
        ctx.stroke();


        // Go down final time
        ctx.moveTo(100 - 50, posY + 100);
        ctx.lineTo(100 - 50, endPosY);
        ctx.strokeStyle = lineColor;
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    };

    function Circle(id, circleX, circleY, radius, color, description, type, expandable) {

        this.Id = id;
        this.circleX = circleX;
        this.circleY = circleY;
        this.radius = radius;
        this.color = color;
        this.type = type;
        this.expandable = expandable;
        this.drawCircle = function () {
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
        };

        
    };

    function Badge(id, posX, posY, spikes, outerRadius, innerRadius, fillColor, strokeColor, description, type, expandable) {

        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.spikes = spikes;
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.description = description;
        this.type = type;
        this.expandable = expandable;

        this.drawBadge = function () {
            var rot = Math.PI / 2 * 3;
            var x = this.posX;
            var y = this.posY;
            var step = Math.PI / spikes;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.posX, this.posY - outerRadius);
            for (var i = 0; i < spikes; i++) {
                x = this.posX + Math.cos(rot) * outerRadius;
                y = this.posY + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = this.posX + Math.cos(rot) * innerRadius;
                y = this.posY + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(this.posX, this.posY - outerRadius);
            ctx.closePath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            ctx.save();
            multiFillText(description, posX, posY - 4, 12, 56);
            ctx.restore();
        };

        this.drawLine = function (lineLeftX, lineRightX, posLineY, lineColor) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(lineLeftX, posLineY);
            ctx.lineTo(lineRightX, posLineY);
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.restore();
        };
    };

    function showDataOnCanvas(obj) {
        var circles = [];
        var arrayCount = 0;
        for (var array = 0; array < obj.length; array++) {
            if (Array.isArray(obj[array])) {
                arrayCount++;
            }
        }

        var circleX = 100;
        var circleY = 70;
        var countPaths = 0;

        for (var i = 0; i < obj.length; i++) {
            var lineLeftX = circleX + 15;
            if (Array.isArray(obj[i])) {
                if (countPaths === 0) {
                    drawSplitLines(circleX, circleY, obj[i - 1].color, arrayCount);
                    circleY += 250;
                } else {
                    circleY += 120;
                }
                var subPathArray = [];
                circleX = 100;
                for (var j = 0; j < obj[i].length; j++) {
                    lineLeftX = circleX + 15;
                    if (obj[i][j].type === "goldbadge") {
                        var badgeX = c.width - 70;
                        subPathArray.push(new Badge(obj[i][j].id, badgeX, circleY, 16, 35, 25, "#CD853F", obj[i][j].color, obj[i][j].description, obj[i][j].type, obj[i][j].expandable));
                        // circles.push(subPathArray.concat());
                        // circles.push(new Circle(obj[i][j].id, badgeX, circleY, 15, "black", obj[i][j].description));
                        drawPinkRectangle(badgeX, circleY, "rgba(237, 125, 49, 0.75)");
                        // circles[circles.length - 1].drawBadge(16, 35, 25, "#DAA520", "red");
                        continue;
                    }

                    if (obj[i][j].type === "circle") {
                        subPathArray.push(new Circle(obj[i][j].id, circleX, circleY, 15, "black", obj[i][j].description, obj[i][j].type, obj[i][j].expandable));
                        // circles.push(subPathArray.concat());
                        // circles[circles.length - 1].drawCircle();
                        if (j + 1 !== obj[i].length && obj[i][j + 1].type !== "goldbadge") {
                            // circles[i][j].drawLine(lineLeftX, lineLeftX + 50, circleY, obj[i][j].color);
                            subPathArray[j].drawLine(lineLeftX, lineLeftX + 50, circleY, obj[i][j].color);
                            if (j === 0) {
                                // circles[i][j].drawLine(circleX - 15, circleX - 50, circleY, "orange");
                                subPathArray[j].drawLine(circleX - 15, circleX - 50, circleY, "orange");
                            }
                        }
                        var secondToLastItem = obj[i].length - 2;
                        if (j === secondToLastItem && obj[i][j + 1].type === "goldbadge") {
                            // circles[i][j].drawLine(lineLeftX, c.width - 55, circleY, obj[i][j].color);
                            subPathArray[j].drawLine(lineLeftX, c.width - 55, circleY, obj[i][j].color);
                        }
                    }

                    if (obj[i][j].type === "badge") {
                        subPathArray.push(new Badge(obj[i][j].id, circleX, circleY, 16, 35, 25, "silver", obj[i][j].color, obj[i][j].description, obj[i][j].type, obj[i][j].expandable));
                        // circles.push(subPathArray.concat());
                        // circles[circles.length - 1].drawBadge(16, 35, 25, "silver", obj[i][j].color);
                        if (j + 1 !== obj[i].length) {
                            // circles[i][j].drawLine(lineLeftX + 15, lineLeftX + 50, circleY, obj[i][j].color);
                            subPathArray[j].drawLine(lineLeftX + 15, lineLeftX + 50, circleY, obj[i][j].color);
                        }
                    }
                    circleX += 80;
                }
                circles.push(subPathArray.concat());

                countPaths++;
                continue;
            }

            if (obj[i].type === "circle") {
                circles.push(new Circle(obj[i].id, circleX, circleY, 15, "black", obj[i].description, obj[i].type, obj[i].expandable));
                // circles[i].drawCircle();
                if (i + 1 !== obj.length) {
                    circles[i].drawLine(lineLeftX, lineLeftX + 50, circleY, obj[i].color);
                }
            }

            if (obj[i].type === "badge") {
                // circles.push(new Circle(obj[i].id, circleX, circleY, 15, "black", obj[i].description));
                circles.push(new Badge(obj[i].id, circleX, circleY, 16, 35, 25, "#CD853F", obj[i].color, obj[i].description, obj[i].type, obj[i].expandable));
                // circles[i].drawBadge();
            }
            circleX += 80;
        }
        return circles;
    }
}