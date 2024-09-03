let speed = 0; // Speed in km/h
let position = 0;
let interval;

const maxSpeed = 50; // 50 km/h
const carElement = document.getElementById('car');
const speedElement = document.getElementById('speed');
const distanceElement = document.getElementById('distance');
const increaseSpeedButton = document.getElementById('increaseSpeed');
const decreaseSpeedButton = document.getElementById('decreaseSpeed');

function updatePosition() {
    // Convert speed from km/h to m/s for position calculation
    let speedInMetersPerSecond = speed * 1000 / 3600;
    position += speedInMetersPerSecond / 50; // Update position based on speed

    // Update displayed information
    speedElement.textContent = speed.toFixed(0);
    distanceElement.textContent = (position * 50).toFixed(2);

    // Adjust lane marker and tree speed based on car speed
    let animationDuration = speed > 0 ? Math.max(0.1, 10 / speed) : 0;

    document.querySelectorAll('.lane-marker').forEach(marker => {
        marker.style.animationDuration = `${animationDuration}s`;
        marker.style.animationPlayState = speed > 0 ? 'running' : 'paused';
    });

    document.querySelectorAll('.tree').forEach(tree => {
        tree.style.animationDuration = `${animationDuration * 2}s`;
        tree.style.animationPlayState = speed > 0 ? 'running' : 'paused';
    });
}

function changeSpeed(amount) {
    speed = Math.max(0, Math.min(maxSpeed, speed + amount));
    updatePosition();
}

increaseSpeedButton.addEventListener('click', () => {
    changeSpeed(5); // Increase speed by 5 km/h
});

decreaseSpeedButton.addEventListener('click', () => {
    changeSpeed(-5); // Decrease speed by 5 km/h
});

// Adding keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        changeSpeed(5); // Increase speed by 5 km/h
    } else if (event.key === 'ArrowDown') {
        changeSpeed(-5); // Decrease speed by 5 km/h
    }
});

interval = setInterval(updatePosition, 20);
