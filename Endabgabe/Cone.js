"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Cone extends Eisdealer.Drawables {
        constructor(_x, _y) {
            super(_x, _y);
        }
        draw() {
            Eisdealer.crc2.fillStyle = "tan";
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.moveTo(825, 550); // Start point (left vertex)
            Eisdealer.crc2.lineTo(875, 550); // Top right vertex
            Eisdealer.crc2.lineTo(850, 625); // Bottom vertex (lowered)
            Eisdealer.crc2.closePath();
            Eisdealer.crc2.fill();
        }
    }
    Eisdealer.Cone = Cone;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Cone.js.map