namespace Eisdealer {
    export class ScoopChosen extends Drawables {

        private radius: number;
        public color: string;
        public flavor: string

        constructor(_x: number, _y: number, _color: string, _flavor: string) {
            super(_x, _y);
            this.radius = 30;
            this.color = _color;
            this.flavor = _flavor;
        }

        draw() {
            crc2.beginPath();
            crc2.arc(this.x, this.y, this.radius, Math.PI, 2 * Math.PI); // Halbkreis von PI bis 2*PI (180° bis 360°)
            crc2.fillStyle = this.color;
            crc2.fill();
        
            crc2.beginPath();
            crc2.moveTo(this.x - this.radius, this.y); // Startpunkt links vom Mittelpunkt
            crc2.lineTo(this.x + this.radius, this.y); // Endpunkt rechts vom Mittelpunkt

        }
        
        }
}
