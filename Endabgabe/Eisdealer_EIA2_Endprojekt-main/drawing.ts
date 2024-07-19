namespace Eisdealer {
    export abstract class Drawables {
        x: number;
        y: number;

        constructor(_x: number, _y: number) {
            this.x = _x;
            this.y = _y;
        }

        abstract draw(): void;

        update(): void {
            this.draw();
        }
    }
}
