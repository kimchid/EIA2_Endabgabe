"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Scoop extends Eisdealer.Drawables {
        name;
        price;
        size; // Use size instead of radius
        color;
        constructor(_x, _y, _color) {
            super(_x, _y);
            this.size = 175; // Increased size for a larger square
            this.color = _color;
            this.name = this.determineName(_color);
            this.price = this.determinePrice(_color);
        }
        determineName(color) {
            switch (color) {
                case colorPistacchio:
                    return 'Pistachio';
                case colorStrawberry:
                    return 'Strawberry';
                case colorVanille:
                    return 'Vanilla';
                case colorChocolate:
                    return 'Chocolate';
                default:
                    return 'Unknown';
            }
        }
        determinePrice(color) {
            switch (color) {
                case colorPistacchio:
                    return 2;
                case colorStrawberry:
                    return 2;
                case colorVanille:
                    return 2;
                case colorChocolate:
                    return 2;
                default:
                    return 0;
            }
        }
        draw() {
            Eisdealer.crc2.lineWidth = 8;
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size); // Draw a larger square
            Eisdealer.crc2.fillStyle = this.color;
            Eisdealer.crc2.fill();
            Eisdealer.crc2.lineWidth = 2;
            Eisdealer.crc2.stroke();
        }
    }
    Eisdealer.Scoop = Scoop;
    // Define colors
    let colorPistacchio = "#93c572";
    let colorStrawberry = "#d47274";
    let colorVanille = "#F3E5AB";
    let colorChocolate = "#45322e";
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Scoop.js.map