"use strict";
var Eisdealer;
(function (Eisdealer) {
    class Vector {
        x;
        y;
        constructor(_x, _y) {
            this.set(_x, _y);
        }
        set(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
    }
    Eisdealer.Vector = Vector;
})(Eisdealer || (Eisdealer = {}));
//# sourceMappingURL=Vector.js.map