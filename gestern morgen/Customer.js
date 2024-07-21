"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Customer extends Eisdealer.Moveables {
        radius = 40;
        skin = "#ffffff";
        targetChair = null;
        state = "coming";
        allObjects;
        order = [];
        orderCompleted = false;
        leaving = false;
        waitStartTime = Date.now();
        mood = 'happy';
        constructor(_x, _y, _direction, _speed, _type, allObjects) {
            super(_x, _y, _direction, _speed, _type);
            this.allObjects = allObjects;
        }
        move() {
            if (this.leaving) {
                this.leave();
                return;
            }
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
                    this.targetChair = null;
                    this.waitStartTime = Date.now();
                    this.placeOrder();
                }
            }
            if (this.orderCompleted && this.isOrderCorrect()) {
                this.mood = 'ecstatic';
                this.speed = new Eisdealer.Vector(1, 1);
                this.leaving = true;
            }
            else if (Date.now() - this.waitStartTime > 20000) {
                this.mood = 'sad';
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
                console.log(`${this.type} left the shop.`);
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
                // Augen
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x - 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.arc(x + 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.fillStyle = '#000000';
                Eisdealer.crc2.fill();
                // Mund
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
            return this.y < -50;
        }
    }
    Eisdealer.Customer = Customer;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Customer.js.map