namespace Eisdealer {

    export class Trash extends Drawables{
    private radius: number;

    constructor(_x: number, _y: number) {
        super(_x, _y);
        this.radius = 35;
    }

    public draw(){
         // Mülltonne
         crc2.beginPath();
         crc2.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
         crc2.fillStyle = '#808080'; 
         crc2.fill();

         crc2.stroke();
         crc2.font = '12px Arial'; // Schriftgröße und -art
         crc2.fillStyle = '#000000'; // Textfarbe: Schwarz
         crc2.fillText('Trash', this.x, this.y);
 
     }
    }

}
