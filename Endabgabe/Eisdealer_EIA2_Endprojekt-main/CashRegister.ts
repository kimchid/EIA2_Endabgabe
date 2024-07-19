namespace Eisdealer {
    // Falls Drawables nicht benötigt wird, können wir es einfach weglassen
    // In diesem Beispiel gehen wir davon aus, dass Drawables eine leere Basisklasse ist
    // oder bereits korrekt definiert wurde
    class Drawables {
        // Hier könnte allgemeine Funktionalität für Zeichnungsobjekte definiert werden
    }

    export class CashRegister extends Drawables {
        private element: HTMLDivElement;

        constructor() {
            super(); // Ruft den Konstruktor der Basisklasse auf

            this.element = document.createElement('div');
            this.element.style.position = 'absolute';
            this.element.style.top = '100px'; // Adjust top position as needed
            this.element.style.right = '20px'; // Adjust right position as needed
            this.element.style.padding = '10px';
            this.element.style.backgroundColor = 'white';
            this.element.style.border = '1px solid black';
            this.element.style.display = 'none'; // Initially hide

            document.body.appendChild(this.element);
        }

        public showPrice(flavor: string): void {
            let price: number;

            // Determine price based on flavor
            switch (flavor) {
                case 'Pistazie':
                    price = 2.5; // Example price
                    break;
                case 'Erdbeere':
                    price = 3.0; // Example price
                    break;
                case 'Vanille':
                    price = 2.0; // Example price
                    break;
                default:
                    price = 0; // Default to 0 if flavor not recognized
                    break;
            }

            if (price > 0) {
                this.element.innerHTML = `Price: $${price.toFixed(2)}`;
            } else {
                this.element.innerHTML = 'Price: Not available';
            }

            this.element.style.display = 'block';
        }

        public hide(): void {
            this.element.style.display = 'none';
        }
    }
}
