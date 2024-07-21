"use strict";
// cashRegister.ts
var Eisdealer;
(function (Eisdealer) {
    class CashRegister {
        total = 0;
        constructor() { }
        add(amount) {
            this.total += amount;
        }
        getTotal() {
            return this.total;
        }
    }
    Eisdealer.CashRegister = CashRegister;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=CashRegister.js.map