// cashRegister.ts
namespace Eisdealer {
    export class CashRegister {
        private total: number = 0;

        constructor() {}

        public add(amount: number): void {
            this.total += amount;
        }

        public getTotal(): number {
            return this.total;
        }
    }
}
