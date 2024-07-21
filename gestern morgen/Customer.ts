namespace Eisdealer {
    export class Customer extends Moveables {
        private radius: number = 40;
        private skin: string = "#ffffff";
        private targetChair: Chair | null = null;
        public state: "waiting" | "coming" | "ordering" | "eating" | "paying" | "leaving" = "coming";
        private allObjects: Drawables[];
        public order: { flavor: string }[] = [];
        public orderCompleted: boolean = false;
        public leaving: boolean = false;
        private waitStartTime: number = Date.now();
        private mood: 'happy' | 'sad' | 'ecstatic' = 'happy';

        constructor(_x: number, _y: number, _direction: Vector, _speed: Vector, _type: string, allObjects: Drawables[]) {
            super(_x, _y, _direction, _speed, _type);
            this.allObjects = allObjects;
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
                    this.waitStartTime = Date.now();
                    this.placeOrder();
                }
            }

            if (this.orderCompleted && this.isOrderCorrect()) {
                this.mood = 'ecstatic';
                this.speed = new Vector(1, 1);
                this.leaving = true;
            } else if (Date.now() - this.waitStartTime > 20000) {
                this.mood = 'sad';
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
            const numScoops = Math.floor(Math.random() * 2) + 1;
            const availableFlavors = ["Schokolade", "Erdbeere", "Vanille", "Pistazie"];
            for (let i = 0; i < numScoops; i++) {
                const randomFlavor = availableFlavors[Math.floor(Math.random() * availableFlavors.length)];
                this.order.push({ flavor: randomFlavor });
            }
            this.drawOrder();
        }

        private isOrderCorrect(): boolean {
            return this.order.length > 0;
        }

        public leave(): void {
            this.speed = new Vector(5, 5);
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

        public drawOrder(): void {
            if (!this.orderCompleted) {
                const startX = this.x + 50;
                const startY = this.y;
                const yOffset = 20;
                for (let i = 0; i < this.order.length; i++) {
                    crc2.font = "16px Arial";
                    crc2.fillStyle = "#000000";
                    crc2.fillText(this.order[i].flavor, startX, startY + i * yOffset);
                }
            }
        }

        public draw(): void {
            if (this.allObjects.includes(this)) {
                const x = this.x;
                const y = this.y;
                crc2.beginPath();
                crc2.arc(x, y, this.radius, 0, Math.PI * 2);
                crc2.fillStyle = this.skin;
                crc2.strokeStyle = "#000000";
                crc2.fill();
                crc2.lineWidth = 2;
                crc2.stroke();

                // Augen
                crc2.beginPath();
                crc2.arc(x - 15, y - 10, 5, 0, Math.PI * 2);
                crc2.arc(x + 15, y - 10, 5, 0, Math.PI * 2);
                crc2.fillStyle = '#000000';
                crc2.fill();

                // Mund
                crc2.beginPath();
                if (this.mood === 'happy') {
                    crc2.arc(x, y + 10, 15, 0, Math.PI, false);
                } else if (this.mood === 'sad') {
                    crc2.arc(x, y + 20, 15, 0, Math.PI, true);
                } else if (this.mood === 'ecstatic') {
                    crc2.arc(x, y + 10, 20, 0, Math.PI, false);
                    crc2.moveTo(x - 20, y + 10);
                    crc2.lineTo(x + 20, y + 10);
                }
                crc2.strokeStyle = '#000000';
                crc2.stroke();
            }
        }

        public update(): void {}

        public hasLeft(): boolean {
            return this.y < -50;
        }
    }
}
