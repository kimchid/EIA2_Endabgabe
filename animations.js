"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animateCustomers = animateCustomers;
exports.createCustomer = createCustomer;
const customer_1 = require("./customer");
function animateCustomers(crc2, customers) {
    crc2.clearRect(0, 0, window.innerWidth, window.innerHeight);
    customers.forEach(customer => {
        customer.move();
        customer.draw(crc2);
    });
}
function createCustomer(customers) {
    if (customers.length < 7) {
        const minX = 50;
        const maxX = 300;
        const minY = 400;
        const maxY = 500;
        const x = Math.random() * (maxX - minX) + minX;
        const y = Math.random() * (maxY - minY) + minY;
        customers.push(new customer_1.Customer(x, y, "green"));
    }
}
//# sourceMappingURL=animations.js.map