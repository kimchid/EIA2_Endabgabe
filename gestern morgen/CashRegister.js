"use strict";
// cash.ts
var Eisdealer;
(function (Eisdealer) {
    class CashRegister {
        total = 0;
        constructor() {
            // Initialisierung, falls nötig
        }
        // Methode zum Hinzufügen eines Betrags zur Kasse
        add(amount) {
            if (amount > 0) {
                this.total += amount;
            }
        }
        // Methode zum Abrufen des aktuellen Gesamtbetrags
        getTotal() {
            return this.total;
        }
    }
    Eisdealer.CashRegister = CashRegister;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=CashRegister.js.map