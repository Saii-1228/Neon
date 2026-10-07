/* =========================================================
   NEON DASH - GAME.JS
   Original neon rhythm platformer
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL GAME CONFIG
   ========================================================= */

const GAME = {
    state: "MENU",
    mode: "cube",

    canvas: null,
    ctx: null,

    width: 0,
    height: 0,

    lastTime: 0,
    animationFrame: null,

    level: null,
    levelIndex: 0,

    cameraX: 0,
    levelTime: 0,

    gravity: 1800,
    normalGravity: 1,

    speed: 360,

    score: 0,
    progress: 0,

    attempts: 0,
    deaths: 0,

    practice: false,
    paused: false,

    shake: 0,

    coinsCollected: 0,

    player: {
        x: 160,
        y: 0,
        width: 32,
        height: 32,

        velocityY: 0,

        grounded: false,
        alive: true,

        rotation: 0,

        primary: "#00f6ff",
        secondary: "#8b5cff"
    },

    input: {
        jump: false,
        holding: false
    },

    settings: {
        music: true,
        sound: true,
        particles: true,
        glow: true,
        screenShake: true,
        showProgress: true,
        quality: "high"
    },

    playerData: {
        username: "SAII",
        stars: 0,
        coins: 0,
        diamonds: 0,
        creatorPoints: 0,

        completedLevels: [],
        bestProgress: {},
        attempts: {},

        achievements: [],

        character: "cube",
        primaryColor: "#00f6ff",
        secondaryColor: "#8b5cff"
    }
};


/* =========================================================
   LEVEL DATA
   ========================================================= */

const LEVELS = [
    {
        id: 1,
        name: "Neon Start",
        difficulty: "Easy",
        stars: 3,
        coins: 3,
        length: "Short",
        speed: 360,
        color: "#00f6ff",

        objects: [
            { type: "ground", x: 0, y: 500, w: 5000, h: 100 },

            { type: "spike", x: 550, y: 468, w: 32, h: 32 },
            { type: "spike", x: 850, y: 468, w: 32, h: 32 },

            { type: "block", x: 1100, y: 430, w: 120, h: 70 },

            { type: "spike", x: 1300, y: 468, w: 32, h: 32 },
            { type: "spike", x: 1340, y: 468, w: 32, h: 32 },

            { type: "platform", x: 1550, y: 390, w: 220, h: 25 },

            { type: "coin", x: 1650, y: 340, collected: false },

            { type: "spike", x: 1900, y: 468, w: 32, h: 32 },

            { type: "speed", x: 2200, y: 450, speed: 450 },

            { type: "spike", x: 2450, y: 468, w: 32, h: 32 },
            { type: "spike", x: 2490, y: 468, w: 32, h: 32 },

            { type: "gravity", x: 2800, y: 450 },

            { type: "platform", x: 3000, y: 150, w: 600, h: 25 },

            { type: "spike", x: 3250, y: 118, w: 32, h: 32 },

            { type: "gravity", x: 3650, y: 120 },

            { type: "coin", x: 3900, y: 420, collected: false },

            { type: "spike", x: 4100, y: 468, w: 32, h: 32 },

            { type: "spike", x: 4500, y: 468, w: 32, h: 32 },

            { type: "finish", x: 4800, y: 400 }
        ]
    },

    {
        id: 2,
        name: "Neon Rush",
        difficulty: "Normal",
        stars: 5,
        coins: 3,
        length: "Medium",
        speed: 420,
        color: "#ff3df2",

        objects: [
            { type: "ground", x: 0, y: 500, w: 7000, h: 100 },

            { type: "spike", x: 500, y: 468, w: 32, h: 32 },
            { type: "spike", x: 540, y: 468, w: 32, h: 32 },

            { type: "block", x: 800, y: 420, w: 100, h: 80 },

            { type: "coin", x: 950, y: 350, collected: false },

            { type: "spike", x: 1150, y: 468, w: 32, h: 32 },

            { type: "speed", x: 1400, y: 450, speed: 520 },

            { type: "spike", x: 1700, y: 468, w: 32, h: 32 },
            { type: "spike", x: 1740, y: 468, w: 32, h: 32 },
            { type: "spike", x: 1780, y: 468, w: 32, h: 32 },

            { type: "platform", x: 2100, y: 350, w: 350, h: 25 },

            { type: "coin", x: 2250, y: 290, collected: false },

            { type: "gravity", x: 2700, y: 450 },

            { type: "spike", x: 3000, y: 118, w: 32, h: 32 },

            { type: "spike", x: 3040, y: 118, w: 32, h: 32 },

            { type: "gravity", x: 3400, y: 120 },

            { type: "speed", x: 3800, y: 450, speed: 600 },

            { type: "spike", x: 4100, y: 468, w: 32, h: 32 },
            { type: "spike", x: 4140, y: 468, w: 32, h: 32 },

            { type: "coin", x: 4500, y: 400, collected: false },

            { type: "finish", x: 6500, y: 400 }
        ]
    },

    {
        id: 3,
        name: "Cyber Circuit",
        difficulty: "Hard",
        stars: 7,
        coins: 3,
        length: "Long",
        speed: 470,
        color: "#9d4edd",

        objects: [
            { type: "ground", x: 0, y: 500, w: 9000, h: 100 },

            { type: "spike", x: 500, y: 468, w: 32, h: 32 },
            { type: "spike", x: 540, y: 468, w: 32, h: 32 },
            { type: "spike", x: 580, y: 468, w: 32, h: 32 },

            { type: "speed", x: 1000, y: 450, speed: 600 },

            { type: "block", x: 1300, y: 400, w: 100, h: 100 },

            { type: "platform", x: 1550, y: 320, w: 300, h: 25 },

            { type: "coin", x: 1700, y: 260, collected: false },

            { type: "gravity", x: 2050, y: 450 },

            { type: "spike", x: 2400, y: 118, w: 32, h: 32 },
            { type: "spike", x: 2440, y: 118, w: 32, h: 32 },

            { type: "speed", x: 2700, y: 120, speed: 650 },

            { type: "gravity", x: 3100, y: 120 },

            { type: "spike", x: 3500, y: 468, w: 32, h: 32 },
            { type: "spike", x: 3540, y: 468, w: 32, h: 32 },
            { type: "spike", x: 3580, y: 468, w: 32, h: 32 },

            { type: "coin", x: 4000, y: 400, collected: false },

            { type: "finish", x: 8200, y: 400 }
        ]
    }
];


/* =========================================================
   PARTICLES
   ========================================================= */

const particles = [];

function createParticle(x, y, color, amount = 1) {
    if (!GAME.settings.particles) return;

    for (let i = 0; i < amount; i++) {
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 250,
            vy: (Math.random() - 0.5) * 250,
            life: 0.4 + Math.random() * 0.7,
            maxLife: 1,
            size: 2 + Math.random() * 5,
            color
        });
    }
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 300 * dt;
        p.life -= dt;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    if (!GAME.ctx) return;

    GAME.ctx.save();

    for (const p of particles) {
        const alpha = Math.max(0, p.life / p.maxLife);

        GAME.ctx.globalAlpha = alpha;
        GAME.ctx.fillStyle = p.color;
        GAME.ctx.shadowBlur = 15;
        GAME.ctx.shadowColor = p.color;

        GAME.ctx.fillRect(
            p.x - GAME.cameraX,
            p.y,
            p.size,
            p.size
        );
    }

    GAME.ctx.restore();
}


/* =========================================================
   CANVAS SETUP
   ========================================================= */

function createGameCanvas() {
    let canvas = document.getElementById("gameCanvas");

    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "gameCanvas";

        canvas.style.position = "fixed";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = "1000";
        canvas.style.display = "none";

        document.body.appendChild(canvas);
    }

    GAME.canvas = canvas;
    GAME.ctx = canvas.getContext("2d");

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
    if (!GAME.canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    GAME.width = window.innerWidth;
    GAME.height = window.innerHeight;

    GAME.canvas.width = GAME.width * dpr;
    GAME.canvas.height = GAME.height * dpr;

    GAME.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}


/* =========================================================
   SAVE SYSTEM
   ========================================================= */

function loadSave() {
    try {
        const saved = localStorage.getItem("neonDashSave");

        if (saved) {
            const data = JSON.parse(saved);

            GAME.playerData = {
                ...GAME.playerData,
                ...data
            };
        }
    } catch (error) {
        console.warn("Save data could not be loaded.", error);
    }
}

function saveGame() {
    try {
        localStorage.setItem(
            "neonDashSave",
            JSON.stringify(GAME.playerData)
        );
    } catch (error) {
        console.warn("Save failed.", error);
    }
}


/* =========================================================
   UI HELPERS
   ========================================================= */

function hideAllScreens() {
    const screens = document.querySelectorAll(
        ".screen, .page, .menu-screen, .game-screen"
    );

    screens.forEach(screen => {
        screen.classList.remove("active");
        screen.style.display = "";
    });
}

function showScreen(id) {
    const element = document.getElementById(id);

    if (!element) return;

    hideAllScreens();

    element.classList.add("active");
    element.style.display = "";
}

function updateText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }
}

function updateMenuStats() {
    updateText("[data-stars]", GAME.playerData.stars);
    updateText("[data-coins]", GAME.playerData.coins);
    updateText("[data-diamonds]", GAME.playerData.diamonds);
    updateText("[data-creator-points]", GAME.playerData.creatorPoints);
}


/* =========================================================
   LEVEL SELECT
   ========================================================= */

function openLevelSelect() {
    GAME.state = "LEVEL_SELECT";

    const container =
        document.querySelector("#levelList") ||
        document.querySelector(".level-list");

    if (container) {
        container.innerHTML = "";

        LEVELS.forEach((level, index) => {
            const best =
                GAME.playerData.bestProgress[level.id] || 0;

            const card = document.createElement("div");

            card.className = "level-card";

            card.innerHTML = `
                <div class="level-number">${String(index + 1).padStart(2, "0")}</div>

                <div class="level-info">
                    <h3>${level.name}</h3>

                    <span class="difficulty ${level.difficulty.toLowerCase()}">
                        ${level.difficulty}
                    </span>

                    <p>
                        ${level.length} •
                        ${level.stars} ★ •
                        ${level.coins} Coins
                    </p>

                    <div class="level-progress">
                        <span style="width:${best}%"></span>
                    </div>

                    <small>Best: ${best}%</small>
                </div>

                <button class="level-play-button">
                    PLAY
                </button>
            `;

            card.querySelector("button").addEventListener(
                "click",
                () => showLevelInfo(index)
            );

            container.appendChild(card);
        });
    }

    showScreen("levelSelect");
}


/* =========================================================
   LEVEL INFORMATION
   ========================================================= */

function showLevelInfo(index) {
    const level = LEVELS[index];

    GAME.levelIndex = index;

    const name = document.querySelector("#levelInfoName");
    const difficulty = document.querySelector("#levelInfoDifficulty");
    const length = document.querySelector("#levelInfoLength");
    const stars = document.querySelector("#levelInfoStars");
    const coins = document.querySelector("#levelInfoCoins");

    if (name) name.textContent = level.name;
    if (difficulty) difficulty.textContent = level.difficulty;
    if (length) length.textContent = level.length;
    if (stars) stars.textContent = `${"★".repeat(level.stars)}`;
    if (coins) coins.textContent = `${level.coins}`;

    showScreen("levelInfo");
}


/* =========================================================
   START LEVEL
   ========================================================= */

function startLevel(index = GAME.levelIndex, practice = false) {
    GAME.level = cloneLevel(LEVELS[index]);

    GAME.levelIndex = index;
    GAME.practice = practice;

    GAME.state = "PLAYING";
    GAME.paused = false;

    GAME.cameraX = 0;
    GAME.levelTime = 0;

    GAME.speed = GAME.level.speed;

    GAME.attempts =
        (GAME.playerData.attempts[GAME.level.id] || 0) + 1;

    GAME.playerData.attempts[GAME.level.id] = GAME.attempts;

    GAME.progress = 0;
    GAME.coinsCollected = 0;

    GAME.normalGravity = 1;

    GAME.player = {
        x: 160,
        y: 0,
        width: 32,
        height: 32,

        velocityY: 0,

        grounded: false,
        alive: true,

        rotation: 0,

        primary: GAME.playerData.primaryColor,
        secondary: GAME.playerData.secondaryColor
    };

    const ground = GAME.level.objects.find(
        object => object.type === "ground"
    );

    if (ground) {
        GAME.player.y =
            ground.y - GAME.player.height;
    } else {
        GAME.player.y = GAME.height / 2;
    }

    particles.length = 0;

    if (GAME.canvas) {
        GAME.canvas.style.display = "block";
    }

    startGameLoop();
}


/* =========================================================
   LEVEL CLONING
   ========================================================= */

function cloneLevel(level) {
    return JSON.parse(JSON.stringify(level));
}


/* =========================================================
   GAME LOOP
   ========================================================= */

function startGameLoop() {
    if (GAME.animationFrame) {
        cancelAnimationFrame(GAME.animationFrame);
    }

    GAME.lastTime = performance.now();

    function loop(time) {
        const dt = Math.min(
            (time - GAME.lastTime) / 1000,
            0.033
        );

        GAME.lastTime = time;

        update(dt);
        draw();

        GAME.animationFrame = requestAnimationFrame(loop);
    }

    GAME.animationFrame = requestAnimationFrame(loop);
}


/* =========================================================
   UPDATE
   ========================================================= */

function update(dt) {
    updateParticles(dt);

    if (GAME.state !== "PLAYING") {
        return;
    }

    if (GAME.paused) {
        return;
    }

    GAME.levelTime += dt;

    updatePlayer(dt);
    updateCamera();

    checkObjects();

    const levelEnd = getLevelEnd();

    if (levelEnd > 0) {
        GAME.progress =
            Math.min(
                100,
                Math.floor(
                    (GAME.player.x / levelEnd) * 100
                )
            );
    }

    updateBestProgress();
}


/* =========================================================
   PLAYER PHYSICS
   ========================================================= */

function updatePlayer(dt) {
    const p = GAME.player;

    const direction = GAME.normalGravity;

    p.velocityY +=
        GAME.gravity *
        direction *
        dt;

    p.y += p.velocityY * dt;

    p.x += GAME.speed * dt;

    p.rotation +=
        GAME.speed *
        dt *
        0.006 *
        direction;

    const ground = getGroundCollision();

    if (ground) {
        if (direction === 1) {
            p.y = ground.y - p.height;

            if (p.velocityY > 0) {
                p.velocityY = 0;
            }

            p.grounded = true;
        } else {
            p.y = ground.y + ground.h;

            if (p.velocityY < 0) {
                p.velocityY = 0;
            }

            p.grounded = true;
        }
    } else {
        p.grounded = false;
    }

    if (p.y > GAME.height + 300 ||
        p.y < -300) {
        killPlayer();
    }
}


/* =========================================================
   JUMP
   ========================================================= */

function playerJump() {
    if (GAME.state !== "PLAYING") return;
    if (GAME.paused) return;
    if (!GAME.player.alive) return;

    const p = GAME.player;

    if (p.grounded) {
        p.velocityY =
            -720 * GAME.normalGravity;

        p.grounded = false;

        createParticle(
            p.x,
            p.y + p.height,
            p.primary,
            8
        );

        playSound("jump");
    }
}


/* =========================================================
   INPUT
   ========================================================= */

function setupInput() {
    window.addEventListener("keydown", event => {
        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {
            event.preventDefault();

            if (event.repeat) return;

            GAME.input.holding = true;

            playerJump();
        }

        if (event.code === "Escape") {
            togglePause();
        }

        if (event.code === "KeyR") {
            if (
                GAME.state === "PLAYING" ||
                GAME.state === "DEAD"
            ) {
                restartLevel();
            }
        }
    });

    window.addEventListener("keyup", event => {
        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {
            GAME.input.holding = false;
        }
    });

    window.addEventListener("pointerdown", event => {
        if (
            GAME.state === "PLAYING" &&
            !GAME.paused
        ) {
            GAME.input.holding = true;
            playerJump();
        }
    });

    window.addEventListener("pointerup", () => {
        GAME.input.holding = false;
    });
}


/* =========================================================
   OBJECT COLLISIONS
   ========================================================= */

function checkObjects() {
    if (!GAME.level) return;

    const p = GAME.player;

    for (const object of GAME.level.objects) {
        if (
            object.type === "spike" ||
            object.type === "block"
        ) {
            if (rectCollision(p, object)) {
                killPlayer();
                return;
            }
        }

        if (object.type === "coin") {
            if (
                !object.collected &&
                circleRectCollision(
                    object.x,
                    object.y,
                    14,
                    p
                )
            ) {
                object.collected = true;

                GAME.coinsCollected++;

                GAME.playerData.coins++;

                createParticle(
                    object.x,
                    object.y,
                    "#ffd700",
                    15
                );

                playSound("coin");

                saveGame();
            }
        }

        if (object.type === "gravity") {
            if (
                !object.used &&
                rectCollision(
                    p,
                    {
                        x: object.x,
                        y: object.y,
                        w: 40,
                        h: 80
                    }
                )
            ) {
                object.used = true;

                GAME.normalGravity *= -1;

                p.velocityY = 0;

                createParticle(
                    p.x,
                    p.y,
                    "#8b5cff",
                    25
                );
            }
        }

        if (object.type === "speed") {
            if (
                !object.used &&
                rectCollision(
                    p,
                    {
                        x: object.x,
                        y: object.y,
                        w: 50,
                        h: 80
                    }
                )
            ) {
                object.used = true;

                GAME.speed = object.speed;

                createParticle(
                    p.x,
                    p.y,
                    "#00f6ff",
                    20
                );
            }
        }

        if (object.type === "finish") {
            if (
                p.x >= object.x
            ) {
                completeLevel();
                return;
            }
        }
    }
}


/* =========================================================
   COLLISION HELPERS
   ========================================================= */

function rectCollision(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.width > b.x &&
        a.y < b.y + b.h &&
        a.y + a.height > b.y
    );
}

function circleRectCollision(cx, cy, radius, rect) {
    const closestX = Math.max(
        rect.x,
        Math.min(cx, rect.x + rect.width)
    );

    const closestY = Math.max(
        rect.y,
        Math.min(cy, rect.y + rect.height)
    );

    const dx = cx - closestX;
    const dy = cy - closestY;

    return (
        dx * dx +
        dy * dy <
        radius * radius
    );
}


/* =========================================================
   GROUND COLLISION
   ========================================================= */

function getGroundCollision() {
    const p = GAME.player;

    let result = null;

    for (const object of GAME.level.objects) {
        if (
            object.type !== "ground" &&
            object.type !== "platform"
        ) {
            continue;
        }

        if (
            p.x + p.width > object.x &&
            p.x < object.x + object.w
        ) {
            if (GAME.normalGravity === 1) {
                const playerBottom =
                    p.y + p.height;

                if (
                    playerBottom >= object.y &&
                    playerBottom <= object.y + 60 &&
                    p.velocityY >= 0
                ) {
                    result = object;
                }
            } else {
                if (
                    p.y <= object.y + object.h &&
                    p.y >= object.y + object.h - 60 &&
                    p.velocityY <= 0
                ) {
                    result = object;
                }
            }
        }
    }

    return result;
}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera() {
    const target =
        GAME.player.x -
        GAME.width * 0.25;

    GAME.cameraX +=
        (target - GAME.cameraX) * 0.12;

    if (GAME.cameraX < 0) {
        GAME.cameraX = 0;
    }
}


/* =========================================================
   LEVEL END
   ========================================================= */

function getLevelEnd() {
    if (!GAME.level) return 0;

    let maximum = 0;

    for (const object of GAME.level.objects) {
        if (object.x > maximum) {
            maximum = object.x;
        }
    }

    return maximum;
}


/* =========================================================
   BEST PROGRESS
   ========================================================= */

function updateBestProgress() {
    if (!GAME.level) return;

    const id = GAME.level.id;

    const current =
        GAME.playerData.bestProgress[id] || 0;

    if (GAME.progress > current) {
        GAME.playerData.bestProgress[id] =
            GAME.progress;

        saveGame();
    }
}


/* =========================================================
   DEATH
   ========================================================= */

function killPlayer() {
    if (!GAME.player.alive) return;

    GAME.player.alive = false;

    GAME.state = "DEAD";

    GAME.deaths++;

    createParticle(
        GAME.player.x,
        GAME.player.y,
        GAME.player.primary,
        40
    );

    if (GAME.settings.screenShake) {
        GAME.shake = 15;
    }

    playSound("death");

    setTimeout(() => {
        showDeathScreen();
    }, 250);
}


/* =========================================================
   DEATH SCREEN
   ========================================================= */

function showDeathScreen() {
    const progress =
        document.querySelector("#deathProgress");

    const attempts =
        document.querySelector("#deathAttempts");

    if (progress) {
        progress.textContent =
            `${GAME.progress}%`;
    }

    if (attempts) {
        attempts.textContent =
            `${GAME.attempts}`;
    }

    showScreen("deathScreen");
}


/* =========================================================
   RESTART
   ========================================================= */

function restartLevel() {
    startLevel(
        GAME.levelIndex,
        GAME.practice
    );
}


/* =========================================================
   COMPLETE LEVEL
   ========================================================= */

function completeLevel() {
    if (GAME.state !== "PLAYING") return;

    GAME.state = "COMPLETED";

    GAME.progress = 100;

    const id = GAME.level.id;

    if (!GAME.playerData.completedLevels.includes(id)) {
        GAME.playerData.completedLevels.push(id);

        GAME.playerData.stars +=
            GAME.level.stars;
    }

    GAME.playerData.bestProgress[id] = 100;

    saveGame();

    checkAchievements();

    playSound("complete");

    showResults();
}


/* =========================================================
   RESULTS
   ========================================================= */

function showResults() {
    updateText(
        "#resultProgress",
        "100%"
    );

    updateText(
        "#resultAttempts",
        GAME.attempts
    );

    updateText(
        "#resultCoins",
        `${GAME.coinsCollected}/${GAME.level.coins}`
    );

    showScreen("resultsScreen");
}


/* =========================================================
   PAUSE
   ========================================================= */

function togglePause() {
    if (
        GAME.state !== "PLAYING" &&
        GAME.state !== "PAUSED"
    ) {
        return;
    }

    GAME.paused = !GAME.paused;

    GAME.state =
        GAME.paused
            ? "PAUSED"
            : "PLAYING";

    const pauseScreen =
        document.querySelector("#pauseScreen");

    if (pauseScreen) {
        pauseScreen.style.display =
            GAME.paused
                ? "flex"
                : "none";
    }
}


/* =========================================================
   DRAW
   ========================================================= */

function draw() {
    if (!GAME.ctx) return;

    const ctx = GAME.ctx;

    ctx.clearRect(
        0,
        0,
        GAME.width,
        GAME.height
    );

    drawBackground();

    if (GAME.level) {
        drawLevel();
        drawPlayer();
    }

    drawParticles();

    drawHUD();

    if (GAME.shake > 0) {
        GAME.shake *= 0.9;

        if (GAME.shake < 0.1) {
            GAME.shake = 0;
        }
    }
}


/* =========================================================
   BACKGROUND
   ========================================================= */

function drawBackground() {
    const ctx = GAME.ctx;

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            GAME.width,
            GAME.height
        );

    gradient.addColorStop(
        0,
        "#03030b"
    );

    gradient.addColorStop(
        0.5,
        "#09051c"
    );

    gradient.addColorStop(
        1,
        "#020914"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        GAME.width,
        GAME.height
    );

    /* Neon grid */

    ctx.save();

    ctx.globalAlpha = 0.12;

    ctx.strokeStyle = "#00f6ff";
    ctx.lineWidth = 1;

    const gridSize = 50;

    const offset =
        -(GAME.cameraX * 0.2) %
        gridSize;

    for (
        let x = offset;
        x < GAME.width;
        x += gridSize
    ) {
        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME.height);

        ctx.stroke();
    }

    for (
        let y = 0;
        y < GAME.height;
        y += gridSize
    ) {
        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(GAME.width, y);

        ctx.stroke();
    }

    ctx.restore();

    /* Moving neon circles */

    for (let i = 0; i < 8; i++) {
        const x =
            ((i * 300) -
                GAME.cameraX * 0.1) %
            (GAME.width + 400);

        const y =
            100 +
            Math.sin(
                GAME.levelTime * 0.8 + i
            ) * 80;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            50 + i * 5,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            i % 2 === 0
                ? "#00f6ff"
                : "#8b5cff";

        ctx.globalAlpha = 0.08;

        ctx.lineWidth = 3;

        ctx.stroke();
    }

    ctx.globalAlpha = 1;
}


/* =========================================================
   DRAW LEVEL
   ========================================================= */

function drawLevel() {
    const ctx = GAME.ctx;

    for (const object of GAME.level.objects) {
        const x =
            object.x -
            GAME.cameraX;

        const y = object.y;

        if (
            x < -200 ||
            x > GAME.width + 200
        ) {
            continue;
        }

        if (object.type === "ground") {
            drawGlowRect(
                x,
                y,
                object.w,
                object.h,
                "#00f6ff"
            );
        }

        if (object.type === "platform") {
            drawGlowRect(
                x,
                y,
                object.w,
                object.h,
                "#8b5cff"
            );
        }

        if (object.type === "block") {
            drawGlowRect(
                x,
                y,
                object.w,
                object.h,
                "#00f6ff"
            );
        }

        if (object.type === "spike") {
            drawSpike(
                x,
                y,
                object.w,
                object.h
            );
        }

        if (object.type === "coin") {
            if (!object.collected) {
                drawCoin(
                    x,
                    y
                );
            }
        }

        if (object.type === "gravity") {
            drawPortal(
                x,
                y,
                "#8b5cff",
                "G"
            );
        }

        if (object.type === "speed") {
            drawPortal(
                x,
                y,
                "#00f6ff",
                ">"
            );
        }

        if (object.type === "finish") {
            drawFinish(
                x,
                y
            );
        }
    }
}


/* =========================================================
   DRAW PLAYER
   ========================================================= */

function drawPlayer() {
    const ctx = GAME.ctx;
    const p = GAME.player;

    const x =
        p.x -
        GAME.cameraX;

    const y = p.y;

    ctx.save();

    ctx.translate(
        x + p.width / 2,
        y + p.height / 2
    );

    ctx.rotate(p.rotation);

    ctx.shadowBlur =
        GAME.settings.glow
            ? 25
            : 0;

    ctx.shadowColor =
        p.primary;

    const gradient =
        ctx.createLinearGradient(
            -16,
            -16,
            16,
            16
        );

    gradient.addColorStop(
        0,
        p.primary
    );

    gradient.addColorStop(
        1,
        p.secondary
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        -16,
        -16,
        32,
        32
    );

    ctx.shadowBlur = 0;

    /* Face */

    ctx.fillStyle = "#050507";

    ctx.fillRect(
        -10,
        -7,
        5,
        5
    );

    ctx.fillRect(
        5,
        -7,
        5,
        5
    );

    ctx.restore();
}


/* =========================================================
   DRAW SHAPES
   ========================================================= */

function drawGlowRect(
    x,
    y,
    w,
    h,
    color
) {
    const ctx = GAME.ctx;

    ctx.save();

    ctx.shadowBlur =
        GAME.settings.glow
            ? 20
            : 0;

    ctx.shadowColor = color;

    ctx.fillStyle = color;

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.12)";

    ctx.fillRect(
        x,
        y,
        w,
        4
    );

    ctx.restore();
}


function drawSpike(
    x,
    y,
    w,
    h
) {
    const ctx = GAME.ctx;

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(
        x,
        y + h
    );

    ctx.lineTo(
        x + w / 2,
        y
    );

    ctx.lineTo(
        x + w,
        y + h
    );

    ctx.closePath();

    ctx.shadowBlur =
        GAME.settings.glow
            ? 20
            : 0;

    ctx.shadowColor =
        "#ff3366";

    ctx.fillStyle =
        "#ff3366";

    ctx.fill();

    ctx.restore();
}


function drawCoin(x, y) {
    const ctx = GAME.ctx;

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        13,
        0,
        Math.PI * 2
    );

    ctx.shadowBlur =
        GAME.settings.glow
            ? 20
            : 0;

    ctx.shadowColor =
        "#ffd700";

    ctx.fillStyle =
        "#ffd700";

    ctx.fill();

    ctx.fillStyle =
        "#6b4f00";

    ctx.font =
        "bold 15px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "C",
        x,
        y
    );

    ctx.restore();
}


function drawPortal(
    x,
    y,
    color,
    symbol
) {
    const ctx = GAME.ctx;

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        x + 20,
        y + 40,
        28,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = color;

    ctx.lineWidth = 5;

    ctx.shadowBlur =
        GAME.settings.glow
            ? 25
            : 0;

    ctx.shadowColor = color;

    ctx.stroke();

    ctx.fillStyle = color;

    ctx.font =
        "bold 20px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        symbol,
        x + 20,
        y + 40
    );

    ctx.restore();
}


function drawFinish(x, y) {
    const ctx = GAME.ctx;

    ctx.save();

    ctx.strokeStyle =
        "#00ff88";

    ctx.lineWidth = 5;

    ctx.shadowBlur =
        GAME.settings.glow
            ? 30
            : 0;

    ctx.shadowColor =
        "#00ff88";

    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x,
        y + 100
    );

    ctx.stroke();

    ctx.fillStyle =
        "#00ff88";

    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x + 70,
        y + 20
    );

    ctx.lineTo(
        x,
        y + 40
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}


/* =========================================================
   HUD
   ========================================================= */

function drawHUD() {
    if (
        GAME.state !== "PLAYING" &&
        GAME.state !== "PAUSED" &&
        GAME.state !== "DEAD" &&
        GAME.state !== "COMPLETED"
    ) {
        return;
    }

    const ctx = GAME.ctx;

    if (
        GAME.settings.showProgress
    ) {
        const barWidth =
            Math.min(
                GAME.width - 40,
                600
            );

        const barX =
            (GAME.width - barWidth) / 2;

        const barY = 20;

        ctx.fillStyle =
            "rgba(255,255,255,0.1)";

        ctx.fillRect(
            barX,
            barY,
            barWidth,
            7
        );

        const progressWidth =
            barWidth *
            (GAME.progress / 100);

        const gradient =
            ctx.createLinearGradient(
                barX,
                0,
                barX + barWidth,
                0
            );

        gradient.addColorStop(
            0,
            "#00f6ff"
        );

        gradient.addColorStop(
            1,
            "#8b5cff"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            barX,
            barY,
            progressWidth,
            7
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 14px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            `${GAME.progress}%`,
            GAME.width / 2,
            48
        );
    }

    ctx.textAlign = "left";

    ctx.font =
        "bold 14px Arial";

    ctx.fillStyle =
        "#ffffff";

    ctx.fillText(
        `ATTEMPT ${GAME.attempts}`,
        20,
        30
    );

    ctx.fillText(
        `COINS ${GAME.coinsCollected}/${GAME.level?.coins || 0}`,
        20,
        52
    );
}


/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

const ACHIEVEMENTS = {
    FIRST_STEP: {
        name: "FIRST STEP",
        condition: () =>
            GAME.playerData.completedLevels.length >= 1
    },

    COLLECTOR: {
        name: "COLLECTOR",
        condition: () =>
            GAME.playerData.coins >= 10
    },

    MASTER: {
        name: "MASTER",
        condition: () =>
            GAME.playerData.completedLevels.length >= 50
    },

    CREATOR: {
        name: "CREATOR",
        condition: () =>
            getCreatedLevels().length >= 1
    }
};

function checkAchievements() {
    for (const key in ACHIEVEMENTS) {
        const achievement =
            ACHIEVEMENTS[key];

        if (
            achievement.condition() &&
            !GAME.playerData.achievements.includes(key)
        ) {
            GAME.playerData.achievements.push(key);

            showAchievementPopup(
                achievement.name
            );
        }
    }

    saveGame();
}

function showAchievementPopup(name) {
    const popup =
        document.querySelector(
            "#achievementPopup"
        );

    if (!popup) return;

    popup.textContent =
        `ACHIEVEMENT UNLOCKED: ${name}`;

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}


/* =========================================================
   PRACTICE MODE
   ========================================================= */

const checkpoints = [];

function createCheckpoint() {
    if (!GAME.practice) return;

    checkpoints.push({
        x: GAME.player.x,
        y: GAME.player.y,
        gravity: GAME.normalGravity
    });
}

function restartFromCheckpoint() {
    if (
        !GAME.practice ||
        checkpoints.length === 0
    ) {
        restartLevel();
        return;
    }

    const checkpoint =
        checkpoints[checkpoints.length - 1];

    GAME.player.x =
        checkpoint.x;

    GAME.player.y =
        checkpoint.y;

    GAME.player.velocityY = 0;

    GAME.normalGravity =
        checkpoint.gravity;

    GAME.state = "PLAYING";

    GAME.paused = false;
}


/* =========================================================
   SIMPLE LEVEL EDITOR
   ========================================================= */

let editorObjects = [];

function openEditor() {
    GAME.state = "EDITOR";

    editorObjects = [];

    showScreen("editorScreen");

    setupEditorCanvas();
}

function addEditorObject(type) {
    editorObjects.push({
        type,
        x: 300 + editorObjects.length * 50,
        y: 400,
        w: 40,
        h: 40
    });

    renderEditor();
}

function deleteEditorObject(index) {
    if (
        index >= 0 &&
        index < editorObjects.length
    ) {
        editorObjects.splice(index, 1);

        renderEditor();
    }
}

function saveCreatedLevel() {
    const created =
        getCreatedLevels();

    created.push({
        id:
            "custom-" +
            Date.now(),

        name:
            "My Neon Level",

        difficulty:
            "Normal",

        objects:
            editorObjects
    });

    localStorage.setItem(
        "neonDashCreatedLevels",
        JSON.stringify(created)
    );

    GAME.playerData.creatorPoints += 1;

    saveGame();

    checkAchievements();
}

function getCreatedLevels() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "neonDashCreatedLevels"
            )
        ) || [];
    } catch {
        return [];
    }
}

function setupEditorCanvas() {
    const canvas =
        document.querySelector(
            "#editorCanvas"
        );

    if (!canvas) return;

    canvas.width =
        Math.max(
            900,
            window.innerWidth
        );

    canvas.height =
        600;

    renderEditor();
}

function renderEditor() {
    const canvas =
        document.querySelector(
            "#editorCanvas"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "#05050c";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.strokeStyle =
        "rgba(0,246,255,0.12)";

    for (
        let x = 0;
        x < canvas.width;
        x += 40
    ) {
        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        ctx.stroke();
    }

    for (
        let y = 0;
        y < canvas.height;
        y += 40
    ) {
        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);

        ctx.stroke();
    }

    editorObjects.forEach(
        (object, index) => {
            ctx.fillStyle =
                object.type === "spike"
                    ? "#ff3366"
                    : "#00f6ff";

            ctx.fillRect(
                object.x,
                object.y,
                object.w,
                object.h
            );

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "10px Arial";

            ctx.fillText(
                index + 1,
                object.x + 5,
                object.y + 15
            );
        }
    );
}


/* =========================================================
   SOUND
   ========================================================= */

let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        try {
            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();
        } catch {
            return null;
        }
    }

    return audioContext;
}

function playSound(type) {
    if (!GAME.settings.sound) return;

    const audio =
        getAudioContext();

    if (!audio) return;

    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();

    oscillator.connect(gain);
    gain.connect(audio.destination);

    const frequencies = {
        jump: 520,
        coin: 900,
        death: 100,
        complete: 1000
    };

    oscillator.frequency.value =
        frequencies[type] || 500;

    oscillator.type =
        type === "death"
            ? "sawtooth"
            : "square";

    gain.gain.setValueAtTime(
        0.08,
        audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.15
    );

    oscillator.start();

    oscillator.stop(
        audio.currentTime + 0.15
    );
}


/* =========================================================
   MENU BUTTON CONNECTION
   ========================================================= */

function setupButtons() {
    document.addEventListener(
        "click",
        event => {
            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) return;

            const action =
                button.dataset.action;

            switch (action) {
                case "play":
                    openLevelSelect();
                    break;

                case "levels":
                    openLevelSelect();
                    break;

                case "create":
                    openEditor();
                    break;

                case "online":
                    showScreen("onlineScreen");
                    break;

                case "profile":
                    showScreen("profileScreen");
                    break;

                case "settings":
                    showScreen("settingsScreen");
                    break;

                case "achievements":
                    showScreen(
                        "achievementsScreen"
                    );
                    break;

                case "shop":
                    showScreen("shopScreen");
                    break;

                case "back":
                    GAME.state = "MENU";
                    showScreen("mainMenu");
                    break;

                case "start-level":
                    startLevel(
                        GAME.levelIndex,
                        false
                    );
                    break;

                case "practice":
                    startLevel(
                        GAME.levelIndex,
                        true
                    );
                    break;

                case "retry":
                    restartLevel();
                    break;

                case "pause":
                    togglePause();
                    break;

                case "resume":
                    togglePause();
                    break;

                case "checkpoint":
                    createCheckpoint();
                    break;

                case "checkpoint-restart":
                    restartFromCheckpoint();
                    break;

                case "save-level":
                    saveCreatedLevel();
                    break;
            }
        }
    );
}


/* =========================================================
   TOUCH / MOBILE BUTTON
   ========================================================= */

function setupMobileControls() {
    const touchButton =
        document.querySelector(
            "#mobileJump"
        );

    if (!touchButton) return;

    const jump = event => {
        event.preventDefault();

        GAME.input.holding = true;

        playerJump();
    };

    touchButton.addEventListener(
        "touchstart",
        jump,
        { passive: false }
    );

    touchButton.addEventListener(
        "mousedown",
        jump
    );

    touchButton.addEventListener(
        "touchend",
        () => {
            GAME.input.holding = false;
        }
    );
}


/* =========================================================
   SETTINGS
   ========================================================= */

function setupSettings() {
    document.addEventListener(
        "change",
        event => {
            const setting =
                event.target.dataset.setting;

            if (!setting) return;

            GAME.settings[setting] =
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value;

            saveGame();
        }
    );
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initNeonDash() {
    loadSave();

    createGameCanvas();

    setupInput();

    setupButtons();

    setupMobileControls();

    setupSettings();

    updateMenuStats();

    GAME.state = "MENU";

    console.log(
        "%c NEON DASH INITIALIZED ",
        "background:#05050c;color:#00f6ff;font-weight:bold;padding:8px;"
    );
}


/* =========================================================
   AUTO START
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initNeonDash
    );
} else {
    initNeonDash();
}
