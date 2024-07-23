"use strict";
var Eisdealer;
(function (Eisdealer) {
    // Die Klasse Customer erbt von der Klasse Moveables, was bedeutet, dass sie 
    // grundlegende Bewegungseigenschaften und -methoden von Moveables übernimmt.
    class Customer extends Eisdealer.Moveables {
        // Der Radius des Kunden (für das Zeichnen).
        radius = 40;
        // Die Hautfarbe des Kunden, standardmäßig weiß.
        skin = "#ffffff";
        // Der Stuhl, auf dem der Kunde sitzt oder auf den er sich bewegen möchte.
        targetChair = null;
        // Alle Objekte, die auf dem Bildschirm gezeichnet werden (Stühle, Tische, etc.).
        allObjects;
        // Die Bestellung des Kunden, als Array von Objekten, die den Geschmacksrichtungen entsprechen.
        order = [];
        // Status, ob die Bestellung abgeschlossen ist.
        orderCompleted = false;
        // Status, ob der Kunde das Lokal verlässt.
        leaving = false;
        // Zeitpunkt, zu dem der Kunde zu warten begann, um die Wartezeit zu messen.
        waitStartTime = Date.now();
        // Die Stimmung des Kunden, die in drei möglichen Zuständen sein kann: 'happy', 'sad', 'ecstatic'.
        mood = 'happy';
        // Der aktuelle Zustand des Kunden. Mögliche Zustände sind: "walk in", "sit", "pay", "leave".
        state;
        // Der Stuhl, der dem Kunden zugewiesen wurde.
        assignedChair = null;
        // Status, ob der Kunde bezahlen möchte.
        customerPay = false;
        // Status, ob der Kunde bezahlt hat.
        paid = false;
        // Status, ob die Bestellung des Kunden korrekt ist.
        orderCorrect = false;
        // Status, ob die Bestellung des Kunden überprüft wurde.
        orderChecked = false;
        // Konstruktor der Customer-Klasse. Initialisiert die Eigenschaften des Kunden.
        constructor(_x, _y, _direction, _speed, _type, allObjects) {
            super(_x, _y, _direction, _speed, _type);
            this.allObjects = allObjects;
            this.state = "walk in"; // Setzt den anfänglichen Zustand auf "walk in".
        }
        // Die Hauptbeweungsmethode des Kunden, die je nach Zustand unterschiedliche Methoden aufruft.
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
        // Methode, die den Zustand "walk in" behandelt.
        handleWalkIn() {
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
                    this.speed = new Eisdealer.Vector(0, 0);
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
        handleSit() {
            // Wenn die Bestellung abgeschlossen ist, wird überprüft, ob sie korrekt ist und der Kunde bereitet sich darauf vor, zu gehen.
            if (this.orderCompleted) {
                if (this.isOrderCorrect()) {
                    this.mood = 'ecstatic'; // Wenn die Bestellung korrekt ist, wird die Stimmung auf "ecstatic" gesetzt.
                    this.speed = new Eisdealer.Vector(1, 1);
                    this.state = "leave";
                    this.leaving = true;
                }
                else {
                    this.mood = 'sad'; // Wenn die Bestellung nicht korrekt ist, wird die Stimmung auf "sad" gesetzt.
                    this.state = "leave";
                    this.leaving = true;
                }
            }
            else if (Date.now() - this.waitStartTime > 10000) {
                // Wenn der Kunde länger als 10 Sekunden wartet und die Bestellung noch nicht abgeschlossen ist, wird die Stimmung auf "sad" gesetzt.
                this.mood = 'sad';
            }
        }
        // Methode, die den Zustand "leave" behandelt.
        handleLeave() {
            // Zielkoordinaten, zu denen der Kunde geht, um das Lokal zu verlassen.
            const targetX = 500;
            const targetY = -50;
            const dxLeave = targetX - this.x;
            const dyLeave = targetY - this.y;
            const distanceLeave = Math.sqrt(dxLeave * dxLeave + dyLeave * dyLeave);
            this.speed = new Eisdealer.Vector(2, 2);
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
        findNextUnoccupiedChair() {
            for (const obj of this.allObjects) {
                if (obj instanceof Eisdealer.Chair && !obj.isOccupied()) {
                    this.targetChair = obj;
                    break;
                }
            }
        }
        // Methode, um einen neuen Kunden zu erstellen und ihn zur Liste der Objekte hinzuzufügen.
        createSingleCustomer() {
            let customerX = 500;
            let customerY = -50;
            let customer = new Customer(customerX, customerY, new Eisdealer.Vector(0, 0), new Eisdealer.Vector(4, 4), `Customer`, this.allObjects);
            this.allObjects.push(customer); // Fügt den neuen Kunden zur Liste der Objekte hinzu.
            customer.state = "walk in";
            customer.mood = "happy";
        }
        // Methode, um eine zufällige Bestellung mit einer oder zwei Kugeln Eis zu erstellen.
        placeOrder() {
            const numScoops = Math.floor(Math.random() * 2) + 1; // Bestimmt die Anzahl der Eiskugeln (1 oder 2).
            const availableFlavors = ["Schokolade", "Erdbeere", "Vanille", "Pistazie"];
            for (let i = 0; i < numScoops; i++) {
                // Wählt einen zufälligen Geschmack aus der Liste der verfügbaren Geschmäcke.
                const randomFlavor = availableFlavors[Math.floor(Math.random() * availableFlavors.length)];
                this.order.push({ flavor: randomFlavor });
            }
            this.drawOrder(); // Zeichnet die Bestellung des Kunden.
        }
        // Methode zur Überprüfung, ob die Bestellung des Kunden korrekt ist.
        isOrderCorrect() {
            return this.order.length > 0 && Math.random() > 0.5; // Gibt zufällig true oder false zurück, um zu simulieren, ob die Bestellung korrekt ist.
        }
        // Methode, um den Kunden zu zeichnen (darzustellen).
        draw() {
            if (this.allObjects.includes(this)) {
                const x = this.x;
                const y = this.y;
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x, y, this.radius, 0, Math.PI * 2); // Zeichnet den Kopf des Kunden.
                Eisdealer.crc2.fillStyle = this.skin;
                Eisdealer.crc2.strokeStyle = "#000000";
                Eisdealer.crc2.fill();
                Eisdealer.crc2.lineWidth = 2;
                Eisdealer.crc2.stroke();
                // Zeichnet die Augen des Kunden.
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x - 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.arc(x + 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.fillStyle = '#000000';
                Eisdealer.crc2.fill();
                // Zeichnet den Mund des Kunden basierend auf seiner Stimmung.
                Eisdealer.crc2.beginPath();
                if (this.mood === 'happy') {
                    Eisdealer.crc2.arc(x, y + 10, 15, 0, Math.PI, false); // Lächeln für glückliche Stimmung.
                }
                else if (this.mood === 'sad') {
                    Eisdealer.crc2.arc(x, y + 20, 15, 0, Math.PI, true); // Trauriger Mund für traurige Stimmung.
                }
                else if (this.mood === 'ecstatic') {
                    Eisdealer.crc2.arc(x, y + 10, 20, 0, Math.PI, false); // Erweiterte Mundform für ekstatische Stimmung.
                    Eisdealer.crc2.moveTo(x - 20, y + 10);
                    Eisdealer.crc2.lineTo(x + 20, y + 10);
                }
                Eisdealer.crc2.strokeStyle = '#000000';
                Eisdealer.crc2.stroke();
            }
        }
        // Methode, die momentan leer ist und möglicherweise in der Zukunft verwendet werden soll.
        update() { }
        // Methode, die überprüft, ob der Kunde das Lokal verlassen hat.
        hasLeft() {
            return this.y < -49; // Überprüft, ob der Kunde außerhalb des sichtbaren Bereichs ist.
        }
        // Methode, die die Bestellung des Kunden auf dem Bildschirm zeichnet.
        drawOrder() {
            if (!this.orderCompleted) {
                const startX = this.x + 50;
                const startY = this.y;
                const yOffset = 20;
                for (let i = 0; i < this.order.length; i++) {
                    Eisdealer.crc2.font = "16px Arial";
                    Eisdealer.crc2.fillStyle = "#000000";
                    Eisdealer.crc2.fillText(this.order[i].flavor, startX, startY + i * yOffset); // Zeichnet die Geschmacksrichtung.
                }
            }
        }
    }
    Eisdealer.Customer = Customer;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Customer.js.map