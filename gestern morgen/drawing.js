"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Drawables {
        x;
        y;
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        update() {
            this.draw();
        }
    }
    Eisdealer.Drawables = Drawables;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=drawing.js.map