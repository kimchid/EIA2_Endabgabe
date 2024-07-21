"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Trash extends Eisdealer.Drawables {
        radius;
        constructor(_x, _y) {
            super(_x, _y);
            this.radius = 30;
        }
        draw() {
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.arc(this.x, this.y, this.radius, Math.PI / 2, 3 * Math.PI / 2); // Von oben links bis unten rechts
            Eisdealer.crc2.lineTo(this.x, this.y); // Zur Mitte zurückkehren
            Eisdealer.crc2.closePath(); // Pfad schließen
            Eisdealer.crc2.fillStyle = '#808080';
            Eisdealer.crc2.fill();
            Eisdealer.crc2.strokeStyle = '#00000';
            Eisdealer.crc2.stroke();
        }
    }
    Eisdealer.Trash = Trash;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Trash.js.map