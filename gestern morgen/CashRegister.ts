// cash.ts
namespace Eisdealer {
    export class CashRegister {
        private total: number = 0;

        constructor() {
            // Initialisierung, falls nötig
        }

        // Methode zum Hinzufügen eines Betrags zur Kasse
        public add(amount: number): void {
            if (amount > 0) {
                this.total += amount;
            }
        }

        // Methode zum Abrufen des aktuellen Gesamtbetrags
        public getTotal(): number {
            return this.total;
        }
    }
}
