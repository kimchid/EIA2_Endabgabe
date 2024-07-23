"use strict";
var Eisdealer;
(function (Eisdealer) {
    // Event Listener, der beim Laden der Seite die Funktion handleLoad aufruft
    window.addEventListener("load", handleLoad);
    // Array zur Speicherung aller zeichnbaren Objekte
    Eisdealer.allObjects = [];
    // Array für die ausgewählten Eiskugeln
    let chosenScoops = [];
    // Farben für die verschiedenen Eissorten
    let colorPistacchio = "#93c572";
    let colorStrawberry = "#C83f49";
    let colorVanille = "#F3E5AB";
    let colorChocolate = "#45322e";
    // Maximale Anzahl von Kunden
    let maxCustomers = 4;
    // HTML-Element zur Anzeige des Gesamtbetrags
    let totalElement;
    // Buttons für Kasse und Zurücksetzen
    let checkoutButton;
    let resetButton;
    // Array für die Bestellpositionen
    let orderItems = [];
    // Gesamteinnahmen des Geschäfts
    let totalIncome = 0;
    // X-Position der Sidebar
    const sidebarX = 1200;
    // Canvas-Element
    let canvas;
    // Funktion, die beim Laden der Seite aufgerufen wird
    function handleLoad(_event) {
        // Canvas-Element abrufen und den Rendering-Kontext zuweisen
        canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        Eisdealer.crc2 = canvas.getContext("2d");
        // Event Listener für Klicks auf der Canvas hinzufügen
        canvas.addEventListener("click", handleCanvasClick);
        // Initialisiere alle Objekte (Stühle, Müll, Eiskugeln)
        initializeObjects();
        // Starte die Animationsschleife alle 20 Millisekunden
        setInterval(animate, 20);
        // Erzeuge erste Kunden
        createCustomer();
        // Zeichne die Preisliste auf die Canvas
        drawPriceList();
        // Erstelle das HTML-Element für die Anzeige des Gesamtbetrags
        totalElement = document.createElement("div");
        totalElement.id = "total";
        totalElement.style.position = "absolute";
        totalElement.style.left = "1850px";
        totalElement.style.top = "80px";
        totalElement.style.fontSize = "20px";
        totalElement.style.zIndex = "10"; // Stelle sicher, dass das Element über der Canvas liegt
        document.body.appendChild(totalElement);
        // Füge Event Listener für die Buttons hinzu
        checkoutButton = document.getElementById("checkoutButton");
        checkoutButton.addEventListener("click", showCheckoutTotal);
        resetButton = document.getElementById("resetButton");
        resetButton.addEventListener("click", resetTotal);
        // Aktualisiere den Gesamtbetrag
        updateTotal();
    }
    // Funktion zur Initialisierung der Objekte auf der Canvas
    function initializeObjects() {
        // Erstelle Müllbehälter und füge ihn zum Array der Objekte hinzu
        let trash = new Eisdealer.Trash(1100, 350);
        Eisdealer.allObjects.push(trash);
        // Erstelle Stühle und füge sie zum Array der Objekte hinzu
        const chairs = [
            new Eisdealer.Chair(100, 100),
            new Eisdealer.Chair(350, 100),
            new Eisdealer.Chair(600, 100),
            new Eisdealer.Chair(850, 100)
        ];
        Eisdealer.allObjects.push(...chairs);
        // Erstelle Eiskugeln und füge sie zum Array der Objekte hinzu
        const scoops = [
            new Eisdealer.Scoop(150, 350, colorChocolate),
            new Eisdealer.Scoop(500, 350, colorStrawberry),
            new Eisdealer.Scoop(150, 575, colorVanille),
            new Eisdealer.Scoop(500, 575, colorPistacchio)
        ];
        Eisdealer.allObjects.push(...scoops);
    }
    // Funktion zur Erzeugung neuer Kunden
    function createCustomer() {
        // Funktion zur Überprüfung, ob neue Kunden erstellt werden müssen
        function createCustomersIfNeeded() {
            // Anzahl der vorhandenen Kunden zählen
            let customerCount = Eisdealer.allObjects.filter(obj => obj instanceof Eisdealer.Customer).length;
            // Falls weniger Kunden vorhanden sind als die maximale Anzahl
            if (customerCount < maxCustomers) {
                // Neue Kundenposition und -details
                let customerX = 500;
                let customerY = -50;
                let customer = new Eisdealer.Customer(customerX, customerY, new Eisdealer.Vector(0, 0), new Eisdealer.Vector(4, 4), `Customer ${customerCount + 1}`, Eisdealer.allObjects);
                Eisdealer.allObjects.push(customer);
            }
            // Falls noch Kunden benötigt werden, die Funktion nach einer Sekunde erneut aufrufen
            if (customerCount < maxCustomers) {
                setTimeout(createCustomersIfNeeded, 1000);
            }
        }
        createCustomersIfNeeded();
    }
    // Animationsfunktion, die alle 20 Millisekunden aufgerufen wird
    function animate() {
        // Zeichne den Hintergrund neu
        drawBackground();
        // Alle Objekte durchlaufen und zeichnen
        Eisdealer.allObjects.forEach(drawable => {
            drawable.draw();
            if (drawable instanceof Eisdealer.Customer) {
                drawable.move(); // Bewege den Kunden
                drawable.drawOrder(); // Zeichne die Bestellung des Kunden
                // Falls der Kunde die Canvas verlassen hat
                if (drawable.hasLeft()) {
                    // Entferne den Kunden aus den Objekten
                    let index = Eisdealer.allObjects.indexOf(drawable);
                    Eisdealer.allObjects.splice(index, 1);
                    // Erzeuge einen neuen Kunden
                    createCustomer();
                }
            }
        });
        // Alle ausgewählten Eiskugeln zeichnen
        chosenScoops.forEach(scoop => {
            scoop.draw();
        });
        // Falls mindestens eine Eiskugel ausgewählt wurde, zeichne die Waffel
        if (chosenScoops.length > 0) {
            let cone = new Eisdealer.Cone(900, 400);
            Eisdealer.allObjects.push(cone);
            cone.draw();
        }
    }
    // Funktion zum Löschen aller ausgewählten Eiskugeln
    function deleteScoopChosen() {
        chosenScoops = [];
        Eisdealer.allObjects = Eisdealer.allObjects.filter(obj => !(obj instanceof Eisdealer.ScoopChosen));
    }
    // Funktion zum Behandeln von Klicks auf der Canvas
    function handleCanvasClick(event) {
        // Bestimme die Klickposition relativ zur Canvas
        const canvasRect = event.target.getBoundingClientRect();
        const clickX = event.clientX - canvasRect.left;
        const clickY = event.clientY - canvasRect.top;
        // Überprüfe, ob ein Eiskrem-Element angeklickt wurde und füge es zur Bestellung hinzu
        iceCreamItems.forEach((option, index) => {
            if (clickX > option.x &&
                clickX < option.x + 200 &&
                clickY > option.y &&
                clickY < option.y + 150) {
                addItemToOrder(iceCreamItems[index], 1);
            }
        });
        // Überprüfe, ob der Müllbehälter angeklickt wurde
        Eisdealer.allObjects.forEach(item => {
            if (item instanceof Eisdealer.Trash) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    deleteScoopChosen(); // Lösche alle ausgewählten Eiskugeln
                    return;
                }
            }
        });
        // Überprüfe, ob ein Kunde angeklickt wurde
        Eisdealer.allObjects.forEach(item => {
            if (item instanceof Eisdealer.Customer) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    checkOrder(item); // Überprüfe die Bestellung des Kunden
                    deleteScoopChosen(); // Lösche alle ausgewählten Eiskugeln
                }
            }
        });
        // Behandle das Klicken auf eine Eiskugel
        handleScoopClick(clickX, clickY);
    }
    // Funktion zum Behandeln von Klicks auf Eiskugeln
    function handleScoopClick(clickX, clickY) {
        // Radius der Eiskugel und maximale Anzahl an Eiskugeln in der Bestellung
        const scoopRadius = 50;
        const maxScoops = 2;
        const scoopPositions = [
            { x: 850, y: 550 },
            { x: 850, y: 525 },
        ];
        // Falls die maximale Anzahl an Eiskugeln noch nicht erreicht ist
        if (chosenScoops.length < maxScoops) {
            for (const item of Eisdealer.allObjects) {
                if (item instanceof Eisdealer.Scoop) {
                    const distance = calculateDistance(clickX, clickY, item.x, item.y);
                    if (distance <= scoopRadius) {
                        let flavorChosenScoop;
                        // Bestimme den Geschmack der Eiskugel basierend auf der Farbe
                        switch (item.color) {
                            case colorPistacchio:
                                flavorChosenScoop = 'Pistazie';
                                break;
                            case colorStrawberry:
                                flavorChosenScoop = 'Erdbeere';
                                break;
                            case colorVanille:
                                flavorChosenScoop = 'Vanille';
                                break;
                            case colorChocolate:
                                flavorChosenScoop = 'Schokolade';
                                break;
                            default:
                                flavorChosenScoop = 'unknown';
                                break;
                        }
                        // Erstelle eine ausgewählte Eiskugel und füge sie zu den Objekten hinzu
                        let chosenScoop = new Eisdealer.ScoopChosen(scoopPositions[chosenScoops.length].x, scoopPositions[chosenScoops.length].y, item.color, flavorChosenScoop);
                        chosenScoops.push(chosenScoop);
                        Eisdealer.allObjects.push(chosenScoop);
                        // Falls dies die erste ausgewählte Eiskugel ist, erstelle die Waffel
                        if (chosenScoops.length === 1) {
                            let cone = new Eisdealer.Cone(900, 400);
                            Eisdealer.allObjects.push(cone);
                        }
                        addItemToOrder(item, 1); // Füge die Eiskugel zur Bestellung hinzu
                        break;
                    }
                }
            }
        }
    }
    // Berechne die Distanz zwischen zwei Punkten
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
    // Überprüfe, ob die Bestellung des Kunden korrekt ist
    function checkOrder(customer) {
        let correct = true;
        // Vergleiche die ausgewählten Eiskugeln mit der Bestellung des Kunden
        for (let i = 0; i < chosenScoops.length; i++) {
            const chosenScoop = chosenScoops[i];
            const customerOrder = customer.order[i];
            if (!customerOrder || chosenScoop.flavor !== customerOrder.flavor) {
                correct = false;
                break;
            }
        }
        // Falls die Bestellung korrekt ist
        if (correct) {
            customer.orderCompleted = true;
            customer.orderCorrect = true;
            customer.leaving = true;
            // Füge den Preis zur Gesamteinnahme hinzu
            const orderPrice = chosenScoops.length * 2; // Annahme: Jede Kugel kostet 2€
            totalIncome += orderPrice;
            updateTotal(); // Aktualisiere den Gesamtbetrag
        }
        else {
            customer.orderCompleted = true;
            customer.orderCorrect = false;
            customer.leaving = true;
        }
    }
    // Zeichne den Hintergrund der Canvas
    function drawBackground() {
        const canvasWidth = 1150;
        const canvasHeight = 800;
        const backgroundColor = '#d3d3d3';
        Eisdealer.crc2.fillStyle = backgroundColor;
        Eisdealer.crc2.fillRect(0, 0, canvasWidth, canvasHeight);
        Eisdealer.crc2.fillStyle = '#A9A9A9';
        Eisdealer.crc2.fillRect(0, 200, 1050, 800);
        Eisdealer.crc2.lineWidth = 2;
        Eisdealer.crc2.stroke();
        Eisdealer.crc2.fillStyle = "#000000";
        Eisdealer.crc2.font = "20px Arial";
        Eisdealer.crc2.fillText("Total: ", 1800, 100);
    }
    // Zeichne die Preisliste auf die Canvas
    function drawPriceList() {
        Eisdealer.crc2.font = "30px Arial";
        Eisdealer.crc2.fillStyle = '#00000';
        // Zeichne die Kasse
        Eisdealer.crc2.strokeRect(sidebarX, 250, 300, 150);
        Eisdealer.crc2.font = "30px Arial";
        Eisdealer.crc2.fillText("Preisliste", sidebarX + 10, 280);
        Eisdealer.crc2.fillText("je Kugel: 2€", sidebarX + 50, 360);
        // Zeichne den Bereich für den Gesamtbetrag
        Eisdealer.crc2.strokeRect(sidebarX, 450, 300, 250);
        Eisdealer.crc2.font = "30px Arial";
        Eisdealer.crc2.fillText("Total", sidebarX + 10, 500);
        Eisdealer.crc2.strokeRect(sidebarX + 50, 550, 200, 80);
    }
    // Füge einen Artikel zur Bestellung hinzu
    function addItemToOrder(item, quantity) {
        const existingItem = orderItems.find(orderItem => orderItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = item.price * existingItem.quantity; // Aktualisiere den Gesamtpreis für diesen Artikel
        }
        else {
            orderItems.push({ name: item.name, quantity, price: item.price * quantity });
        }
        updateTotal(); // Aktualisiere den Gesamtbetrag
    }
    // Aktualisiere den Gesamtbetrag auf der Canvas
    function updateTotal() {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        Eisdealer.crc2.clearRect(sidebarX + 50, 550, 200, 80);
        Eisdealer.crc2.fillStyle = '#00000';
        Eisdealer.crc2.fillText(total.toFixed(0) + "€", sidebarX + 170, 600);
    }
    // Zeige den Gesamtbetrag im Kassenbereich an
    function showCheckoutTotal() {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        Eisdealer.crc2.clearRect(0, 0, Eisdealer.crc2.canvas.width, Eisdealer.crc2.canvas.height);
        drawBackground();
        drawPriceList();
        Eisdealer.crc2.fillStyle = '#000000';
        Eisdealer.crc2.font = "20px Arial";
        Eisdealer.crc2.fillText(" Total: " + total.toFixed(0) + "€", Eisdealer.crc2.canvas.width - 200, 50);
    }
    // Setze alle Bestellungen und ausgewählten Eiskugeln zurück
    function resetTotal() {
        chosenScoops = [];
        orderItems = [];
        totalIncome = 0; // Setze die Gesamteinnahmen zurück
        updateTotal(); // Aktualisiere den Gesamtbetrag
    }
    // Liste der verfügbaren Eiskrem-Artikel
    const iceCreamItems = [
        { name: 'Vanilla', x: 150, y: 575, price: 2 },
        { name: 'Strawberry', x: 500, y: 350, price: 2 },
        { name: 'Chocolate', x: 150, y: 350, price: 2 },
        { name: 'Pistachio', x: 500, y: 575, price: 2 },
        // Weitere Artikel können hinzugefügt werden
    ];
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=main.js.map