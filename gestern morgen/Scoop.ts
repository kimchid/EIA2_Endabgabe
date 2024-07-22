namespace Eisdealer {
    export class Scoop extends Drawables implements IceCreamItem {
        name: string;
        price: number;
        private size: number; // Use size instead of radius
        public color: string;

        constructor(_x: number, _y: number, _color: string) {
            super(_x, _y);
            this.size = 175; // Increased size for a larger square
            this.color = _color;
            this.name = this.determineName(_color);
            this.price = this.determinePrice(_color);
        }

        private determineName(color: string): string {
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

        draw(): void {
            crc2.lineWidth = 8;
            crc2.beginPath();
            crc2.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size); // Draw a larger square
            crc2.fillStyle = this.color;
            crc2.fill();
            crc2.lineWidth = 2;
            crc2.stroke();
        }
    }

    // Define colors
    let colorPistacchio: string = "#93c572";
    let colorStrawberry: string = "#d47274";
    let colorVanille: string = "#F3E5AB";
    let colorChocolate: string = "#45322e";

}
