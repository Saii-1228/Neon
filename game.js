/* =========================================================
   NEON DASH
   LANDSCAPE GAME ENGINE
   Designed for the supplied index.html
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       DOM
    ===================================================== */

    const $ = id => document.getElementById(id);

    const canvas = $("game-canvas");

    if (!canvas) {
        console.error("Neon Dash: #game-canvas not found.");
        return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Neon Dash: Canvas context unavailable.");
        return;
    }

    /* =====================================================
       GAME CONFIG
    ===================================================== */

    const CONFIG = {
        logicalWidth: 1280,
        logicalHeight: 720,

        playerSize: 42,

        groundY: 570,

        gravity: 1900,
        jumpForce: 720,

        saveKey: "neonDashPlayerData_v3",
        settingsKey: "neonDashSettings_v3",

        version: 3
    };

    /* =====================================================
       GAME STATE
    ===================================================== */

    const GAME = {

        screen: "main-menu",

        state: "MENU",

        level: null,

        levelId: null,

        practice: false,

        animationFrame: 0,

        lastTime: 0,

        cameraX: 0,

        speed: 320,

        baseSpeed: 320,

        gravity: CONFIG.gravity,

        progress: 0,

        coinsCollected: 0,

        collectedCoins: new Set(),

        particles: [],

        shake: 0,

        landscapeWarning: null,

        musicEnabled: true,

        soundEnabled: true,

        input: {
            jumpHeld: false,
            jumpPressed: false
        },

        player: {

            x: 140,

            y: 0,

            size: CONFIG.playerSize,

            velocityY: 0,

            grounded: false,

            rotation: 0,

            gravityDirection: 1,

            mode: "cube",

            color: "#00eaff",

            secondaryColor: "#a855f7",

            trail: true
        },

        settings: {

            progress: true,

            shake: true,

            practice: true,

            particles: true,

            glow: true,

            background: true,

            musicVolume: 70,

            soundVolume: 80
        },

        playerData: {

            id: "saii-player",

            username: "SAII",

            level: 1,

            coins: 0,

            diamonds: 0,

            stars: 0,

            creatorPoints: 0,

            completed: 0,

            created: 0,

            totalAttempts: 0,

            selectedCharacter: "cube",

            primaryColor: "#00eaff",

            secondaryColor: "#a855f7",

            trail: true,

            completedLevels: [],

            attempts: {},

            bestProgress: {},

            collectedCoins: {},

            achievements: {},

            ownedItems: [],

            createdLevels: [],

            lastPlayed: null,

            version: CONFIG.version
        },

        editor: {

            objects: [],

            history: [],

            future: [],

            selectedTool: "select"
        }
    };

    /* =====================================================
       LEVELS
    ===================================================== */

    const LEVELS = [

        {
            id: 1,
            name: "Neon Start",
            difficulty: "easy",
            length: "SHORT",
            stars: 5,
            worldWidth: 9000,
            speed: 300,
            color: "#00eaff",

            objects: [

                {
                    type: "ground",
                    x: 0,
                    y: 570,
                    w: 9000,
                    h: 150
                },

                {
                    type: "spike",
                    x: 850,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 1250,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "block",
                    x: 1650,
                    y: 470,
                    w: 110,
                    h: 100
                },

                {
                    type: "coin",
                    x: 1830,
                    y: 390,
                    id: "1a"
                },

                {
                    type: "spike",
                    x: 2050,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 2100,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "speed",
                    x: 2600,
                    y: 460,
                    value: 1.2
                },

                {
                    type: "block",
                    x: 3100,
                    y: 450,
                    w: 120,
                    h: 120
                },

                {
                    type: "coin",
                    x: 3300,
                    y: 370,
                    id: "1b"
                },

                {
                    type: "spike",
                    x: 3650,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 3700,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "block",
                    x: 4300,
                    y: 430,
                    w: 120,
                    h: 140
                },

                {
                    type: "speed",
                    x: 4700,
                    y: 460,
                    value: 1.3
                },

                {
                    type: "spike",
                    x: 5200,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "coin",
                    x: 5700,
                    y: 400,
                    id: "1c"
                },

                {
                    type: "block",
                    x: 6100,
                    y: 450,
                    w: 120,
                    h: 120
                },

                {
                    type: "spike",
                    x: 6550,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 6600,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 6650,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "finish",
                    x: 8200,
                    y: 400,
                    w: 55,
                    h: 170
                }
            ]
        },

        {
            id: 2,
            name: "Neon Rush",
            difficulty: "normal",
            length: "MEDIUM",
            stars: 7,
            worldWidth: 12500,
            speed: 350,
            color: "#a855f7",

            objects: [

                {
                    type: "ground",
                    x: 0,
                    y: 570,
                    w: 12500,
                    h: 150
                },

                {
                    type: "spike",
                    x: 700,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 750,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "block",
                    x: 1200,
                    y: 450,
                    w: 120,
                    h: 120
                },

                {
                    type: "coin",
                    x: 1400,
                    y: 360,
                    id: "2a"
                },

                {
                    type: "speed",
                    x: 1750,
                    y: 460,
                    value: 1.3
                },

                {
                    type: "spike",
                    x: 2300,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 2350,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "block",
                    x: 2850,
                    y: 430,
                    w: 120,
                    h: 140
                },

                {
                    type: "coin",
                    x: 3100,
                    y: 340,
                    id: "2b"
                },

                {
                    type: "spike",
                    x: 3500,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 3550,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 3600,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "speed",
                    x: 4200,
                    y: 460,
                    value: 1.45
                },

                {
                    type: "block",
                    x: 4900,
                    y: 420,
                    w: 130,
                    h: 150
                },

                {
                    type: "coin",
                    x: 5150,
                    y: 330,
                    id: "2c"
                },

                {
                    type: "spike",
                    x: 5550,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 5600,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "block",
                    x: 6200,
                    y: 440,
                    w: 130,
                    h: 130
                },

                {
                    type: "speed",
                    x: 6900,
                    y: 460,
                    value: 1.6
                },

                {
                    type: "spike",
                    x: 7500,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 7550,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "coin",
                    x: 7900,
                    y: 380,
                    id: "2d"
                },

                {
                    type: "block",
                    x: 8500,
                    y: 430,
                    w: 130,
                    h: 140
                },

                {
                    type: "spike",
                    x: 9000,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 9050,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "coin",
                    x: 9500,
                    y: 370,
                    id: "2e"
                },

                {
                    type: "speed",
                    x: 10000,
                    y: 460,
                    value: 1.7
                },

                {
                    type: "spike",
                    x: 10600,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 10650,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "finish",
                    x: 11700,
                    y: 400,
                    w: 55,
                    h: 170
                }
            ]
        },

        {
            id: 3,
            name: "Neon Circuit",
            difficulty: "hard",
            length: "LONG",
            stars: 10,
            worldWidth: 15500,
            speed: 390,
            color: "#ff3bd4",

            objects: [

                {
                    type: "ground",
                    x: 0,
                    y: 570,
                    w: 15500,
                    h: 150
                },

                {
                    type: "spike",
                    x: 600,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 650,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "block",
                    x: 1000,
                    y: 430,
                    w: 120,
                    h: 140
                },

                {
                    type: "speed",
                    x: 1400,
                    y: 460,
                    value: 1.4
                },

                {
                    type: "spike",
                    x: 1900,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 1950,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "coin",
                    x: 2250,
                    y: 350,
                    id: "3a"
                },

                {
                    type: "block",
                    x: 2700,
                    y: 400,
                    w: 130,
                    h: 170
                },

                {
                    type: "spike",
                    x: 3150,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 3200,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "speed",
                    x: 3700,
                    y: 460,
                    value: 1.55
                },

                {
                    type: "coin",
                    x: 4200,
                    y: 350,
                    id: "3b"
                },

                {
                    type: "block",
                    x: 4700,
                    y: 420,
                    w: 130,
                    h: 150
                },

                {
                    type: "spike",
                    x: 5200,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 5250,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 5300,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "speed",
                    x: 5800,
                    y: 460,
                    value: 1.7
                },

                {
                    type: "block",
                    x: 6500,
                    y: 400,
                    w: 130,
                    h: 170
                },

                {
                    type: "coin",
                    x: 6800,
                    y: 320,
                    id: "3c"
                },

                {
                    type: "spike",
                    x: 7300,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 7350,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "speed",
                    x: 7900,
                    y: 460,
                    value: 1.8
                },

                {
                    type: "block",
                    x: 8500,
                    y: 420,
                    w: 140,
                    h: 150
                },

                {
                    type: "coin",
                    x: 8800,
                    y: 320,
                    id: "3d"
                },

                {
                    type: "spike",
                    x: 9300,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 9350,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 9400,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "speed",
                    x: 9900,
                    y: 460,
                    value: 1.9
                },

                {
                    type: "block",
                    x: 10500,
                    y: 400,
                    w: 140,
                    h: 170
                },

                {
                    type: "coin",
                    x: 10800,
                    y: 300,
                    id: "3e"
                },

                {
                    type: "spike",
                    x: 11300,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 11350,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "speed",
                    x: 11900,
                    y: 460,
                    value: 2
                },

                {
                    type: "block",
                    x: 12600,
                    y: 410,
                    w: 150,
                    h: 160
                },

                {
                    type: "coin",
                    x: 12900,
                    y: 300,
                    id: "3f"
                },

                {
                    type: "spike",
                    x: 13500,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 13550,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "spike",
                    x: 13600,
                    y: 530,
                    w: 42,
                    h: 40
                },

                {
                    type: "finish",
                    x: 14800,
                    y: 400,
                    w: 55,
                    h: 170
                }
            ]
        }
    ];

    /* =====================================================
       GENERATE LEVELS 4-6
    ===================================================== */

    function generateLevel(level) {

        if (level.objects) return;

        level.objects = [

            {
                type: "ground",
                x: 0,
                y: 570,
                w: level.worldWidth,
                h: 150
            }
        ];

        const difficulty =
            level.id === 6 ? 1 :
            level.id === 5 ? 1.15 :
            1.3;

        let index = 0;

        for (
            let x = 650;
            x < level.worldWidth - 700;
            x += 320 / difficulty
        ) {

            const pattern = index % 8;

            if (pattern === 0) {

                level.objects.push({
                    type: "spike",
                    x,
                    y: 530,
                    w: 42,
                    h: 40
                });

            } else if (pattern === 1) {

                level.objects.push({
                    type: "spike",
                    x,
                    y: 530,
                    w: 42,
                    h: 40
                });

                level.objects.push({
                    type: "spike",
                    x: x + 50,
                    y: 530,
                    w: 42,
                    h: 40
                });

            } else if (pattern === 2) {

                level.objects.push({
                    type: "block",
                    x,
                    y: 430,
                    w: 120,
                    h: 140
                });

            } else if (pattern === 3) {

                level.objects.push({
                    type: "speed",
                    x,
                    y: 460,
                    value:
                        1.25 +
                        level.id * 0.08
                });

            } else if (pattern === 4) {

                level.objects.push({
                    type: "spike",
                    x,
                    y: 530,
                    w: 42,
                    h: 40
                });

                level.objects.push({
                    type: "coin",
                    x: x + 140,
                    y: 380,
                    id:
                        `${level.id}-${index}`
                });

            } else if (pattern === 5) {

                level.objects.push({
                    type: "block",
                    x,
                    y: 450,
                    w: 120,
                    h: 120
                });

                level.objects.push({
                    type: "spike",
                    x: x + 160,
                    y: 530,
                    w: 42,
                    h: 40
                });

            } else if (pattern === 6) {

                level.objects.push({
                    type: "block",
                    x,
                    y: 400,
                    w: 100,
                    h: 170
                });

            } else {

                level.objects.push({
                    type: "spike",
                    x,
                    y: 530,
                    w: 42,
                    h: 40
                });

            }

            index++;
        }

        level.objects.push({

            type: "finish",

            x:
                level.worldWidth - 650,

            y: 400,

            w: 55,

            h: 170
        });
    }

    LEVELS.forEach(generateLevel);

    /* =====================================================
       PLAYER DATA
    ===================================================== */

    function createDefaultPlayerData() {

        return {

            id:
                "player-" +
                Math.random()
                    .toString(36)
                    .slice(2, 9),

            username: "SAII",

            level: 1,

            coins: 0,

            diamonds: 0,

            stars: 0,

            creatorPoints: 0,

            completed: 0,

            created: 0,

            totalAttempts: 0,

            selectedCharacter: "cube",

            primaryColor: "#00eaff",

            secondaryColor: "#a855f7",

            trail: true,

            completedLevels: [],

            attempts: {},

            bestProgress: {},

            collectedCoins: {},

            achievements: {},

            ownedItems: [],

            createdLevels: [],

            lastPlayed: null,

            version: CONFIG.version
        };
    }

    function loadPlayerData() {

        try {

            const saved =
                localStorage.getItem(
                    CONFIG.saveKey
                );

            if (!saved) {

                GAME.playerData =
                    createDefaultPlayerData();

                savePlayerData();

                return;
            }

            const parsed =
                JSON.parse(saved);

            GAME.playerData = {

                ...createDefaultPlayerData(),

                ...parsed,

                attempts:
                    parsed.attempts || {},

                bestProgress:
                    parsed.bestProgress || {},

                collectedCoins:
                    parsed.collectedCoins || {},

                achievements:
                    parsed.achievements || {},

                ownedItems:
                    parsed.ownedItems || [],

                completedLevels:
                    parsed.completedLevels || [],

                createdLevels:
                    parsed.createdLevels || []
            };

        } catch (error) {

            console.warn(
                "Player data could not be loaded.",
                error
            );

            GAME.playerData =
                createDefaultPlayerData();
        }

        GAME.player.color =
            GAME.playerData.primaryColor;

        GAME.player.secondaryColor =
            GAME.playerData.secondaryColor;

        GAME.player.trail =
            GAME.playerData.trail;
    }

    function savePlayerData() {

        try {

            GAME.playerData.lastPlayed =
                new Date().toISOString();

            localStorage.setItem(

                CONFIG.saveKey,

                JSON.stringify(
                    GAME.playerData
                )
            );

        } catch (error) {

            console.warn(
                "Player data could not be saved.",
                error
            );
        }
    }

    /* =====================================================
       SETTINGS SAVE
    ===================================================== */

    function loadSettings() {

        try {

            const saved =
                localStorage.getItem(
                    CONFIG.settingsKey
                );

            if (saved) {

                GAME.settings = {

                    ...GAME.settings,

                    ...JSON.parse(saved)
                };
            }

        } catch (_) {}
    }

    function saveSettings() {

        try {

            localStorage.setItem(

                CONFIG.settingsKey,

                JSON.stringify(
                    GAME.settings
                )
            );

        } catch (_) {}
    }

    /* =====================================================
       LANDSCAPE SYSTEM
    ===================================================== */

    function setupLandscape() {

        document.body.classList.add(
            "neon-dash-landscape"
        );

        const gameScreen =
            $("game-screen");

        if (gameScreen) {

            gameScreen.classList.add(
                "landscape-game"
            );
        }

        createLandscapeWarning();

        updateLandscapeState();

        window.addEventListener(
            "resize",
            updateLandscapeState
        );

        window.addEventListener(
            "orientationchange",
            () => {

                setTimeout(
                    updateLandscapeState,
                    200
                );
            }
        );
    }

    function createLandscapeWarning() {

        let warning =
            $("neon-landscape-warning");

        if (warning) return;

        warning =
            document.createElement("div");

        warning.id =
            "neon-landscape-warning";

        warning.innerHTML = `

            <div class="landscape-warning-box">

                <div class="landscape-warning-icon">
                    LANDSCAPE
                </div>

                <h2>Rotate Your Device</h2>

                <p>
                    Neon Dash is designed for landscape gameplay.
                </p>

            </div>

        `;

        warning.style.cssText = `

            position: fixed;
            inset: 0;
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
            background: #050516;
            color: white;
            text-align: center;
            font-family: Arial, sans-serif;
            padding: 24px;

        `;

        document.body.appendChild(warning);

        GAME.landscapeWarning =
            warning;
    }

    function updateLandscapeState() {

        const playing =
            GAME.screen === "game-screen" &&
            (
                GAME.state === "PLAYING" ||
                GAME.state === "PAUSED" ||
                GAME.state === "DEAD" ||
                GAME.state === "COMPLETE"
            );

        const portrait =
            window.innerHeight >
            window.innerWidth;

        if (
            GAME.landscapeWarning
        ) {

            GAME.landscapeWarning.style.display =
                playing && portrait
                    ? "flex"
                    : "none";
        }

        resizeCanvas();
    }

    async function requestLandscape() {

        try {

            if (
                screen.orientation &&
                screen.orientation.lock
            ) {

                await screen.orientation.lock(
                    "landscape"
                );
            }

        } catch (_) {

            /*
              Browsers may reject orientation
              locking unless installed/PWA/fullscreen.
              The landscape warning still handles this.
            */
        }
    }

    /* =====================================================
       SCREEN SYSTEM
    ===================================================== */

    function allScreens() {

        return document.querySelectorAll(
            ".screen"
        );
    }

    function showScreen(id) {

        allScreens().forEach(
            screen => {

                screen.classList.remove(
                    "active"
                );
            }
        );

        const target = $(id);

        if (target) {

            target.classList.add(
                "active"
            );

            GAME.screen = id;
        }

        hideOverlays();

        if (id !== "game-screen") {

            stopGameLoop();

            GAME.state = "MENU";
        }

        updateTopBar(id);

        updateLandscapeState();

        updateAllStats();
    }

    function updateTopBar(screen) {

        const back =
            $("back-button");

        const title =
            $("top-title");

        if (!back || !title) return;

        if (screen === "main-menu") {

            back.style.visibility =
                "hidden";

            title.textContent =
                "NEON DASH";

            return;
        }

        back.style.visibility =
            "visible";

        const titles = {

            "level-select":
                "LEVEL SELECT",

            "level-details":
                "LEVEL DETAILS",

            "game-screen":
                "NEON DASH",

            "online":
                "ONLINE LEVELS",

            "profile":
                "PROFILE",

            "shop":
                "SHOP",

            "achievements":
                "ACHIEVEMENTS",

            "editor":
                "LEVEL EDITOR",

            "settings":
                "SETTINGS"
        };

        title.textContent =
            titles[screen] ||
            "NEON DASH";
    }

    function hideOverlays() {

        [
            "pause-overlay",
            "death-overlay",
            "complete-overlay"
        ].forEach(id => {

            const element = $(id);

            if (element) {

                element.classList.add(
                    "hidden"
                );
            }
        });
    }

    function showOverlay(id) {

        const element = $(id);

        if (element) {

            element.classList.remove(
                "hidden"
            );
        }
    }

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    let notificationTimer = null;

    function notify(message) {

        const box =
            $("notification");

        const text =
            $("notification-text");

        if (!box || !text) return;

        text.textContent =
            message;

        box.classList.add(
            "show"
        );

        clearTimeout(
            notificationTimer
        );

        notificationTimer =
            setTimeout(() => {

                box.classList.remove(
                    "show"
                );

            }, 2200);
    }

    /* =====================================================
       LEVEL SELECT
    ===================================================== */

    function renderLevelList(
        filter = "all"
    ) {

        const container =
            $("level-list");

        if (!container) return;

        container.innerHTML = "";

        LEVELS.forEach(level => {

            if (
                filter !== "all" &&
                level.difficulty !== filter
            ) {

                return;
            }

            const best =
                GAME.playerData
                    .bestProgress[level.id] ||
                0;

            const coins =
                GAME.playerData
                    .collectedCoins[level.id] ||
                [];

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "level-card";

            card.dataset.levelId =
                level.id;

            card.dataset.difficulty =
                level.difficulty;

            card.innerHTML = `

                <div class="level-icon ${level.difficulty}">
                    <i class="fa-solid fa-bolt"></i>
                </div>

                <div class="level-info">

                    <h3>${level.name}</h3>

                    <p>
                        ${level.difficulty.toUpperCase()}
                        •
                        ${level.length}
                    </p>

                    <div class="level-meta">

                        <span>
                            ★ ${level.stars}
                        </span>

                        <span>
                            ● ${coins.length}/3
                        </span>

                        <span>
                            ${best}%
                        </span>

                    </div>

                </div>

                <div class="level-progress">

                    <div class="progress-track">

                        <div
                            class="progress-fill"
                            style="width:${best}%"
                        ></div>

                    </div>

                    <span>
                        ${best}%
                    </span>

                </div>

            `;

            card.addEventListener(
                "click",
                () => {

                    openLevelDetails(
                        level.id
                    );
                }
            );

            container.appendChild(card);
        });
    }

    function openLevelDetails(id) {

        const level =
            LEVELS.find(
                l => l.id === Number(id)
            );

        if (!level) return;

        GAME.levelId =
            level.id;

        const best =
            GAME.playerData
                .bestProgress[level.id] ||
            0;

        const attempts =
            GAME.playerData
                .attempts[level.id] ||
            0;

        const coins =
            GAME.playerData
                .collectedCoins[level.id] ||
            [];

        setText(
            "detail-level-name",
            level.name
        );

        setText(
            "detail-difficulty",
            level.difficulty.toUpperCase()
        );

        setText(
            "detail-difficulty-text",
            level.difficulty.toUpperCase()
        );

        setText(
            "detail-length",
            level.length
        );

        setText(
            "detail-stars",
            `★ ${level.stars}`
        );

        setText(
            "detail-coins",
            `${coins.length} / 3`
        );

        setText(
            "detail-best",
            `${best}%`
        );

        setText(
            "detail-attempts",
            attempts
        );

        const icon =
            $("detail-level-icon");

        if (icon) {

            icon.className =
                `large-level-icon ${level.difficulty}`;
        }

        showScreen(
            "level-details"
        );
    }

    /* =====================================================
       START LEVEL
    ===================================================== */

    function startLevel(
        id,
        practice = false
    ) {

        const level =
            LEVELS.find(
                l => l.id === Number(id)
            );

        if (!level) {

            notify(
                "Level not found"
            );

            return;
        }

        GAME.level =
            level;

        GAME.levelId =
            level.id;

        GAME.practice =
            practice;

        GAME.state =
            "PLAYING";

        GAME.progress =
            0;

        GAME.coinsCollected =
            0;

        GAME.collectedCoins =
            new Set();

        GAME.cameraX =
            0;

        GAME.speed =
            level.speed;

        GAME.baseSpeed =
            level.speed;

        GAME.gravity =
            CONFIG.gravity;

        GAME.shake =
            0;

        GAME.particles =
            [];

        GAME.player.x =
            140;

        GAME.player.y =
            CONFIG.groundY -
            GAME.player.size;

        GAME.player.velocityY =
            0;

        GAME.player.grounded =
            true;

        GAME.player.rotation =
            0;

        GAME.player.gravityDirection =
            1;

        GAME.player.mode =
            GAME.playerData
                .selectedCharacter ||
            "cube";

        GAME.player.color =
            GAME.playerData
                .primaryColor;

        GAME.player.secondaryColor =
            GAME.playerData
                .secondaryColor;

        GAME.player.trail =
            GAME.playerData
                .trail;

        /*
          Reset one-use portals.
        */

        level.objects.forEach(
            object => {

                if (
                    object.type === "speed" ||
                    object.type === "gravity"
                ) {

                    object.used = false;
                }
            }
        );

        if (
            !GAME.playerData.attempts[
                level.id
            ]
        ) {

            GAME.playerData.attempts[
                level.id
            ] = 0;
        }

        GAME.playerData.attempts[
            level.id
        ]++;

        GAME.playerData.totalAttempts++;

        GAME.playerData.lastPlayed =
            new Date().toISOString();

        savePlayerData();

        setText(
            "game-level-title",
            level.name.toUpperCase()
        );

        showScreen(
            "game-screen"
        );

        resizeCanvas();

        hideOverlays();

        requestLandscape();

        startGameLoop();

        notify(
            practice
                ? "Practice mode"
                : "GO!"
        );

        beep(
            420,
            0.06
        );
    }

    function restartLevel() {

        if (!GAME.levelId) return;

        startLevel(
            GAME.levelId,
            GAME.practice
        );
    }

    /* =====================================================
       GAME LOOP
    ===================================================== */

    function startGameLoop() {

        stopGameLoop();

        GAME.lastTime =
            performance.now();

        GAME.animationFrame =
            requestAnimationFrame(
                gameLoop
            );
    }

    function stopGameLoop() {

        if (
            GAME.animationFrame
        ) {

            cancelAnimationFrame(
                GAME.animationFrame
            );

            GAME.animationFrame =
                0;
        }
    }

    function gameLoop(time) {

        GAME.animationFrame =
            requestAnimationFrame(
                gameLoop
            );

        let dt =
            (time -
                GAME.lastTime) /
            1000;

        GAME.lastTime =
            time;

        dt =
            Math.min(
                dt,
                0.033
            );

        if (
            GAME.state ===
            "PLAYING"
        ) {

            update(dt);
        }

        draw();
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    function update(dt) {

        if (!GAME.level) return;

        const p =
            GAME.player;

        p.x +=
            GAME.speed * dt;

        p.velocityY +=
            GAME.gravity *
            p.gravityDirection *
            dt;

        const previousY =
            p.y;

        p.y +=
            p.velocityY * dt;

        handlePlatforms(
            previousY
        );

        handleWorldObjects();

        updateRotation(dt);

        GAME.cameraX =
            Math.max(
                0,
                p.x -
                    CONFIG.logicalWidth *
                    0.30
            );

        GAME.cameraX =
            Math.min(
                GAME.cameraX,
                Math.max(
                    0,
                    GAME.level.worldWidth -
                        CONFIG.logicalWidth
                )
            );

        GAME.progress =
            Math.min(
                100,
                Math.floor(
                    (
                        p.x /
                        Math.max(
                            1,
                            GAME.level.worldWidth -
                                500
                        )
                    ) *
                    100
                )
            );

        updateHUD();

        updateParticles(dt);

        if (
            GAME.shake > 0
        ) {

            GAME.shake -=
                dt * 35;

            if (
                GAME.shake < 0
            ) {

                GAME.shake =
                    0;
            }
        }

        GAME.input.jumpPressed =
            false;

        if (
            p.y >
                CONFIG.logicalHeight +
                200 ||
            p.y <
                -300
        ) {

            die();
        }
    }

    /* =====================================================
       PLATFORM COLLISION
    ===================================================== */

    function handlePlatforms(
        previousY
    ) {

        const p =
            GAME.player;

        const previousBottom =
            previousY +
            p.size;

        const currentBottom =
            p.y +
            p.size;

        p.grounded =
            false;

        if (
            p.gravityDirection ===
            1
        ) {

            if (
                currentBottom >=
                    CONFIG.groundY &&
                previousBottom <=
                    CONFIG.groundY + 25 &&
                p.velocityY >= 0
            ) {

                p.y =
                    CONFIG.groundY -
                    p.size;

                p.velocityY =
                    0;

                p.grounded =
                    true;
            }

        } else {

            if (
                p.y <= 0
            ) {

                p.y =
                    0;

                p.velocityY =
                    0;

                p.grounded =
                    true;
            }
        }

        for (
            const object
            of GAME.level.objects
        ) {

            if (
                object.type !==
                    "block" &&
                object.type !==
                    "platform"
            ) {

                continue;
            }

            if (
                !rectsOverlap(
                    p.x,
                    p.y,
                    p.size,
                    p.size,
                    object.x,
                    object.y,
                    object.w,
                    object.h
                )
            ) {

                continue;
            }

            if (
                p.gravityDirection ===
                1
            ) {

                if (
                    previousBottom <=
                        object.y + 15 &&
                    p.velocityY >= 0
                ) {

                    p.y =
                        object.y -
                        p.size;

                    p.velocityY =
                        0;

                    p.grounded =
                        true;

                } else {

                    die();

                    return;
                }

            } else {

                const bottom =
                    object.y +
                    object.h;

                if (
                    p.y >=
                        bottom - 15 &&
                    p.velocityY <= 0
                ) {

                    p.y =
                        bottom;

                    p.velocityY =
                        0;

                    p.grounded =
                        true;

                } else {

                    die();

                    return;
                }
            }
        }
    }

    /* =====================================================
       OBJECT COLLISIONS
    ===================================================== */

    function handleWorldObjects() {

        const p =
            GAME.player;

        for (
            const object
            of GAME.level.objects
        ) {

            const width =
                object.w ||
                60;

            if (
                object.x >
                    p.x + 250 ||
                object.x +
                    width <
                    p.x - 150
            ) {

                continue;
            }

            if (
                object.type ===
                "spike"
            ) {

                if (
                    rectsOverlap(
                        p.x + 7,
                        p.y + 7,
                        p.size - 14,
                        p.size - 14,
                        object.x,
                        object.y,
                        object.w,
                        object.h
                    )
                ) {

                    die();

                    return;
                }
            }

            if (
                object.type ===
                "coin"
            ) {

                if (
                    GAME.collectedCoins.has(
                        object.id
                    )
                ) {

                    continue;
                }

                if (
                    circleRectCollision(
                        object.x,
                        object.y,
                        17,
                        p.x,
                        p.y,
                        p.size,
                        p.size
                    )
                ) {

                    collectCoin(
                        object
                    );
                }
            }

            if (
                object.type ===
                "speed"
            ) {

                if (
                    !object.used &&
                    rectsOverlap(
                        p.x,
                        p.y,
                        p.size,
                        p.size,
                        object.x,
                        object.y,
                        60,
                        120
                    )
                ) {

                    object.used =
                        true;

                    GAME.speed =
                        GAME.baseSpeed *
                        object.value;

                    burst(
                        p.x,
                        p.y,
                        "#f59e0b"
                    );

                    beep(
                        700,
                        0.05
                    );
                }
            }

            if (
                object.type ===
                "finish"
            ) {

                if (
                    rectsOverlap(
                        p.x,
                        p.y,
                        p.size,
                        p.size,
                        object.x,
                        object.y,
                        object.w,
                        object.h
                    )
                ) {

                    completeLevel();

                    return;
                }
            }
        }
    }

    /* =====================================================
       JUMP
    ===================================================== */

    function jump() {

        if (
            GAME.state !==
            "PLAYING"
        ) {

            return;
        }

        const p =
            GAME.player;

        if (!p.grounded) return;

        p.velocityY =
            -CONFIG.jumpForce *
            p.gravityDirection;

        p.grounded =
            false;

        burst(
            p.x +
                p.size / 2,
            p.y +
                p.size,
            GAME.level.color,
            10
        );

        beep(
            520,
            0.055
        );
    }

    function pressJump() {

        if (
            GAME.state ===
            "PLAYING"
        ) {

            jump();
        }
    }

    /* =====================================================
       INPUT
    ===================================================== */

    function isJumpKey(
        event
    ) {

        return (
            event.code ===
                "Space" ||
            event.code ===
                "ArrowUp" ||
            event.code ===
                "KeyW"
        );
    }

    document.addEventListener(
        "keydown",
        event => {

            if (
                isJumpKey(event)
            ) {

                event.preventDefault();

                if (
                    !GAME.input.jumpHeld
                ) {

                    GAME.input.jumpHeld =
                        true;

                    GAME.input.jumpPressed =
                        true;

                    pressJump();
                }
            }

            if (
                event.code ===
                "Escape"
            ) {

                event.preventDefault();

                if (
                    GAME.state ===
                    "PLAYING"
                ) {

                    pauseGame();

                } else if (
                    GAME.state ===
                    "PAUSED"
                ) {

                    resumeGame();
                }
            }

            if (
                event.code ===
                "KeyR"
            ) {

                if (
                    GAME.state ===
                        "PLAYING" ||
                    GAME.state ===
                        "DEAD" ||
                    GAME.state ===
                        "COMPLETE"
                ) {

                    restartLevel();
                }
            }
        }
    );

    document.addEventListener(
        "keyup",
        event => {

            if (
                isJumpKey(event)
            ) {

                GAME.input.jumpHeld =
                    false;
            }
        }
    );

    canvas.addEventListener(
        "pointerdown",
        event => {

            if (
                GAME.screen !==
                "game-screen"
            ) {

                return;
            }

            event.preventDefault();

            pressJump();
        },
        {
            passive: false
        }
    );

    const mobileAction =
        $("mobile-action");

    if (mobileAction) {

        mobileAction.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                pressJump();

            },
            {
                passive: false
            }
        );
    }

    /* Prevent page scrolling while touching game */

    document.addEventListener(
        "touchmove",
        event => {

            if (
                GAME.screen ===
                "game-screen"
            ) {

                event.preventDefault();
            }

        },
        {
            passive: false
        }
    );

    /* =====================================================
       PAUSE
    ===================================================== */

    function pauseGame() {

        if (
            GAME.state !==
            "PLAYING"
        ) {

            return;
        }

        GAME.state =
            "PAUSED";

        showOverlay(
            "pause-overlay"
        );
    }

    function resumeGame() {

        if (
            GAME.state !==
            "PAUSED"
        ) {

            return;
        }

        GAME.state =
            "PLAYING";

        const overlay =
            $("pause-overlay");

        if (overlay) {

            overlay.classList.add(
                "hidden"
            );
        }

        GAME.lastTime =
            performance.now();
    }

    /* =====================================================
       DEATH
    ===================================================== */

    function die() {

        if (
            GAME.state !==
            "PLAYING"
        ) {

            return;
        }

        GAME.state =
            "DEAD";

        GAME.shake =
            GAME.settings.shake
                ? 14
                : 0;

        burst(
            GAME.player.x,
            GAME.player.y,
            "#ff315c",
            30
        );

        beep(
            100,
            0.15
        );

        updateBestProgress(
            GAME.progress
        );

        setText(
            "death-progress",
            `${GAME.progress}%`
        );

        setText(
            "death-attempt",
            GAME.playerData
                .attempts[
                    GAME.levelId
                ] || 0
        );

        showOverlay(
            "death-overlay"
        );
    }

    /* =====================================================
       COMPLETE
    ===================================================== */

    function completeLevel() {

        if (
            GAME.state !==
            "PLAYING"
        ) {

            return;
        }

        GAME.state =
            "COMPLETE";

        GAME.progress =
            100;

        const levelId =
            GAME.levelId;

        const data =
            GAME.playerData;

        if (
            !data.completedLevels
                .includes(levelId)
        ) {

            data.completedLevels.push(
                levelId
            );

            data.completed++;

            data.stars +=
                GAME.level.stars;

            data.coins +=
                GAME.coinsCollected *
                10;
        }

        data.bestProgress[
            levelId
        ] = 100;

        data.collectedCoins[
            levelId
        ] = Array.from(
            new Set([
                ...(data.collectedCoins[
                    levelId
                ] || []),

                ...GAME.collectedCoins
            ])
        ).slice(0, 3);

        updateAchievementProgress();

        savePlayerData();

        updateAllStats();

        setText(
            "complete-attempts",
            data.attempts[
                levelId
            ] || 0
        );

        setText(
            "complete-coins",
            `${GAME.coinsCollected} / 3`
        );

        setText(
            "complete-stars",
            GAME.level.stars
        );

        showOverlay(
            "complete-overlay"
        );

        burst(
            GAME.player.x,
            GAME.player.y,
            GAME.level.color,
            50
        );

        beep(
            900,
            0.1
        );

        setTimeout(
            () => {

                beep(
                    1200,
                    0.15
                );

            },
            100
        );
    }

    /* =====================================================
       BEST PROGRESS
    ===================================================== */

    function updateBestProgress(
        progress
    ) {

        if (!GAME.levelId) return;

        const current =
            GAME.playerData
                .bestProgress[
                    GAME.levelId
                ] || 0;

        if (
            progress >
            current
        ) {

            GAME.playerData
                .bestProgress[
                    GAME.levelId
                ] = progress;

            savePlayerData();
        }

        renderLevelList(
            document.querySelector(
                ".filter-button.active"
            )?.dataset
                .difficulty ||
            "all"
        );
    }

    /* =====================================================
       COINS
    ===================================================== */

    function collectCoin(
        object
    ) {

        GAME.collectedCoins.add(
            object.id
        );

        GAME.coinsCollected++;

        burst(
            object.x,
            object.y,
            "#ffd43b",
            15
        );

        beep(
            1000,
            0.05
        );

        updateHUD();
    }

    /* =====================================================
       ROTATION
    ===================================================== */

    function updateRotation(
        dt
    ) {

        const p =
            GAME.player;

        if (
            !p.grounded
        ) {

            p.rotation +=
                dt *
                7 *
                p.gravityDirection;

        } else {

            const target =
                Math.round(
                    p.rotation /
                    (Math.PI / 2)
                ) *
                (Math.PI / 2);

            p.rotation +=
                (
                    target -
                    p.rotation
                ) *
                Math.min(
                    1,
                    dt * 12
                );
        }
    }

    /* =====================================================
       HUD
    ===================================================== */

    function updateHUD() {

        const progressBar =
            $("game-progress-bar");

        const progressText =
            $("game-progress-text");

        if (
            progressBar
        ) {

            progressBar.style.width =
                `${GAME.progress}%`;
        }

        if (
            progressText
        ) {

            progressText.textContent =
                `${GAME.progress}%`;
        }
    }

    /* =====================================================
       CANVAS RESIZE
    ===================================================== */

    function resizeCanvas() {

        const rect =
            canvas.getBoundingClientRect();

        let width =
            rect.width;

        let height =
            rect.height;

        if (
            !width ||
            !height
        ) {

            width =
                window.innerWidth;

            height =
                window.innerHeight;
        }

        /*
          Keep the internal canvas sharp.
        */

        const dpr =
            Math.min(
                window.devicePixelRatio ||
                1,
                2
            );

        canvas.width =
            Math.floor(
                width * dpr
            );

        canvas.height =
            Math.floor(
                height * dpr
            );

        canvas.style.touchAction =
            "none";

        /*
          All game drawing uses
          a fixed 1280x720 landscape
          coordinate system.
        */

        const scaleX =
            width /
            CONFIG.logicalWidth;

        const scaleY =
            height /
            CONFIG.logicalHeight;

        const scale =
            Math.min(
                scaleX,
                scaleY
            );

        const offsetX =
            (
                width -
                CONFIG.logicalWidth *
                scale
            ) / 2;

        const offsetY =
            (
                height -
                CONFIG.logicalHeight *
                scale
            ) / 2;

        ctx.setTransform(
            dpr *
                scale,
            0,
            0,
            dpr *
                scale,
            dpr *
                offsetX,
            dpr *
                offsetY
        );
    }

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    /* =====================================================
       DRAW
    ===================================================== */

    function draw() {

        const rect =
            canvas.getBoundingClientRect();

        const width =
            rect.width ||
            window.innerWidth;

        const height =
            rect.height ||
            window.innerHeight;

        /*
          Clear using device coordinates.
        */

        ctx.save();

        ctx.setTransform(
            window.devicePixelRatio ||
            1,
            0,
            0,
            window.devicePixelRatio ||
            1,
            0,
            0
        );

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.restore();

        /*
          Restore logical landscape
          coordinate system.
        */

        resizeCanvas();

        drawBackground();

        if (!GAME.level) {

            return;
        }

        ctx.save();

        if (
            GAME.settings.shake &&
            GAME.shake > 0
        ) {

            ctx.translate(
                (
                    Math.random() -
                    0.5
                ) *
                GAME.shake,

                (
                    Math.random() -
                    0.5
                ) *
                GAME.shake
            );
        }

        drawWorld();

        ctx.restore();

        drawParticles();

        drawPlayer();
    }

    /* =====================================================
       BACKGROUND
    ===================================================== */

    function drawBackground() {

        const width =
            CONFIG.logicalWidth;

        const height =
            CONFIG.logicalHeight;

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                height
            );

        gradient.addColorStop(
            0,
            "#050516"
        );

        gradient.addColorStop(
            1,
            "#0b1027"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        if (
            !GAME.settings.background
        ) {

            return;
        }

        const color =
            GAME.level?.color ||
            "#00eaff";

        ctx.save();

        ctx.globalAlpha =
            0.16;

        const grid =
            50;

        const offsetX =
            -(
                GAME.cameraX *
                0.25
            ) %
            grid;

        ctx.strokeStyle =
            color;

        ctx.lineWidth =
            1;

        for (
            let x =
                offsetX;
            x <
                width;
            x += grid
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );

            ctx.lineTo(
                x,
                height
            );

            ctx.stroke();
        }

        for (
            let y = 0;
            y <
                height;
            y += grid
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                width,
                y
            );

            ctx.stroke();
        }

        ctx.restore();

        /*
          Background neon particles.
        */

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const x =
                (
                    i * 150 -
                    GAME.cameraX *
                        0.08
                ) %
                (
                    width + 200
                );

            const y =
                80 +
                (
                    i * 67
                ) %
                400;

            ctx.save();

            ctx.globalAlpha =
                0.15;

            ctx.fillStyle =
                color;

            ctx.beginPath();

            ctx.arc(
                x < 0
                    ? x + width + 200
                    : x,
                y,
                2 +
                    i % 4,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }
    }

    /* =====================================================
       WORLD
    ===================================================== */

    function drawWorld() {

        ctx.save();

        ctx.translate(
            -GAME.cameraX,
            0
        );

        for (
            const object
            of GAME.level.objects
        ) {

            drawObject(
                object
            );
        }

        /*
          Extra bottom world area.
        */

        ctx.fillStyle =
            "#0d1430";

        ctx.fillRect(
            GAME.cameraX,
            CONFIG.groundY,
            CONFIG.logicalWidth,
            CONFIG.logicalHeight -
                CONFIG.groundY
        );

        ctx.strokeStyle =
            GAME.level.color;

        ctx.lineWidth =
            4;

        ctx.beginPath();

        ctx.moveTo(
            GAME.cameraX,
            CONFIG.groundY
        );

        ctx.lineTo(
            GAME.cameraX +
                CONFIG.logicalWidth,
            CONFIG.groundY
        );

        ctx.stroke();

        ctx.restore();
    }

    /* =====================================================
       OBJECT DRAWING
    ===================================================== */

    function drawObject(
        object
    ) {

        const color =
            GAME.level.color ||
            "#00eaff";

        if (
            object.type ===
            "ground"
        ) {

            ctx.fillStyle =
                "#10172f";

            ctx.fillRect(
                object.x,
                object.y,
                object.w,
                object.h
            );

            ctx.strokeStyle =
                color;

            ctx.lineWidth =
                4;

            ctx.beginPath();

            ctx.moveTo(
                object.x,
                object.y
            );

            ctx.lineTo(
                object.x +
                    object.w,
                object.y
            );

            ctx.stroke();

            return;
        }

        if (
            object.type ===
                "block" ||
            object.type ===
                "platform"
        ) {

            if (
                GAME.settings.glow
            ) {

                ctx.save();

                ctx.shadowBlur =
                    18;

                ctx.shadowColor =
                    color;

                ctx.strokeStyle =
                    color;

                ctx.strokeRect(
                    object.x,
                    object.y,
                    object.w,
                    object.h
                );

                ctx.restore();
            }

            ctx.fillStyle =
                "#121a36";

            ctx.fillRect(
                object.x,
                object.y,
                object.w,
                object.h
            );

            ctx.strokeStyle =
                color;

            ctx.lineWidth =
                3;

            ctx.strokeRect(
                object.x,
                object.y,
                object.w,
                object.h
            );

            /*
              Inner pattern.
            */

            ctx.globalAlpha =
                0.18;

            ctx.strokeStyle =
                color;

            for (
                let x =
                    object.x + 15;
                x <
                    object.x +
                    object.w;
                x += 30
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    x,
                    object.y
                );

                ctx.lineTo(
                    x -
                        object.h,
                    object.y +
                        object.h
                );

                ctx.stroke();
            }

            ctx.globalAlpha =
                1;

            return;
        }

        if (
            object.type ===
            "spike"
        ) {

            ctx.save();

            ctx.beginPath();

            ctx.moveTo(
                object.x,
                object.y +
                    object.h
            );

            ctx.lineTo(
                object.x +
                    object.w / 2,
                object.y
            );

            ctx.lineTo(
                object.x +
                    object.w,
                object.y +
                    object.h
            );

            ctx.closePath();

            ctx.fillStyle =
                "#ff315c";

            if (
                GAME.settings.glow
            ) {

                ctx.shadowBlur =
                    18;

                ctx.shadowColor =
                    "#ff315c";
            }

            ctx.fill();

            ctx.restore();

            return;
        }

        if (
            object.type ===
            "coin"
        ) {

            if (
                GAME.collectedCoins.has(
                    object.id
                )
            ) {

                return;
            }

            ctx.save();

            ctx.beginPath();

            ctx.arc(
                object.x,
                object.y,
                17,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ffd43b";

            if (
                GAME.settings.glow
            ) {

                ctx.shadowBlur =
                    20;

                ctx.shadowColor =
                    "#ffd43b";
            }

            ctx.fill();

            ctx.shadowBlur =
                0;

            ctx.strokeStyle =
                "#fff2a3";

            ctx.lineWidth =
                3;

            ctx.stroke();

            ctx.restore();

            return;
        }

        if (
            object.type ===
            "speed"
        ) {

            drawPortal(
                object.x,
                object.y,
                "#f59e0b",
                ">>"
            );

            return;
        }

        if (
            object.type ===
            "finish"
        ) {

            ctx.save();

            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth =
                5;

            ctx.beginPath();

            ctx.moveTo(
                object.x,
                object.y
            );

            ctx.lineTo(
                object.x,
                object.y +
                    object.h
            );

            ctx.stroke();

            ctx.fillStyle =
                color;

            ctx.beginPath();

            ctx.moveTo(
                object.x,
                object.y
            );

            ctx.lineTo(
                object.x + 80,
                object.y + 30
            );

            ctx.lineTo(
                object.x,
                object.y + 60
            );

            ctx.closePath();

            ctx.fill();

            ctx.restore();
        }
    }

    function drawPortal(
        x,
        y,
        color,
        text
    ) {

        ctx.save();

        ctx.beginPath();

        ctx.ellipse(
            x + 30,
            y + 60,
            30,
            60,
            0,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            color;

        ctx.lineWidth =
            6;

        if (
            GAME.settings.glow
        ) {

            ctx.shadowBlur =
                22;

            ctx.shadowColor =
                color;
        }

        ctx.stroke();

        ctx.shadowBlur =
            0;

        ctx.fillStyle =
            color;

        ctx.font =
            "bold 24px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            text,
            x + 30,
            y + 60
        );

        ctx.restore();
    }

    /* =====================================================
       PLAYER
    ===================================================== */

    function drawPlayer() {

        const p =
            GAME.player;

        const screenX =
            p.x -
            GAME.cameraX;

        const screenY =
            p.y;

        /*
          Player trail.
        */

        if (
            p.trail &&
            GAME.settings.particles
        ) {

            for (
                let i = 1;
                i <= 5;
                i++
            ) {

                ctx.save();

                ctx.globalAlpha =
                    0.08 *
                    (6 - i);

                ctx.fillStyle =
                    p.color;

                ctx.fillRect(
                    screenX -
                        i * 9,
                    screenY +
                        i * 3,
                    p.size,
                    p.size
                );

                ctx.restore();
            }
        }

        ctx.save();

        ctx.translate(
            screenX +
                p.size / 2,
            screenY +
                p.size / 2
        );

        ctx.rotate(
            p.rotation
        );

        if (
            GAME.settings.glow
        ) {

            ctx.shadowBlur =
                25;

            ctx.shadowColor =
                p.color;
        }

        ctx.fillStyle =
            p.color;

        ctx.fillRect(
            -p.size / 2,
            -p.size / 2,
            p.size,
            p.size
        );

        ctx.shadowBlur =
            0;

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth =
            3;

        ctx.strokeRect(
            -p.size / 2,
            -p.size / 2,
            p.size,
            p.size
        );

        /*
          Original Neon Dash face.
        */

        ctx.fillStyle =
            "#050516";

        ctx.fillRect(
            -10,
            -9,
            20,
            18
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            -6,
            -7,
            6,
            6
        );

        ctx.fillRect(
            2,
            -7,
            6,
            6
        );

        ctx.restore();
    }

    /* =====================================================
       PARTICLES
    ===================================================== */

    function burst(
        x,
        y,
        color,
        amount = 12
    ) {

        if (
            !GAME.settings.particles
        ) {

            return;
        }

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;

            const speed =
                60 +
                Math.random() *
                240;

            GAME.particles.push({

                x,

                y,

                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed,

                life:
                    0.3 +
                    Math.random() *
                    0.5,

                maxLife:
                    0.3 +
                    Math.random() *
                    0.5,

                size:
                    2 +
                    Math.random() *
                    4,

                color
            });
        }
    }

    function updateParticles(
        dt
    ) {

        for (
            let i =
                GAME.particles.length -
                1;
            i >= 0;
            i--
        ) {

            const particle =
                GAME.particles[i];

            particle.x +=
                particle.vx *
                dt;

            particle.y +=
                particle.vy *
                dt;

            particle.vy +=
                500 *
                dt;

            particle.life -=
                dt;

            if (
                particle.life <=
                0
            ) {

                GAME.particles.splice(
                    i,
                    1
                );
            }
        }
    }

    function drawParticles() {

        for (
            const particle
            of GAME.particles
        ) {

            const alpha =
                Math.max(
                    0,
                    particle.life /
                        particle.maxLife
                );

            ctx.save();

            ctx.globalAlpha =
                alpha;

            ctx.fillStyle =
                particle.color;

            ctx.beginPath();

            ctx.arc(
                particle.x -
                    GAME.cameraX,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }
    }

    /* =====================================================
       COLLISION HELPERS
    ===================================================== */

    function rectsOverlap(
        ax,
        ay,
        aw,
        ah,
        bx,
        by,
        bw,
        bh
    ) {

        return (

            ax <
                bx + bw &&

            ax + aw >
                bx &&

            ay <
                by + bh &&

            ay + ah >
                by
        );
    }

    function circleRectCollision(
        cx,
        cy,
        radius,
        rx,
        ry,
        rw,
        rh
    ) {

        const closestX =
            Math.max(
                rx,
                Math.min(
                    cx,
                    rx + rw
                )
            );

        const closestY =
            Math.max(
                ry,
                Math.min(
                    cy,
                    ry + rh
                )
            );

        const dx =
            cx -
            closestX;

        const dy =
            cy -
            closestY;

        return (
            dx * dx +
            dy * dy <
            radius * radius
        );
    }

    /* =====================================================
       AUDIO
    ===================================================== */

    let audioContext =
        null;

    function getAudioContext() {

        if (!audioContext) {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContext) {

                return null;
            }

            audioContext =
                new AudioContext();
        }

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();
        }

        return audioContext;
    }

    function beep(
        frequency,
        duration
    ) {

        if (
            !GAME.soundEnabled ||
            GAME.settings.soundVolume <=
                0
        ) {

            return;
        }

        const audio =
            getAudioContext();

        if (!audio) return;

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();

        oscillator.type =
            "square";

        oscillator.frequency.value =
            frequency;

        gain.gain.value =
            Math.min(
                0.08,
                GAME.settings
                    .soundVolume /
                    1000
            );

        oscillator.connect(
            gain
        );

        gain.connect(
            audio.destination
        );

        oscillator.start();

        gain.gain
            .exponentialRampToValueAtTime(
                0.001,
                audio.currentTime +
                    duration
            );

        oscillator.stop(
            audio.currentTime +
                duration
        );
    }

    /* =====================================================
       STATS / PLAYER UI
    ===================================================== */

    function updateAllStats() {

        const data =
            GAME.playerData;

        setText(
            "coin-counter",
            data.coins
        );

        setText(
            "diamond-counter",
            data.diamonds
        );

        setText(
            "star-counter",
            data.stars
        );

        setText(
            "completed-counter",
            data.completed
        );

        setText(
            "created-counter",
            data.created
        );

        setText(
            "profile-username",
            data.username
        );

        setText(
            "profile-stars",
            data.stars
        );

        setText(
            "profile-coins",
            data.coins
        );

        setText(
            "profile-diamonds",
            data.diamonds
        );

        setText(
            "profile-creator-points",
            data.creatorPoints
        );

        setText(
            "shop-coins",
            data.coins
        );

        setText(
            "menu-username",
            data.username
        );
    }

    function setText(
        id,
        value
    ) {

        const element =
            $(id);

        if (element) {

            element.textContent =
                value;
        }
    }

    /* =====================================================
       ACHIEVEMENTS
    ===================================================== */

    const ACHIEVEMENTS = [

        {
            id: "first-step",

            condition:
                () =>
                    GAME.playerData
                        .completed >=
                    1
        },

        {
            id: "collector",

            condition:
                () =>
                    GAME.playerData
                        .coins >=
                    100
        },

        {
            id: "speedrunner",

            condition:
                () =>
                    Object.values(
                        GAME.playerData
                            .bestProgress
                    ).some(
                        value =>
                            value >= 100
                    )
        },

        {
            id: "creator",

            condition:
                () =>
                    GAME.playerData
                        .created >=
                    1
        },

        {
            id: "master",

            condition:
                () =>
                    GAME.playerData
                        .completed >=
                    50
        },

        {
            id: "perfect-run",

            condition:
                () =>
                    Object.values(
                        GAME.playerData
                            .bestProgress
                    ).some(
                        value =>
                            value >= 100
                    )
        }
    ];

    function updateAchievementProgress() {

        const cards =
            document.querySelectorAll(
                ".achievement-card"
            );

        cards.forEach(
            (
                card,
                index
            ) => {

                const achievement =
                    ACHIEVEMENTS[
                        index
                    ];

                if (!achievement)
                    return;

                const unlocked =
                    achievement.condition();

                if (
                    unlocked
                ) {

                    GAME.playerData
                        .achievements[
                            achievement.id
                        ] = true;

                    card.classList.add(
                        "unlocked"
                    );

                    const progress =
                        card.querySelector(
                            ".achievement-progress"
                        );

                    if (
                        progress
                    ) {

                        progress.textContent =
                            "COMPLETE";
                    }
                }
            }
        );

        savePlayerData();
    }

    /* =====================================================
       SETTINGS
    ===================================================== */

    function setupSettings() {

        const checkboxSettings = {

            "setting-progress":
                "progress",

            "setting-shake":
                "shake",

            "setting-practice":
                "practice",

            "setting-particles":
                "particles",

            "setting-glow":
                "glow",

            "setting-background":
                "background"
        };

        Object.entries(
            checkboxSettings
        ).forEach(
            (
                [id, key]
            ) => {

                const input =
                    $(id);

                if (!input)
                    return;

                input.checked =
                    GAME.settings[key];

                input.addEventListener(
                    "change",
                    () => {

                        GAME.settings[
                            key
                        ] =
                            input.checked;

                        saveSettings();
                    }
                );
            }
        );

        const musicVolume =
            $("music-volume");

        const soundVolume =
            $("sound-volume");

        if (
            musicVolume
        ) {

            musicVolume.value =
                GAME.settings
                    .musicVolume;

            musicVolume.addEventListener(
                "input",
                () => {

                    GAME.settings
                        .musicVolume =
                        Number(
                            musicVolume.value
                        );

                    saveSettings();
                }
            );
        }

        if (
            soundVolume
        ) {

            soundVolume.value =
                GAME.settings
                    .soundVolume;

            soundVolume.addEventListener(
                "input",
                () => {

                    GAME.settings
                        .soundVolume =
                        Number(
                            soundVolume.value
                        );

                    saveSettings();
                }
            );
        }
    }

    /* =====================================================
       AUDIO BUTTONS
    ===================================================== */

    function setupAudioButtons() {

        const musicButton =
            $("music-button");

        const soundButton =
            $("sound-button");

        if (
            musicButton
        ) {

            musicButton.addEventListener(
                "click",
                () => {

                    GAME.musicEnabled =
                        !GAME.musicEnabled;

                    notify(
                        GAME.musicEnabled
                            ? "Music ON"
                            : "Music OFF"
                    );
                }
            );
        }

        if (
            soundButton
        ) {

            soundButton.addEventListener(
                "click",
                () => {

                    GAME.soundEnabled =
                        !GAME.soundEnabled;

                    GAME.settings
                        .soundVolume =
                        GAME.soundEnabled
                            ? 80
                            : 0;

                    saveSettings();

                    notify(
                        GAME.soundEnabled
                            ? "Sound ON"
                            : "Sound OFF"
                    );
                }
            );
        }
    }

    /* =====================================================
       DAILY
    ===================================================== */

    function setupDaily() {

        const button =
            document.querySelector(
                '[data-action="daily"]'
            );

        if (!button) return;

        button.addEventListener(
            "click",
            () => {

                startLevel(
                    4,
                    false
                );
            }
        );
    }

    /* =====================================================
       NAVIGATION
    ===================================================== */

    function setupNavigation() {

        document
            .querySelectorAll(
                "[data-screen]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            const target =
                                button
                                    .dataset
                                    .screen;

                            if (
                                target &&
                                $(target)
                            ) {

                                showScreen(
                                    target
                                );
                            }
                        }
                    );
                }
            );

        const back =
            $("back-button");

        if (
            back
        ) {

            back.addEventListener(
                "click",
                () => {

                    if (
                        GAME.screen ===
                        "game-screen"
                    ) {

                        exitLevel();

                        return;
                    }

                    if (
                        GAME.screen ===
                        "level-details"
                    ) {

                        showScreen(
                            "level-select"
                        );

                        return;
                    }

                    showScreen(
                        "main-menu"
                    );
                }
            );
        }
    }

    /* =====================================================
       LEVEL BUTTONS
    ===================================================== */

    function setupLevelButtons() {

        const play =
            $("play-level-button");

        const practice =
            $("practice-level-button");

        if (
            play
        ) {

            play.addEventListener(
                "click",
                () => {

                    startLevel(
                        GAME.levelId,
                        false
                    );
                }
            );
        }

        if (
            practice
        ) {

            practice.addEventListener(
                "click",
                () => {

                    if (
                        !GAME.settings
                            .practice
                    ) {

                        notify(
                            "Practice is disabled"
                        );

                        return;
                    }

                    startLevel(
                        GAME.levelId,
                        true
                    );
                }
            );
        }
    }

    /* =====================================================
       GAME BUTTONS
    ===================================================== */

    function setupGameButtons() {

        const pause =
            $("pause-button");

        const resume =
            $("resume-button");

        const restart =
            $("restart-button");

        const exit =
            $("exit-level-button");

        const deathRetry =
            $("death-retry-button");

        const deathMenu =
            $("death-menu-button");

        const completeReplay =
            $("complete-replay-button");

        const completeMenu =
            $("complete-menu-button");

        if (
            pause
        ) {

            pause.addEventListener(
                "click",
                pauseGame
            );
        }

        if (
            resume
        ) {

            resume.addEventListener(
                "click",
                resumeGame
            );
        }

        if (
            restart
        ) {

            restart.addEventListener(
                "click",
                () => {

                    hideOverlays();

                    restartLevel();
                }
            );
        }

        if (
            exit
        ) {

            exit.addEventListener(
                "click",
                exitLevel
            );
        }

        if (
            deathRetry
        ) {

            deathRetry.addEventListener(
                "click",
                () => {

                    hideOverlays();

                    restartLevel();
                }
            );
        }

        if (
            deathMenu
        ) {

            deathMenu.addEventListener(
                "click",
                () => {

                    hideOverlays();

                    showScreen(
                        "level-select"
                    );
                }
            );
        }

        if (
            completeReplay
        ) {

            completeReplay.addEventListener(
                "click",
                () => {

                    hideOverlays();

                    restartLevel();
                }
            );
        }

        if (
            completeMenu
        ) {

            completeMenu.addEventListener(
                "click",
                () => {

                    hideOverlays();

                    showScreen(
                        "level-select"
                    );
                }
            );
        }
    }

    function exitLevel() {

        hideOverlays();

        stopGameLoop();

        GAME.state =
            "MENU";

        if (
            GAME.levelId
        ) {

            openLevelDetails(
                GAME.levelId
            );

        } else {

            showScreen(
                "level-select"
            );
        }
    }

    /* =====================================================
       DIFFICULTY FILTERS
    ===================================================== */

    function setupDifficultyFilters() {

        document
            .querySelectorAll(
                ".filter-button"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            document
                                .querySelectorAll(
                                    ".filter-button"
                                )
                                .forEach(
                                    b =>
                                        b.classList
                                            .remove(
                                                "active"
                                            )
                                );

                            button.classList.add(
                                "active"
                            );

                            renderLevelList(
                                button.dataset
                                    .difficulty
                            );
                        }
                    );
                }
            );
    }

    /* =====================================================
       ONLINE SEARCH
    ===================================================== */

    function setupOnlineSearch() {

        const search =
            $("level-search");

        if (!search)
            return;

        search.addEventListener(
            "input",
            () => {

                const query =
                    search.value
                        .trim()
                        .toLowerCase();

                document
                    .querySelectorAll(
                        ".online-level-card"
                    )
                    .forEach(
                        card => {

                            const text =
                                card.textContent
                                    .toLowerCase();

                            card.style.display =
                                !query ||
                                text.includes(
                                    query
                                )
                                    ? ""
                                    : "none";
                        }
                    );
            }
        );
    }

    /* =====================================================
       SHOP
    ===================================================== */

    function setupShop() {

        document
            .querySelectorAll(
                ".shop-item"
            )
            .forEach(
                item => {

                    item.addEventListener(
                        "click",
                        () => {

                            if (
                                item.classList
                                    .contains(
                                        "owned"
                                    )
                            ) {

                                notify(
                                    "Already owned"
                                );

                                return;
                            }

                            const text =
                                item.textContent;

                            const match =
                                text.match(
                                    /(\d+)\s*COINS/i
                                );

                            const price =
                                match
                                    ? Number(
                                        match[1]
                                    )
                                    : 0;

                            if (
                                GAME.playerData
                                    .coins <
                                price
                            ) {

                                notify(
                                    `You need ${price} coins`
                                );

                                return;
                            }

                            GAME.playerData
                                .coins -=
                                price;

                            GAME.playerData
                                .ownedItems
                                .push(
                                    item.dataset
                                        .item ||
                                    item.textContent
                                        .trim()
                                );

                            item.classList.add(
                                "owned"
                            );

                            const span =
                                item.querySelector(
                                    "span"
                                );

                            if (
                                span
                            ) {

                                span.textContent =
                                    "OWNED";
                            }

                            savePlayerData();

                            updateAllStats();

                            notify(
                                "Item purchased"
                            );
                        }
                    );
                }
            );
    }

    /* =====================================================
       RESET SAVE
    ===================================================== */

    function setupReset() {

        const button =
            $("reset-save");

        if (!button)
            return;

        button.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Reset all Neon Dash player data?"
                    );

                if (!confirmed)
                    return;

                localStorage.removeItem(
                    CONFIG.saveKey
                );

                localStorage.removeItem(
                    CONFIG.settingsKey
                );

                location.reload();
            }
        );
    }

    /* =====================================================
       EDITOR
    ===================================================== */

    function setupEditor() {

        const editorCanvas =
            $("editor-canvas");

        if (!editorCanvas)
            return;

        const editorCtx =
            editorCanvas.getContext(
                "2d"
            );

        function resizeEditor() {

            const rect =
                editorCanvas
                    .getBoundingClientRect();

            const dpr =
                Math.min(
                    window.devicePixelRatio ||
                    1,
                    2
                );

            editorCanvas.width =
                Math.max(
                    320,
                    rect.width *
                        dpr
                );

            editorCanvas.height =
                Math.max(
                    300,
                    rect.height *
                        dpr
                );

            editorCtx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

            drawEditor();
        }

        function drawEditor() {

            const rect =
                editorCanvas
                    .getBoundingClientRect();

            const w =
                Math.max(
                    320,
                    rect.width
                );

            const h =
                Math.max(
                    300,
                    rect.height
                );

            editorCtx.clearRect(
                0,
                0,
                w,
                h
            );

            editorCtx.fillStyle =
                "#080b1c";

            editorCtx.fillRect(
                0,
                0,
                w,
                h
            );

            editorCtx.strokeStyle =
                "rgba(0,234,255,.12)";

            for (
                let x = 0;
                x < w;
                x += 40
            ) {

                editorCtx.beginPath();

                editorCtx.moveTo(
                    x,
                    0
                );

                editorCtx.lineTo(
                    x,
                    h
                );

                editorCtx.stroke();
            }

            for (
                let y = 0;
                y < h;
                y += 40
            ) {

                editorCtx.beginPath();

                editorCtx.moveTo(
                    0,
                    y
                );

                editorCtx.lineTo(
                    w,
                    y
                );

                editorCtx.stroke();
            }

            for (
                const object
                of GAME.editor.objects
            ) {

                editorCtx.fillStyle =
                    object.type ===
                    "spike"
                        ? "#ff315c"
                        : "#00eaff";

                editorCtx.fillRect(
                    object.x,
                    object.y,
                    object.w ||
                        40,
                    object.h ||
                        40
                );
            }
        }

        function addEditorObject(
            type
        ) {

            GAME.editor.history.push(
                JSON.stringify(
                    GAME.editor.objects
                )
            );

            GAME.editor.future =
                [];

            GAME.editor.objects.push({

                type,

                x:
                    100 +
                    GAME.editor.objects
                        .length *
                    50,

                y: 400,

                w: 40,

                h: 40
            });

            drawEditor();
        }

        document
            .querySelectorAll(
                ".editor-category"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            document
                                .querySelectorAll(
                                    ".editor-category"
                                )
                                .forEach(
                                    b =>
                                        b.classList
                                            .remove(
                                                "active"
                                            )
                                );

                            button.classList.add(
                                "active"
                            );

                            const text =
                                button.textContent
                                    .trim()
                                    .toLowerCase();

                            if (
                                text.includes(
                                    "hazard"
                                )
                            ) {

                                addEditorObject(
                                    "spike"
                                );

                            } else if (
                                text.includes(
                                    "coin"
                                )
                            ) {

                                addEditorObject(
                                    "coin"
                                );

                            } else {

                                addEditorObject(
                                    "block"
                                );
                            }
                        }
                    );
                }
            );

        const undo =
            $("editor-undo");

        const redo =
            $("editor-redo");

        if (undo) {

            undo.addEventListener(
                "click",
                () => {

                    if (
                        !GAME.editor
                            .history
                            .length
                    ) {

                        return;
                    }

                    GAME.editor.future.push(
                        JSON.stringify(
                            GAME.editor.objects
                        )
                    );

                    GAME.editor.objects =
                        JSON.parse(
                            GAME.editor
                                .history
                                .pop()
                        );

                    drawEditor();
                }
            );
        }

        if (redo) {

            redo.addEventListener(
                "click",
                () => {

                    if (
                        !GAME.editor
                            .future
                            .length
                    ) {

                        return;
                    }

                    GAME.editor.history.push(
                        JSON.stringify(
                            GAME.editor.objects
                        )
                    );

                    GAME.editor.objects =
                        JSON.parse(
                            GAME.editor
                                .future
                                .pop()
                        );

                    drawEditor();
                }
            );
        }

        const save =
            $("editor-save");

        if (save) {

            save.addEventListener(
                "click",
                () => {

                    try {

                        localStorage.setItem(
                            "neonDashEditor",
                            JSON.stringify(
                                GAME.editor
                                    .objects
                            )
                        );

                        GAME.playerData
                            .created++;

                        GAME.playerData
                            .creatorPoints +=
                            10;

                        GAME.playerData
                            .createdLevels
                            .push({
                                id:
                                    Date.now(),
                                objects:
                                    GAME.editor
                                        .objects
                            });

                        savePlayerData();

                        updateAllStats();

                        notify(
                            "Level saved"
                        );

                    } catch (_) {

                        notify(
                            "Could not save level"
                        );
                    }
                }
            );
        }

        const test =
            $("editor-test");

        if (test) {

            test.addEventListener(
                "click",
                () => {

                    notify(
                        "Editor test ready"
                    );
                }
            );
        }

        const play =
            $("editor-play");

        if (play) {

            play.addEventListener(
                "click",
                () => {

                    startLevel(
                        1,
                        false
                    );
                }
            );
        }

        window.addEventListener(
            "resize",
            resizeEditor
        );

        resizeEditor();
    }

    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function init() {

        loadSettings();

        loadPlayerData();

        setupLandscape();

        setupNavigation();

        setupLevelButtons();

        setupGameButtons();

        setupDifficultyFilters();

        setupSettings();

        setupAudioButtons();

        setupDaily();

        setupOnlineSearch();

        setupShop();

        setupReset();

        setupEditor();

        renderLevelList(
            "all"
        );

        updateAllStats();

        updateAchievementProgress();

        resizeCanvas();

        showScreen(
            "main-menu"
        );

        notify(
            "Welcome to Neon Dash"
        );

        console.log(
            "Neon Dash initialized successfully."
        );

        console.log(
            "Player data:",
            GAME.playerData
        );
    }

    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();
    }

})();
