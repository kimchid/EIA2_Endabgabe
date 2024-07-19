namespace Eisdealer {
    window.addEventListener("load", handleLoad);

    export let crc2: CanvasRenderingContext2D;

    export let allObjects: Drawables[] = [];
    let targetPosition: Vector = new Vector(0, 0);
    let chosenScoops: ScoopChosen[] = [];
    let colorPistacchio: string = "#93c572";
    let colorStrawberry: string = "#d47274";
    let colorVanille: string = "#F3E5AB";
    let colorChocolate: string = "#45322e";
    let maxCustomers = 4;

    function handleLoad(_event: Event): void {
        console.log("handleLoad");
        let canvas: HTMLCanvasElement | null = document.querySelector("canvas");
        if (!canvas) return;
        crc2 = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.addEventListener("click", handleClick);

        // Initialize objects in the scene
        initializeObjects();

        // Start the animation loop
        setInterval(animate, 20);

        // Create initial set of customers
        createCustomer();
    }

    function initializeObjects(): void {
        let trash: Trash = new Trash(1250, 100);
        allObjects.push(trash);

        // Add chairs
        const chairs = [
            new Chair(100, 100),
            new Chair(350, 100),
            new Chair(600, 100),
            new Chair(850, 100)
        ];
        allObjects.push(...chairs);

        // Add scoops
        const scoops = [
            new Scoop(150, 350, colorChocolate),
            new Scoop(500, 350, colorStrawberry),
            new Scoop(150, 575, colorVanille),
            new Scoop(500, 575, colorPistacchio)
        ];
        allObjects.push(...scoops);
    }

    function createCustomer(): void {
        function createCustomersIfNeeded(): void {
            let customerCount = allObjects.filter(obj => obj instanceof Customer).length;

            if (customerCount < maxCustomers) {
                let customerX = 500;
                let customerY = -50;
                let customer = new Customer(customerX, customerY, new Vector(0, 0), new Vector(4, 4), `Customer ${customerCount + 1}`, allObjects);
                allObjects.push(customer);
                customer.findNextUnoccupiedChair();
            }

            if (customerCount < maxCustomers) {
                setTimeout(createCustomersIfNeeded, 3000);
            }
        }
        createCustomersIfNeeded();
    }

    function animate(): void {
        drawBackground();

        allObjects.forEach(drawable => {
            drawable.draw();
            if (drawable instanceof Customer) {
                drawable.move();
                drawable.drawOrder();
                if (drawable.hasLeft()) {
                    let index = allObjects.indexOf(drawable);
                    allObjects.splice(index, 1);
                    createCustomer(); // Create a new customer if one has left
                }
            }
        });

        chosenScoops.forEach(scoop => {
            scoop.draw();
        });

        if (chosenScoops.length > 0) {
            let cone = new Cone(900, 400);
            allObjects.push(cone);
            cone.draw();
        }
    }

    function deleteScoopChosen(): void {
        chosenScoops = [];
        allObjects = allObjects.filter(obj => !(obj instanceof ScoopChosen));
    }

    export function handleClick(event: MouseEvent): void {
        let canvasRect = (event.target as HTMLCanvasElement).getBoundingClientRect();
        let clickX = event.clientX - canvasRect.left;
        let clickY = event.clientY - canvasRect.top;

        // Handle clicks on trash
        allObjects.forEach(item => {
            if (item instanceof Trash) {
                const distance = Math.sqrt(Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2));
                if (distance <= 50) {
                    deleteScoopChosen();
                    return;
                }
            }
        });

        // Handle clicks on customers to check orders
        allObjects.forEach(item => {
            if (item instanceof Customer) {
                const distance = Math.sqrt(Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2));
                if (distance <= 50) {
                    checkOrder(item);
                    deleteScoopChosen();
                }
            }
        });

        // Handle clicks on scoops to add to the cone
        handleScoopClick(clickX, clickY);
    }

    function handleScoopClick(clickX: number, clickY: number): void {
        const scoopRadius = 50;
        const maxScoops = 2;
        const scoopPositions = [
            { x: 850, y: 550 },
            { x: 850, y: 525 },
        ];

        if (chosenScoops.length < maxScoops) {
            for (const item of allObjects) {
                if (item instanceof Scoop) {
                    const distance = Math.sqrt(Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2));
                    if (distance <= scoopRadius) {
                        let flavorChosenScoop: string;

                        if (item.color === colorPistacchio) {
                            flavorChosenScoop = 'pistacchio';
                        } else if (item.color === colorStrawberry) {
                            flavorChosenScoop = 'strawberry';
                        } else if (item.color === colorVanille) {
                            flavorChosenScoop = 'vanille';
                        } else {
                            flavorChosenScoop = 'unknown';
                        }

                        let chosenScoop = new ScoopChosen(scoopPositions[chosenScoops.length].x, scoopPositions[chosenScoops.length].y, item.color, flavorChosenScoop);
                        chosenScoops.push(chosenScoop);
                        allObjects.push(chosenScoop);

                        if (chosenScoops.length === 1) {
                            let cone = new Cone(900, 400);
                            allObjects.push(cone);
                        }

                        break;
                    }
                }
            }
        }
    }

    function checkOrder(customer: Customer): void {
        let correct = true;

        for (let i = 0; i < chosenScoops.length; i++) {
            const chosenScoop = chosenScoops[i];
            const customerOrder = customer.order[i];

            if (!customerOrder || chosenScoop.flavor !== customerOrder.flavor) {
                correct = false; // Flag for incorrect order
                break;
            }
        }

        if (correct) {
            customer.orderCompleted = true;
            customer.leaving = true; // Mark the customer as leaving
        }
    }

    function drawBackground(): void {
        const canvasWidth = 2000;
        const canvasHeight = 800;
        const backgroundColor = '#d3d3d3';

        crc2.fillStyle = backgroundColor;
        crc2.fillRect(0, 0, canvasWidth, canvasHeight);

        crc2.fillStyle = '#A9A9A9';
        crc2.fillRect(0, 200, 1050, 800);
        crc2.lineWidth = 2;
        crc2.stroke();
    }
}

function initializeCashRegister() {
    // Erstelle eine Instanz der CashRegister-Klasse
    const cashRegister = new Eisdealer.CashRegister();

    // Beispiel: Zeige den Preis für eine bestimmte Eissorte an
    cashRegister.showPrice('Pistazie');

    // Beispiel: Verstecke die Anzeige nach 3 Sekunden
    setTimeout(() => {
        cashRegister.hide();
    }, 3000);
}

// Starte die Anwendung
initializeCashRegister();

