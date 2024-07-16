import { IceCreamItem } from "./iceCreamItem";
import { OrderItem } from "./orderItem";
import { Customer } from "./customer";
import { drawFace, drawIceCreamOptions, drawCounter, drawSidebar } from "./drawing";
import { handleCanvasClick } from "./events";
import { animateCustomers, createCustomer } from "./animations";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const crc2 = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (crc2) {
    // Draw initial elements
    drawFace(crc2, 100, 100, 50, true);
    drawFace(crc2, 350, 100, 50, false);
    drawFace(crc2, 600, 100, 50, true);
    drawFace(crc2, 850, 100, 50, true);

    drawCounter(crc2);
    drawIceCreamOptions(crc2);
    drawSidebar(crc2);
}

let customers: Customer[] = [];
const orderItems: OrderItem[] = [];
const iceCreamItems: IceCreamItem[] = [
    { name: "Schokolade", price: 2 },
    { name: "Vanille", price: 2 },
    { name: "Schokostückchen", price: 1 },
    { name: "Erdbeere", price: 2 },
    { name: "Pistazie", price: 2 },
    { name: "Waffeln", price: 1 }
];

canvas.addEventListener('click', (event) => handleCanvasClick(event, crc2, orderItems, iceCreamItems));

function handleLoad() {
    customers.push(new Customer(200, 400));

    setInterval(createCustomer, 5000, customers);

    window.setInterval(() => {
        animateCustomers(crc2, customers);
    }, 24);
}

window.addEventListener('load', handleLoad);
