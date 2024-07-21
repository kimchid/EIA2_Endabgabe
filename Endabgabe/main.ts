namespace Eisdealer {
    window.addEventListener("load", handleLoad);

    export let crc2: CanvasRenderingContext2D;
    export let allObjects: Drawables[] = [];
    let chosenScoops: ScoopChosen[] = [];
    let colorPistacchio: string = "#93c572";
    let colorStrawberry: string = "#d47274";
    let colorVanille: string = "#F3E5AB";
    let colorChocolate: string = "#45322e";
    let maxCustomers = 4;
    let cashRegister: CashRegister;
    let totalElement: HTMLElement;
    let orderItems: OrderItem[] = [];
    const sidebarX = 1200;
    let canvas: HTMLCanvasElement | null;

    function handleLoad(_event: Event): void {
        console.log("handleLoad");
        canvas = document.querySelector("canvas");
        if (!canvas) return;
        crc2 = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.addEventListener("click", handleClick);

        initializeObjects();
        setInterval(animate, 20);
        createCustomer();

        cashRegister = new CashRegister();
        drawPriceList();

        totalElement = document.createElement("div");
        totalElement.id = "total";
        totalElement.style.position = "absolute";
        totalElement.style.left = "1850px";
        totalElement.style.top = "80px";
        totalElement.style.fontSize = "20px";
        totalElement.style.zIndex = "10"; // Ensure the totalElement is in front of the canvas
        document.body.appendChild(totalElement);

        updateTotalDisplay();
    }

    function initializeObjects(): void {
        let trash: Trash = new Trash(1000, 350);
        allObjects.push(trash);

        const chairs = [
            new Chair(100, 100),
            new Chair(350, 100),
            new Chair(600, 100),
            new Chair(850, 100)
        ];
        allObjects.push(...chairs);

        const scoops = [
            new Scoop(150, 350, colorChocolate),
            new Scoop(500, 350, colorStrawberry),
            new Scoop(150, 575, colorVanille),
            new Scoop(500, 575, colorPistacchio)
        ];
        allObjects.push(...scoops);

        scoops.forEach(scoop => {
            const iceCreamItem = scoop.getIceCreamItem();
            console.log(`Scoop at (${scoop.x}, ${scoop.y}) is ${iceCreamItem?.name} and costs ${iceCreamItem?.price}`);
        });
    }

    function createCustomer(): void {
        function createCustomersIfNeeded(): void {
            let customerCount = allObjects.filter(obj => obj instanceof Customer).length;

            if (customerCount < maxCustomers) {
                let customerX = 500;
                let customerY = -50;
                let customer = new Customer(customerX, customerY, new Vector(4, 4), new Vector(4, 4), `Customer ${customerCount + 1}`, allObjects);
                allObjects.push(customer);
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
                    createCustomer();
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

        allObjects.forEach(item => {
            if (item instanceof Trash) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    deleteScoopChosen();
                    return;
                }
            }
        });

        allObjects.forEach(item => {
            if (item instanceof Customer) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    checkOrder(item);
                    return;
                }
            }
        });

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
                    const distance = calculateDistance(clickX, clickY, item.x, item.y);
                    if (distance <= scoopRadius) {
                        let flavorChosenScoop: string;

                        if (item.color === colorPistacchio) {
                            flavorChosenScoop = 'Pistazie';
                        } else if (item.color === colorStrawberry) {
                            flavorChosenScoop = 'Erdbeere';
                        } else if (item.color === colorVanille) {
                            flavorChosenScoop = 'Vanille';
                        } else if (item.color === colorChocolate) {
                            flavorChosenScoop = 'Schokolade';
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

                        addItemToOrder(item, 1); // Add scoop to order
                        break;
                    }
                }
            }
        }
    }

    function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function checkOrder(customer: Customer): void {
        let correct = true;

        for (let i = 0; i < chosenScoops.length; i++) {
            const chosenScoop = chosenScoops[i];
            const customerOrder = customer.order[i];

            if (!customerOrder || chosenScoop.flavor !== customerOrder.flavor) {
                correct = false;
                break;
            }
        }

        if (correct) {
            customer.orderCompleted = true;
            customer.leaving = true;
            cashRegister.add(chosenScoops.length * 2);
            updateTotalDisplay();
            deleteScoopChosen();  // Clear chosen scoops after order is completed
        }
    }

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

    function drawPriceList(): void {
        crc2.font = "30px Arial";

        // Draw Cash Register
        crc2.strokeRect(sidebarX, 450, 300, 250);
        crc2.fillText("Total", sidebarX + 10, 500);
        crc2.strokeRect(sidebarX + 50, 550, 200, 80);
    }

    function addItemToOrder(item: IceCreamItem, quantity: number) {
        const existingItem = orderItems.find(orderItem => orderItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price += item.price * quantity;
        } else {
            orderItems.push({ name: item.name, quantity, price: item.price * quantity });
        }
        updateTotal();
    }

    function updateTotal() {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        crc2.clearRect(sidebarX + 50, 550, 200, 80);
        crc2.fillText(total.toFixed(2) + "€", sidebarX + 170, 600);
    }
}
