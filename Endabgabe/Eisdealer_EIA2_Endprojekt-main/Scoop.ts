namespace Eisdealer {
    export class Scoop extends Drawables {

        private radius: number;
        public color: string;

        constructor(_x: number, _y: number, _color: string) {
            super(_x, _y);
            this.radius = 80;
            this.color = _color;
        }

        draw() {
        crc2.lineWidth = 8;

        crc2.beginPath();
        crc2.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        crc2.fillStyle = this.color;
        crc2.fill();
        crc2.lineWidth = 2;
        crc2.stroke();
        

        }
        }

   
}
