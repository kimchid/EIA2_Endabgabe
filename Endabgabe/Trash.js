"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Trash extends Eisdealer.Drawables {
        radius;
        constructor(_x, _y) {
            super(_x, _y);
            this.radius = 50;
        }
        draw() {
            //console.log("trash draw");
            // Mülltonne
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.arc(this.x, this.y, this.radius, 0, Math.PI * 1);
            Eisdealer.crc2.fillStyle = '#808080';
            Eisdealer.crc2.fill();
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.arc(this.x, this.y, 40, 0, Math.PI * 1);
            Eisdealer.crc2.strokeStyle = '#fffff';
            Eisdealer.crc2.stroke();
        }
    }
    Eisdealer.Trash = Trash;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Trash.js.map