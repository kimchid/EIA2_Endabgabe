namespace Eisdealer {

    // Die Klasse Customer erbt von der Klasse Moveables, was bedeutet, dass sie 
    // grundlegende Bewegungseigenschaften und -methoden von Moveables übernimmt.
    export class Customer extends Moveables {
        // Der Radius des Kunden (für das Zeichnen).
        private radius: number = 40;
        // Die Hautfarbe des Kunden, standardmäßig weiß.
        private skin: string = "#ffffff";
        // Der Stuhl, auf dem der Kunde sitzt oder auf den er sich bewegen möchte.
        private targetChair: Chair | null = null;
        // Alle Objekte, die auf dem Bildschirm gezeichnet werden (Stühle, Tische, etc.).
        private allObjects: Drawables[];
        // Die Bestellung des Kunden, als Array von Objekten, die den Geschmacksrichtungen entsprechen.
        public order: { flavor: string }[] = [];
        // Status, ob die Bestellung abgeschlossen ist.
        public orderCompleted: boolean = false;
        // Status, ob der Kunde das Lokal verlässt.
        public leaving: boolean = false;
        // Zeitpunkt, zu dem der Kunde zu warten begann, um die Wartezeit zu messen.
        private waitStartTime: number = Date.now();
        // Die Stimmung des Kunden, die in drei möglichen Zuständen sein kann: 'happy', 'sad', 'ecstatic'.
        private mood: 'happy' | 'sad' | 'ecstatic' = 'happy';
        // Der aktuelle Zustand des Kunden. Mögliche Zustände sind: "walk in", "sit", "pay", "leave".
        public state: "walk in" | "sit" | "pay" | "leave";
        // Der Stuhl, der dem Kunden zugewiesen wurde.
        public assignedChair: Chair | null = null;
        // Status, ob der Kunde bezahlen möchte.
        public customerPay: boolean = false;
        // Status, ob der Kunde bezahlt hat.
        public paid: boolean = false;
        // Status, ob die Bestellung des Kunden korrekt ist.
        public orderCorrect: boolean = false;
        // Status, ob die Bestellung des Kunden überprüft wurde.
        public orderChecked: boolean = false;

        // Konstruktor der Customer-Klasse. Initialisiert die Eigenschaften des Kunden.
        constructor(_x: number, _y: number, _direction: Vector, _speed: Vector, _type: string, allObjects: Drawables[]) {
            super(_x, _y, _direction, _speed, _type);
            this.allObjects = allObjects;
            this.state = "walk in"; // Setzt den anfänglichen Zustand auf "walk in".
        }

        // Die Hauptbeweungsmethode des Kunden, die je nach Zustand unterschiedliche Methoden aufruft.
        public move(): void {
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
        

        // Methode, die den Zustand "walk in" behandelt.
        private handleWalkIn(): void {
            // Wenn der Kunde keinen Zielstuhl hat oder der Zielstuhl besetzt ist, wird ein neuer Stuhl gesucht.
            if (!this.targetChair || this.targetChair.isOccupied()) {
                this.findNextUnoccupiedChair();
            }

            if (this.targetChair) {
                // Berechnet den Abstand zwischen dem Kunden und dem Zielstuhl.
                const dx = this.targetChair.x - this.x + 50;
                const dy = this.targetChair.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                // Die Distanz, die der Kunde sich in einem Schritt bewegt, wird auf die Geschwindigkeit des Kunden begrenzt.
                const moveDistance = Math.min(this.speed.x, distance);

                // Aktualisiert die Position des Kunden, um sich in Richtung des Zielstuhls zu bewegen.
                this.x += (dx / distance) * moveDistance;
                this.y += (dy / distance) * moveDistance;

                // Wenn der Kunde nahe genug am Zielstuhl ist, wird der Stuhl besetzt und der Zustand ändert sich zu "sit".
                if (distance < this.speed.x) {
                    this.targetChair.occupy();
                    this.speed = new Vector(0, 0);
                    this.assignedChair = this.targetChair;
                    this.targetChair = null;

                    // Bestellung aufgeben.
                    this.placeOrder();
                    this.state = "sit";
                    this.waitStartTime = Date.now(); // Setzt den Startzeitpunkt für das Warten.
                }
            }
        }

        // Methode, die den Zustand "sit" behandelt.
        private handleSit(): void {
            // When the order is completed, check if it's correct and prepare the customer to leave.
            if (this.orderCompleted) {
                if (this.orderCorrect) {
                    this.mood = 'ecstatic'; // If the order is correct, set the mood to "ecstatic".
                } else {
                    this.mood = 'sad'; // If the order is not correct, set the mood to "sad".
                }
                this.speed = new Vector(1, 1);
                this.state = "leave";
                this.leaving = true;
            } else if (Date.now() - this.waitStartTime > 10000) {
                // If the customer waits longer than 10 seconds and the order is not completed, set the mood to "sad".
                this.mood = 'sad';
            }
        }
        

        // Methode, die den Zustand "leave" behandelt.
        private handleLeave(): void {
            // Zielkoordinaten, zu denen der Kunde geht, um das Lokal zu verlassen.
            const targetX = 500;
            const targetY = -50;
            const dxLeave = targetX - this.x;
            const dyLeave = targetY - this.y;
            const distanceLeave = Math.sqrt(dxLeave * dxLeave + dyLeave * dyLeave);
            this.speed = new Vector(2, 2);
            // Die Distanz, die der Kunde sich in einem Schritt bewegt, wird auf die Geschwindigkeit des Kunden begrenzt.
            const moveDistanceLeave = Math.min(this.speed.x, distanceLeave);

            // Aktualisiert die Position des Kunden, um sich in Richtung des Ausgangs zu bewegen.
            this.x += (dxLeave / distanceLeave) * moveDistanceLeave;
            this.y += (dyLeave / distanceLeave) * moveDistanceLeave;

            // Wenn der Kunde das Lokal verlassen hat, wird der Stuhl freigegeben und der Kunde aus der Liste der Objekte entfernt.
            if (this.y < -49) {
                if (this.assignedChair) {
                    this.assignedChair.free();
                }
                this.allObjects = this.allObjects.filter(obj => obj !== this);
                this.createSingleCustomer(); // Ein neuer Kunde wird erstellt.
            }
        }

        // Methode, die den nächsten freien Stuhl sucht und als Zielstuhl festlegt.
        private findNextUnoccupiedChair(): void {
            for (const obj of this.allObjects) {
                if (obj instanceof Chair && !obj.isOccupied()) {
                    this.targetChair = obj;
                    break;
                }
            }
        }

        // Methode, um einen neuen Kunden zu erstellen und ihn zur Liste der Objekte hinzuzufügen.
        public createSingleCustomer(): void {
            let customerX = 500;
            let customerY = -50;
            let customer = new Customer(customerX, customerY, new Vector(0, 0), new Vector(4, 4), `Customer`, this.allObjects);
            this.allObjects.push(customer); // Fügt den neuen Kunden zur Liste der Objekte hinzu.
            customer.state = "walk in";
            customer.mood = "happy";
        }

        // Methode, um eine zufällige Bestellung mit einer oder zwei Kugeln Eis zu erstellen.
        private placeOrder(): void {
            const numScoops = Math.floor(Math.random() * 2) + 1; // Bestimmt die Anzahl der Eiskugeln (1 oder 2).
            const availableFlavors = ["Schokolade", "Erdbeere", "Vanille", "Pistazie"];
            for (let i = 0; i < numScoops; i++) {
                // Wählt einen zufälligen Geschmack aus der Liste der verfügbaren Geschmäcke.
                const randomFlavor = availableFlavors[Math.floor(Math.random() * availableFlavors.length)];
                this.order.push({ flavor: randomFlavor });
            }
            this.drawOrder(); // Zeichnet die Bestellung des Kunden.
        }

        // // Methode zur Überprüfung, ob die Bestellung des Kunden korrekt ist.
        // private isOrderCorrect(): boolean {
        //     return this.order.length > 0 && Math.random() > 0.5; // Gibt zufällig true oder false zurück, um zu simulieren, ob die Bestellung korrekt ist.
        // }

        // Methode, um den Kunden zu zeichnen (darzustellen).
        public draw(): void {
            if (this.allObjects.includes(this)) {
                const x = this.x;
                const y = this.y;
                crc2.beginPath();
                crc2.arc(x, y, this.radius, 0, Math.PI * 2); // Draw the customer's head
                crc2.fillStyle = this.skin;
                crc2.strokeStyle = "#000000";
                crc2.fill();
                crc2.lineWidth = 2;
                crc2.stroke();
        
                // Draw the customer's eyes
                crc2.beginPath();
                crc2.arc(x - 15, y - 10, 5, 0, Math.PI * 2);
                crc2.arc(x + 15, y - 10, 5, 0, Math.PI * 2);
                crc2.fillStyle = '#000000';
                crc2.fill();
        
                // Draw the customer's mouth based on their mood
                crc2.beginPath();
                if (this.mood === 'happy') {
                    crc2.arc(x, y + 10, 15, 0, Math.PI, false); // Smile for happy mood
                } else if (this.mood === 'sad') {
                    crc2.arc(x, y + 20, 15, 0, Math.PI, true); // Sad mouth for sad mood
                } else if (this.mood === 'ecstatic') {
                    crc2.arc(x, y + 10, 20, 0, Math.PI, false); // Wide smile for ecstatic mood
                    crc2.moveTo(x - 20, y + 10);
                    crc2.lineTo(x + 20, y + 10);
                }
                crc2.strokeStyle = '#000000';
                crc2.stroke();
            }
        }
        

        // Methode, die momentan leer ist und möglicherweise in der Zukunft verwendet werden soll.
        public update(): void {}

        // Methode, die überprüft, ob der Kunde das Lokal verlassen hat.
        public hasLeft(): boolean {
            return this.y < -49; // Überprüft, ob der Kunde außerhalb des sichtbaren Bereichs ist.
        }

        // Methode, die die Bestellung des Kunden auf dem Bildschirm zeichnet.
        public drawOrder(): void {
            if (!this.orderCompleted) {
                const startX = this.x + 50;
                const startY = this.y;
                const yOffset = 20;
                for (let i = 0; i < this.order.length; i++) {
                    crc2.font = "16px Arial";
                    crc2.fillStyle = "#000000";
                    crc2.fillText(this.order[i].flavor, startX, startY + i * yOffset); // Zeichnet die Geschmacksrichtung.
                }
            }
        }
    }
}
