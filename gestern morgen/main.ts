namespace Eisdealer {
    // Event listener für das Laden des Fensters, ruft handleLoad auf, wenn das Fenster geladen ist.
    window.addEventListener("load", handleLoad);

    // Deklaration und Initialisierung von globalen Variablen
    export let crc2: CanvasRenderingContext2D;
    export let allObjects: Drawables[] = [];
    let chosenScoops: ScoopChosen[] = [];
    let colorPistacchio: string = "#93c572";
    let colorStrawberry: string = "#C83f49";
    let colorVanille: string = "#F3E5AB";
    let colorChocolate: string = "#45322e";
    let maxCustomers = 4;
    let totalElement: HTMLElement;
    let checkoutButton: HTMLButtonElement;
    let resetButton: HTMLButtonElement;
    let orderItems: OrderItem[] = [];
    let totalIncome: number = 0;
    const sidebarX = 1200;

    let canvas: HTMLCanvasElement;

    // Funktion, die aufgerufen wird, wenn das Fenster geladen ist
    function handleLoad(_event: Event): void {
        // Auswahl des Canvas-Elements und des 2D-Zeichenkontexts
        canvas = document.querySelector("canvas") as HTMLCanvasElement;
        if (!canvas) return;
        crc2 = canvas.getContext("2d") as CanvasRenderingContext2D;

        // Hinzufügen eines Click-Event-Listeners zum Canvas
        canvas.addEventListener("click", handleCanvasClick);

        // Initialisierung der Objekte und Start der Animation
        initializeObjects();
        setInterval(animate, 20);
        createCustomer();

        // Zeichnen der Preisliste
        drawPriceList();

        // Erstellen und Konfigurieren des "total"-Elements
        totalElement = document.createElement("div");
        totalElement.id = "total";
        totalElement.style.position = "absolute";
        totalElement.style.left = "1850px";
        totalElement.style.top = "80px";
        totalElement.style.fontSize = "20px";
        totalElement.style.zIndex = "10"; // Sicherstellen, dass das totalElement vor dem Canvas liegt
        document.body.appendChild(totalElement);

        // Initialisierung und Hinzufügen von Event-Listenern zu den Buttons
        checkoutButton = document.getElementById("checkoutButton") as HTMLButtonElement;
        checkoutButton.addEventListener("click", showCheckoutTotal);

        resetButton = document.getElementById("resetButton") as HTMLButtonElement;
        resetButton.addEventListener("click", resetTotal);

        // Aktualisierung der Gesamtsumme
        updateTotal();
    }

    // Initialisierung der Objekte im Spiel
    function initializeObjects(): void {
        let trash: Trash = new Trash(1100, 350);
        allObjects.push(trash);

        // Hinzufügen von Stühlen zum Array allObjects
        const chairs = [
            new Chair(100, 100),
            new Chair(350, 100),
            new Chair(600, 100),
            new Chair(850, 100)
        ];
        allObjects.push(...chairs);

        // Hinzufügen von Eiskugeln zum Array allObjects
        const scoops = [
            new Scoop(150, 350, colorChocolate),
            new Scoop(500, 350, colorStrawberry),
            new Scoop(150, 575, colorVanille),
            new Scoop(500, 575, colorPistacchio)
        ];
        allObjects.push(...scoops);
    }

    // Funktion zur Erstellung von Kunden
    function createCustomer(): void {
        function createCustomersIfNeeded(): void {
            let customerCount = allObjects.filter(obj => obj instanceof Customer).length;

            // Wenn die Anzahl der Kunden kleiner als die maximale Anzahl ist, neuen Kunden erstellen
            if (customerCount < maxCustomers) {
                let customerX = 500;
                let customerY = -50;
                let customer = new Customer(customerX, customerY, new Vector(0, 0), new Vector(4, 4), `Customer ${customerCount + 1}`, allObjects);
                allObjects.push(customer);
            }

            // Weiter Kunden erstellen, wenn die maximale Anzahl noch nicht erreicht ist
            if (customerCount < maxCustomers) {
                setTimeout(createCustomersIfNeeded, 1000);
            }
        }
        createCustomersIfNeeded();
    }

    // Animationsfunktion, die regelmäßig aufgerufen wird
    function animate(): void {
        drawBackground();

        // Zeichnen und Bewegen der Objekte
        allObjects.forEach(drawable => {
            drawable.draw();
            if (drawable instanceof Customer) {
                drawable.move();
                drawable.drawOrder();
                if (drawable.hasLeft()) {
                    let index = allObjects.indexOf(drawable);
                    allObjects.splice(index, 1);
                    createCustomer();
                }
            }
        });

        // Zeichnen der ausgewählten Eiskugeln
        chosenScoops.forEach(scoop => {
            scoop.draw();
        });

        // Zeichnen der Waffel, wenn mindestens eine Kugel gewählt wurde
        if (chosenScoops.length > 0) {
            let cone = new Cone(900, 400);
            allObjects.push(cone);
            cone.draw();
        }
    }

    // Funktion zum Löschen der ausgewählten Eiskugeln
    function deleteScoopChosen(): void {
        chosenScoops = [];
        allObjects = allObjects.filter(obj => !(obj instanceof ScoopChosen));
    }

    // Funktion, die aufgerufen wird, wenn auf das Canvas geklickt wird
    function handleCanvasClick(event: MouseEvent): void {
        const canvasRect = (event.target as HTMLCanvasElement).getBoundingClientRect();
        const clickX = event.clientX - canvasRect.left;
        const clickY = event.clientY - canvasRect.top;

        // Überprüfen, ob auf eines der Eiscreme-Items geklickt wurde
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

        // Überprüfen, ob auf einen bestimmten Bereich geklickt wurde
        if (
            clickX > 800 &&
            clickX < 900 &&
            clickY > 500 &&
            clickY < 570
        ) {
            addItemToOrder(iceCreamItems[5], 1);
        }

        // Überprüfen, ob auf den Mülleimer geklickt wurde
        allObjects.forEach(item => {
            if (item instanceof Trash) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    deleteScoopChosen();
                    return;
                }
            }
        });

        // Überprüfen, ob auf einen Kunden geklickt wurde
        allObjects.forEach(item => {
            if (item instanceof Customer) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    checkOrder(item);
                    deleteScoopChosen();
                }
            }
        });

        // Überprüfen, ob auf eine Eiskugel geklickt wurde
        handleScoopClick(clickX, clickY);
    }

    // Funktion, die aufgerufen wird, wenn auf eine Eiskugel geklickt wird
    function handleScoopClick(clickX: number, clickY: number): void {
        const scoopRadius = 50;
        const maxScoops = 2;
        const scoopPositions = [
            { x: 850, y: 550 },
            { x: 850, y: 525 },
        ];

        // Überprüfen, ob die maximale Anzahl an Kugeln erreicht ist
        if (chosenScoops.length < maxScoops) {
            for (const item of allObjects) {
                if (item instanceof Scoop) {
                    const distance = calculateDistance(clickX, clickY, item.x, item.y);
                    if (distance <= scoopRadius) {
                        let flavorChosenScoop: string;

                        // Bestimmen des Geschmacks der gewählten Kugel
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

                        // Erstellen der gewählten Kugel und Hinzufügen zum Array
                        let chosenScoop = new ScoopChosen(
                            scoopPositions[chosenScoops.length].x,
                            scoopPositions[chosenScoops.length].y,
                            item.color,
                            flavorChosenScoop
                        );
                        chosenScoops.push(chosenScoop);
                        allObjects.push(chosenScoop);

                        // Hinzufügen der Waffel, wenn die erste Kugel gewählt wurde
                        if (chosenScoops.length === 1) {
                            let cone = new Cone(900, 400);
                            allObjects.push(cone);
                        }

                        // Hinzufügen der Kugel zur Bestellung
                        addItemToOrder(item, 1);
                        break;
                    }
                }
            }
        }
    }

    // Funktion zur Berechnung der Distanz zwischen zwei Punkten
    function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    // Funktion zur Überprüfung der Bestellung eines Kunden
    function checkOrder(customer: Customer): void {
        let correct = true;

        // Überprüfen, ob die gewählten Kugeln mit der Bestellung des Kunden übereinstimmen
        for (let i = 0; i < chosenScoops.length; i++) {
            const chosenScoop = chosenScoops[i];
            const customerOrder = customer.order[i];

            if (!customerOrder || chosenScoop.flavor !== customerOrder.flavor) {
                correct = false;
                break;
            }
        }

        // Aktualisieren des Kundenstatus und der Gesamtsumme, wenn die Bestellung korrekt ist
        if (correct) {
            customer.orderCompleted = true;
            customer.leaving = true;
            customer.orderCorrect = true;

            const orderPrice = chosenScoops.length * 2; // Annahme: jede Kugel kostet 2€
            totalIncome += orderPrice;

            updateTotal();
        } else {
            customer.orderCompleted = true;
            customer.leaving = true;
            customer.orderCorrect = false;
        }
    }

    // Funktion zum Zeichnen des Hintergrunds
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

    // Funktion zum Zeichnen der Preisliste
    function drawPriceList(): void {
        crc2.font = "30px Arial";
        crc2.fillStyle = '#00000';

        // Zeichnen der Kasse
        crc2.strokeRect(sidebarX, 250, 300, 150);
        crc2.font = "30px Arial";
        crc2.fillText("Preisliste", sidebarX + 10, 280);
        crc2.fillText("je Kugel: 2€", sidebarX + 50, 360);

        crc2.strokeRect(sidebarX, 450, 300, 250);
        crc2.font = "30px Arial";
        crc2.fillText("Total", sidebarX + 10, 500);
        crc2.strokeRect(sidebarX + 50, 550, 200, 80);
    }

    // Funktion zum Hinzufügen eines Items zur Bestellung
    function addItemToOrder(item: IceCreamItem, quantity: number): void {
        const existingItem = orderItems.find(orderItem => orderItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = item.price * existingItem.quantity; // Aktualisieren des Gesamtpreises für dieses Item
        } else {
            orderItems.push({ name: item.name, quantity, price: item.price * quantity });
        }
        updateTotal();
    }

    // Funktion zur Aktualisierung der Gesamtsumme
    function updateTotal(): void {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        crc2.clearRect(sidebarX + 50, 550, 200, 80);
        crc2.fillText(total.toFixed(0) + "€", sidebarX + 170, 600);
        crc2.fillStyle = '#00000';

        updateTotal(); // Aktualisieren der Anzeige
    }

    // Funktion zur Anzeige der Gesamtsumme beim Checkout
    function showCheckoutTotal(): void {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        crc2.clearRect(0, 0, crc2.canvas.width, crc2.canvas.height);
        drawBackground();
        drawPriceList();
        crc2.fillStyle = '#000000';
        crc2.font = "20px Arial";
        crc2.fillText("Income Total: " + total.toFixed(0) + "€", crc2.canvas.width - 200, 50);
    }

    // Funktion zum Zurücksetzen der Gesamtsumme
    function resetTotal(): void {
        chosenScoops = [];
        orderItems = [];
        totalIncome = 0; // Zurücksetzen des Gesamteinkommens
        updateTotal();
    }

    // Definition der verfügbaren Eissorten
    const iceCreamItems = [
        { name: 'Vanilla', x: 150, y: 575, price: 2 },
        { name: 'Strawberry', x: 500, y: 350, price: 2 },
        { name: 'Chocolate', x: 150, y: 350, price: 2 },
        { name: 'Pistachio', x: 500, y: 575, price: 2 },
        // Weitere Items können hier hinzugefügt werden
    ];
}
