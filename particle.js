const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

let mouse = {
    x: null,
    y: null,
    radius: 100,
};

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class Particle {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 10 + 2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        ctx.fillStyle = this.color;
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        const maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;
        let directionX = forceDirectionX * force * this.density * 0.6;
        let directionY = forceDirectionY * force * this.density * 0.6;

        if (distance < mouse.radius + this.size) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }

        this.draw();
    }
}

function init() {
    particleArray = [];
    for (let y = 0; y < canvas.height; y += 3) {
        for (let x = 0; x < canvas.width; x += 4) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            if (pixelData[3] > 128) {
                const positionX = x;
                const positionY = y;
                const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
                particleArray.push(new Particle(positionX, positionY, color, 2));
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    clearCanvas();
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
    }
}

init();
animate();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

const png = new Image();
png.src = "ironman2.png"; // Replace with the path to your image
png.addEventListener("load", () => {
    console.log("Image has loaded");
    ctx.drawImage(png, 0, 0);
    init();
});