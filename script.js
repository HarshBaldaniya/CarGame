let speed = 0; // Speed in km/h
let position = 0;
let interval;
const maxSpeed = 50; // 50 km/h
const carElement = document.getElementById('car');
const speedElement = document.getElementById('speed');
const distanceElement = document.getElementById('distance');
const increaseSpeedButton = document.getElementById('increaseSpeed');
const decreaseSpeedButton = document.getElementById('decreaseSpeed');
const carStartAudio = document.getElementById('carStartAudio');
const carAccelerationAudio = document.getElementById('carAccelerationAudio');
const carHornAudio = document.getElementById('carHornAudio');
const playHornButton = document.getElementById('playHorn');
const canvas = document.getElementById('speedGraph');
const ctx = canvas.getContext('2d');
const graphData = [];
const graphInterval = 100; // Update graph every 100 ms
let lastGraphTime = 0;
let time = 0;
let carStarted = false;

// Set initial volume for each sound effect
carStartAudio.volume = 0.8; // 80% volume
carAccelerationAudio.volume = 0.7; // 70% volume initially
carHornAudio.volume = 1.0; // 100% volume

// Update position and speed display
function updatePosition() {
    let speedInMetersPerSecond = speed * 1000 / 3600;
    position += speedInMetersPerSecond / 50;
    speedElement.textContent = speed.toFixed(0);
    distanceElement.textContent = (position * 50).toFixed(2);

    let animationDuration = speed > 0 ? Math.max(0.1, 10 / speed) : 0;

    document.querySelectorAll('.lane-marker').forEach(marker => {
        marker.style.animationDuration = `${animationDuration}s`;
        marker.style.animationPlayState = speed > 0 ? 'running' : 'paused';
    });

    document.querySelectorAll('.tree').forEach(tree => {
        tree.style.animationDuration = `${animationDuration * 2}s`;
        tree.style.animationPlayState = speed > 0 ? 'running' : 'paused';
    });

    updateGraph();
}

// Change speed and update position
function changeSpeed(amount) {
    let previousSpeed = speed;
    speed = Math.max(0, Math.min(maxSpeed, speed + amount));

    if (speed > 0 && !carStarted) {
        // Play car start sound on the first acceleration
        carStartAudio.play();
        carStarted = true;
    }

    if (speed > previousSpeed) {
        // Play car acceleration sound when increasing speed
        carAccelerationAudio.currentTime = 0; // Restart sound
        carAccelerationAudio.play();
    }

    // Adjust volume based on speed relative to maxSpeed
    carAccelerationAudio.volume = speed / maxSpeed;

    if (speed < previousSpeed) {
        // Optionally, adjust sound behavior when decreasing speed
        if (speed === 0) {
            carAccelerationAudio.pause();
            carAccelerationAudio.currentTime = 0; // Reset sound to the start
        }
    }

    updatePosition();
}

// Play horn sound
function playHorn() {
    carHornAudio.play();
}

function updateGraph() {
    if (time - lastGraphTime >= graphInterval / 1000) {
        graphData.push({ time, speed });
        if (graphData.length > canvas.width / 2) {
            graphData.shift();
        }
        lastGraphTime = time;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Y-axis (Speed) with labels
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.moveTo(50, 10);
    ctx.lineTo(50, canvas.height - 30);
    ctx.stroke();

    const yAxisTicks = 5;
    for (let i = 0; i <= yAxisTicks; i++) {
        const y = canvas.height - 30 - i * (canvas.height - 40) / yAxisTicks;
        const speedLabel = (maxSpeed / yAxisTicks) * i;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(50, y);
        ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${speedLabel} km/h`, 45, y + 5);
    }

    // Draw X-axis (Time) with label
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.moveTo(50, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Time (s)', canvas.width / 2, canvas.height - 10);

    // Draw graph
    ctx.beginPath();
    ctx.moveTo(
        50,
        canvas.height - 30 - graphData[0].speed * ((canvas.height - 40) / maxSpeed)
    );
    graphData.forEach((point, index) => {
        const x = 50 + index * ((canvas.width - 60) / graphData.length);
        const y = canvas.height - 30 - point.speed * ((canvas.height - 40) / maxSpeed);
        ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw smoothed curve
    ctx.beginPath();
    ctx.moveTo(
        50,
        canvas.height - 30 - graphData[0].speed * ((canvas.height - 40) / maxSpeed)
    );
    for (let i = 1; i < graphData.length; i++) {
        const x = 50 + i * ((canvas.width - 60) / graphData.length);
        const y = canvas.height - 30 - graphData[i].speed * ((canvas.height - 40) / maxSpeed);
        const cx = (50 + (i - 1) * ((canvas.width - 60) / graphData.length) + x) / 2;
        const cy = (canvas.height - 30 - graphData[i - 1].speed * ((canvas.height - 40) / maxSpeed) + y) / 2;
        ctx.quadraticCurveTo(cx, cy, x, y);
    }
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.stroke();
}

increaseSpeedButton.addEventListener('click', () => {
    changeSpeed(2); // Increase speed by 2 km/h
});

decreaseSpeedButton.addEventListener('click', () => {
    changeSpeed(-2); // Decrease speed by 2 km/h
});

playHornButton.addEventListener('click', playHorn);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        changeSpeed(2); // Increase speed by 2 km/h
    } else if (event.key === 'ArrowDown') {
        changeSpeed(-2); // Decrease speed by 2 km/h
    } else if (event.key === ' ') {
        playHorn(); // Play horn when spacebar is pressed
    }
});

interval = setInterval(() => {
    time += 0.1;
    updatePosition();
}, 100);
