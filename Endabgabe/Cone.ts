namespace Eisdealer {

    export class Cone extends Drawables{


    constructor(_x: number, _y: number) {
        super(_x, _y);
    }

    public draw(){
        //console.log("drawCup")
        crc2.fillStyle = "tan";
        crc2.beginPath();
        crc2.moveTo(825, 550); // Start point (left vertex)
        crc2.lineTo(875, 550); // Top right vertex
        crc2.lineTo(850, 625); // Bottom vertex (lowered)
        crc2.closePath();
        crc2.fill();
    }
}
}