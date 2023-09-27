const planet1 = document.getElementById('planet');
const planet2 = document.getElementById('planet2');
const planet3 = document.getElementById('planet3');
const blackhole = document.getElementById('black-hole');
const spaceship = document.getElementById('spaceship');
const title = document.getElementsByClassName('container')
const typing = document.getElementsByClassName('intro-subtitle')

let score = 0;

let shipX = 0;
let shipY = 0;
let shipVx = 0;
let shipVy = 0;
let shipAx = 0;
let shipAy = 0;
let shipVisible = false;

let lastTimestamp = performance.now();
const FPSscale = 120;

const friction = 0.98;
const topSpeed = 8;
const initialVelocity = 8;
let currentTopSpeed = topSpeed;

const planet1Mass = 600;
const planet2Mass = 1200;
const planet3Mass = 300;

const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    shift: false
};

const trailSize = 5; // Adjust this value to control the thickness of the trail
const trailColor = '#FF69B4'; // Neon pink color

const projectiles = [];
const asteroidGravityScale = 0.35; // Adjust this value to change the strength of gravity acting on the asteroids

function updateScore(value) {
    score += value;
    const scoreDisplay = document.getElementById("score-display");
    scoreDisplay.textContent = "Score: " + score;
}

updatePlanetHoverEffects();
// Call the updateSvgSize function initially and on window resize
updateSvgSize();

// Update svgSize on scroll
window.addEventListener('scroll', () => {
    updateSvgSize();
});

// Update svgSize on window resize
window.addEventListener('resize', () => {
    updateSvgSize();
});

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

    planet1.onmouseenter = () => applyHoverEffect(planet1, 1.25);
    planet1.onmouseleave = () => removeHoverEffect(planet1);
  
    planet2.onmouseenter = () => applyHoverEffect(planet2, 1.25);
    planet2.onmouseleave = () => removeHoverEffect(planet2);
  
    planet3.onmouseenter = () => applyHoverEffect(planet3, 1.25);
    planet3.onmouseleave = () => removeHoverEffect(planet3);

}

window.onload = updatePlanetHoverEffects;


document.addEventListener('click', (event) => {
    if (!shipVisible) return;
    const targetX = event.pageX;
    const targetY = event.pageY;

    const projectile = spawnProjectile(targetX, targetY);
    projectiles.push(projectile);
});

function spawnSpaceship(x, y) {
    shipAx = 0;
    shipAy = 0;
    shipX = x;
    shipY = y;
    shipVisible = true;
    spaceship.style.display = 'block';
    spaceship.style.visibility = 'visible';
    shipVx = initialVelocity;
    shipVy = 0;

    $('.intro-title, .intro-subtitle').animate({opacity: 0}, 100, function() {
        // Introduce a delay after the titles have faded out
        setTimeout(function() {
            // Fade in the score-display
            $('#score-display').fadeIn(100);
        }, 100); // This is a 300ms delay, you can adjust this to your preference
    });
}

planet1.addEventListener('click', () => {

    const planetRect = planet1.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 60, planetRect.top + planetRect.height / 2)
    };

    initGame();

});

planet2.addEventListener('click', () => {
    const planetRect = planet2.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 30, planetRect.top + planetRect.height / 2)
    };

    initGame();
});

planet3.addEventListener('click', () => {
    const planetRect = planet3.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 30, planetRect.top + planetRect.height / 2)
    };

    initGame();
});

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

    // Shift key
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

    // Shift key
    if (event.key.toLowerCase() === "shift") {
        keys.shift = false;
        event.preventDefault();
    }
});




function updateAcceleration() {
    if (!shipVisible) return;

    const acceleration = 0.2;
    const boostMultiplier = keys.shift ? 3 : 1; // Double the acceleration when boosting. Adjust this as needed.
    
    shipAx = 0;
    shipAy = 0;

    if (keys.w) shipAy = -acceleration * boostMultiplier;
    if (keys.s) shipAy = acceleration * boostMultiplier;
    if (keys.a) shipAx = -acceleration * boostMultiplier;
    if (keys.d) shipAx = acceleration * boostMultiplier;
}

function checkSpaceshipOutOfBounds() {
    if (!shipVisible) return;

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



function checkCollision(elem1, elem2, isSpaceship = false) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
  
    const centerX1 = rect1.left + rect1.width / 2;
    const centerY1 = rect1.top + rect1.height / 2;
    const centerX2 = rect2.left + rect2.width / 2;
    const centerY2 = rect2.top + rect2.height / 2;
  
    const distance = Math.sqrt((centerX1 - centerX2) ** 2 + (centerY1 - centerY2) ** 2);
    const radius1 = isSpaceship ? rect1.width / 4 : rect1.width / 2; // adjust radius for spaceship
  
    const radius2 = rect2.width / 2;
  
    return distance < (radius1 + radius2);
  }

  function destroySpaceship() {
    gameStarted = false; // To be removed...

    shipVisible = false;
    spaceship.style.visibility = 'hidden';
    shipVx = 0;
    shipVy = 0;
    shipAx = 0;
    shipAy = 0;

    updatePlanetHoverEffects();
    clearTrail();

    // Fade out the score-display
    $('#score-display').fadeOut(200, function() {
        // Once the score is completely faded out, fade in the titles
        $('.intro-title, .intro-subtitle').animate({opacity: 1}, 400);
    });
}


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

function updateSpaceshipPosition(deltaTime) {
    updateAcceleration();

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


// Global variables
let trailPoints = [];
const maxTrailPoints = 50; // Adjust this value to control the length of the trail

function updateTrailPath(x, y) {
    // Add the new point to the array
    trailPoints.push({x: x, y: y});

    // Call the updateTrail function to handle the trail drawing
    updateTrail();
}


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


function removeOldestTrailPoint() {
    if (trailPoints.length > 0) {
        trailPoints.shift();
    }
}


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








const asteroids = [];

function createAsteroid(x, y, vx, vy, radius) {
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
    const asteroidSize = Math.random() * (80 - 35) + 35;

    createAsteroid(x, y, vx, vy, asteroidSize);
}


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

function destroyAsteroid(index) {
    document.body.removeChild(asteroids[index].element);
    asteroids.splice(index, 1);
}



let currentAsteroids = 0;
const asteroidWaveCount = 40;
const asteroidWaveDelay = 1000;
let currentWave = 0;
const addedAsteroidsPerWave = 4;
const spawnTimeDecreasePerWave = 100;

function initGame() {
    if (gameStarted) return;

    // Reset the score to 0
    score = 0;
    updateScore(0);

    asteroidSpawnLoop(); // Comment out if not workinggggg
}

function startNewWave(numAsteroids, spawnTimeDecrease) {
    currentAsteroids = 0;
    currentWave++;
    spawnAsteroids(numAsteroids, spawnTimeDecrease);
}




let asteroidCount = 0;
const maxAsteroids = 20;
let gameStarted = false;



function asteroidSpawnLoop() {
    gameStarted = true;
    
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


// var elementsToFade = $('.intro-title, .intro-subtitle');





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
  
  // Check if the spaceship is out of bounds
  //checkSpaceshipOutOfBounds();

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


gameLoop(lastTimestamp);
