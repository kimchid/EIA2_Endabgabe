"use strict";
var Eisdealer;
(function (Eisdealer) {
    // Define the Drawables base class if it isn't already defined
    class Drawables {
        x;
        y;
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    class Scoop extends Drawables {
        name;
        price;
        radius;
        color;
        constructor(_x, _y, _color) {
            super(_x, _y);
            this.radius = 80;
            this.color = _color;
            this.name = this.determineName(_color); // Set a name based on color
            this.price = this.determinePrice(_color); // Set a price based on color
        }
        determineName(color) {
            // Define names based on color
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
            // Define prices based on color
            switch (color) {
                case colorPistacchio:
                    return 2.5;
                case colorStrawberry:
                    return 2.0;
                case colorVanille:
                    return 1.5;
                case colorChocolate:
                    return 2.0;
                default:
                    return 1.0;
            }
        }
        draw() {
            Eisdealer.crc2.lineWidth = 8;
            Eisdealer.crc2.beginPath();
            Eisdealer.crc2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // Use arc for circles
            Eisdealer.crc2.fillStyle = this.color;
            Eisdealer.crc2.fill();
            Eisdealer.crc2.lineWidth = 2;
            Eisdealer.crc2.stroke();
        }
    }
    Eisdealer.Scoop = Scoop;
    // Example usage of color variables
    let colorPistacchio = "#93c572";
    let colorStrawberry = "#d47274";
    let colorVanille = "#F3E5AB";
    let colorChocolate = "#45322e";
    // Example code to demonstrate creating a scoop
    let exampleScoop = new Scoop(100, 100, colorChocolate);
    // Assuming crc2 is your CanvasRenderingContext2D and has been set up
    exampleScoop.draw();
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Scoop.js.map