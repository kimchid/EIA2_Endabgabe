"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Trash extends Eisdealer.Drawables {
        radius;
        constructor(_x, _y) {
            super(_x, _y);
            this.radius = 35;
        }
        draw() {
            // Mülltonne
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            Eisdealer.crc2.fillStyle = '#808080';
            Eisdealer.crc2.fill();
            Eisdealer.crc2.stroke();
            Eisdealer.crc2.font = '12px Arial'; // Schriftgröße und -art
            Eisdealer.crc2.fillStyle = '#000000'; // Textfarbe: Schwarz
            Eisdealer.crc2.fillText('Trash', this.x, this.y);
        }
    }
    Eisdealer.Trash = Trash;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Trash.js.map