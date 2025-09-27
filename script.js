const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

let particles = [];
let planets = [];

class Planet {
    constructor(x, y, size, type = 'uranus') {
        this.x = x;
        this.y = y;
        this.size = size;
        this.type = type;
        this.rings = Math.random() > 0.3; // Some planets have rings
        this.ringRotation = 0;
        this.ringSpeed = 0.0002 + Math.random() * 0.0008; // SUPER slow spinning
        this.planetRotation = 0;
        this.planetRotationSpeed = (Math.random() - 0.5) * 0.0001; // VERY slow planet rotation
        this.driftX = (Math.random() - 0.5) * 0.03;
        this.driftY = (Math.random() - 0.5) * 0.03;
        this.pulseOffset = Math.random() * Math.PI * 2;

        // Different planet types with different color schemes
        this.setupPlanetType();
    }

    setupPlanetType() {
        switch(this.type) {
            case 'uranus':
                this.colors = {
                    center: '#7FDDFF',
                    mid1: '#4FD0E7',
                    mid2: '#3A9BC1',
                    edge1: '#1E4F66',
                    edge2: '#0A2A35'
                };
                this.ringColors = ['#00ff9f', '#ff3cac', '#7b68ee', '#4FD0E7', '#FF6B9D'];
                break;
            case 'jupiter':
                this.colors = {
                    center: '#FFB347',
                    mid1: '#FF8C42',
                    mid2: '#FF6B42',
                    edge1: '#D2691E',
                    edge2: '#8B4513'
                };
                this.ringColors = ['#FFB347', '#ff3cac', '#7b68ee'];
                break;
            case 'saturn':
                this.colors = {
                    center: '#FAD5A5',
                    mid1: '#DDBF94',
                    mid2: '#C8A882',
                    edge1: '#B8860B',
                    edge2: '#8B7355'
                };
                this.ringColors = ['#00ff9f', '#FAD5A5', '#ff3cac', '#7b68ee'];
                this.rings = true; // Saturn always has rings
                break;
            case 'neptune':
                this.colors = {
                    center: '#4169E1',
                    mid1: '#1E90FF',
                    mid2: '#0080FF',
                    edge1: '#0000CD',
                    edge2: '#191970'
                };
                this.ringColors = ['#4169E1', '#ff3cac', '#00ff9f'];
                break;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = 0.7;

        // Very subtle pulsing effect
        const pulse = Math.sin(Date.now() * 0.0008 + this.pulseOffset) * 0.05 + 1;
        const currentSize = this.size * pulse;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.planetRotation);

        // Create planet gradient based on type
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
        gradient.addColorStop(0, this.colors.center);
        gradient.addColorStop(0.2, this.colors.mid1);
        gradient.addColorStop(0.5, this.colors.mid2);
        gradient.addColorStop(0.8, this.colors.edge1);
        gradient.addColorStop(1, this.colors.edge2);

        // Draw clean planet (no bands)
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw rainbow rings if this planet has them
        if (this.rings) {
            ctx.save();
            ctx.rotate(this.ringRotation);

            // Sharp, defined rings with rainbow colors
            ctx.lineWidth = 3;
            ctx.setLineDash([]); // Solid lines, not dashed

            const ringDistances = [1.3, 1.5, 1.7, 1.9, 2.1];

            ringDistances.forEach((distance, index) => {
                // Cycle through rainbow colors
                ctx.strokeStyle = this.ringColors[index % this.ringColors.length];
                ctx.globalAlpha = 0.7 - (index * 0.1); // Fade outer rings slightly

                ctx.beginPath();
                // Uranus has thin, vertical rings (perpendicular to its rotation)
                ctx.ellipse(0, 0, currentSize * distance * 0.2, currentSize * distance, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Add inner glow
                ctx.strokeStyle = this.ringColors[index % this.ringColors.length];
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.lineWidth = 3;
            });

            ctx.restore();
        }

        // Add planet glow last
        ctx.globalAlpha = 0.4;
        ctx.shadowColor = this.colors.center;
        ctx.shadowBlur = currentSize * 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    update() {
        // Gentle drift movement
        this.x += this.driftX;
        this.y += this.driftY;

        // Continuous ring rotation (one direction only)
        this.ringRotation += this.ringSpeed;

        // Slow planet rotation
        this.planetRotation += this.planetRotationSpeed;

        // Wrap around screen edges
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.angle = 0; // Set angle to 0 for upwards orientation
        this.speed = 0.1; // Control speed
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = 1.0; // Reset global alpha to full opacity
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Add spaceship glow
        ctx.shadowColor = '#ff3cac';
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(0, -15); // The nose of the triangle
        ctx.lineTo(10, 15); // Bottom right
        ctx.lineTo(-10, 15); // Bottom left
        ctx.closePath();
        ctx.fillStyle = '#ff3cac'; // Cyberpunk pink
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Boundary wrapping
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y < 0) this.y = canvas.height;
    }

    thrust() {
        // Increase the triangle's velocity in the direction it's currently facing
        this.velocityX += this.speed * Math.cos(this.angle - Math.PI / 2);
        this.velocityY += this.speed * Math.sin(this.angle - Math.PI / 2);
    }

    rotate(dir) {
        // Rotate the triangle by a small angle
        this.angle += dir * 0.1; // 'dir' will be either 1 or -1
    }
    shoot() {
        // Call shootStar with the player's current position and angle
        shootStar(this.x, this.y, this.angle);
    }
    
}

// Create the player (triangle) object
const player = new Player(canvas.width / 2, canvas.height / 2);

// Key event listeners for player control
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        // Call the thrust method when the up arrow is pressed
        player.thrust();
    } else if (event.key === 'ArrowLeft') {
        // Rotate the triangle counter-clockwise
        player.rotate(-1);
    } else if (event.key === 'ArrowRight') {
        // Rotate the triangle clockwise
        player.rotate(1);
    }
    if (event.code === 'Space') {
        player.shoot();
    }
});

document.addEventListener('keyup', (event) => {
    // Stop the thrust when the up arrow key is released, if desired
    // You may comment out these lines if you want the player to glide
    if (event.key === 'ArrowUp') {
        player.velocityX *= 0.9; // Apply some friction to slow down
        player.velocityY *= 0.9;
    }
});

const mouse = {
    x: null,
    y: null,
    radius: 150 // Increase or decrease the radius for larger or smaller area of effect
};

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    // Create a few stars at the click location
    for (let i = 0; i < 5; i++) {
        createStar(mouse.x, mouse.y);
    }
});

// Touch events for mobile
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    // Create stars on touch
    for (let i = 0; i < 3; i++) {
        createStar(mouse.x, mouse.y);
    }
});

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
});

function createStar(x, y) {
    let size = Math.random() * 5 + 2; // Random size between 2 and 7
    // Cyberpunk color palette: cyan, pink, purple
    let colors = [159, 315, 270]; // Cyan, Pink, Purple in HSL
    let hue = colors[Math.floor(Math.random() * colors.length)];
    let velocityX = (Math.random() - 0.5) * 2;
    let velocityY = (Math.random() - 0.5) * 2;
    particles.push(new Particle(x, y, size, hue, velocityX, velocityY));
}

function shootStar(x, y, angle) {
    const shootSpeed = 5; // Adjust the shooting speed as necessary
    const size = 5; // Fixed size for shot stars
    // Cyberpunk rainbow shots - more vibrant
    let colors = [159, 315, 270, 180, 300]; // Cyan, Pink, Purple, Light Blue, Magenta
    let hue = colors[Math.floor(Math.random() * colors.length)];
    // Calculate the velocity for the new star based on the angle
    let velocityX = shootSpeed * Math.cos(angle - Math.PI / 2);
    let velocityY = shootSpeed * Math.sin(angle - Math.PI / 2);

    // Create the new star with the specified properties
    particles.push(new Particle(x, y, size, hue, velocityX, velocityY));
}

class Particle {
    constructor(x, y, size, hue) {
        this.x = x;
        this.y = y;
        this.size = size; // Size now represents the radius of the star
        this.maxSize = size * 2;
        this.shrink = Math.random() > 0.5;
        this.opacity = Math.random();
        this.hue = hue;
        this.velocityX = (Math.random() - 0.5) * 2;
        this.velocityY = (Math.random() - 0.5) * 2;
    }

    drawStar() {
        const outerRadius = this.size;
        const innerRadius = this.size / 2;
        const numPoints = 5;

        ctx.beginPath();
        ctx.globalAlpha = this.opacity;

        // Add sparkle effect
        const sparkleIntensity = Math.sin(Date.now() * 0.01 + this.x * 0.01) * 0.3 + 0.7;
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${50 * sparkleIntensity}%)`;

        // Add glow effect
        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowBlur = this.size * 2;

        for (let i = 0; i < numPoints; i++) {
            ctx.lineTo(
                this.x + outerRadius * Math.cos((Math.PI * 2 / numPoints) * i),
                this.y + outerRadius * Math.sin((Math.PI * 2 / numPoints) * i)
            );
            ctx.lineTo(
                this.x + innerRadius * Math.cos((Math.PI * 2 / numPoints) * i + Math.PI / numPoints),
                this.y + innerRadius * Math.sin((Math.PI * 2 / numPoints) * i + Math.PI / numPoints)
            );
        }

        ctx.closePath();
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

       // Calculate distance between particle and mouse
       const dx = mouse.x - this.x;
       const dy = mouse.y - this.y;
       const distance = Math.sqrt(dx * dx + dy * dy);

       // Change properties if mouse is close
       if (distance < mouse.radius) {
           if (this.size < this.maxSize) {
               this.size += 0.5; // Grow
           }
           // Additional interaction effects can be added here
       } else {
           // Restore to original state if mouse moves away
           if (this.size > this.maxSize / 2) {
               this.size -= 0.1;
           }
       }
        if (this.shrink) {
            this.size -= 0.1;
            this.opacity -= 0.005;
            if (this.size <= 0.1) {
                this.shrink = false;
            }
        } else {
            this.size += 0.1;
            this.opacity += 0.005;
            if (this.size >= this.maxSize) {
                this.shrink = true;
            }
        }

        this.size = Math.max(this.size, 0.1);
        this.size = Math.min(this.size, this.maxSize);
        this.opacity = Math.max(this.opacity, 0);
        this.opacity = Math.min(this.opacity, 1);
    }
}

function init() {
    particles = [];
    planets = [];
    const numberOfParticles = 500; // Increase this number to create more stars

    // Create stars
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = Math.random() * 5 + 2; // Random size between 2 and 7
        // Cyberpunk color palette for initial stars
        let colors = [159, 315, 270]; // Cyan, Pink, Purple
        let hue = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, size, hue));
    }

    // Create variety of small, distant planets
    const planetTypes = ['uranus', 'jupiter', 'saturn', 'neptune'];
    const numberOfPlanets = 5;

    for (let i = 0; i < numberOfPlanets; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = Math.random() * 15 + 8; // Much smaller size between 8-23 (very distant look)
        let type = planetTypes[Math.floor(Math.random() * planetTypes.length)];
        planets.push(new Planet(x, y, size, type));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw planets first (behind everything)
    planets.forEach(planet => {
        planet.update();
        planet.draw();
    });

    // Update and draw each particle (stars on top of planets)
    particles.forEach((particle, index) => {
        if (particle.size <= 0) {
            particles.splice(index, 1); // Remove the particle if it's too small (optional)
        } else {
            particle.update();
            particle.drawStar();
        }
    });

    // Update and draw the player once per frame (on top of everything)
    player.update();
    player.draw();

    requestAnimationFrame(animate);
}

init();
animate();