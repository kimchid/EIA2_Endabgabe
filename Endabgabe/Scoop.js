"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Scoop extends Eisdealer.Drawables {
        radius;
        color;
        constructor(_x, _y, _color) {
            super(_x, _y);
            this.radius = 80;
            this.color = _color;
        }
        draw() {
            Eisdealer.crc2.lineWidth = 8;
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            Eisdealer.crc2.fillStyle = this.color;
            Eisdealer.crc2.fill();
            Eisdealer.crc2.lineWidth = 2;
            Eisdealer.crc2.stroke();
        }
    }
    Eisdealer.Scoop = Scoop;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Scoop.js.map