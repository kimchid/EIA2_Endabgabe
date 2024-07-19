namespace Eisdealer {
    export class Customer extends Moveables {
        private radius: number;
        private skin: string;
        private targetChair: Chair | null;
        private allObjects: Drawables[];
        public order: { flavor: string }[];
        public orderCompleted: boolean = false;
        public leaving: boolean = false;
        private waitStartTime: number; // Time when customer starts waiting
        private mood: 'happy' | 'sad' | 'ecstatic' = 'happy'; // Customer mood

        constructor(_x: number, _y: number, _direction: Vector, _speed: Vector, _type: string, allObjects: Drawables[]) {
            super(_x, _y, _direction, _speed, _type);
            this.radius = 40;
            this.skin = "#ffffff";
            this.targetChair = null;
            this.allObjects = allObjects;
            this.order = [];
            this.waitStartTime = Date.now(); // Initialize wait start time
        }

        public move(): void {
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
                    this.speed = new Vector(0, 0);
                    this.targetChair = null;
                    this.waitStartTime = Date.now(); // Reset wait start time when seated

                    // Place the order once the chair is occupied
                    this.placeOrder();
                }
            }

            if (this.orderCompleted) {
                if (this.isOrderCorrect()) {
                    this.mood = 'ecstatic'; // Set mood to ecstatic if the order is correct
                } else {
                    this.mood = 'happy'; // Default to happy if not ecstatic
                }
                this.speed = new Vector(1, 1); // Adjust speed when order is completed
                this.leaving = true; // Mark the customer as leaving
            } else {
                // Check if the customer has been waiting too long
                const currentTime = Date.now();
                if (currentTime - this.waitStartTime > 20000) { // Adjust waiting time threshold as needed
                    this.mood = 'sad'; // Set mood to sad if waiting too long
                }
            }
        }

        private findNextUnoccupiedChair(): void {
            for (const obj of this.allObjects) {
                if (obj instanceof Chair && !obj.isOccupied()) {
                    this.targetChair = obj;
                    break;
                }
            }
        }

        private placeOrder(): void {
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

        private isOrderCorrect(): boolean {
            // Logic to determine if the order is correct
            // For simplicity, assume any non-empty order is correct
            return this.order.length > 0;
        }

        public leave(): void {
            this.speed = new Vector(5, 5); // Set speed for leaving

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

        public drawOrder(): void {
            if (!this.orderCompleted) {
                const startX = this.x + 50;
                const startY = this.y;
                const yOffset = 20; // Vertical spacing between text lines

                for (let i = 0; i < this.order.length; i++) {
                    const x = startX;
                    const y = startY + i * yOffset;
                    const flavorText = this.order[i].flavor;

                    // Display the flavor text
                    crc2.font = "16px Arial";
                    crc2.fillStyle = "#000000";
                    crc2.fillText(flavorText, x, y);
                }
            }
        }

        public draw(): void {
            if (this.allObjects.includes(this)) {
                const x = this.x;
                const y = this.y;
                const radius = this.radius;
                const skin = this.skin;

                // Draw head
                crc2.beginPath();
                crc2.arc(x, y, radius, 0, Math.PI * 2);
                crc2.fillStyle = skin;
                crc2.strokeStyle = "#000000";
                crc2.fill();
                crc2.lineWidth = 2;
                crc2.stroke();

                // Draw eyes
                crc2.beginPath();
                crc2.arc(x - 15, y - 10, 5, 0, Math.PI * 2);
                crc2.arc(x + 15, y - 10, 5, 0, Math.PI * 2);
                crc2.fillStyle = '#000000';
                crc2.fill();

                // Draw mouth based on mood
                crc2.beginPath();
                if (this.mood === 'happy') {
                    crc2.arc(x, y + 10, 15, 0, Math.PI, false); // Smiling
                } else if (this.mood === 'sad') {
                    crc2.arc(x, y + 20, 15, 0, Math.PI, true); // Frowning
                } else if (this.mood === 'ecstatic') {
                    crc2.arc(x, y + 10, 20, 0, Math.PI, false); // Extremely happy
                    crc2.moveTo(x - 20, y + 10); // Add extra details for ecstatic mood
                    crc2.lineTo(x + 20, y + 10);
                }
                crc2.strokeStyle = '#000000';
                crc2.stroke();
            }
        }

        public update(): void {
            // Implement necessary update logic here if required
        }

        public hasLeft(): boolean {
            return this.y < -50; // Consider the customer has left if they move off the screen
        }
    }
}

// namespace Endabgabe_Eisdealer {
//     export class Customer {
//       public positionX: number;
//       public positionY: number;
//       public color: string;
//       public mood: "happy" | "sad" | "excited";
//       public state: "waiting" | "coming" | "ordering" | "eating" | "paying" | "leaving";
//       public targetPositionX: number | undefined;
//       public targetPositionY: number | undefined;
//       public id: number;
  
//       private static nextId: number = 1;
//       private startTime: number | undefined;
  
//       constructor(_positionX: number, _positionY: number, _color: string) {
//         this.positionX = _positionX;
//         this.positionY = _positionY;
//         this.color = _color;
//         this.mood = "happy";
//         this.state = "waiting";
//         this.targetPositionX = undefined;
//         this.targetPositionY = undefined;
//         this.id = Customer.nextId++;
//       }
  
//       public move(): void {
//         if (this.state == "coming" && this.targetPositionX !== undefined && this.targetPositionY !== undefined) {
//           // Move towards the target table
//           let dx = this.targetPositionX - this.positionX;
//           let dy = this.targetPositionY - this.positionY;
//           let distance = Math.sqrt(dx * dx + dy * dy);
  
//           if (distance > 1) {
//             this.positionX += dx / distance * 2;
//             this.positionY += dy / distance * 2;
//           } else {
//             this.order();
//           }
//         } else if (this.state == "eating") {
//           // Move towards the Cone
//           let conePositionX = 900;
//           let conePositionY = 270;
  
//           let dx = conePositionX - this.positionX;
//           let dy = conePositionY - this.positionY;
//           let distance = Math.sqrt(dx * dx + dy * dy);
  
//           if (distance > 1) {
//             this.positionX += dx / distance * 2;
//             this.positionY += dy / distance * 2;
//           } else {
//             this.state = "paying";
//           }
//         } else if (this.state == "paying") {
//           displayCustomerPayment();
  
//         } else if (this.state == "waiting" || this.state == "ordering") {
//           // Start order timer if not already started
//           if (!this.startTime) {
//             this.startTimer();
//           }
//         } else if (this.state == "leaving") {
//           let dx = 0 - this.positionX;
//           let dy = 0 - this.positionY;
//           let distance = Math.sqrt(dx * dx + dy * dy);
  
//           if (distance > 1) {
//             this.positionX += dx / distance * 2;
//             this.positionY += dy / distance * 2;
//           } else {
  
//             // Remove the customer from the scene
//             removeElements(this);
//           }
//         }
  
//         this.draw();
//       }
  
//       public order(): void {
//         this.state = "ordering";
//         displayCustomerOrder();
//       }
  
//       public startTimer(): void {
//         this.startTime = Date.now();
      
//         setTimeout(() => {
//           if ((this.state == "waiting" || this.state == "ordering" || this.state == "paying") && this.startTime !== undefined) {
//             let currentTime = Date.now();
//             let elapsedSeconds = (currentTime - this.startTime) / 1000;
      
//             if (elapsedSeconds > 45) {
//               this.mood = "sad";
//             }
//           }
//         }, 45000);
//       }
  
//       public draw(): void {
//         crc2.save();
//         crc2.beginPath();
//         crc2.translate(this.positionX, this.positionY);
  
//         if (this.mood == "happy") {
//           crc2.fillStyle = this.color;
//         } else if (this.mood == "sad") {
//           crc2.fillStyle = "red";
//         } else if (this.mood == "excited") {
//           crc2.fillStyle = "orange";
//         }
  
//         crc2.arc(0, 0, 40, 0, 2 * Math.PI);
//         crc2.fill();
//         crc2.closePath();
  
//         crc2.beginPath();
//         crc2.fillStyle = 'black';
//         crc2.arc(-20, -10, 4, 0, 2 * Math.PI);
//         crc2.fill();
//         crc2.closePath();
//         crc2.beginPath();
//         crc2.arc(15, -15, 4, 0, 2 * Math.PI);
//         crc2.fill();
//         crc2.closePath();
  
//         crc2.beginPath();
//         crc2.strokeStyle = 'black';
//         crc2.lineWidth = 5;
  
//         if (this.mood == "happy" || this.mood == "excited") {
//           crc2.arc(0, 0, 8, 0, Math.PI, false);
//         } else if (this.mood == "sad") {
//           crc2.arc(0, 8, 8, Math.PI, 2 * Math.PI, false);
//         }
  
//         crc2.stroke();
//         crc2.closePath();
  
//         crc2.restore();
//       }
//     }
//   }