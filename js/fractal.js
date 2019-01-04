;(function() {
    class SquareFractal {
        constructor(params) {
            let defaults = {
                sideLength: 500,
                offset: 0.1,
                count: 100   
            }

            el = params.el;
            this._sideLength = params.sideLength || defaults.sideLength;
            this.createCanvas(el);
            this.ctx = this.cnv.getContext('2d');

            this._offset = params.offset || defaults.offset;
            this._count = params.count || defaults.count;    

            this.render();
        }

        createCanvas(el) {
            let cnv = document.createElement('canvas');
            cnv.width = this.sideLength;
            cnv.height = this.sideLength;
            el.appendChild(cnv);
            this.cnv = cnv;
        }

        render() {
            this.ctx.clearRect(0, 0, this.sideLength, this.sideLength);
            this.drawRecursiveRect({
                x: 0,
                y: 0
            },
            {
                x: this.sideLength,
                y: 0
            }, this.offset, this.count);
        }

        drawRecursiveRect(a, b, offset=0.1, count=10) {
            if (count <= 0)
                return;

            const cd = this.getCDCoordinates(a, b);
            const c = cd.c;
            const d = cd.d;

            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.lineTo(c.x, c.y);
            this.ctx.lineTo(d.x, d.y);
            this.ctx.closePath();
            this.ctx.stroke();

            const newAB = SquareFractal.getNewABCoordinates(a, b, offset);

            this.drawRecursiveRect(newAB.a, newAB.b, offset, --count);
        }

        getCDCoordinates(a, b) {
            const aToB = {
                x: b.x - a.x,
                y: b.y - a.y
            }
            const angle = SquareFractal.getAngle(aToB);
            const length = SquareFractal.getMagnitude(aToB);
            const ortagonalVector = SquareFractal.getVectorFromAngle(angle + Math.PI / 2, length);

            let c = {};
            c.x = b.x + ortagonalVector.x;
            c.y = b.y + ortagonalVector.y;

            let d = {};
            d.x = a.x + ortagonalVector.x;
            d.y = a.y + ortagonalVector.y;
        
            return {
                c: c,
                d: d
            }
        }

        get count() {
            return this._count;
        }

        set count(val) {
            this._count = val;
            this.render();
        }

        get sideLength() {
            return this._sideLength;
        }

        set sideLength(val) {
            val = +val
            this._sideLength = val;
            this.cnv.width = val;
            this.cnv.height = val;
            this.render();
        }

        get offset() {
            return this._offset;
        }

        set offset(val) {
            if (val < 0) {
                this._offset = 0;
            } else if (val > 1) {
                this._offset = 1;
            } else if (val >= 0 && val <= 1) {
                this._offset = val;
            } else {
                throw new Error('Неверное значение параметра offset');
            }
                
            this.render();
        }

        static getAngle(vector) {
            return Math.atan2(vector.y, vector.x);
        }

        static getMagnitude(vector) {
            return Math.sqrt(vector.x **2 + vector.y **2);
        }

        static getVectorFromAngle(angle, magnitude) {
            const x = magnitude * Math.cos(angle);
            const y = magnitude * Math.sin(angle);
            return {
                x: x,
                y: y
            }
        }

        static getNewABCoordinates(a, b, offset) {
            const aToB = {
                x: b.x - a.x,
                y: b.y - a.y
            }
        
            const aToBPart = {
                x: aToB.x * offset,
                y: aToB.y * offset
            }
        
            const angle = SquareFractal
                .getAngle(aToB);
            const length = SquareFractal
                .getMagnitude(aToB);
            const ortagonalVector = SquareFractal
                .getVectorFromAngle(angle + Math.PI / 2, length);
        
            const newA = {
                x: a.x + aToBPart.x,
                y: a.y + aToBPart.y
            }
        
            const newB = {
                x: b.x + ortagonalVector.x * offset,
                y: b.y + ortagonalVector.y * offset
            }
        
            return {
                a: newA,
                b: newB
            }
        }
    }

    window.SquareFractal = SquareFractal;
})();