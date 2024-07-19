"use strict";
var Eisdealer;
(function (Eisdealer) {
    window.addEventListener("load", handleLoad);
    Eisdealer.allObjects = [];
    let targetPosition = new Eisdealer.Vector(0, 0);
    let chosenScoops = [];
    let colorPistacchio = "#93c572";
    let colorStrawberry = "#d47274";
    let colorVanille = "#F3E5AB";
    let colorChocolate = "#45322e";
    let maxCustomers = 4;
    function handleLoad(_event) {
        console.log("handleLoad");
        let canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        Eisdealer.crc2 = canvas.getContext("2d");
        canvas.addEventListener("click", handleClick);
        // Initialize objects in the scene
        initializeObjects();
        // Start the animation loop
        setInterval(animate, 20);
        // Create initial set of customers
        createCustomer();
    }
    function initializeObjects() {
        let trash = new Eisdealer.Trash(1250, 100);
        Eisdealer.allObjects.push(trash);
        // Add chairs
        const chairs = [
            new Eisdealer.Chair(100, 100),
            new Eisdealer.Chair(350, 100),
            new Eisdealer.Chair(600, 100),
            new Eisdealer.Chair(850, 100)
        ];
        Eisdealer.allObjects.push(...chairs);
        // Add scoops
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
                    createCustomer(); // Create a new customer if one has left
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
        // Handle clicks on trash
        Eisdealer.allObjects.forEach(item => {
            if (item instanceof Eisdealer.Trash) {
                const distance = Math.sqrt(Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2));
                if (distance <= 50) {
                    deleteScoopChosen();
                    return;
                }
            }
        });
        // Handle clicks on customers to check orders
        Eisdealer.allObjects.forEach(item => {
            if (item instanceof Eisdealer.Customer) {
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
                correct = false; // Flag for incorrect order
                break;
            }
        }
        if (correct) {
            customer.orderCompleted = true;
            customer.leaving = true; // Mark the customer as leaving
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
    }
})(Eisdealer || (Eisdealer = {}));
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
//# sourceMappingURL=main.js.map