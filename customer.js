"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
class Customer {
    x;
    y;
    color;
    constructor(x, y, color = "green") {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    move() {
        // Implement logic to move customer
    }
    draw(crc2) {
        crc2.fillStyle = this.color;
        crc2.beginPath();
        crc2.arc(this.x, this.y, 20, 0, Math.PI * 2);
        crc2.fill();
        crc2.stroke();
    }
}
exports.Customer = Customer;
//# sourceMappingURL=customer.js.map