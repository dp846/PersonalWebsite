const planet1 = document.getElementById('planet');
const planet2 = document.getElementById('planet2');
const spaceship = document.getElementById('spaceship');
const title = document.getElementsByClassName('container')
const typing = document.getElementsByClassName('intro-subtitle')

let shipX = 0;
let shipY = 0;
let shipVx = 0;
let shipVy = 0;
let shipAx = 0;
let shipAy = 0;
let shipVisible = false;

const friction = 0.98;
const topSpeed = 10;
const initialVelocity = 8;

const planet1Mass = 600;
const planet2Mass = 1200;
const planet3Mass = 300;



const keys = {
    w: false,
    s: false,
    a: false,
    d: false
};

const trailColor = 'rgba(255, 255, 255, 0.8)';
const trailSize = 5;

const projectiles = [];
const asteroidGravityScale = 0.35; // Adjust this value to change the strength of gravity acting on the asteroids

document.addEventListener('click', (event) => {
    if (!shipVisible) return;
    const targetX = event.clientX;
    const targetY = event.clientY;

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
}

planet1.addEventListener('click', () => {

    const planetRect = planet1.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 60, planetRect.top + planetRect.height / 2)
      title.style.visibility = 'hidden';
      typing.style.visibility = 'hidden';
    };

});

planet2.addEventListener('click', () => {
    const planetRect = planet2.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 30, planetRect.top + planetRect.height / 2)
    };
});

planet3.addEventListener('click', () => {
    const planetRect = planet3.getBoundingClientRect();
    if (!shipVisible){
      spawnSpaceship(planetRect.right + 30, planetRect.top + planetRect.height / 2)
    };
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
});

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${trailSize}px`;
    particle.style.height = `${trailSize}px`;
    particle.style.backgroundColor = trailColor;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.borderRadius = '50%';

    document.body.appendChild(particle);

    setTimeout(() => {
        document.body.removeChild(particle);
    }, 300);
}

function createBulletTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.backgroundColor = 'rgba(235, 52, 122, 0.8)';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.borderRadius = '50%';

    document.body.appendChild(particle);

    setTimeout(() => {
        document.body.removeChild(particle);
    }, 200); // Adjust the bullet trail duration (in milliseconds)
}



function updateAcceleration() {
    if (!shipVisible) return;

    const acceleration = 0.2;
    shipAx = 0;
    shipAy = 0;

    if (keys.w) shipAy = -acceleration;
    if (keys.s) shipAy = acceleration;
    if (keys.a) shipAx = -acceleration;
    if (keys.d) shipAx = acceleration;
}

function updateSpaceshipPosition() {
    updateAcceleration();

    shipVx += shipAx;
    shipVy += shipAy;

    shipVx *= friction;
    shipVy *= friction;

    const currentSpeed = Math.sqrt(shipVx ** 2 + shipVy ** 2);
    if (currentSpeed > topSpeed) {
        shipVx = (shipVx / currentSpeed) * topSpeed;
        shipVy = (shipVy / currentSpeed) * topSpeed;
    }

    shipX += shipVx;
    shipY += shipVy;

    spaceship.style.left = `${shipX}px`;
    spaceship.style.top = `${shipY}px`;

    createTrailParticle(shipX + trailSize / 2, shipY + trailSize / 2);
}


function checkSpaceshipOutOfBounds() {
    if (!shipVisible) return;

    const spaceshipRect = spaceship.getBoundingClientRect();
    if (
        spaceshipRect.left < 0 ||
        spaceshipRect.right > window.innerWidth ||
        spaceshipRect.top < 0 ||
        spaceshipRect.bottom > window.innerHeight
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
    shipVisible = false;
    spaceship.style.visibility = 'hidden';
    shipVx = 0;
    shipVy = 0;
    shipAx = 0;
    shipAy = 0;
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

function updateSpaceshipPosition() {
    updateAcceleration();

    const gravityForce1 = calculateGravityForce(shipX, shipY, planet1, planet1Mass);
     const gravityForce2 = calculateGravityForce(shipX, shipY, planet2, planet2Mass);
     const gravityForce3 = calculateGravityForce(shipX, shipY, planet3, planet3Mass);


    if (shipVisible) {
        shipVx += shipAx + gravityForce1.forceX + gravityForce2.forceX + gravityForce3.forceX;
        shipVy += shipAy + gravityForce1.forceY + gravityForce2.forceY + gravityForce3.forceY;

        shipVx *= friction;
        shipVy *= friction;

        const currentSpeed = Math.sqrt(shipVx ** 2 + shipVy ** 2);
        if (currentSpeed > topSpeed) {
            shipVx = (shipVx / currentSpeed) * topSpeed;
            shipVy = (shipVy / currentSpeed) * topSpeed;
        }

        shipX += shipVx;
        shipY += shipVy;

        createTrailParticle(shipX + trailSize / 2, shipY + trailSize / 2);
    }

    spaceship.style.left = `${shipX}px`;
    spaceship.style.top = `${shipY}px`;
}


function spawnProjectile(targetX, targetY) {
    const projectile = document.createElement('div');
    projectile.style.position = 'absolute';
    projectile.style.width = '20px';
    projectile.style.height = '20px';
    projectile.style.backgroundColor = 'rgba(235, 52, 122, 1)';
    projectile.style.left = `${shipX}px`;
    projectile.style.top = `${shipY}px`;
    projectile.style.borderRadius = '50%';

    const distanceX = targetX - shipX;
    const distanceY = targetY - shipY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const projectileSpeed = 25;
    const velocityX = (distanceX / distance) * projectileSpeed;
    const velocityY = (distanceY / distance) * projectileSpeed;

    document.body.appendChild(projectile);

    return {
        element: projectile,
        velocityX: velocityX,
        velocityY: velocityY
    };
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
            destroySpaceship();

            // Remove the asteroid
            document.body.removeChild(asteroid.element);
            asteroids.splice(i, 1);

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
                // Remove the projectile
                document.body.removeChild(projectile.element);
                projectiles.splice(i, 1);

                // Remove the asteroid
                document.body.removeChild(asteroid.element);
                asteroids.splice(j, 1);

                // No need to check further collisions for this projectile
                break;
            }
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

    asteroid.velocityX += (gravityForce1.forceX + gravityForce2.forceX) * asteroidGravityScale;
    asteroid.velocityY += (gravityForce1.forceY + gravityForce2.forceY) * asteroidGravityScale;
}

function destroyAsteroid(index) {
    document.body.removeChild(asteroids[index].element);
    asteroids.splice(index, 1);
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
  
    const spawnTime = Math.random() * (1900 - 500) + 500;
    setTimeout(asteroidSpawnLoop, spawnTime);
  }

asteroidSpawnLoop();







function gameLoop() {
    updateSpaceshipPosition();

    // Update projectile positions and create bullet trail particles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        const oldX = parseFloat(projectile.element.style.left);
        const oldY = parseFloat(projectile.element.style.top);

        projectile.element.style.left = `${oldX + projectile.velocityX}px`;
        projectile.element.style.top = `${oldY + projectile.velocityY}px`;

        createBulletTrailParticle(oldX + 2.5, oldY + 2.5);

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
  
     // Update asteroid positions
     for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        const oldX = parseFloat(asteroid.element.style.left);
        const oldY = parseFloat(asteroid.element.style.top);

        updateAsteroidVelocity(asteroid);

        asteroid.element.style.left = `${oldX + asteroid.velocityX}px`;
        asteroid.element.style.top = `${oldY + asteroid.velocityY}px`;

        // Update asteroid rotation
        asteroid.rotation = (asteroid.rotation + asteroid.rotationSpeed) % 360;
        asteroid.element.style.transform = `rotate(${asteroid.rotation}deg)`;

        // Check if the asteroid is colliding with a planet
        if (checkCollision(asteroid.element, planet1, true) || checkCollision(asteroid.element, planet2, true) || checkCollision(asteroid.element, planet3, true)) {
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
   
  // Check for collisions between projectiles and asteroids
  checkProjectileAsteroidCollisions();
  
  // Check for collisions between the spaceship and asteroids
  checkSpaceshipAsteroidCollisions();
  
  // Check if the spaceship is out of bounds
  //checkSpaceshipOutOfBounds();

    if (shipVisible) {
        if (checkCollision(spaceship, planet1, true) || checkCollision(spaceship, planet2, true) || checkCollision(spaceship, planet3, true)) {
            destroySpaceship();
        }
    }


    requestAnimationFrame(gameLoop);
}


gameLoop();
