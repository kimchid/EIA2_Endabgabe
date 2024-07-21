namespace Eisdealer {
    // Define the Drawables base class if it isn't already defined
    abstract class Drawables {
        constructor(public x: number, public y: number) {}

        abstract draw(): void;
    }

    interface IceCreamItem {
        name: string;
        price: number;
    }

    export class Scoop extends Drawables implements IceCreamItem {
        name: string;
        price: number;
        private radius: number;
        public color: string;

        constructor(_x: number, _y: number, _color: string) {
            super(_x, _y);
            this.radius = 80;
            this.color = _color;
            this.name = this.determineName(_color); // Set a name based on color
            this.price = this.determinePrice(_color); // Set a price based on color
        }

        private determineName(color: string): string {
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

        private determinePrice(color: string): number {
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

        draw(): void {
            crc2.lineWidth = 8;
            crc2.beginPath();
            crc2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // Use arc for circles
            crc2.fillStyle = this.color;
            crc2.fill();
            crc2.lineWidth = 2;
            crc2.stroke();
        }
    }

    // Example usage of color variables
    let colorPistacchio: string = "#93c572";
    let colorStrawberry: string = "#d47274";
    let colorVanille: string = "#F3E5AB";
    let colorChocolate: string = "#45322e";

    // Example code to demonstrate creating a scoop
    let exampleScoop = new Scoop(100, 100, colorChocolate);
    // Assuming crc2 is your CanvasRenderingContext2D and has been set up
    exampleScoop.draw();
}
