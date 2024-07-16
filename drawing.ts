export function drawFace(crc2: CanvasRenderingContext2D, x: number, y: number, radius: number, happy: boolean) {
    crc2.beginPath();
    crc2.arc(x, y, radius, 0, Math.PI * 2, true);
    crc2.moveTo(x + radius * 0.6, y);
    if (happy) {
        crc2.arc(x, y, radius * 0.6, 0, Math.PI, false);
    } else {
        crc2.arc(x, y + radius * 0.2, radius * 0.2, 0, Math.PI, true);
    }
    crc2.moveTo(x - radius * 0.3, y - radius * 0.3);
    crc2.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.15, 0, Math.PI * 2, true);
    crc2.moveTo(x + radius * 0.3, y - radius * 0.3);
    crc2.arc(x + radius * 0.3, y - radius * 0.3, radius * 0.15, 0, Math.PI * 2, true);
    crc2.stroke();
}

export function drawIceCreamOptions(crc2: CanvasRenderingContext2D) {
    const options = [
        { color: "#45322e", text: "Schokolade", x: 40, y: 280 },
        { color: "#F3E5AB", text: "Vanille", x: 320, y: 280 },
        { color: "#352927", text: "Schokostückchen", x: 750, y: 280 },
        { color: "#d47274", text: "Erdbeere", x: 40, y: 500 },
        { color: "#93c572", text: "Pistazie", x: 320, y: 500 }
    ];

    options.forEach((option) => {
        crc2.fillStyle = option.color;
        crc2.fillRect(option.x, option.y, 200, 150);
        crc2.strokeRect(option.x, option.y, 200, 150);
        crc2.fillStyle = "black";
        crc2.fillText(option.text, option.x + 20, option.y + 190);
    });
}

export function drawCounter(crc2: CanvasRenderingContext2D) {
    crc2.strokeRect(0, 200, window.innerWidth - 550, 500);
    crc2.lineTo(1000, 450);
    crc2.textAlign = "left";
    crc2.font = "20px Arial";
    crc2.fillText("+ 2€", 100, 250);
    crc2.fillText("+ 2€", 460, 250);
}

export function drawSidebar(crc2: CanvasRenderingContext2D) {
    const sidebarX = window.innerWidth - 520;

    crc2.strokeRect(sidebarX, 200, 400, 250);
    crc2.font = "30px Arial";
    crc2.fillText("Preisliste", sidebarX + 20, 260);
    crc2.fillText("je Kugel:                2€", sidebarX + 50, 320);
    crc2.fillText("Schokostückchen: 1€", sidebarX + 50, 360);
    crc2.fillText("Waffeln:                 1€", sidebarX + 50, 400);

    crc2.strokeRect(sidebarX, 450, 400, 250);
    crc2.fillText("Kasse", sidebarX + 20, 500);
    crc2.strokeRect(sidebarX + 50, 550, 300, 80);
}
