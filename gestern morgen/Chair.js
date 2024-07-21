"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Chair extends Eisdealer.Drawables {
        width;
        height;
        color;
        occupied;
        constructor(_x, _y) {
            super(_x, _y);
            this.width = 100;
            this.height = 100;
            this.color = '#00000';
            this.occupied = false;
        }
        isOccupied() {
            return this.occupied;
        }
        occupy() {
            this.occupied = true;
        }
        draw() {
            const chairRadius = 20;
            const chairX = this.x + this.width / 2;
            const chairY = this.y + this.height / 2;
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.arc(chairX, chairY, chairRadius, 0, Math.PI * 2);
            Eisdealer.crc2.fillStyle = this.color;
            Eisdealer.crc2.fill();
        }
    }
    Eisdealer.Chair = Chair;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Chair.js.map