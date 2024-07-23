"use strict";
var Eisdealer;
(function (Eisdealer) {
    // Die Klasse `Customer` erbt von `Moveables`
    class Customer extends Eisdealer.Moveables {
        // Private Eigenschaften
        radius = 40; // Radius des Kundenkreises
        skin = "#ffffff"; // Hautfarbe des Kunden
        targetChair = null; // Zielstuhl des Kunden
        allObjects; // Alle Zeichnungsobjekte im Spiel
        order = []; // Die Bestellung des Kunden
        orderCompleted = false; // Status der Bestellfertigstellung
        leaving = false; // Status des Verlassens
        waitStartTime = Date.now(); // Startzeit des Wartens
        mood = 'happy'; // Stimmung des Kunden
        state; // Zustand des Kunden
        assignedChair = null; // Zugewiesener Stuhl des Kunden
        customerPay = false; // Status der Zahlung
        paid = false; // Zahlungsstatus
        orderCorrect = false; // Status der Korrektheit der Bestellung
        orderChecked = false; // Status der Überprüfung der Bestellung
        // Konstruktor
        constructor(_x, _y, _direction, _speed, _type, allObjects) {
            super(_x, _y, _direction, _speed, _type); // Aufruf des Konstruktors der Basisklasse
            this.allObjects = allObjects; // Initialisierung aller Objekte
            this.state = "walk in"; // Initialisierung des Zustands
        }
        // Methode zum Bewegen des Kunden
        move() {
            switch (this.state) {
                case "walk in":
                    this.handleWalkIn(); // Handhabung des Eintritts
                    break;
                case "sit":
                    this.handleSit(); // Handhabung des Sitzens
                    break;
                case "leave":
                    this.handleLeave(); // Handhabung des Verlassens
                    break;
            }
        }
        // Methode zur Handhabung des Eintritts
        handleWalkIn() {
            if (!this.targetChair || this.targetChair.isOccupied()) {
                this.findNextUnoccupiedChair(); // Suche nach einem unbesetzten Stuhl
            }
            if (this.targetChair) {
                const dx = this.targetChair.x - this.x + 50;
                const dy = this.targetChair.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const moveDistance = Math.min(this.speed.x, distance);
                this.x += (dx / distance) * moveDistance; // Bewegung in Richtung des Stuhls
                this.y += (dy / distance) * moveDistance;
                if (distance < this.speed.x) {
                    this.targetChair.occupy(); // Besetzen des Stuhls
                    this.speed = new Eisdealer.Vector(0, 0); // Geschwindigkeit auf 0 setzen
                    this.assignedChair = this.targetChair; // Zuordnung des Stuhls
                    this.targetChair = null;
                    // Bestellung aufgeben
                    this.placeOrder();
                    this.state = "sit"; // Zustand auf "sit" setzen
                    this.waitStartTime = Date.now(); // Startzeit für das Warten setzen
                }
            }
        }
        // Methode zur Handhabung des Sitzens
        handleSit() {
            if (this.orderCompleted) {
                if (this.isOrderCorrect()) {
                    this.mood = 'ecstatic'; // Stimmung auf "ecstatic" setzen
                    this.speed = new Eisdealer.Vector(1, 1);
                    this.state = "leave"; // Zustand auf "leave" setzen
                    this.leaving = true;
                }
                else {
                    this.mood = 'sad'; // Stimmung auf "sad" setzen
                    this.state = "leave"; // Zustand auf "leave" setzen
                    this.leaving = true;
                }
            }
            else if (Date.now() - this.waitStartTime > 10000) {
                this.mood = 'sad'; // Stimmung auf "sad" setzen, wenn Wartezeit überschritten
            }
        }
        // Methode zur Handhabung des Verlassens
        handleLeave() {
            const targetX = 500;
            const targetY = -50;
            const dxLeave = targetX - this.x;
            const dyLeave = targetY - this.y;
            const distanceLeave = Math.sqrt(dxLeave * dxLeave + dyLeave * dyLeave);
            this.speed = new Eisdealer.Vector(2, 2);
            const moveDistanceLeave = Math.min(this.speed.x, distanceLeave);
            this.x += (dxLeave / distanceLeave) * moveDistanceLeave; // Bewegung in Richtung des Ausgangs
            this.y += (dyLeave / distanceLeave) * moveDistanceLeave;
            if (this.y < -49) {
                if (this.assignedChair) {
                    this.assignedChair.free(); // Freigeben des Stuhls
                }
                this.allObjects = this.allObjects.filter(obj => obj !== this); // Entfernen des Kunden aus den Objekten
                this.createSingleCustomer(); // Erstellen eines neuen Kunden
            }
        }
        // Methode zur Suche nach einem unbesetzten Stuhl
        findNextUnoccupiedChair() {
            for (const obj of this.allObjects) {
                if (obj instanceof Eisdealer.Chair && !obj.isOccupied()) {
                    this.targetChair = obj; // Setzen des Zielstuhls
                    break;
                }
            }
        }
        // Methode zur Erstellung eines neuen Kunden
        createSingleCustomer() {
            let customerX = 500;
            let customerY = -50;
            let customer = new Customer(customerX, customerY, new Eisdealer.Vector(0, 0), new Eisdealer.Vector(4, 4), `Customer`, this.allObjects);
            this.allObjects.push(customer); // Hinzufügen des Kunden zu den Objekten
            customer.state = "walk in"; // Zustand auf "walk in" setzen
            customer.mood = "happy"; // Stimmung auf "happy" setzen
        }
        // Methode zum Aufgeben der Bestellung
        placeOrder() {
            const numScoops = Math.floor(Math.random() * 2) + 1; // Zufällige Anzahl von Kugeln
            const availableFlavors = ["Schokolade", "Erdbeere", "Vanille", "Pistazie"];
            for (let i = 0; i < numScoops; i++) {
                const randomFlavor = availableFlavors[Math.floor(Math.random() * availableFlavors.length)];
                this.order.push({ flavor: randomFlavor }); // Hinzufügen der Geschmacksrichtung zur Bestellung
            }
            this.drawOrder(); // Zeichnen der Bestellung
        }
        // Methode zur Überprüfung der Korrektheit der Bestellung
        isOrderCorrect() {
            // Hier sollte die Logik zur Überprüfung der Bestellung implementiert werden
            // Dies ist nur eine Platzhalter-Implementierung
            return this.order.length > 0 && Math.random() > 0.5;
        }
        // Methode zum Verlassen des Kunden
        leave() {
            this.speed = new Eisdealer.Vector(5, 5);
            const dx = 500 - this.x;
            const dy = -50 - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const moveDistance = Math.min(distance, Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y));
            this.x += (dx / distance) * moveDistance; // Bewegung in Richtung des Ausgangs
            this.y += (dy / distance) * moveDistance;
            if (this.y < -50) {
                const index = this.allObjects.indexOf(this);
                if (index > -1) {
                    this.allObjects.splice(index, 1); // Entfernen des Kunden aus den Objekten
                }
            }
        }
        // Methode zum Zeichnen der Bestellung
        drawOrder() {
            if (!this.orderCompleted) {
                const startX = this.x + 50;
                const startY = this.y;
                const yOffset = 20;
                for (let i = 0; i < this.order.length; i++) {
                    Eisdealer.crc2.font = "16px Arial";
                    Eisdealer.crc2.fillStyle = "#000000";
                    Eisdealer.crc2.fillText(this.order[i].flavor, startX, startY + i * yOffset); // Zeichnen des Bestelltextes
                }
            }
        }
        // Methode zum Zeichnen des Kunden
        draw() {
            if (this.allObjects.includes(this)) {
                const x = this.x;
                const y = this.y;
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x, y, this.radius, 0, Math.PI * 2); // Zeichnen des Kundenkreises
                Eisdealer.crc2.fillStyle = this.skin;
                Eisdealer.crc2.strokeStyle = "#000000";
                Eisdealer.crc2.fill();
                Eisdealer.crc2.lineWidth = 2;
                Eisdealer.crc2.stroke();
                // Augen zeichnen
                Eisdealer.crc2.beginPath();
                Eisdealer.crc2.arc(x - 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.arc(x + 15, y - 10, 5, 0, Math.PI * 2);
                Eisdealer.crc2.fillStyle = '#000000';
                Eisdealer.crc2.fill();
                // Mund zeichnen
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
        // Leere Methode zum Aktualisieren
        update() { }
        // Methode zur Überprüfung, ob der Kunde das Gelände verlassen hat
        hasLeft() {
            return this.y < -49; // Anpassung für Verlassen-Bedingung
        }
    }
    Eisdealer.Customer = Customer;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Customer.js.map