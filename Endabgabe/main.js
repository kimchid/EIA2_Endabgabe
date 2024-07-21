"use strict";
var Eisdealer;
(function (Eisdealer) {
    window.addEventListener("load", handleLoad);
    Eisdealer.allObjects = [];
    let chosenScoops = [];
    let colorPistacchio = "#93c572";
    let colorStrawberry = "#d47274";
    let colorVanille = "#F3E5AB";
    let colorChocolate = "#45322e";
    let maxCustomers = 4;
    let cashRegister;
    let totalElement;
    let orderItems = [];
    const sidebarX = 1200;
    let canvas;
    function handleLoad(_event) {
        console.log("handleLoad");
        canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        Eisdealer.crc2 = canvas.getContext("2d");
        canvas.addEventListener("click", handleClick);
        initializeObjects();
        setInterval(animate, 20);
        createCustomer();
        cashRegister = new Eisdealer.CashRegister();
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
    function initializeObjects() {
        let trash = new Eisdealer.Trash(1000, 350);
        Eisdealer.allObjects.push(trash);
        const chairs = [
            new Eisdealer.Chair(100, 100),
            new Eisdealer.Chair(350, 100),
            new Eisdealer.Chair(600, 100),
            new Eisdealer.Chair(850, 100)
        ];
        Eisdealer.allObjects.push(...chairs);
        const scoops = [
            new Eisdealer.Scoop(150, 350, colorChocolate),
            new Eisdealer.Scoop(500, 350, colorStrawberry),
            new Eisdealer.Scoop(150, 575, colorVanille),
            new Eisdealer.Scoop(500, 575, colorPistacchio)
        ];
        Eisdealer.allObjects.push(...scoops);
        scoops.forEach(scoop => {
            const iceCreamItem = scoop.getIceCreamItem();
            console.log(`Scoop at (${scoop.x}, ${scoop.y}) is ${iceCreamItem?.name} and costs ${iceCreamItem?.price}`);
        });
    }
    function createCustomer() {
        function createCustomersIfNeeded() {
            let customerCount = Eisdealer.allObjects.filter(obj => obj instanceof Eisdealer.Customer).length;
            if (customerCount < maxCustomers) {
                let customerX = 500;
                let customerY = -50;
                let customer = new Eisdealer.Customer(customerX, customerY, new Eisdealer.Vector(4, 4), new Eisdealer.Vector(4, 4), `Customer ${customerCount + 1}`, Eisdealer.allObjects);
                Eisdealer.allObjects.push(customer);
            }
            if (customerCount < maxCustomers) {
                setTimeout(createCustomersIfNeeded, 3000);
            }
        }
        createCustomersIfNeeded();
    }
    function animate() {
        drawBackground();
        Eisdealer.allObjects.forEach(drawable => {
            drawable.draw();
            if (drawable instanceof Eisdealer.Customer) {
                drawable.move();
                drawable.drawOrder();
                if (drawable.hasLeft()) {
                    let index = Eisdealer.allObjects.indexOf(drawable);
                    Eisdealer.allObjects.splice(index, 1);
                    createCustomer();
                }
            }
        });
        chosenScoops.forEach(scoop => {
            scoop.draw();
        });
        if (chosenScoops.length > 0) {
            let cone = new Eisdealer.Cone(900, 400);
            Eisdealer.allObjects.push(cone);
            cone.draw();
        }
    }
    function deleteScoopChosen() {
        chosenScoops = [];
        Eisdealer.allObjects = Eisdealer.allObjects.filter(obj => !(obj instanceof Eisdealer.ScoopChosen));
    }
    function handleClick(event) {
        let canvasRect = event.target.getBoundingClientRect();
        let clickX = event.clientX - canvasRect.left;
        let clickY = event.clientY - canvasRect.top;
        Eisdealer.allObjects.forEach(item => {
            if (item instanceof Eisdealer.Trash) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    deleteScoopChosen();
                    return;
                }
            }
        });
        Eisdealer.allObjects.forEach(item => {
            if (item instanceof Eisdealer.Customer) {
                const distance = calculateDistance(clickX, clickY, item.x, item.y);
                if (distance <= 50) {
                    checkOrder(item);
                    return;
                }
            }
        });
        handleScoopClick(clickX, clickY);
    }
    Eisdealer.handleClick = handleClick;
    function handleScoopClick(clickX, clickY) {
        const scoopRadius = 50;
        const maxScoops = 2;
        const scoopPositions = [
            { x: 850, y: 550 },
            { x: 850, y: 525 },
        ];
        if (chosenScoops.length < maxScoops) {
            for (const item of Eisdealer.allObjects) {
                if (item instanceof Eisdealer.Scoop) {
                    const distance = calculateDistance(clickX, clickY, item.x, item.y);
                    if (distance <= scoopRadius) {
                        let flavorChosenScoop;
                        if (item.color === colorPistacchio) {
                            flavorChosenScoop = 'Pistazie';
                        }
                        else if (item.color === colorStrawberry) {
                            flavorChosenScoop = 'Erdbeere';
                        }
                        else if (item.color === colorVanille) {
                            flavorChosenScoop = 'Vanille';
                        }
                        else if (item.color === colorChocolate) {
                            flavorChosenScoop = 'Schokolade';
                        }
                        else {
                            flavorChosenScoop = 'unknown';
                        }
                        let chosenScoop = new Eisdealer.ScoopChosen(scoopPositions[chosenScoops.length].x, scoopPositions[chosenScoops.length].y, item.color, flavorChosenScoop);
                        chosenScoops.push(chosenScoop);
                        Eisdealer.allObjects.push(chosenScoop);
                        if (chosenScoops.length === 1) {
                            let cone = new Eisdealer.Cone(900, 400);
                            Eisdealer.allObjects.push(cone);
                        }
                        addItemToOrder(item, 1); // Add scoop to order
                        break;
                    }
                }
            }
        }
    }
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
    function checkOrder(customer) {
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
            deleteScoopChosen(); // Clear chosen scoops after order is completed
        }
    }
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
    function drawPriceList() {
        Eisdealer.crc2.font = "30px Arial";
        // Draw Cash Register
        Eisdealer.crc2.strokeRect(sidebarX, 450, 300, 250);
        Eisdealer.crc2.fillText("Total", sidebarX + 10, 500);
        Eisdealer.crc2.strokeRect(sidebarX + 50, 550, 200, 80);
    }
    function addItemToOrder(item, quantity) {
        const existingItem = orderItems.find(orderItem => orderItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price += item.price * quantity;
        }
        else {
            orderItems.push({ name: item.name, quantity, price: item.price * quantity });
        }
        updateTotal();
    }
    function updateTotal() {
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        Eisdealer.crc2.clearRect(sidebarX + 50, 550, 200, 80);
        Eisdealer.crc2.fillText(total.toFixed(2) + "€", sidebarX + 170, 600);
    }
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=main.js.map