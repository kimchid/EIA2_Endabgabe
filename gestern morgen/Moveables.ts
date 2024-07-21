namespace Eisdealer {
    export abstract class Moveables extends Drawables {
        direction: Vector;
        speed: Vector;
        type: string;

        constructor(_x: number, _y: number, _direction: Vector, _speed: Vector, _type: string) {
            super(_x, _y);
            this.direction = _direction;
            this.speed = _speed;
            this.type = _type;
        }

        public draw(): void {
            console.log("movables draw");
        }

        public move(): void {
    
        }

        update(): void {
            this.move();
            this.draw();
        }
    }
}
