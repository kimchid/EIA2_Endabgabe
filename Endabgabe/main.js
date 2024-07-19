"use strict";
// main.ts
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
    function handleLoad(_event) {
        console.log("handleLoad");
        let canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        Eisdealer.crc2 = canvas.getContext("2d");
        canvas.addEventListener("click", handleClick);
        initializeObjects();
        setInterval(animate, 20);
        createCustomer();
        cashRegister = new Eisdealer.CashRegister();
        drawPriceList();
        // Create the total element and add it to the document
        totalElement = document.createElement("div");
        totalElement.id = "total";
        totalElement.style.position = "absolute";
        totalElement.style.left = "1850px";
        totalElement.style.top = "80px";
        totalElement.style.fontSize = "20px";
        document.body.appendChild(totalElement);
        // Initial display
        updateTotalDisplay();
    }
    function initializeObjects() {
        let trash = new Eisdealer.Trash(1250, 100);
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
    }
    function createCustomer() {
        function createCustomersIfNeeded() {
            let customerCount = Eisdealer.allObjects.filter(obj => obj instanceof Eisdealer.Customer).length;
            if (customerCount < maxCustomers) {
                let customerX = 500;
                let customerY = -50;
                let customer = new Eisdealer.Customer(customerX, customerY, new Eisdealer.Vector(0, 0), new Eisdealer.Vector(4, 4), `Customer ${customerCount + 1}`, Eisdealer.allObjects);
                Eisdealer.allObjects.push(customer);
                customer.findNextUnoccupiedChair();
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
                const distance = Math.sqrt(Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2));
                if (distance <= 50) {
                    deleteScoopChosen();
                    return;
                }
            }
        });
        Eisdealer.allObjects.forEach(item => {
            if (item instanceof Eisdealer.Customer) {
                const distance = Math.sqrt(Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2));
                if (distance <= 50) {
                    checkOrder(item);
                    deleteScoopChosen();
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
                    const distance = Math.sqrt(Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2));
                    if (distance <= scoopRadius) {
                        let flavorChosenScoop;
                        if (item.color === colorPistacchio) {
                            flavorChosenScoop = 'pistacchio';
                        }
                        else if (item.color === colorStrawberry) {
                            flavorChosenScoop = 'strawberry';
                        }
                        else if (item.color === colorVanille) {
                            flavorChosenScoop = 'vanille';
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
                        break;
                    }
                }
            }
        }
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
            updateTotalDisplay(); // Update the total display when an order is completed
        }
    }
    function drawBackground() {
        const canvasWidth = 2000;
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
        // No need to create totalElement here; it's created once in handleLoad
    }
    function drawPriceList() {
        const sidebarX = 1500;
        Eisdealer.crc2.strokeRect(sidebarX, 200, 400, 250);
        Eisdealer.crc2.font = "30px Arial";
        Eisdealer.crc2.fillText("Preisliste", sidebarX + 20, 260);
        Eisdealer.iceCreamItems.forEach((item, index) => {
            Eisdealer.crc2.fillText(`${item.name}: ${item.price}€`, sidebarX + 50, 320 + index * 40);
        });
    }
    function updateTotalDisplay() {
        if (totalElement) {
            totalElement.textContent = `Total: ${cashRegister.getTotal()}€`;
        }
    }
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=main.js.map