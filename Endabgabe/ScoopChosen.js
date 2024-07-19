"use strict";
var Eisdealer;
(function (Eisdealer) {
    class ScoopChosen extends Eisdealer.Drawables {
        radius;
        color;
        flavor;
        constructor(_x, _y, _color, _flavor) {
            super(_x, _y);
            this.radius = 30;
            this.color = _color;
            this.flavor = _flavor;
        }
        draw() {
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.arc(this.x, this.y, this.radius, Math.PI, 2 * Math.PI); // Halbkreis von PI bis 2*PI (180° bis 360°)
            Eisdealer.crc2.fillStyle = this.color;
            Eisdealer.crc2.fill();
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.moveTo(this.x - this.radius, this.y); // Startpunkt links vom Mittelpunkt
            Eisdealer.crc2.lineTo(this.x + this.radius, this.y); // Endpunkt rechts vom Mittelpunkt
        }
    }
    Eisdealer.ScoopChosen = ScoopChosen;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=ScoopChosen.js.map