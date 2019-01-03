let cnv = document.getElementById('cnv');
let offsetInput = document.getElementById('offsetInput');
cnv.width = 500;
cnv.height = 500;
let ctx = cnv.getContext('2d');

ctx.clearRect(0, 0, cnv.width, cnv.height);
function drawRecursiveRect(a, b, offset=0.1, deep=10) {
    if (deep == 0)
        return;

    let length = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);

    let cd = getCDCoordinates(a, b);
    let c = cd.c;
    let d = cd.d;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.stroke();

    const newAB = getNewABCoordinates(a, b, offset);
    // console.log(newAB)

    drawRecursiveRect(newAB.a, newAB.b, offset, --deep);
}

function getVectorFromAngle(angle, magnitude) {
    let x = magnitude * Math.cos(angle);
    let y = magnitude * Math.sin(angle);
    return {
        x: x,
        y: y
    }
}

function getAngle(vector) {
    return Math.atan2(vector.y, vector.x);
}

function getMagnitude(vector) {
    return Math.sqrt(vector.x **2 + vector.y **2);
}

function getCDCoordinates(a, b) {
    let aToB = {
        x: b.x - a.x,
        y: b.y - a.y
    }
    let angle = getAngle(aToB);
    let length = getMagnitude(aToB);
    let ortagonalVector = getVectorFromAngle(angle + Math.PI / 2, length);
    let c = {};
    c.x = b.x + ortagonalVector.x;
    c.y = b.y + ortagonalVector.y;
    // console.log(c, angle, length, ortagonalVector)
    let d = {};
    d.x = a.x + ortagonalVector.x;
    d.y = a.y + ortagonalVector.y;

    return {
        c: c,
        d: d
    }
}

// offset задаётся в диапазоне от 0 до 1 
function getNewABCoordinates(a, b, offset) {
    let aToB = {
        x: b.x - a.x,
        y: b.y - a.y
    }

    let aToBPart = {
        x: aToB.x * offset,
        y: aToB.y * offset
    }

    let angle = getAngle(aToB);
    let length = getMagnitude(aToB);
    let ortagonalVector = getVectorFromAngle(angle + Math.PI / 2, length);

    let newA = {
        x: a.x + aToBPart.x,
        y: a.y + aToBPart.y
    }

    let newB = {
        x: b.x + ortagonalVector.x * offset,
        y: b.y + ortagonalVector.y * offset
    }

    return {
        a: newA,
        b: newB
    }
}

drawRecursiveRect(
    {
        x: 10,
        y: 10
    },
    {
        x: 490,
        y: 10
    },
    offsetInput.value,
    100
);

offsetInput.oninput = function() {
    console.log(this.value)
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    drawRecursiveRect({x: 10, y: 10}, {x: 490, y: 10}, this.value, 100);
}