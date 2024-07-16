"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customer_1 = require("./customer");
const drawing_1 = require("./drawing");
const events_1 = require("./events");
const animations_1 = require("./animations");
const canvas = document.getElementById('canvas');
const crc2 = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
if (crc2) {
    // Draw initial elements
    (0, drawing_1.drawFace)(crc2, 100, 100, 50, true);
    (0, drawing_1.drawFace)(crc2, 350, 100, 50, false);
    (0, drawing_1.drawFace)(crc2, 600, 100, 50, true);
    (0, drawing_1.drawFace)(crc2, 850, 100, 50, true);
    (0, drawing_1.drawCounter)(crc2);
    (0, drawing_1.drawIceCreamOptions)(crc2);
    (0, drawing_1.drawSidebar)(crc2);
}
let customers = [];
const orderItems = [];
const iceCreamItems = [
    { name: "Schokolade", price: 2 },
    { name: "Vanille", price: 2 },
    { name: "Schokostückchen", price: 1 },
    { name: "Erdbeere", price: 2 },
    { name: "Pistazie", price: 2 },
    { name: "Waffeln", price: 1 }
];
canvas.addEventListener('click', (event) => (0, events_1.handleCanvasClick)(event, crc2, orderItems, iceCreamItems));
function handleLoad() {
    customers.push(new customer_1.Customer(200, 400));
    setInterval(animations_1.createCustomer, 5000, customers);
    window.setInterval(() => {
        (0, animations_1.animateCustomers)(crc2, customers);
    }, 24);
}
window.addEventListener('load', handleLoad);
//# sourceMappingURL=main.js.map