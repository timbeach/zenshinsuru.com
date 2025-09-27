// oneko.js

let onekoX = window.innerWidth / 2;
let onekoY = window.innerHeight / 2;
let targetX = onekoX;
let targetY = onekoY;
let animationFrame = 0;
let lastFrameTime = 0;
let lastMouseMoveTime = Date.now(); // Track the last mouse movement time
let isIdle = false;
let lickCount = 0; // Track how many times the cat has licked
let isYawning = false; // Track if the cat is yawning

// Reference to the oneko div
const oneko = document.getElementById('oneko');

// Define frame sets for different directions and idle/sleep animations
const frameSets = {
    up: [
        { x: -32, y: -64 },
        { x: -32, y: -96 }
    ],
    left: [
        { x: -192, y: -32 },
        { x: -128, y: -64 },
        { x: -128, y: -96 }
    ],
    right: [
        { x: -96, y: 0 },
        { x: -96, y: -32 },
        { x: -160, y: -64 }
    ],
    down: [
        { x: -224, y: -64 },
        { x: -192, y: -96 }
    ],
    upLeft: [
        { x: -32, y: 0 },
        { x: -32, y: -32 }
    ],
    upRight: [
        { x: 0, y: -64 },
        { x: 0, y: -96 }
    ],
    downLeft: [
        { x: -160, y: -96 },
        { x: -192, y: -32 }
    ],
    downRight: [
        { x: -160, y: -32 },
        { x: -96, y: -32 }
    ],
    lick: [
        { x: -224, y: 0 },  // Licking frame
        { x: -96, y: -96 }  // Sitting/resting frame
    ],
    yawn: [
        { x: -96, y: -64 }  // Yawning frame
    ],
    sleep: [
        { x: -64, y: 0 },    // Sleeping frame 1
        { x: -64, y: -32 }   // Sleeping frame 2
    ]
};

// Function to determine the direction
function getDirection(deltaX, deltaY) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY) {
        if (deltaX > 0) return "right";
        else return "left";
    } else if (absY > absX) {
        if (deltaY > 0) return "down";
        else return "up";
    } else {
        // Diagonal directions
        if (deltaX < 0 && deltaY < 0) return "upLeft";
        if (deltaX > 0 && deltaY < 0) return "upRight";
        if (deltaX < 0 && deltaY > 0) return "downLeft";
        if (deltaX > 0 && deltaY > 0) return "downRight";
    }
    return "down"; // Default fallback
}

// Function to update the position and animation frame of the oneko
function updatePosition(timestamp) {
    const speed = 0.01; // Cat's movement speed
    const stoppingDistance = 50; // Stopping distance from the cursor
    const deltaX = targetX - onekoX;
    const deltaY = targetY - onekoY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if the cat should be idle
    const currentTime = Date.now();
    if (currentTime - lastMouseMoveTime > 5000) {
        isIdle = true;
    } else {
        isIdle = false;
        lickCount = 0; // Reset lick count when the mouse moves
        isYawning = false; // Reset yawning status
    }

    if (!isIdle && distance > stoppingDistance) {
        // Cat is moving
        const moveX = (deltaX / distance) * speed * distance;
        const moveY = (deltaY / distance) * speed * distance;

        onekoX += moveX;
        onekoY += moveY;

        // Update the position of the cat
        oneko.style.transform = `translate(${onekoX - 16}px, ${onekoY - 16}px)`;

        // Determine the direction
        const direction = getDirection(deltaX, deltaY);

        // Update the running animation frame every 150ms
        if (timestamp - lastFrameTime > 150) {
            const frames = frameSets[direction]; // Get the frames for the current direction
            animationFrame = (animationFrame + 1) % frames.length; // Loop through the frames
            const frame = frames[animationFrame];
            oneko.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
            lastFrameTime = timestamp;
        }
    } else if (isIdle) {
        // Cat is idle
        if (lickCount < 3) {
            // Licking phase: alternate between licking and sitting/resting
            if (timestamp - lastFrameTime > 500) { // Switch frames every 500ms
                const frames = frameSets.lick;
                animationFrame = (animationFrame + 1) % frames.length;
                const frame = frames[animationFrame];
                oneko.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
                lastFrameTime = timestamp;
                if (animationFrame === 0) lickCount++; // Increment lick count after each full cycle
            }
        } else if (!isYawning) {
            // Yawning phase
            if (timestamp - lastFrameTime > 1000) { // Hold the yawn for 1 second
                const frame = frameSets.yawn[0];
                oneko.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
                lastFrameTime = timestamp;
                isYawning = true; // Mark as yawning completed
            }
        } else {
            // Sleeping phase: alternate between the two sleeping frames
            if (timestamp - lastFrameTime > 700) { // Switch sleeping frames every 700ms
                const frames = frameSets.sleep;
                animationFrame = (animationFrame + 1) % frames.length;
                const frame = frames[animationFrame];
                oneko.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
                lastFrameTime = timestamp;
            }
        }
    } else {
        // Cat stops at a distance from the cursor
        oneko.style.transform = `translate(${onekoX - 16}px, ${onekoY - 16}px)`;

        // Set the animation to the sitting frame
        oneko.style.backgroundPosition = `-96px -96px`;
    }

    // Request the next animation frame
    requestAnimationFrame(updatePosition);
}

// Update the target position whenever the mouse moves
document.addEventListener('mousemove', (event) => {
    targetX = event.pageX;
    targetY = event.pageY;
    lastMouseMoveTime = Date.now(); // Reset the idle timer
    isIdle = false; // Reset idle status when the mouse moves
});

// Start the animation loop
requestAnimationFrame(updatePosition);

