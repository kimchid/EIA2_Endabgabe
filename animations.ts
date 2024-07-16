import { Customer } from "./customer";

export function animateCustomers(crc2: CanvasRenderingContext2D, customers: Customer[]) {
    crc2.clearRect(0, 0, window.innerWidth, window.innerHeight);
    customers.forEach(customer => {
        customer.move();
        customer.draw(crc2);
    });
}

export function createCustomer(customers: Customer[]) {
    if (customers.length < 7) {
        const minX = 50;
        const maxX = 300;
        const minY = 400;
        const maxY = 500;

        const x = Math.random() * (maxX - minX) + minX;
        const y = Math.random() * (maxY - minY) + minY;
        customers.push(new Customer(x, y, "green"));
    }
}
