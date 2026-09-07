const canvas = document.getElementById("graphicsCanvas");
const ctx = canvas.getContext("2d");

// --------------------------------------------------
/*
Praktikum Grafika Komputer - Pertemuan 1
Graphics Playground

Nama : Joaquin Fairuz Nawfal Ismono
NRP  : 5025241106
Kelas: B

Nama : Hasan Abdurrahman
NRP  : 5025241114
Kelas: B

Challenge:
- A - Bouncing Object
- B - Follow Mouse
- C - Click to Change Canvas Color
- D - Keyboard Movement
- E - Mouse Coordinate
*/
// --------------------------------------------------

const rectangle = {
    x: 80,
    y: 80,
    width: 160,
    height: 100,
    color: "#3498db"
};

const arrow = {
    x: 600,
    y: 350,
    width: 50,
    height: 50,
    speed: 5,
    angle: 0,
    color: "#e67e22"
};

const circle = {
    x: 650,
    y: 120,
    radius: 10,
    color: "#2ecc71"
};

const movingBall = {
    x: 350,
    y: 300,
    radius: 25,
    speedX: 2,
    speedY: 2,
    color: "#9b59b6"
};

const player = {
    x: 600,
    y: 350,
    width: 50,
    height: 50,
    speed: 5,
    color: "#e67e22"
};

const mouse = {
    x: 0,
    y: 0
};

const keys = {};

const colors = [
    "#9b59b6",
    "#e74c3c",
    "#2ecc71",
    "#f1c40f",
    "#3498db",
    "#ffffff",
    "#000000"
];

let colorIndex = 0;
let canvasColorIndex = 5;

// --------------------------------------------------
// CANVAS
// --------------------------------------------------

function clearCanvas() {
    ctx.fillStyle = colors[canvasColorIndex];

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

// --------------------------------------------------
// DRAW
// --------------------------------------------------

function drawRectangle() {
    ctx.fillStyle = rectangle.color;

    ctx.fillRect(
        rectangle.x,
        rectangle.y,
        rectangle.width,
        rectangle.height
    );
}

function drawLine() {
    ctx.beginPath();

    ctx.moveTo(300, 80);
    ctx.lineTo(500, 180);

    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 5;

    ctx.stroke();
}

function drawCircle() {
    ctx.beginPath();

    ctx.arc(
        650,
        120,
        60,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#2ecc71";
    ctx.fill();
}

function drawTriangle() {
    ctx.beginPath();

    ctx.moveTo(150, 300);
    ctx.lineTo(80, 430);
    ctx.lineTo(220, 430);

    ctx.closePath();

    ctx.fillStyle = "#f39c12";
    ctx.fill();

    ctx.strokeStyle = "#8a5705";
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawMovingBall() {
    ctx.beginPath();

    ctx.arc(
        movingBall.x,
        movingBall.y,
        movingBall.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = movingBall.color;
    ctx.fill();
}

function drawArrow() {
    ctx.save();

    ctx.translate(
        arrow.x + arrow.width / 2,
        arrow.y + arrow.height / 2
    );

    ctx.rotate(arrow.angle);

    ctx.beginPath();
    ctx.moveTo(25, 0);   // ujung panah
    ctx.lineTo(-20, -20);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-20, 20);
    ctx.closePath();

    ctx.fillStyle = arrow.color;
    ctx.fill();

    ctx.restore();
}

function drawMouseCoordinate() {
    ctx.fillStyle = "#222";
    if (canvasColorIndex === 6) {
        ctx.fillStyle = "#ffffff"
    }
    ctx.font = "16px Arial";

    ctx.fillText(
        `Mouse: (${Math.round(mouse.x)}, ${Math.round(mouse.y)})`,
        20,
        30
    );
}

function followMouse() {
    circle.x = mouse.x;
    circle.y = mouse.y;
}

function drawCircleFollowMouse() {
    ctx.beginPath();

    ctx.arc(
        circle.x,
        circle.y,
        circle.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = circle.color;
    ctx.fill();
}

// --------------------------------------------------
// UPDATE
// --------------------------------------------------

function updateMovingBall() {
    movingBall.x += movingBall.speedX;
    movingBall.y += movingBall.speedY;

    if (
        movingBall.x + movingBall.radius >= canvas.width ||
        movingBall.x - movingBall.radius <= 0
    ) {
        movingBall.speedX *= -1;
    }

    if (
        movingBall.y + movingBall.radius >= canvas.height ||
        movingBall.y - movingBall.radius <= 0
    ) {
        movingBall.speedY *= -1;
    }
}

function updatePlayer() {
    let directionX = 0;
    let directionY = 0;

    if (keys["ArrowLeft"]) {
        directionX -= 1;
    }

    if (keys["ArrowRight"]) {
        directionX += 1;
    }

    if (keys["ArrowUp"]) {
        directionY -= 1;
    }

    if (keys["ArrowDown"]) {
        directionY += 1;
    }

    arrow.x += directionX * arrow.speed;
    arrow.y += directionY * arrow.speed;

    if (directionX !== 0 || directionY !== 0) {
        arrow.angle = Math.atan2(directionY, directionX);
    }

    arrow.x = Math.max(
        0,
        Math.min(canvas.width - arrow.width, arrow.x)
    );

    arrow.y = Math.max(
        0,
        Math.min(canvas.height - arrow.height, arrow.y)
    );
}

// --------------------------------------------------
// INPUT
// --------------------------------------------------

canvas.addEventListener("mousemove", function(event) {
    const rect = canvas.getBoundingClientRect();

    mouse.x =
        (event.clientX - rect.left) *
        (canvas.width / rect.width);

    mouse.y =
        (event.clientY - rect.top) *
        (canvas.height / rect.height);
});

canvas.addEventListener("click", function() {
    colorIndex = (colorIndex + 1) % colors.length;
    canvasColorIndex = (canvasColorIndex + 1) % colors.length;
});

window.addEventListener("keydown", function(event) {
    const controlledKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown"
    ];

    if (controlledKeys.includes(event.key)) {
        event.preventDefault();
    }

    // State-based:
    // simpan status tombol untuk translasi kontinu.
    keys[event.key] = true;

    // Event-based:
    // contoh aksi diskrit sekali tekan.
    if (
        event.key.toLowerCase() === "r" &&
        !event.repeat
    ) {
        arrow.x = 600;
        arrow.y = 350;
        arrow.angle = 0;
    }
});

window.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

// --------------------------------------------------
// ANIMATION LOOP
// --------------------------------------------------

function animate() {
    clearCanvas();

    updateMovingBall();
    updatePlayer();

    followMouse();

    drawRectangle();
    drawLine();
    drawCircle();
    drawCircleFollowMouse();
    drawTriangle();
    drawMovingBall();
    drawArrow();
    drawMouseCoordinate();

    requestAnimationFrame(animate);
}

animate();