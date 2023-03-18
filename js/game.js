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

const planet1Mass = 1200;
const planet2Mass = 300;


const keys = {
    w: false,
    s: false,
    a: false,
    d: false
};

const trailColor = 'rgba(255, 255, 255, 0.5)';
const trailSize = 5;

const projectiles = [];
const cometGravityScale = 0.5; // Adjust this value to change the strength of gravity acting on the comets

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
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
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



function checkCollision(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    const centerX1 = rect1.left + rect1.width / 2;
    const centerY1 = rect1.top + rect1.height / 2;
    const centerX2 = rect2.left + rect2.width / 2;
    const centerY2 = rect2.top + rect2.height / 2;

    const distance = Math.sqrt((centerX1 - centerX2) ** 2 + (centerY1 - centerY2) ** 2);
    const radius1 = rect1.width / 2;
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

    if (shipVisible) {
        shipVx += shipAx + gravityForce1.forceX + gravityForce2.forceX;
        shipVy += shipAy + gravityForce1.forceY + gravityForce2.forceY;

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
    projectile.style.width = '10px';
    projectile.style.height = '10px';
    projectile.style.backgroundColor = 'white';
    projectile.style.left = `${shipX}px`;
    projectile.style.top = `${shipY}px`;
    projectile.style.borderRadius = '50%';

    const distanceX = targetX - shipX;
    const distanceY = targetY - shipY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const projectileSpeed = 16;
    const velocityX = (distanceX / distance) * projectileSpeed;
    const velocityY = (distanceY / distance) * projectileSpeed;

    document.body.appendChild(projectile);

    return {
        element: projectile,
        velocityX: velocityX,
        velocityY: velocityY
    };
}




const comets = [];

function createComet(x, y, vx, vy, radius) {
    const comet = document.createElement('div');
    comet.style.position = 'absolute';
    comet.style.width = `${radius}px`;
    comet.style.height = `${radius}px`;
    comet.style.backgroundColor = 'gray';
    comet.style.left = `${x}px`;
    comet.style.top = `${y}px`;
    comet.style.borderRadius = '50%';

    document.body.appendChild(comet);
    comets.push({
        element: comet,
        velocityX: vx,
        velocityY: vy,
    });
}

function spawnComet() {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const speed = Math.random() * (1.5 - 0.7) + 0.7;

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

    // Calculate the direction from the comet's spawn position towards the center of the screen
    const directionX = centerX - x;
    const directionY = centerY - y;
    const distance = Math.sqrt(directionX * directionX + directionY * directionY);
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;

    // Calculate the velocity components
    vx = normalizedDirectionX * speed;
    vy = normalizedDirectionY * speed;

    // Randomize the comet size
    const cometSize = Math.random() * (80 - 35) + 35;

    createComet(x, y, vx, vy, cometSize);
}




function checkSpaceshipCometCollisions() {
    if (!shipVisible) return;

    for (let i = comets.length - 1; i >= 0; i--) {
        const comet = comets[i];
        if (checkCollision(spaceship, comet.element)) {
            // Destroy the spaceship
            destroySpaceship();

            // Remove the comet
            document.body.removeChild(comet.element);
            comets.splice(i, 1);

            // No need to check further collisions for the spaceship
            break;
        }
    }
}


function checkProjectileCometCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        for (let j = comets.length - 1; j >= 0; j--) {
            const comet = comets[j];
            if (checkCollision(projectile.element, comet.element)) {
                // Remove the projectile
                document.body.removeChild(projectile.element);
                projectiles.splice(i, 1);

                // Remove the comet
                document.body.removeChild(comet.element);
                comets.splice(j, 1);

                // No need to check further collisions for this projectile
                break;
            }
        }
    }
}

function updateCometVelocity(comet) {
    const gravityForce1 = calculateGravityForce(
        parseFloat(comet.element.style.left),
        parseFloat(comet.element.style.top),
        planet1,
        planet1Mass
    );
    const gravityForce2 = calculateGravityForce(
        parseFloat(comet.element.style.left),
        parseFloat(comet.element.style.top),
        planet2,
        planet2Mass
    );

    comet.velocityX += (gravityForce1.forceX + gravityForce2.forceX) * cometGravityScale;
    comet.velocityY += (gravityForce1.forceY + gravityForce2.forceY) * cometGravityScale;
}

function destroyComet(index) {
    document.body.removeChild(comets[index].element);
    comets.splice(index, 1);
}



let cometCount = 0;
const maxComets = 20;


function cometSpawnLoop() {
    const spaceshipElement = document.getElementById("spaceship");
    const rect = spaceshipElement.getBoundingClientRect();
    const inViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth;
  
    const isVisible = spaceshipElement.style.display !== "none";
  
    if (inViewport && isVisible && cometCount < maxComets) {
      spawnComet();
      cometCount++;
    }
  
    const spawnTime = Math.random() * (1900 - 500) + 500;
    setTimeout(cometSpawnLoop, spawnTime);
  }

cometSpawnLoop();







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
  
    // Update comet positions
    for (let i = comets.length - 1; i >= 0; i--) {
        const comet = comets[i];
        const oldX = parseFloat(comet.element.style.left);
        const oldY = parseFloat(comet.element.style.top);

        updateCometVelocity(comet);

        comet.element.style.left = `${oldX + comet.velocityX}px`;
        comet.element.style.top = `${oldY + comet.velocityY}px`;

        // Check if the comet is colliding with a planet
        if (checkCollision(comet.element, planet1) || checkCollision(comet.element, planet2)) {
            destroyComet(i);
            continue;
        }

        // Remove comets that travel too far outside the window view
        const cometRect = comet.element.getBoundingClientRect();
        const buffer = 100; // Distance outside the window view before the comet is destroyed
        if (
            cometRect.left < -buffer ||
            cometRect.right > window.innerWidth + buffer ||
            cometRect.top < -buffer ||
            cometRect.bottom > window.innerHeight + buffer
        ) {
            destroyComet(i);
        }
    }
   
  // Check for collisions between projectiles and comets
  checkProjectileCometCollisions();
  
  // Check for collisions between the spaceship and comets
  checkSpaceshipCometCollisions();
  
  // Check if the spaceship is out of bounds
  //checkSpaceshipOutOfBounds();

    if (shipVisible) {
        if (checkCollision(spaceship, planet1) || checkCollision(spaceship, planet2)) {
            destroySpaceship();
        }
    }


    requestAnimationFrame(gameLoop);
}


gameLoop();
