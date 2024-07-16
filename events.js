"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCanvasClick = handleCanvasClick;
function handleCanvasClick(event, crc2, orderItems, iceCreamItems) {
    const x = event.clientX;
    const y = event.clientY;
    const options = [
        { name: "Schokolade", x: 40, y: 280, width: 200, height: 150 },
        { name: "Vanille", x: 320, y: 280, width: 200, height: 150 },
        { name: "Schokostückchen", x: 750, y: 280, width: 200, height: 150 },
        { name: "Erdbeere", x: 40, y: 500, width: 200, height: 150 },
        { name: "Pistazie", x: 320, y: 500, width: 200, height: 150 },
        { name: "Waffeln", x: 825, y: 550, width: 50, height: 50 }
    ];
    options.forEach((option, index) => {
        if (x > option.x &&
            x < option.x + option.width &&
            y > option.y &&
            y < option.y + option.height) {
            addItemToOrder(iceCreamItems[index], 1, orderItems, crc2);
        }
    });
}
function addItemToOrder(item, quantity, orderItems, crc2) {
    const existingItem = orderItems.find(orderItem => orderItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price += item.price * quantity;
    }
    else {
        orderItems.push({ name: item.name, quantity, price: item.price * quantity });
    }
    updateTotal(orderItems, crc2);
}
function updateTotal(orderItems, crc2) {
    const sidebarX = window.innerWidth - 520;
    const total = orderItems.reduce((sum, item) => sum + item.price, 0);
    crc2.clearRect(sidebarX + 50, 550, 300, 80);
    crc2.fillText(total.toFixed(2) + "€", sidebarX + 170, 600);
}
//# sourceMappingURL=events.js.map