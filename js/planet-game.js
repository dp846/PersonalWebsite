// --------------------------------------------//
// ----------------- Variables ----------------//
// --------------------------------------------//

let GAMEACTIVE = false;

// On load
updateSvgSize();
window.onload = updatePlanetHoverEffects();

// Get elements
const planet1 = document.getElementById('planet');
const planet2 = document.getElementById('planet2');
const planet3 = document.getElementById('planet3');
const spaceship = document.getElementById('spaceship');
const typing = document.getElementsByClassName('intro-subtitle')

// Game variables
let score = 0;
let lastTimestamp = performance.now();
const FPSscale = 120;
const asteroidGravityScale = 0.35; // Strength of gravity acting on the asteroids
const projectiles = [];
let asteroids = [];


// Ship variables
const initialVelocity = 8;
const friction = 0.98;
const topSpeed = 8;
const acceleration = 0.2;
let shipX = 0;
let shipY = 0;
let shipVx = 0;
let shipVy = 0;
let shipAx = 0;
let shipAy = 0;
let shipVisible = false;
let currentTopSpeed = topSpeed;

// Planet variables
const planet1Mass = 600;
const planet2Mass = 1200;
const planet3Mass = 300;

// Movement keys
const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    shift: false
};

// Projectile trail variables
const trailSize = 5; // Thickness of the trail
const trailColor = '#FF69B4'; // Color (neon pink)

// Ship trail variables
let trailPoints = [];
const maxTrailPoints = 50; // Adjust this value to control the length of the trail

// -------------- GAME FUNCTIONALITY START ------------------ //

// Initialise the game when begun
function initGame() {
    if (GAMEACTIVE) return;

    // Activate the game
    GAMEACTIVE = true;

    // Reset the score to 0
    score = 0;
    updateScore(0);

    // Begin the first asteroid wave
    asteroidSpawnLoop();
}

// Adds the argument value to the score and updates the score display
function updateScore(value) {
    score += value;
    const scoreDisplay = document.getElementById("score-display");
    scoreDisplay.textContent = "Score: " + score;
}

// -------------- GAME FUNCTIONALITY END ------------------ //


// -------------- TRAIL FUNCTIONALITY START ------------------ //

function updateTrailPath(x, y) {

    // Add the new point to the array
    trailPoints.push({x: x, y: y});

    // Call the updateTrail function to handle the trail drawing
    updateTrail();
}

// Update spaceship trail
function updateTrail() {
    // Remove the oldest point if the array is too long
    if (trailPoints.length > maxTrailPoints) {
        removeOldestTrailPoint();
    }

    // Generate the path data
    const pathData = trailPoints
        .map((point, index) => {
            const command = index === 0 ? 'M' : 'L';
            return `${command} ${point.x},${point.y}`;
        })
        .join(' ');

    // Create or update the path element
    let trailPath = document.getElementById('trail-path');
    if (trailPoints.length > 0) {
        if (!trailPath) {
            trailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            trailPath.setAttribute('id', 'trail-path');
            trailPath.setAttribute('fill', 'none');
            trailPath.setAttribute('stroke', 'url(#trailGradient)');
            trailPath.setAttribute('stroke-width', trailSize);
            trailPath.setAttribute('stroke-linecap', 'round');
            trailPath.setAttribute('stroke-linejoin', 'round');
            trailPath.setAttribute('filter', 'url(#glow)'); // Add the glow effect
            document.getElementById('trail-svg').appendChild(trailPath);
        }

        if (trailPoints.length > 1) {
            const startX = trailPoints[0].x;
            const startY = trailPoints[0].y;
            const endX = trailPoints[trailPoints.length - 1].x;
            const endY = trailPoints[trailPoints.length - 1].y;
        
            const trailGradient = document.getElementById('trailGradient');
            trailGradient.setAttribute('x1', startX);
            trailGradient.setAttribute('y1', startY);
            trailGradient.setAttribute('x2', endX);
            trailGradient.setAttribute('y2', endY);
        }

        // Update the path data
        trailPath.setAttribute('d', pathData);
    } else if (trailPath) {
        trailPath.parentNode.removeChild(trailPath);
    }
}

// Clear the trail on spaceship destruction
function clearTrail() {
    // Remove trail points one by one with a delay
    const delay = 1; // Adjust this value to control the speed of the trail disappearing

    function removeTrailPoint() {
        if (trailPoints.length > 0) {
            removeOldestTrailPoint();
            updateTrail();
            setTimeout(removeTrailPoint, delay);
        }
    }

    removeTrailPoint();
}

// Remove last trail point
function removeOldestTrailPoint() {
    if (trailPoints.length > 0) {
        trailPoints.shift();
    }
}

// -------------- TRAIL FUNCTIONALITY END ---------------- //


// -------------- EVENT LISTENER START ---------------- //

// Movement key dict update on keydown and keyup 
document.addEventListener('keydown', (event) => {
    if (!shipVisible) {
        Object.keys(keys).forEach((key) => {
            keys[key] = false;
        });
        return;
    }
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = true;
        event.preventDefault();
    }

    // Shift key for boost (mechanic may be removed)
    if (event.key.toLowerCase() === "shift") {
        keys.shift = true;
        event.preventDefault();
    }
});
document.addEventListener('keyup', (event) => {
    if (!shipVisible) {
        Object.keys(keys).forEach((key) => {
            keys[key] = false;
        });
        return;
    }
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = false;
        event.preventDefault();
    }

    // Shift key for boost (mechanic may be removed)
    if (event.key.toLowerCase() === "shift") {
        keys.shift = false;
        event.preventDefault();
    }
});

// Rejigs on scroll and resize
window.addEventListener('scroll', () => {
    updateSvgSize();
});
window.addEventListener('resize', () => {
    updateSvgSize();
});

// Any planet being clicked should spawn the spaceship at that planet and start the game. 
planet1.addEventListener('click', () => {
    const planetRect = planet1.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 60, planetRect.top + planetRect.height / 2)
      initGame();
    };
});
planet2.addEventListener('click', () => {
    const planetRect = planet2.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 30, planetRect.top + planetRect.height / 2)
      initGame();
    };
});
planet3.addEventListener('click', () => {
    const planetRect = planet3.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 30, planetRect.top + planetRect.height / 2)
      initGame();
    };
});

// Shooting projectiles
document.addEventListener('click', (event) => {
    if (!shipVisible) return;
    const targetX = event.pageX;
    const targetY = event.pageY;

    const projectile = spawnProjectile(targetX, targetY);
    projectiles.push(projectile); // Add the projectile to the array
});

// -------------- EVENT LISTENER END ---------------- //


// ----------- SHIP FUNCTIONALITY START ------------- //

// Spawn the spaceship at the planet that was clicked
function spawnSpaceship(x, y) {

    // Resetting vars
    shipAx = 0;
    shipAy = 0;
    shipX = x;
    shipY = y;
    shipVisible = true;
    spaceship.style.display = 'block';
    spaceship.style.visibility = 'visible';
    shipVx = initialVelocity;
    shipVy = 0;

    // Fade out the intro title and fade in the score-display instead
    $('.intro-title').animate({opacity: 0}, 100, function() {
        setTimeout(function() {
            $('#score-display').fadeIn(100);
        }, 100);
    });
}

// Destroy the spaceship (player died...)
function destroySpaceship() {
    shipVisible = false;
    spaceship.style.visibility = 'hidden';
    shipVx = 0;
    shipVy = 0;
    shipAx = 0;
    shipAy = 0;

    // Play smooth animation for the svg trail disappearing at point of death
    clearTrail();

    // End the game (a lives system will be added later - for now, just end the game and reset the score whenever the player dies)
    GAMEACTIVE = false;

    // Fade out the score-display
    $('#score-display').fadeOut(200, function() {
        // Once the score is completely faded out, fade in the titles
        $('.intro-title').animate({opacity: 1}, 400);
    });
}

// Destroy ship if it goes too far out of the screen
function checkSpaceshipOutOfBounds() {

    const spaceshipRect = spaceship.getBoundingClientRect();
    if (
        spaceshipRect.left < -1000 ||
        spaceshipRect.right > window.innerWidth + 1000 ||
        spaceshipRect.top < -1000 ||
        spaceshipRect.bottom > window.innerHeight + 1000
    ) {
        destroySpaceship();
    }
}

// Ship acceleration update with boost mechanic involved
function updateShipAcceleration() {
    if (!shipVisible) return;

    const boostMultiplier = keys.shift ? 3 : 1; // Triple acceleration when boosting with shift
    
    shipAx = 0;
    shipAy = 0;

    if (keys.w) shipAy = -acceleration * boostMultiplier;
    if (keys.s) shipAy = acceleration * boostMultiplier;
    if (keys.a) shipAx = -acceleration * boostMultiplier;
    if (keys.d) shipAx = acceleration * boostMultiplier;
}

// Update the spaceship position and rotation
function updateSpaceshipPosition(deltaTime) {
    updateShipAcceleration();

    const gravityForce1 = calculateGravityForce(shipX, shipY, planet1, planet1Mass);
    const gravityForce2 = calculateGravityForce(shipX, shipY, planet2, planet2Mass);
    const gravityForce3 = calculateGravityForce(shipX, shipY, planet3, planet3Mass);

    if (shipVisible) {
        shipVx += (shipAx + gravityForce1.forceX + gravityForce2.forceX + gravityForce3.forceX) * deltaTime * FPSscale;
        shipVy += (shipAy + gravityForce1.forceY + gravityForce2.forceY + gravityForce3.forceY) * deltaTime * FPSscale;

        shipVx *= friction;
        shipVy *= friction;

        const currentSpeed = Math.sqrt(shipVx ** 2 + shipVy ** 2);

        const currentTopSpeed = keys.shift ? topSpeed * 1.3 : topSpeed; // Boosting topSpeed by 50% when Shift is pressed. Adjust as necessary.

        if (currentSpeed > currentTopSpeed) {
            shipVx = (shipVx / currentSpeed) * topSpeed;
            shipVy = (shipVy / currentSpeed) * topSpeed;
        }

        shipX += shipVx * deltaTime * FPSscale;
        shipY += shipVy * deltaTime * FPSscale;

        // Calculate rotation angle based on current speed
        const rotationAngle = Math.atan2(shipVy, shipVx) * (180 / Math.PI) + 90;

        // Apply rotation to the spaceship
        spaceship.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;

        updateTrailPath(shipX, shipY);
    }

    spaceship.style.left = `${shipX}px`;
    spaceship.style.top = `${shipY}px`;
}

// Calculate the gravity force acting on the spaceship using a given planet and its mass
function calculateGravityForce(shipX, shipY, planet, planetMass) {
    const planetRect = planet.getBoundingClientRect();
    const planetCenterX = planetRect.left + planetRect.width / 2;
    const planetCenterY = planetRect.top + planetRect.height / 2;

    const distanceX = planetCenterX - shipX;
    const distanceY = planetCenterY - shipY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const gravityConstant = 0.05;
    const forceMagnitude = (gravityConstant * spaceship.offsetWidth * planetMass) / (distance ** 2);

    const forceX = (distanceX / distance) * forceMagnitude;
    const forceY = (distanceY / distance) * forceMagnitude;

    return { forceX, forceY };
}

// Loop through all the asteroids and check for any collisions with the spaceship
function checkSpaceshipAsteroidCollisions() {
    if (!shipVisible) return;

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        if (checkCollision(spaceship, asteroid.element, true)) {
            // Destroy the spaceship
            createExplosion(shipX, shipY)
            
            destroySpaceship();

            destroyAsteroid(i);

            // No need to check further collisions for the spaceship
            break;
        }
    }
}

// Spawn a shooting projectile at the spaceship's position and return the projectile object
function spawnProjectile(targetX, targetY) {
    const projectile = document.createElement('div');
    projectile.style.position = 'absolute';
    projectile.style.width = '4px';
    projectile.style.height = '100px'; // Increase the length here
    projectile.style.backgroundColor = 'rgba(235, 52, 122, 1)';
    projectile.style.left = `${shipX}px`;
    projectile.style.top = `${shipY}px`;
    projectile.style.transformOrigin = 'center';
  
    const distanceX = targetX - shipX;
    const distanceY = targetY - shipY;
    const angle = Math.atan2(distanceY, distanceX) * (180 / Math.PI) + 90; // Add 90 degrees rotation here
    projectile.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  
    const glowStyle = `
      box-shadow: 0 0 10px rgba(235, 52, 122, 0.5), 
                  0 0 20px rgba(235, 52, 122, 0.5), 
                  0 0 30px rgba(235, 52, 122, 0.5), 
                  0 0 40px rgba(235, 52, 122, 0.5);
    `;
    projectile.style.cssText += glowStyle;
  
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    const projectileSpeed = 25;
    const velocityX = (distanceX / distance) * projectileSpeed;
    const velocityY = (distanceY / distance) * projectileSpeed;
  
    document.body.appendChild(projectile);
  
    return {
      element: projectile,
      velocityX: velocityX,
      velocityY: velocityY,
    };
}

// Update the positions of the ship's shot projectiles
function updateProjectilePositions(deltaTime) {
    // Update projectile positions and create bullet trail particles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        const oldX = parseFloat(projectile.element.style.left);
        const oldY = parseFloat(projectile.element.style.top);

        // Multiply by deltaTime
        projectile.element.style.left = `${oldX + projectile.velocityX * deltaTime * FPSscale}px`;
        projectile.element.style.top = `${oldY + projectile.velocityY * deltaTime * FPSscale}px`;

        // Remove projectiles that go off-screen
        const projectileRect = projectile.element.getBoundingClientRect();
        if (
            projectileRect.left < 0 ||
            projectileRect.right > window.innerWidth ||
            projectileRect.top < 0 ||
            projectileRect.bottom > window.innerHeight
        ) {
            document.body.removeChild(projectile.element);
            projectiles.splice(i, 1);
        }
    }
}

// ----------- SHIP FUNCTIONALITY END ----------- //


// ----- MISCELLANEOUS FUNCTIONALITY START ------ //

// Updates the size of the SVG element to match the size of the document
function updateSvgSize() {
    const trailSvg = document.getElementById("trail-svg");
    const body = document.body;
    const html = document.documentElement;
  
    const width = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    );
  
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  
    trailSvg.setAttribute("width", width);
    trailSvg.setAttribute("height", height);
}

// Update the hover effects of each of the planets (so scaling increase can be slightly different for each of them if needed)
function updatePlanetHoverEffects() {
    const planet1 = document.getElementById('planet');
    const planet2 = document.getElementById('planet2');
    const planet3 = document.getElementById('planet3');
  
    function applyHoverEffect(planet, scale) {
        if (!shipVisible) {
          planet.style.transform = `scale(${scale})`;
        }
    }
  
    function removeHoverEffect(planet) {
      planet.style.transform = '';
    }
  
    // Set the transition property for each planet
    [planet1, planet2, planet3].forEach(planet => {
      planet.style.transition = 'all 0.5s ease';
    });

    planet1.onmouseenter = () => applyHoverEffect(planet1, 1.15);
    planet1.onmouseleave = () => removeHoverEffect(planet1);
  
    planet2.onmouseenter = () => applyHoverEffect(planet2, 1.15);
    planet2.onmouseleave = () => removeHoverEffect(planet2);
  
    planet3.onmouseenter = () => applyHoverEffect(planet3, 1.15);
    planet3.onmouseleave = () => removeHoverEffect(planet3);

}

// Check for a collision between two elements (with a bool to check that the first element is the spaceship or not)
function checkCollision(elem1, elem2, isSpaceship = false) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
  
    const centerX1 = rect1.left + rect1.width / 2;
    const centerY1 = rect1.top + rect1.height / 2;
    const centerX2 = rect2.left + rect2.width / 2;
    const centerY2 = rect2.top + rect2.height / 2;
  
    const distance = Math.sqrt((centerX1 - centerX2) ** 2 + (centerY1 - centerY2) ** 2);
    const radius1 = isSpaceship ? rect1.width / 4 : rect1.width / 2; // adjust radius for spaceship for more lenient gameplay collisions
  
    const radius2 = rect2.width / 2;
  
    return distance < (radius1 + radius2);
}

// Explosion css animation 
function createExplosion(x, y) {
    const explosionDuration = 1000; // Duration of the explosion animation in milliseconds
    const explosionSize = 50; // Width and height of the explosion element
  
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = `${x - explosionSize / 2}px`; // Center horizontally
    div.style.top = `${y - explosionSize / 2}px`; // Center vertically
    div.style.width = `${explosionSize}px`;
    div.style.height = `${explosionSize}px`;
    div.style.background = 'radial-gradient(circle, rgba(255,255,0,1) 0%, rgba(255,0,0,1) 100%)';
    div.style.borderRadius = '50%';
    div.style.animation = `explosion ${explosionDuration}ms forwards`;
  
    document.body.appendChild(div);
  
    setTimeout(() => {
      document.body.removeChild(div);
    }, explosionDuration);
}

// ----- MISCELLANEOUS FUNCTIONALITY END ------ //



// -------- ASTEROID FUNCTIONALITY START -------- //

// Creates the element for an asteroid along with its initial properties
function spawnAsteroid() {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const speed = Math.random() * (0.9 - 0.5) + 0.5;

    // Choose a random position and velocity based on the side of the screen
    if (side === 0) {
        // Top side
        x = Math.random() * window.innerWidth;
        y = -30;
    } else if (side === 1) {
        // Right side
        x = window.innerWidth;
        y = Math.random() * window.innerHeight;
    } else if (side === 2) {
        // Bottom side
        x = Math.random() * window.innerWidth;
        y = window.innerHeight;
    } else {
        // Left side
        x = -30;
        y = Math.random() * window.innerHeight;
    }

    // Calculate the direction from the asteroid's spawn position towards the center of the screen
    const directionX = centerX - x;
    const directionY = centerY - y;
    const distance = Math.sqrt(directionX * directionX + directionY * directionY);
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;

    // Calculate the velocity components
    vx = normalizedDirectionX * speed;
    vy = normalizedDirectionY * speed;

    // Randomize the asteroid size
    const radius = Math.random() * (80 - 35) + 35;

    const asteroid = document.createElement('div');
    asteroid.style.position = 'absolute';

    asteroid.style.backgroundImage = "url('img/asteroid.png')";
    asteroid.style.backgroundRepeat = 'no-repeat';
    asteroid.style.backgroundSize = 'cover';

    asteroid.style.width = `${radius}px`;
    asteroid.style.height = `${radius}px`;
    asteroid.style.left = `${x}px`;
    asteroid.style.top = `${y}px`;
    asteroid.style.borderRadius = '50%';

    // Add an initial random rotation and rotation speed
    const rotation = Math.random() * 360;
    const rotationSpeed = Math.random() * 2 - 1; // Random value between -1 and 1

    asteroid.style.transform = `rotate(${rotation}deg)`;

    document.body.appendChild(asteroid);
    asteroids.push({
        element: asteroid,
        velocityX: vx,
        velocityY: vy,
        rotation: rotation,
        rotationSpeed: rotationSpeed,
    });
}

// Check for any projectiles hitting an asteroid
function checkProjectileAsteroidCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        for (let j = asteroids.length - 1; j >= 0; j--) {
            const asteroid = asteroids[j];
            if (checkCollision(projectile.element, asteroid.element)) {
                // Get the asteroid's x and y coordinates (center of the asteroid)
                const asteroidX = asteroid.element.offsetLeft + asteroid.element.offsetWidth / 2;
                const asteroidY = asteroid.element.offsetTop + asteroid.element.offsetHeight / 2;

                // Create an explosion at the asteroid's coordinates
                createExplosion(asteroidX, asteroidY);

                // Remove the projectile
                document.body.removeChild(projectile.element);
                projectiles.splice(i, 1);

                // Remove the asteroid and add to score
                updateScore(1);
                destroyAsteroid(j);

                // No need to check further collisions for this projectile
                break;
            }
        }
    }
}

// Check for any projectiles hitting any planet
function checkProjectilePlanetCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];

        if (checkCollision(projectile.element, planet1, true) || checkCollision(projectile.element, planet2, true) || checkCollision(projectile.element, planet3, true)) {
            // Get the spaceship's x and y coordinates
            const projectileX = parseFloat(projectile.element.style.left);
            const projectileY = parseFloat(projectile.element.style.top);

            // Create an explosion at the spaceship's coordinates
            createExplosion(projectileX, projectileY);

            // Remove the projectile
            document.body.removeChild(projectile.element);
            projectiles.splice(i, 1);

        }
    }
}

// Update the velcoity of the asteroid
function updateAsteroidVelocity(asteroid) {
    const gravityForce1 = calculateGravityForce(
        parseFloat(asteroid.element.style.left),
        parseFloat(asteroid.element.style.top),
        planet1,
        planet1Mass
    );
    const gravityForce2 = calculateGravityForce(
        parseFloat(asteroid.element.style.left),
        parseFloat(asteroid.element.style.top),
        planet2,
        planet2Mass
    );
    const gravityForce3 = calculateGravityForce(
        parseFloat(asteroid.element.style.left),
        parseFloat(asteroid.element.style.top),
        planet3,
        planet3Mass
    );

    asteroid.velocityX += (gravityForce1.forceX + gravityForce2.forceX + gravityForce3.forceX) * asteroidGravityScale;
    asteroid.velocityY += (gravityForce1.forceY + gravityForce2.forceY + gravityForce3.forceY) * asteroidGravityScale;
}

// Destroy the asteroid at the given index within the asteroids array
function destroyAsteroid(index) {
    document.body.removeChild(asteroids[index].element);
    asteroids.splice(index, 1);
}

// TODO: add a proper wave system for infinte gameplay that gets more challenging with each wave

let currentAsteroids = 0;
const asteroidWaveCount = 40;
const asteroidWaveDelay = 1000;
let currentWave = 0;
const addedAsteroidsPerWave = 4;
const spawnTimeDecreasePerWave = 100;

function startNewWave(numAsteroids, spawnTimeDecrease) {
    currentAsteroids = 0;
    currentWave++;
    spawnAsteroids(numAsteroids, spawnTimeDecrease);
}

let asteroidCount = 0;
const maxAsteroids = 20;


function asteroidSpawnLoop() {
    
    const spaceshipElement = document.getElementById("spaceship");
    const rect = spaceshipElement.getBoundingClientRect();
    const inViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth;
  
    const isVisible = spaceshipElement.style.display !== "none";
  
    if (inViewport && isVisible && asteroidCount < maxAsteroids) {
      spawnAsteroid();
      asteroidCount++;
    }
  
    const spawnTime = Math.random() * (2200 - 1000) + 1000;
    setTimeout(asteroidSpawnLoop, spawnTime);
}

function updateAsteroidPositions(deltaTime) {
    // Update asteroid positions
    for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    const oldX = parseFloat(asteroid.element.style.left);
    const oldY = parseFloat(asteroid.element.style.top);

    updateAsteroidVelocity(asteroid);

    asteroid.element.style.left = `${oldX + asteroid.velocityX * deltaTime * FPSscale}px`;
    asteroid.element.style.top = `${oldY + asteroid.velocityY * deltaTime * FPSscale}px`;

    // Update asteroid rotation
    asteroid.rotation = (asteroid.rotation + asteroid.rotationSpeed) % 360;
    asteroid.element.style.transform = `rotate(${asteroid.rotation}deg)`;

    // Check if the asteroid is colliding with a planet
    if (checkCollision(asteroid.element, planet1, true) || checkCollision(asteroid.element, planet2, true) || checkCollision(asteroid.element, planet3, true)) {
        // Get the asteroid's x and y coordinates
        const asteroidX = asteroid.element.offsetLeft;
        const asteroidY = asteroid.element.offsetTop;

        // Get the asteroid's width and height
        const asteroidWidth = asteroid.element.offsetWidth;
        const asteroidHeight = asteroid.element.offsetHeight;

        // Calculate the center of the asteroid
        const centerX = asteroidX + asteroidWidth / 2;
        const centerY = asteroidY + asteroidHeight / 2;

        // Create an explosion at the asteroid's center
        createExplosion(centerX, centerY);

        destroyAsteroid(i);
        continue;
    }

    // Remove asteroids that travel too far outside the window view
    const asteroidRect = asteroid.element.getBoundingClientRect();
    const buffer = 100; // Distance outside the window view before the asteroid is destroyed
    if (
        asteroidRect.left < -buffer ||
        asteroidRect.right > window.innerWidth + buffer ||
        asteroidRect.top < -buffer ||
        asteroidRect.bottom > window.innerHeight + buffer
    ) {
        destroyAsteroid(i);
    }
}
}

// -------- ASTEROID FUNCTIONALITY START -------- //


// -------- GAME LOOP START -------- //

function gameLoop(timestamp) {

    let deltaTime = (timestamp - lastTimestamp) / 1000;  // Divide by 1000 to convert ms to s
    lastTimestamp = timestamp;

    deltaTime = Math.min(deltaTime, 1 / 15);

    updateSpaceshipPosition(deltaTime);
  
    updateAsteroidPositions(deltaTime);

    updateProjectilePositions(deltaTime);

    checkSpaceshipOutOfBounds();
   
  // Check for collisions between projectiles and asteroids
  checkProjectileAsteroidCollisions();
  
  // Check for collisions between the spaceship and asteroids
  checkSpaceshipAsteroidCollisions();

  // Check for collisions between the projectiles and planets
  checkProjectilePlanetCollisions();

    if (shipVisible) {
        if (checkCollision(spaceship, planet1, true) || checkCollision(spaceship, planet2, true) || checkCollision(spaceship, planet3, true)) {
            // Get the spaceship's x and y coordinates
            const spaceshipX = spaceship.offsetLeft;
            const spaceshipY = spaceship.offsetTop;

            // Create an explosion at the spaceship's coordinates
            createExplosion(spaceshipX, spaceshipY);

            destroySpaceship();
        }
    }
    requestAnimationFrame(gameLoop);
}

// -------- GAME LOOP END -------- //

gameLoop(lastTimestamp);
