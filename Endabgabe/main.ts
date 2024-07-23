namespace Eisdealer {
    // Event Listener, der beim Laden der Seite die Funktion handleLoad aufruft
    window.addEventListener("load", handleLoad);

    // CanvasRenderingContext2D für das Zeichnen auf der Canvas
    export let crc2: CanvasRenderingContext2D;
    // Array zur Speicherung aller zeichnbaren Objekte
    export let allObjects: Drawables[] = [];
    // Array für die ausgewählten Eiskugeln
    let chosenScoops: ScoopChosen[] = [];
    // Farben für die verschiedenen Eissorten
    let colorPistacchio: string = "#93c572";
    let colorStrawberry: string = "#C83f49";
    let colorVanille: string = "#F3E5AB";
    let colorChocolate: string = "#45322e";
    // Maximale Anzahl von Kunden
    let maxCustomers = 4;
    // HTML-Element zur Anzeige des Gesamtbetrags
    let totalElement: HTMLElement;
    // Buttons für Kasse und Zurücksetzen
    let checkoutButton: HTMLButtonElement;
    let resetButton: HTMLButtonElement;
    // Array für die Bestellpositionen
    let orderItems: OrderItem[] = [];
    // Gesamteinnahmen des Geschäfts
    let totalIncome: number = 0;
    // X-Position der Sidebar
    const sidebarX = 1200;

    // Canvas-Element
    let canvas: HTMLCanvasElement;

    // Funktion, die beim Laden der Seite aufgerufen wird
    function handleLoad(_event: Event): void {
        // Canvas-Element abrufen und den Rendering-Kontext zuweisen
        canvas = document.querySelector("canvas") as HTMLCanvasElement;
        if (!canvas) return;
        crc2 = canvas.getContext("2d") as CanvasRenderingContext2D;

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
        checkoutButton = document.getElementById("checkoutButton") as HTMLButtonElement;
        checkoutButton.addEventListener("click", showCheckoutTotal);

        resetButton = document.getElementById("resetButton") as HTMLButtonElement;
        resetButton.addEventListener("click", resetTotal);

        // Aktualisiere den Gesamtbetrag
        updateTotal();
    }

    // Funktion zur Initialisierung der Objekte auf der Canvas
    function initializeObjects(): void {
        // Erstelle Müllbehälter und füge ihn zum Array der Objekte hinzu
        let trash: Trash = new Trash(1100, 350);
        allObjects.push(trash);

        // Erstelle Stühle und füge sie zum Array der Objekte hinzu
        const chairs = [
            new Chair(100, 100),
            new Chair(350, 100),
            new Chair(600, 100),
            new Chair(850, 100)
        ];
        allObjects.push(...chairs);

        // Erstelle Eiskugeln und füge sie zum Array der Objekte hinzu
        const scoops = [
            new Scoop(150, 350, colorChocolate),
            new Scoop(500, 350, colorStrawberry),
            new Scoop(150, 575, colorVanille),
            new Scoop(500, 575, colorPistacchio)
        ];
        allObjects.push(...scoops);
    }

    // Funktion zur Erzeugung neuer Kunden
    function createCustomer(): void {
        // Funktion zur Überprüfung, ob neue Kunden erstellt werden müssen
        function createCustomersIfNeeded(): void {
            // Anzahl der vorhandenen Kunden zählen
            let customerCount = allObjects.filter(obj => obj instanceof Customer).length;

            // Falls weniger Kunden vorhanden sind als die maximale Anzahl
            if (customerCount < maxCustomers) {
                // Neue Kundenposition und -details
                let customerX = 500;
                let customerY = -50;
                let customer = new Customer(customerX, customerY, new Vector(0, 0), new Vector(4, 4), `Customer ${customerCount + 1}`, allObjects);
                allObjects.push(customer);
            }

            // Falls noch Kunden benötigt werden, die Funktion nach einer Sekunde erneut aufrufen
            if (customerCount < maxCustomers) {
                setTimeout(createCustomersIfNeeded, 1000);
            }
        }
        createCustomersIfNeeded();
    }

    // Animationsfunktion, die alle 20 Millisekunden aufgerufen wird
    function animate(): void {
        // Zeichne den Hintergrund neu
        drawBackground();

        // Alle Objekte durchlaufen und zeichnen
        allObjects.forEach(drawable => {
            drawable.draw();
            if (drawable instanceof Customer) {
                drawable.move(); // Bewege den Kunden
                drawable.drawOrder(); // Zeichne die Bestellung des Kunden
                // Falls der Kunde die Canvas verlassen hat
                if (drawable.hasLeft()) {
                    // Entferne den Kunden aus den Objekten
                    let index = allObjects.indexOf(drawable);
                    allObjects.splice(index, 1);
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
            let cone = new Cone(900, 400);
            allObjects.push(cone);
            cone.draw();
        }
    }

    // Funktion zum Löschen aller ausgewählten Eiskugeln
    function deleteScoopChosen(): void {
        chosenScoops = [];
        allObjects = allObjects.filter(obj => !(obj instanceof ScoopChosen));
    }

    // Funktion zum Behandeln von Klicks auf der Canvas
    function handleCanvasClick(event: MouseEvent): void {
        // Bestimme die Klickposition relativ zur Canvas
        const canvasRect = (event.target as HTMLCanvasElement).getBoundingClientRect();
        const clickX = event.clientX - canvasRect.left;
        const clickY = event.clientY - canvasRect.top;

        // Überprüfe, ob ein Eiskrem-Element angeklickt wurde und füge es zur Bestellung hinzu
        iceCreamItems.forEach((option, index) => {
            if (
                clickX > option.x &&
                clickX < option.x + 200 &&
                clickY > option.y &&
                clickY < option.y + 150
            ) {
                addItemToOrder(iceCreamItems[index], 1);
            }
        });

        // Überprüfe, ob der Müllbehälter angeklickt wurde
        allObjects.forEach(item => {
            if (item instanceof Trash) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    deleteScoopChosen(); // Lösche alle ausgewählten Eiskugeln
                    return;
                }
            }
        });

        // Überprüfe, ob ein Kunde angeklickt wurde
        allObjects.forEach(item => {
            if (item instanceof Customer) {
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
    function handleScoopClick(clickX: number, clickY: number): void {
        // Radius der Eiskugel und maximale Anzahl an Eiskugeln in der Bestellung
        const scoopRadius = 50;
        const maxScoops = 2;
        const scoopPositions = [
            { x: 850, y: 550 },
            { x: 850, y: 525 },
        ];

        // Falls die maximale Anzahl an Eiskugeln noch nicht erreicht ist
        if (chosenScoops.length < maxScoops) {
            for (const item of allObjects) {
                if (item instanceof Scoop) {
                    const distance = calculateDistance(clickX, clickY, item.x, item.y);
                    if (distance <= scoopRadius) {
                        let flavorChosenScoop: string;

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
                        let chosenScoop = new ScoopChosen(
                            scoopPositions[chosenScoops.length].x,
                            scoopPositions[chosenScoops.length].y,
                            item.color,
                            flavorChosenScoop
                        );
                        chosenScoops.push(chosenScoop);
                        allObjects.push(chosenScoop);

                        // Falls dies die erste ausgewählte Eiskugel ist, erstelle die Waffel
                        if (chosenScoops.length === 1) {
                            let cone = new Cone(900, 400);
                            allObjects.push(cone);
                        }

                        addItemToOrder(item, 1); // Füge die Eiskugel zur Bestellung hinzu
                        break;
                    }
                }
            }
        }
    }

    // Berechne die Distanz zwischen zwei Punkten
    function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    // Überprüfe, ob die Bestellung des Kunden korrekt ist
    function checkOrder(customer: Customer): void {
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
        } else {
            customer.orderCompleted = true;
            customer.orderCorrect = false;
            customer.leaving = true;
        }
    }

    // Zeichne den Hintergrund der Canvas
    function drawBackground(): void {
        const canvasWidth = 1150;
        const canvasHeight = 800;
        const backgroundColor = '#d3d3d3';

        crc2.fillStyle = backgroundColor;
        crc2.fillRect(0, 0, canvasWidth, canvasHeight);

        crc2.fillStyle = '#A9A9A9';
        crc2.fillRect(0, 200, 1050, 800);
        crc2.lineWidth = 2;
        crc2.stroke();

        crc2.fillStyle = "#000000";
        crc2.font = "20px Arial";
        crc2.fillText("Total: ", 1800, 100);
    }

    // Zeichne die Preisliste auf die Canvas
    function drawPriceList(): void {
        crc2.font = "30px Arial";
        crc2.fillStyle = '#00000';

        // Zeichne die Kasse
        crc2.strokeRect(sidebarX, 250, 300, 150);
        crc2.font = "30px Arial";
        crc2.fillText("Preisliste", sidebarX + 10, 280);
        crc2.fillText("je Kugel: 2€", sidebarX + 50, 360);

        // Zeichne den Bereich für den Gesamtbetrag
        crc2.strokeRect(sidebarX, 450, 300, 250);
        crc2.font = "30px Arial";
        crc2.fillText("Total", sidebarX + 10, 500);
        crc2.strokeRect(sidebarX + 50, 550, 200, 80);
    }

    // Füge einen Artikel zur Bestellung hinzu
    function addItemToOrder(item: IceCreamItem, quantity: number): void {
        const existingItem = orderItems.find(orderItem => orderItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = item.price * existingItem.quantity; // Aktualisiere den Gesamtpreis für diesen Artikel
        } else {
            orderItems.push({ name: item.name, quantity, price: item.price * quantity });
        }
        updateTotal(); // Aktualisiere den Gesamtbetrag
    }

    // Aktualisiere den Gesamtbetrag auf der Canvas
    function updateTotal(): void {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        crc2.clearRect(sidebarX + 50, 550, 200, 80);
        crc2.fillStyle = '#00000';
        crc2.fillText(total.toFixed(0) + "€", sidebarX + 170, 600);
    }

    // Zeige den Gesamtbetrag im Kassenbereich an
    function showCheckoutTotal(): void {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        crc2.clearRect(0, 0, crc2.canvas.width, crc2.canvas.height);
        drawBackground();
        drawPriceList();
        crc2.fillStyle = '#000000';
        crc2.font = "20px Arial";
        crc2.fillText(" Total: " + total.toFixed(0) + "€", crc2.canvas.width - 200, 50);
    }

    // Setze alle Bestellungen und ausgewählten Eiskugeln zurück
    function resetTotal(): void {
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
}
