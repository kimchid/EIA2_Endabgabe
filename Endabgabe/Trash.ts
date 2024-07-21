namespace Eisdealer {

    export class Trash extends Drawables{
    private radius: number;

    constructor(_x: number, _y: number) {
        super(_x, _y);
        this.radius = 30;
    }

    public draw(){
        crc2.beginPath();
        crc2.arc(this.x, this.y, this.radius, Math.PI / 2, 3 * Math.PI / 2); // Von oben links bis unten rechts
        crc2.lineTo(this.x, this.y); // Zur Mitte zurückkehren
        crc2.closePath(); // Pfad schließen
        crc2.fillStyle = '#808080'; 
        crc2.fill();
        crc2.strokeStyle = '#00000';
        crc2.stroke();
 
     }
    }

}
