namespace Eisdealer {

    export class Trash extends Drawables{
    private radius: number;

    constructor(_x: number, _y: number) {
        super(_x, _y);
        this.radius = 50;
    }

    public draw(){
         // Mülltonne
         crc2.beginPath();
         crc2.arc(this.x, this.y, this.radius, 0, Math.PI * 1);
         crc2.fillStyle = '#808080'; 
         crc2.fill();
 
         crc2.beginPath();
         crc2.arc(this.x, this.y, 40, 0, Math.PI * 1);
         crc2.strokeStyle = '#fffff';
         crc2.stroke();
 
     }
    }

}
