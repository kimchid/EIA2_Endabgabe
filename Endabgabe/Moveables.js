"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Moveables extends Eisdealer.Drawables {
        direction;
        speed;
        type;
        constructor(_x, _y, _direction, _speed, _type) {
            super(_x, _y);
            this.direction = _direction;
            this.speed = _speed;
            this.type = _type;
        }
        draw() {
            console.log("movables draw");
        }
        move() {
        }
        update() {
            this.move();
            this.draw();
        }
    }
    Eisdealer.Moveables = Moveables;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Moveables.js.map