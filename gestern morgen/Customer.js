"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Customer extends Eisdealer.Moveables {
        radius = 40;
        skin = "#ffffff";
        targetChair = null;
        allObjects;
        order = [];
        orderCompleted = false;
        leaving = false;
        waitStartTime = Date.now();
        mood = 'happy';
        state;
        assignedChair = null;
        customerPay = false;
        paid = false;
        orderCorrect = false;
        orderChecked = false;
        constructor(_x, _y, _direction, _speed, _type, allObjects) {
            super(_x, _y, _direction, _speed, _type);
            this.allObjects = allObjects;
            this.state = "walk in"; // Initialize the state
        }
        move() {
            switch (this.state) {
                case "walk in":
                    this.handleWalkIn();
                    break;
                case "sit":
                    this.handleSit();
                    break;
                case "leave":
                    this.handleLeave();
                    break;
            }
        }
        handleWalkIn() {
            if (!this.targetChair || this.targetChair.isOccupied()) {
                this.findNextUnoccupiedChair();
            }
            if (this.targetChair) {
                const dx = this.targetChair.x - this.x + 50;
                const dy = this.targetChair.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const moveDistance = Math.min(this.speed.x, distance);
                this.x += (dx / distance) * moveDistance;
                this.y += (dy / distance) * moveDistance;
                if (distance < this.speed.x) {
                    this.targetChair.occupy();
                    this.speed = new Eisdealer.Vector(0, 0);
                    this.assignedChair = this.targetChair;
                    this.targetChair = null;
                    // Place order
                    this.placeOrder();
                    this.state = "sit";
                    this.waitStartTime = Date.now(); // Set the start time for waiting
                }
            }
        }
        handleSit() {
            if (this.orderCompleted && this.isOrderCorrect()) {
                this.mood = 'ecstatic';
                this.speed = new Eisdealer.Vector(1, 1);
                this.state = "leave";
                this.leaving = true;
            }
            else if (Date.now() - this.waitStartTime > 10000) {
                this.mood = 'sad';
            }
        }
        handleLeave() {
            const targetX = 500;
            const targetY = -50;
            const dxLeave = targetX - this.x;
            const dyLeave = targetY - this.y;
            const distanceLeave = Math.sqrt(dxLeave * dxLeave + dyLeave * dyLeave);
            this.speed = new Eisdealer.Vector(2, 2);
            const moveDistanceLeave = Math.min(this.speed.x, distanceLeave);
            this.x += (dxLeave / distanceLeave) * moveDistanceLeave;
            this.y += (dyLeave / distanceLeave) * moveDistanceLeave;
            if (this.y < -49) {
                if (this.assignedChair) {
                    this.assignedChair.free();
                }
                this.allObjects = this.allObjects.filter(obj => obj !== this);
                this.createSingleCustomer();
            }
        }
        findNextUnoccupiedChair() {
            for (const obj of this.allObjects) {
                if (obj instanceof Eisdealer.Chair && !obj.isOccupied()) {
                    this.targetChair = obj;
                    break;
                }
            }
        }
        createSingleCustomer() {
            let customerX = 500;
            let customerY = -50;
            let customer = new Customer(customerX, customerY, new Eisdealer.Vector(0, 0), new Eisdealer.Vector(4, 4), `Customer`, this.allObjects);
            this.allObjects.push(customer); // Add customer to allObjects
            customer.state = "walk in";
            customer.mood = "happy";
        }
        getReceipt() {
            let amount = 0;
            let receiptContent = "<h3>Receipt</h3><ul>";
            receiptContent += `</ul><p>Total: ${amount} €</p>`;
            const receiptElement = document.getElementById("receipt");
            if (receiptElement) {
                receiptElement.innerHTML = receiptContent;
            }
            return amount;
        }
        placeOrder() {
            const numScoops = Math.floor(Math.random() * 2) + 1;
            const availableFlavors = ["Schokolade", "Erdbeere", "Vanille", "Pistazie"];
            for (let i = 0; i < numScoops; i++) {
                const randomFlavor = availableFlavors[Math.floor(Math.random() * availableFlavors.length)];
                this.order.push({ flavor: randomFlavor });
            }
            this.drawOrder();
        }
        isOrderCorrect() {
            return this.order.length > 0;
        }
        leave() {
            this.speed = new Eisdealer.Vector(5, 5);
            const dx = 500 - this.x;
            const dy = -50 - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const moveDistance = Math.min(distance, Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y));
            this.x += (dx / distance) * moveDistance;
            this.y += (dy / distance) * moveDistance;
            if (this.y < -50) {
                const index = this.allObjects.indexOf(this);
                if (index > -1) {
                    this.allObjects.splice(index, 1);
                }
            }
        }
        drawOrder() {
            if (!this.orderCompleted) {
                const startX = this.x + 50;
                const startY = this.y;
                const yOffset = 20;
                for (let i = 0; i < this.order.length; i++) {
                    Eisdealer.crc2.font = "16px Arial";
                    Eisdealer.crc2.fillStyle = "#000000";
                    Eisdealer.crc2.fillText(this.order[i].flavor, startX, startY + i * yOffset);
                }
            }
        }
        draw() {
            if (this.allObjects.includes(this)) {
                const x = this.x;
                const y = this.y;
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x, y, this.radius, 0, Math.PI * 2);
                Eisdealer.crc2.fillStyle = this.skin;
                Eisdealer.crc2.strokeStyle = "#000000";
                Eisdealer.crc2.fill();
                Eisdealer.crc2.lineWidth = 2;
                Eisdealer.crc2.stroke();
                // Eyes
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x - 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.arc(x + 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.fillStyle = '#000000';
                Eisdealer.crc2.fill();
                // Mouth
                Eisdealer.crc2.beginPath();
                if (this.mood === 'happy') {
                    Eisdealer.crc2.arc(x, y + 10, 15, 0, Math.PI, false);
                }
                else if (this.mood === 'sad') {
                    Eisdealer.crc2.arc(x, y + 20, 15, 0, Math.PI, true);
                }
                else if (this.mood === 'ecstatic') {
                    Eisdealer.crc2.arc(x, y + 10, 20, 0, Math.PI, false);
                    Eisdealer.crc2.moveTo(x - 20, y + 10);
                    Eisdealer.crc2.lineTo(x + 20, y + 10);
                }
                Eisdealer.crc2.strokeStyle = '#000000';
                Eisdealer.crc2.stroke();
            }
        }
        update() { }
        hasLeft() {
            return this.y < -49; // Adjusted for leaving condition
        }
    }
    Eisdealer.Customer = Customer;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Customer.js.map