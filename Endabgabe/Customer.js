"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Customer extends Eisdealer.Moveables {
        radius;
        skin;
        targetChair;
        allObjects;
        order;
        orderCompleted = false;
        leaving = false;
        waitStartTime; // Time when customer starts waiting
        mood = 'happy'; // Customer mood
        constructor(_x, _y, _direction, _speed, _type, allObjects) {
            super(_x, _y, _direction, _speed, _type);
            this.radius = 40;
            this.skin = "#ffffff";
            this.targetChair = null;
            this.allObjects = allObjects;
            this.order = [];
            this.waitStartTime = Date.now(); // Initialize wait start time
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
                    this.waitStartTime = Date.now(); // Reset wait start time when seated
                    // Place the order once the chair is occupied
                    this.placeOrder();
                }
            }
            if (this.orderCompleted) {
                if (this.isOrderCorrect()) {
                    this.mood = 'ecstatic'; // Set mood to ecstatic if the order is correct
                }
                else {
                    this.mood = 'happy'; // Default to happy if not ecstatic
                }
                this.speed = new Eisdealer.Vector(1, 1); // Adjust speed when order is completed
                this.leaving = true; // Mark the customer as leaving
            }
            else {
                // Check if the customer has been waiting too long
                const currentTime = Date.now();
                if (currentTime - this.waitStartTime > 20000) { // Adjust waiting time threshold as needed
                    this.mood = 'sad'; // Set mood to sad if waiting too long
                }
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
            const numScoops = Math.floor(Math.random() * 2) + 1; // Random number of scoops (1-2)
            const availableFlavors = ["Schokolade", "Erdbeere", "Vanille", "Pistazie"];
            for (let i = 0; i < numScoops; i++) {
                const randomIndex = Math.floor(Math.random() * availableFlavors.length);
                const randomFlavor = availableFlavors[randomIndex];
                this.order.push({ flavor: randomFlavor });
            }
            // Display the order
            this.drawOrder();
        }
        isOrderCorrect() {
            // Logic to determine if the order is correct
            // For simplicity, assume any non-empty order is correct
            return this.order.length > 0;
        }
        leave() {
            this.speed = new Eisdealer.Vector(5, 5); // Set speed for leaving
            const dx = 500 - this.x;
            const dy = -50 - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const moveDistance = Math.min(distance, Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y));
            this.x += (dx / distance) * moveDistance;
            this.y += (dy / distance) * moveDistance;
            // Remove customer from allObjects once they reach the exit
            if (this.y < -50) { // Adjust the condition based on your canvas size
                console.log(`${this.type} left the shop.`);
                this.allObjects = this.allObjects.filter(obj => obj !== this);
            }
        }
        drawOrder() {
            if (!this.orderCompleted) {
                const startX = this.x + 50;
                const startY = this.y;
                const yOffset = 20; // Vertical spacing between text lines
                for (let i = 0; i < this.order.length; i++) {
                    const x = startX;
                    const y = startY + i * yOffset;
                    const flavorText = this.order[i].flavor;
                    // Display the flavor text
                    Eisdealer.crc2.font = "16px Arial";
                    Eisdealer.crc2.fillStyle = "#000000";
                    Eisdealer.crc2.fillText(flavorText, x, y);
                }
            }
        }
        draw() {
            if (this.allObjects.includes(this)) {
                const x = this.x;
                const y = this.y;
                const radius = this.radius;
                const skin = this.skin;
                // Draw head
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x, y, radius, 0, Math.PI * 2);
                Eisdealer.crc2.fillStyle = skin;
                Eisdealer.crc2.strokeStyle = "#000000";
                Eisdealer.crc2.fill();
                Eisdealer.crc2.lineWidth = 2;
                Eisdealer.crc2.stroke();
                // Draw eyes
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x - 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.arc(x + 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.fillStyle = '#000000';
                Eisdealer.crc2.fill();
                // Draw mouth based on mood
                Eisdealer.crc2.beginPath();
                if (this.mood === 'happy') {
                    Eisdealer.crc2.arc(x, y + 10, 15, 0, Math.PI, false); // Smiling
                }
                else if (this.mood === 'sad') {
                    Eisdealer.crc2.arc(x, y + 20, 15, 0, Math.PI, true); // Frowning
                }
                else if (this.mood === 'ecstatic') {
                    Eisdealer.crc2.arc(x, y + 10, 20, 0, Math.PI, false); // Extremely happy
                    Eisdealer.crc2.moveTo(x - 20, y + 10); // Add extra details for ecstatic mood
                    Eisdealer.crc2.lineTo(x + 20, y + 10);
                }
                Eisdealer.crc2.strokeStyle = '#000000';
                Eisdealer.crc2.stroke();
            }
        }
        update() {
            // Implement necessary update logic here if required
        }
        hasLeft() {
            return this.y < -50; // Consider the customer has left if they move off the screen
        }
    }
    Eisdealer.Customer = Customer;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Customer.js.map