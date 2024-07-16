export class Customer {
    x: number;
    y: number;
    color: string;

    constructor(x: number, y: number, color: string = "green") {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    move() {
        // Implement logic to move customer
    }

    draw(crc2: CanvasRenderingContext2D) {
        crc2.fillStyle = this.color;
        crc2.beginPath();
        crc2.arc(this.x, this.y, 20, 0, Math.PI * 2);
        crc2.fill();
        crc2.stroke();
    }
}
