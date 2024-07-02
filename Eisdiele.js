"use strict";
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
if (ctx) {
    const drawFace = (x, y, radius, happy) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.moveTo(x + radius * 0.6, y);
        if (happy) {
            ctx.arc(x, y, radius * 0.6, 0, Math.PI, false);
        }
        else {
            ctx.arc(x, y + radius * 0.2, radius * 0.2, 0, Math.PI, true);
        }
        ctx.moveTo(x - radius * 0.3, y - radius * 0.3);
        ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.15, 0, Math.PI * 2, true);
        ctx.moveTo(x + radius * 0.3, y - radius * 0.3);
        ctx.arc(x + radius * 0.3, y - radius * 0.3, radius * 0.15, 0, Math.PI * 2, true);
        ctx.stroke();
    };
    // Faces
    const faceRadius = 50;
    drawFace(100, 100, faceRadius, true);
    drawFace(350, 100, faceRadius, false);
    drawFace(600, 100, faceRadius, true);
    drawFace(850, 100, faceRadius, true);
    // Counter (Theke)
    ctx.strokeRect(0, 200, canvas.width - 550, 500);
    ctx.textAlign = "left";
    ctx.font = "20px Arial";
    ctx.fillText("+ 2€", 100, 250);
    ctx.fillText("+ 2€", 460, 250);
    // Ice Cream Options
    const options = [
        { color: "brown", text: "Schokolade", x: 40, y: 280 },
        { color: "yellow", text: "Vanille", x: 320, y: 280 },
        { color: "white", text: "Streusel", x: 750, y: 280 },
        { color: "red", text: "Erdbeere", x: 40, y: 500 },
        { color: "green", text: "Pistazie", x: 320, y: 500 },
        { color: "tan", text: "Waffeln", x: 750, y: 500 }
    ];
    options.forEach((option) => {
        ctx.fillStyle = option.color;
        ctx.fillRect(option.x, option.y, 200, 150);
        ctx.strokeRect(option.x, option.y, 200, 150);
        ctx.fillStyle = "black";
        ctx.fillText(option.text, option.x + 20, option.y + 190);
    });
    // Sidebar for Price List and Cash Register
    const sidebarX = canvas.width - 520;
    // Price List
    ctx.strokeRect(sidebarX, 20, 400, 200);
    ctx.font = "30px Arial";
    ctx.fillText("Preisliste", sidebarX + 20, 60);
    ctx.fillText("1 Kugel:                 2€", sidebarX + 20, 100);
    ctx.fillText("max. 2 Kugeln:      3€", sidebarX + 20, 140);
    ctx.fillText("Streuseln:              1€", sidebarX + 20, 180);
    // Cash Register
    ctx.strokeRect(sidebarX, 240, 400, 400);
    ctx.fillText("Kasse", sidebarX + 20, 280);
    ctx.strokeRect(sidebarX + 20, 320, 300, 40);
    ctx.strokeRect(sidebarX + 20, 370, 300, 40);
    ctx.fillText("+", sidebarX + 350, 350);
    ctx.fillText("+", sidebarX + 350, 400);
    ctx.fillText("Total:", sidebarX + 20, 450);
    ctx.strokeRect(sidebarX + 20, 480, 300, 80);
    let orderItems = [];
    function addItemToOrder(item, quantity) {
        const existingItem = orderItems.find(orderItem => orderItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price += item.price * quantity;
        }
        else {
            orderItems.push({ name: item.name, quantity, price: item.price * quantity });
        }
        updateTotal();
    }
    function updateTotal() {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        ctx.clearRect(sidebarX + 20, 480, 300, 80);
        ctx.fillText(total.toFixed(2) + "€", sidebarX + 170, 530);
    }
    // For testing, adding items to order
    addItemToOrder(iceCreamItems[0], 1); // Add 1 Schokolade
    addItemToOrder(iceCreamItems[2], 1); // Add 1 Streusel
}
//# sourceMappingURL=Eisdiele.js.map