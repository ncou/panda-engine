game.module(
    'plugins.polygon'
)
.require(
    'engine.physics'
)
.body(function() {

game.Polygon = game.Class.extend({
    x: null,
    y: null,

    init: function(points, dontDebug) {
        this.x = new Float32Array(points.length);
        this.y = new Float32Array(points.length);

        for (var i = 0; i < points.length; i++) {
            this.x[i] = points[i][0];
            this.y[i] = points[i][1];
        }

        if(game.debugDraw && !dontDebug) this.debugDraw();
    },

    // Is point inside polygon
    pointInside: function(x, y) {
        var inside = false, i, j;

        for (i = 0; i < this.x.length; i++) {
            j = i + 1;
            if (j === this.x.length) j = 0;

            if (this.y[i]< y && this.y[j] >= y ||
                this.y[j]< y && this.y[i] >= y) {

                if (this.x[i] + (y - this.y[i]) / (this.y[j] - this.y[i]) * (this.x[j] - this.x[i]) < x) {
                    inside = !inside;
                }
            }
        }

        return inside;
    },

    // Is line inside polygon
    lineInside: function(x1, y1, x2, y2) {
        if(!this.pointInside(x1, y1) || !this.pointInside(x2, y2)) return false;

        var theCos, theSin, dist, sX, sY, eX, eY, rotSX, rotSY, rotEX, rotEY, crossX, i, j, polyI;

        x2 -= x1;
        y2 -= y1;
        dist = Math.sqrt(x2 * x2 + y2 * y2);
        theCos = x2 / dist;
        theSin = y2 / dist;

        for (i = 0; i < this.x.length; i++) {
            j = i + 1;
            if (j === this.x.length) j = 0;

            sX = this.x[i] - x1;
            sY = this.y[i] - y1;
            eX = this.x[j] - x1;
            eY = this.y[j] - y1;
            if (sX === 0 && sY === 0 && eX === x2 && eY === y2 ||
                eX === 0 && eY === 0 && sX === x2 && sY === y2) {
                return true;
            }

            rotSX = sX * theCos + sY * theSin;
            rotSY = sY * theCos - sX * theSin;
            rotEX = eX * theCos + eY * theSin;
            rotEY = eY * theCos - eX * theSin;
            if (rotSY < 0 && rotEY > 0 || rotEY < 0 && rotSY > 0) {
                crossX = rotSX + (rotEX - rotSX) * (0 - rotSY) / (rotEY - rotSY);
                if (crossX >= 0 && crossX <= dist) return false;
            }

            if (
                rotSY === 0 && rotEY === 0 &&
                (rotSX >= 0 || rotEX >=0 ) &&
                (rotSX <= dist || rotEX <= dist) &&
                (rotSX < 0 || rotEX < 0 || rotSX > dist || rotEX > dist)
            ) {
                return false;
            }
        }

        return true;
    },

    debugDraw: function() {
        var sprite = new game.Graphics();
        sprite.beginFill(0x0000ff);

        for (i = 0; i < this.x.length; i++) {
            if(i === 0) sprite.moveTo(this.x[i], this.y[i]);
            else sprite.lineTo(this.x[i], this.y[i]);
        }

        sprite.alpha = 0.3;
        game.scene.stage.addChild(sprite);
    }
});

game.PolygonSet = game.Class.extend({
    polygons: [],

    init: function(polygons) {
        if(typeof(polygons) === 'array') this.polygons = polygons;
    },

    // Add polygon to set
    add: function(polygon) {
        this.polygons.push(polygon);
    },

    // Find nearest polygon set point for coordinates
    findNearestPoint: function(x, y) {
        var pointList = this.getPoints();
        if(pointList.length === 0) return false;

        var nearestDist = 0;
        var nearestPoint = null;
        for (var i = 0; i < pointList.length; i++) {
            var dist = game.Math.distance(x, y, pointList[i].x, pointList[i].y);
            if(dist < nearestDist || i === 0) {
                nearestDist = dist;
                nearestPoint = i;
            }
        }

        return {x: pointList[nearestPoint].x, y: pointList[nearestPoint].y};
    },

    // Get points for polygon set
    getPoints: function() {
        var points = [];
        for (polyI=0; polyI<this.polygons.length; polyI++) {
            for (i=0; i<this.polygons[polyI].x.length; i++) {
                points.push({x:this.polygons[polyI].x[i], y:this.polygons[polyI].y[i]});
            }
        }
        return points;
    },

    // Is point inside polygon set
    pointInside: function(testX, testY) {
        var oddNodes = false;
        var polyI, i, j;

        for (polyI=0; polyI<this.polygons.length; polyI++) {
            for (i=0; i < this.polygons[polyI].x.length; i++) {
                j = i + 1;
                if (j === this.polygons[polyI].x.length) j = 0;

                if (this.polygons[polyI].y[i]< testY && this.polygons[polyI].y[j] >= testY ||
                    this.polygons[polyI].y[j]< testY && this.polygons[polyI].y[i] >= testY) {

                    if (this.polygons[polyI].x[i] + (testY - this.polygons[polyI].y[i]) / (this.polygons[polyI].y[j] - this.polygons[polyI].y[i]) * (this.polygons[polyI].x[j] - this.polygons[polyI].x[i]) < testX) {
                        oddNodes = !oddNodes;
                    }
                }
            }
        }

        return oddNodes;
    },

    // Is line inside polygon set
    lineInside: function(testSX, testSY, testEX, testEY) {
        var theCos, theSin, dist, sX, sY, eX, eY, rotSX, rotSY, rotEX, rotEY, crossX, i, j, polyI;

        testEX -= testSX;
        testEY -= testSY;
        dist = Math.sqrt(testEX * testEX + testEY * testEY);
        theCos = testEX / dist;
        theSin = testEY / dist;

        for (polyI = 0; polyI < this.polygons.length; polyI++) {
            for (i = 0; i < this.polygons[polyI].x.length; i++) {
                j = i + 1;
                if (j === this.polygons[polyI].x.length) j = 0;

                sX = this.polygons[polyI].x[i] - testSX;
                sY = this.polygons[polyI].y[i] - testSY;
                eX = this.polygons[polyI].x[j] - testSX;
                eY = this.polygons[polyI].y[j] - testSY;
                if (sX === 0 && sY === 0 && eX === testEX && eY === testEY ||
                    eX === 0 && eY === 0 && sX === testEX && sY === testEY) {
                    return true;
                }

                rotSX = sX * theCos + sY * theSin;
                rotSY = sY * theCos - sX * theSin;
                rotEX = eX * theCos + eY * theSin;
                rotEY = eY * theCos - eX * theSin;
                if (rotSY < 0 && rotEY > 0 || rotEY < 0 && rotSY > 0) {
                    crossX = rotSX + (rotEX - rotSX) * (0 - rotSY) / (rotEY - rotSY);
                    if (crossX >= 0 && crossX <= dist) return false;
                }

                if (
                    rotSY === 0 && rotEY === 0 &&
                    (rotSX >= 0 || rotEX >=0 ) &&
                    (rotSX <= dist || rotEX <= dist) &&
                    (rotSX < 0 || rotEX < 0 || rotSX > dist || rotEX > dist)
                ) {
                    return false;
                }
            }
        }

        return this.pointInside(testSX + testEX / 2, testSY + testEY / 2);
    }
});

game.PolygonPathFinder = game.Class.extend({
    polygonSet: null,

    init: function(polygonSet) {
        if(!polygonSet) throw('No PolygonSet defined.');
        this.polygonSet = polygonSet;
    },

    swapPoints: function(list, a, b) {
        var swap = game.copy(list[a]);
        list[a] = game.copy(list[b]);
        list[b] = swap;
    },

    find: function(sX, sY, eX, eY) {
        var INF = Number.MAX_VALUE;
        var path = [];
        var bestDist, newDist, treeCount, polyI, i, j, bestI, bestJ;

        if(!this.polygonSet.pointInside(eX,eY)) {
            // If end point is not inside, find nearest point
            var nearest = this.polygonSet.findNearestPoint(eX, eY);
            eX = nearest.x;
            eY = nearest.y;
        }

        // If start and end points are same, return
        if(sX === eX && sY === eY) return false;

        if (this.polygonSet.lineInside(sX,sY,eX,eY)) {
            // If straight line, return with end point
            path.push({x: eX, y: eY});
            return path;
        }

        var pointList = this.polygonSet.getPoints();
        pointList.unshift({x:sX, y:sY});
        pointList.push({x:eX, y:eY});

        treeCount = 1;
        pointList[0].totalDist = 0;

        bestJ = 0;
        while (bestJ < pointList.length - 1) {
            bestDist = INF;
            for (i = 0; i < treeCount; i++) {
                for (j = treeCount; j < pointList.length; j++) {
                    if (this.polygonSet.lineInside(pointList[i].x, pointList[i].y, pointList[j].x,pointList[j].y)) {
                        newDist = pointList[i].totalDist + game.Math.distance(pointList[i].x,pointList[i].y, pointList[j].x,pointList[j].y);

                        if (newDist < bestDist) {
                            bestDist = newDist;
                            bestI = i;
                            bestJ = j;
                        }
                    }
                }
            }
            if (bestDist === INF) return false;

            pointList[bestJ].prev = bestI;
            pointList[bestJ].totalDist = bestDist;

            this.swapPoints(pointList, bestJ, treeCount);
            treeCount++;
        }

        i = treeCount - 1;
        while (i > 0) {
            i = pointList[i].prev;
            path.unshift({x: pointList[i].x, y: pointList[i].y});
        }

        path.push({x: eX, y: eY});

        return path;
    }
});

});