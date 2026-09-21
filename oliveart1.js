// ==========================================
// OLIVE AI ART ENGINE
// oliveart1.js
// OLIVE ART v0.3.1
// ==========================================

function generateOliveArt(prompt) {
    prompt = String(prompt || "").toLowerCase().trim();

    // ------------------------------------------
    // CANVAS
    // ------------------------------------------

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    // Keep the pixel-art look
    canvas.style.width = "384px";
    canvas.style.height = "384px";
    canvas.style.imageRendering = "pixelated";

    // ------------------------------------------
    // SEEDED RANDOM
    // ------------------------------------------

    let seed = 0;

    for (let i = 0; i < prompt.length; i++) {
        seed = ((seed << 5) - seed) + prompt.charCodeAt(i);
        seed |= 0;
    }

    function rand() {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
    }

    function chance(amount) {
        return rand() < amount;
    }

    // ------------------------------------------
    // HELPERS
    // ------------------------------------------

    function has(word) {
        return prompt.includes(word);
    }

    function hasAny(words) {
        return words.some(word => prompt.includes(word));
    }

    function rect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(
            Math.floor(x),
            Math.floor(y),
            Math.max(1, Math.floor(w)),
            Math.max(1, Math.floor(h))
        );
    }

    function circle(x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    function line(x1, y1, x2, y2, color, width = 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // ------------------------------------------
    // PROMPT CATEGORIES
    // ------------------------------------------

    const isNight = hasAny([
        "night",
        "dark",
        "midnight"
    ]);

    const isSpace = hasAny([
        "space",
        "galaxy",
        "cosmos",
        "universe"
    ]);

    const isOcean = hasAny([
        "ocean",
        "sea",
        "underwater",
        "water"
    ]);

    const isBeach = hasAny([
        "beach",
        "shore",
        "island"
    ]);

    const isForest = hasAny([
        "forest",
        "woods",
        "woodland",
        "jungle"
    ]);

    const isDesert = hasAny([
        "desert",
        "sand",
        "dunes"
    ]);

    const isSnow = hasAny([
        "snow",
        "ice",
        "winter",
        "frozen"
    ]);

    const isFire = hasAny([
        "fire",
        "flame",
        "flames"
    ]);

    const isVolcano = hasAny([
        "volcano",
        "volcanic",
        "lava"
    ]);

    const isSunset = hasAny([
        "sunset",
        "sunrise",
        "dusk",
        "dawn"
    ]);

    const isRain = hasAny([
        "rain",
        "rainy",
        "storm",
        "stormy"
    ]);

    const isCity = hasAny([
        "city",
        "urban",
        "skyscraper",
        "building",
        "buildings"
    ]);

    const isLandscape = hasAny([
        "landscape",
        "scenery",
        "nature"
    ]);

    // FIXED:
    // This variable was missing in v0.3.
    const isMountain = hasAny([
        "mountain",
        "mountains",
        "hill",
        "hills"
    ]);

    // ------------------------------------------
    // SUBJECTS / OBJECTS
    // ------------------------------------------

    const isCat = hasAny([
        "cat",
        "kitten"
    ]);

    const isDog = hasAny([
        "dog",
        "puppy"
    ]);

    const isAnimal = hasAny([
        "animal",
        "creature",
        "beast"
    ]);

    const isRobot = hasAny([
        "robot",
        "android",
        "machine"
    ]);

    const isHuman = hasAny([
        "human",
        "person",
        "people",
        "knight",
        "warrior"
    ]);

    const isCar = hasAny([
        "car",
        "vehicle",
        "truck"
    ]);

    const isRocket = hasAny([
        "rocket",
        "spaceship",
        "space ship"
    ]);

    const isUFO = hasAny([
        "ufo",
        "flying saucer",
        "alien ship"
    ]);

    const isCastle = hasAny([
        "castle",
        "fortress"
    ]);

    const isHouse = hasAny([
        "house",
        "home",
        "cabin"
    ]);

    const isComputer = hasAny([
        "computer",
        "pc",
        "laptop",
        "monitor"
    ]);

    const isSword = hasAny([
        "sword",
        "blade"
    ]);

    const isFlower = hasAny([
        "flower",
        "flowers"
    ]);

    const isMushroom = hasAny([
        "mushroom",
        "mushrooms"
    ]);

    const isSkull = hasAny([
        "skull",
        "skeleton"
    ]);

    const isPortal = hasAny([
        "portal",
        "gateway",
        "gate"
    ]);

    const isHeart = hasAny([
        "heart",
        "love",
        "cute"
    ]);

    const isPlanet = hasAny([
        "planet",
        "world"
    ]);

    // ------------------------------------------
    // COLOR THEMES
    // ------------------------------------------

    let skyTop = "#18233f";
    let skyBottom = "#526d8f";
    let groundColor = "#31452e";

    if (isNight) {
        skyTop = "#070b24";
        skyBottom = "#18245c";
        groundColor = "#111827";
    }

    if (isSpace) {
        skyTop = "#02020b";
        skyBottom = "#090d28";
        groundColor = "#080817";
    }

    if (isSunset) {
        skyTop = "#492b68";
        skyBottom = "#e47b62";
        groundColor = "#4d342e";
    }

    if (isDesert) {
        skyTop = "#d98c58";
        skyBottom = "#f2c27d";
        groundColor = "#c78b4b";
    }

    if (isOcean || isBeach) {
        skyTop = "#4b91c2";
        skyBottom = "#9bd2df";
        groundColor = "#d9bd78";
    }

    if (isForest) {
        skyTop = "#172d35";
        skyBottom = "#5a8b72";
        groundColor = "#233d27";
    }

    if (isSnow) {
        skyTop = "#718ca4";
        skyBottom = "#d9edf2";
        groundColor = "#d9e5e8";
    }

    if (isFire || isVolcano) {
        skyTop = "#230b12";
        skyBottom = "#8c3021";
        groundColor = "#291817";
    }

    if (isCity) {
        skyTop = isNight ? "#070a18" : "#56677c";
        skyBottom = isNight ? "#20284a" : "#9eabb7";
        groundColor = "#252525";
    }

    // ------------------------------------------
    // SKY GRADIENT
    // ------------------------------------------

    const gradient = ctx.createLinearGradient(0, 0, 0, 128);
    gradient.addColorStop(0, skyTop);
    gradient.addColorStop(1, skyBottom);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    // ------------------------------------------
    // ATMOSPHERE
    // ------------------------------------------

    if (isRain) {
        for (let i = 0; i < 80; i++) {
            const x = rand() * 128;
            const y = rand() * 100;

            line(
                x,
                y,
                x - 2,
                y + 7,
                "rgba(180,220,255,0.55)",
                1
            );
        }
    }

    // ------------------------------------------
    // CLOUDS
    // ------------------------------------------

    if (!isSpace) {
        const cloudCount = isNight ? 2 : 4;

        for (let i = 0; i < cloudCount; i++) {
            const x = rand() * 115;
            const y = 15 + rand() * 30;

            const cloudColor = isNight
                ? "#26304d"
                : "#d9e4e8";

            rect(x, y + 4, 22, 5, cloudColor);
            rect(x + 4, y, 9, 8, cloudColor);
            rect(x + 11, y + 2, 10, 7, cloudColor);
        }
    }

    // ------------------------------------------
    // SUN
    // ------------------------------------------

    if (!isNight && !isSpace && !isRain) {
        const sunColor = isSunset
            ? "#ffd36b"
            : "#fff1a6";

        circle(103, 23, 10, sunColor);

        if (isSunset) {
            circle(103, 23, 6, "#ffe08a");
        }
    }

    // ------------------------------------------
    // MOON
    // ------------------------------------------

    if (isNight) {
        circle(100, 23, 10, "#f5f0c8");

        circle(104, 19, 10, skyTop);
    }

    // ------------------------------------------
    // STARS
    // ------------------------------------------

    if (isNight || isSpace) {
        const starCount = isSpace ? 70 : 35;

        for (let i = 0; i < starCount; i++) {
            const x = rand() * 128;
            const y = rand() * 75;
            const size = chance(0.15) ? 2 : 1;

            rect(
                x,
                y,
                size,
                size,
                chance(0.25)
                    ? "#fff5b8"
                    : "#ffffff"
            );
        }
    }

    // ------------------------------------------
    // GALAXY
    // ------------------------------------------

    if (isSpace || has("galaxy")) {
        for (let i = 0; i < 45; i++) {
            const x = 45 + rand() * 55;
            const y = 20 + rand() * 55;

            circle(
                x,
                y,
                chance(0.2) ? 2 : 1,
                chance(0.5)
                    ? "#b9a7ff"
                    : "#ffffff"
            );
        }

        for (let i = 0; i < 10; i++) {
            line(
                50 + rand() * 45,
                30 + rand() * 35,
                80 + rand() * 30,
                25 + rand() * 45,
                "rgba(150,130,255,0.15)",
                2
            );
        }
    }

    // ------------------------------------------
    // PLANET
    // ------------------------------------------

    if (isPlanet) {
        const px = 94;
        const py = 57;
        const pr = 19;

        circle(px, py, pr, "#596bb5");

        circle(px - 5, py - 5, 8, "#7184d1");

        circle(px + 7, py + 4, 6, "#40518d");

        // Planet ring
        ctx.strokeStyle = "#d7c6ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(px, py, 29, 8, -0.15, 0, Math.PI * 2);
        ctx.stroke();
    }

    // ------------------------------------------
    // DISTANT MOUNTAINS
    // ------------------------------------------

    if (
        isLandscape ||
        isForest ||
        isDesert ||
        isSnow ||
        isHouse ||
        isCastle ||
        isCity ||
        isOcean ||
        isBeach ||
        isMountain
    ) {
        ctx.fillStyle = isSnow
            ? "#aebfc8"
            : "#38495a";

        ctx.beginPath();

        ctx.moveTo(0, 78);

        for (let x = 0; x <= 128; x += 16) {
            const height = 15 + rand() * 25;

            ctx.lineTo(
                x,
                78 - height
            );

            ctx.lineTo(
                x + 8,
                78
            );
        }

        ctx.lineTo(128, 90);
        ctx.lineTo(0, 90);
        ctx.closePath();
        ctx.fill();

        // Snow caps
        if (isSnow || chance(0.35)) {
            ctx.fillStyle = "#e7f3f4";

            for (let i = 0; i < 5; i++) {
                const x = rand() * 120 + 4;
                const y = 45 + rand() * 20;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 5, y + 7);
                ctx.lineTo(x - 5, y + 7);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    // ------------------------------------------
    // GROUND
    // ------------------------------------------

    if (!isOcean && !isSpace) {
        const groundY = isCity
            ? 92
            : 84;

        rect(
            0,
            groundY,
            128,
            128 - groundY,
            groundColor
        );
    }

    // ------------------------------------------
    // DESERT
    // ------------------------------------------

    if (isDesert) {
        for (let i = 0; i < 9; i++) {
            const x = rand() * 128;
            const y = 88 + rand() * 35;

            ctx.strokeStyle = "#dca968";
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.arc(
                x,
                y,
                8 + rand() * 10,
                Math.PI,
                Math.PI * 2
            );
            ctx.stroke();
        }

        // Cacti
        for (let i = 0; i < 5; i++) {
            const x = 10 + rand() * 108;
            const y = 75 + rand() * 25;

            rect(x, y, 4, 20, "#397046");
            rect(x - 5, y + 7, 5, 3, "#397046");
            rect(x - 5, y + 4, 3, 6, "#397046");
            rect(x + 4, y + 10, 5, 3, "#397046");
            rect(x + 6, y + 7, 3, 6, "#397046");
        }
    }

    // ------------------------------------------
    // FOREST
    // ------------------------------------------

    if (isForest) {
        for (let i = 0; i < 14; i++) {
            const x = rand() * 128;
            const y = 60 + rand() * 25;

            const trunk = "#503c2c";

            rect(x, y, 4, 24, trunk);

            circle(
                x + 2,
                y - 2,
                10 + rand() * 5,
                chance(0.5)
                    ? "#285d38"
                    : "#347347"
            );

            circle(
                x - 3,
                y + 3,
                6,
                "#285d38"
            );

            circle(
                x + 8,
                y + 3,
                6,
                "#3d7d4a"
            );
        }
    }

    // ------------------------------------------
    // OCEAN
    // ------------------------------------------

    if (isOcean) {
        const oceanY = isBeach ? 80 : 65;

        rect(
            0,
            oceanY,
            128,
            128 - oceanY,
            "#236b9a"
        );

        for (let i = 0; i < 25; i++) {
            const x = rand() * 128;
            const y = oceanY + rand() * 45;

            line(
                x,
                y,
                x + 4 + rand() * 8,
                y,
                "#63b4cc",
                1
            );
        }

        if (isBeach) {
            rect(
                0,
                78,
                128,
                7,
                "#e4ca84"
            );
        }
    }

    // ------------------------------------------
    // SNOW
    // ------------------------------------------

    if (isSnow) {
        rect(
            0,
            85,
            128,
            43,
            "#dfecef"
        );

        for (let i = 0; i < 50; i++) {
            const x = rand() * 128;
            const y = rand() * 128;

            rect(
                x,
                y,
                1 + chance(0.15),
                1 + chance(0.15),
                "#ffffff"
            );
        }
    }

    // ------------------------------------------
    // VOLCANO
    // ------------------------------------------

    if (isVolcano) {
        ctx.fillStyle = "#241b1d";

        ctx.beginPath();
        ctx.moveTo(35, 100);
        ctx.lineTo(62, 51);
        ctx.lineTo(94, 100);
        ctx.closePath();
        ctx.fill();

        // Lava opening
        rect(57, 54, 12, 4, "#ff6a1a");

        // Lava
        line(63, 58, 63, 82, "#ff5a18", 3);
        line(62, 69, 57, 79, "#ff8b1c", 2);
        line(66, 72, 72, 84, "#ff8b1c", 2);

        // Smoke
        for (let i = 0; i < 8; i++) {
            circle(
                63 + (rand() - 0.5) * 25,
                42 - rand() * 22,
                3 + rand() * 4,
                "rgba(45,45,50,0.7)"
            );
        }
    }

    // ------------------------------------------
    // FIRE
    // ------------------------------------------

    if (isFire) {
        for (let i = 0; i < 15; i++) {
            const x = 25 + rand() * 78;
            const y = 82 - rand() * 28;

            circle(
                x,
                y,
                3 + rand() * 3,
                chance(0.5)
                    ? "#ff7a18"
                    : "#ffd34d"
            );
        }

        // Main fire
        ctx.fillStyle = "#ff6a18";

        ctx.beginPath();
        ctx.moveTo(64, 108);
        ctx.lineTo(43, 83);
        ctx.lineTo(55, 88);
        ctx.lineTo(53, 65);
        ctx.lineTo(65, 80);
        ctx.lineTo(72, 60);
        ctx.lineTo(80, 84);
        ctx.lineTo(90, 75);
        ctx.lineTo(85, 108);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffd34d";

        ctx.beginPath();
        ctx.moveTo(64, 105);
        ctx.lineTo(55, 87);
        ctx.lineTo(64, 91);
        ctx.lineTo(68, 77);
        ctx.lineTo(76, 91);
        ctx.lineTo(74, 105);
        ctx.closePath();
        ctx.fill();
    }

    // ------------------------------------------
    // CITY
    // ------------------------------------------

    if (isCity) {
        const buildings = [
            [5, 58, 18, 35],
            [26, 45, 17, 48],
            [46, 62, 13, 31],
            [62, 37, 22, 56],
            [87, 51, 15, 42],
            [105, 42, 18, 51]
        ];

        for (const b of buildings) {
            const [x, y, w, h] = b;

            rect(
                x,
                y,
                w,
                h,
                chance(0.5)
                    ? "#333b4a"
                    : "#454d5b"
            );

            // Windows
            for (let wy = y + 5; wy < y + h - 3; wy += 8) {
                for (let wx = x + 3; wx < x + w - 2; wx += 6) {
                    if (chance(0.7)) {
                        rect(
                            wx,
                            wy,
                            2,
                            3,
                            isNight
                                ? "#f5d66d"
                                : "#a9c7d2"
                        );
                    }
                }
            }
        }

        // Road
        rect(0, 113, 128, 15, "#202020");

        line(0, 120, 128, 120, "#e3d17b", 1);

        for (let x = 5; x < 128; x += 18) {
            rect(x, 119, 8, 2, "#e3d17b");
        }
    }

    // ------------------------------------------
    // HOUSE
    // ------------------------------------------

    if (isHouse) {
        rect(43, 72, 43, 35, "#8c5c42");

        // Roof
        ctx.fillStyle = "#51353a";

        ctx.beginPath();
        ctx.moveTo(36, 74);
        ctx.lineTo(65, 49);
        ctx.lineTo(92, 74);
        ctx.closePath();
        ctx.fill();

        // Door
        rect(60, 87, 10, 20, "#3c2925");

        circle(68, 97, 1, "#e4c96a");

        // Windows
        rect(49, 82, 9, 9, "#8ed0d6");
        rect(74, 82, 9, 9, "#8ed0d6");

        line(53, 82, 53, 91, "#52646b");
        line(49, 86, 58, 86, "#52646b");

        line(78, 82, 78, 91, "#52646b");
        line(74, 86, 83, 86, "#52646b");
    }

    // ------------------------------------------
    // CASTLE
    // ------------------------------------------

    if (isCastle) {
        // Main building
        rect(38, 60, 52, 48, "#707582");

        // Towers
        rect(26, 47, 17, 61, "#656b79");
        rect(85, 47, 17, 61, "#656b79");

        // Tower tops
        ctx.fillStyle = "#444957";

        ctx.beginPath();
        ctx.moveTo(24, 48);
        ctx.lineTo(34, 34);
        ctx.lineTo(45, 48);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(83, 48);
        ctx.lineTo(94, 34);
        ctx.lineTo(104, 48);
        ctx.closePath();
        ctx.fill();

        // Center roof
        ctx.beginPath();
        ctx.moveTo(48, 61);
        ctx.lineTo(65, 43);
        ctx.lineTo(82, 61);
        ctx.closePath();
        ctx.fill();

        // Windows
        rect(33, 62, 5, 9, "#a7d7dc");
        rect(92, 62, 5, 9, "#a7d7dc");

        rect(61, 64, 8, 10, "#9bcbd1");

        // Door
        rect(59, 88, 12, 20, "#382b2b");

        // Flag
        line(65, 43, 65, 24, "#332d35", 2);

        ctx.fillStyle = "#8c3d58";

        ctx.beginPath();
        ctx.moveTo(66, 25);
        ctx.lineTo(80, 29);
        ctx.lineTo(66, 34);
        ctx.closePath();
        ctx.fill();
    }

    // ------------------------------------------
    // CAT
    // ------------------------------------------

    if (isCat) {
        const x = 65;
        const y = 94;

        // Body
        circle(x, y + 7, 13, "#d6a16c");

        // Head
        circle(x, y - 7, 11, "#d6a16c");

        // Ears
        ctx.fillStyle = "#d6a16c";

        ctx.beginPath();
        ctx.moveTo(x - 9, y - 12);
        ctx.lineTo(x - 7, y - 24);
        ctx.lineTo(x - 1, y - 15);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 1, y - 15);
        ctx.lineTo(x + 7, y - 24);
        ctx.lineTo(x + 9, y - 12);
        ctx.closePath();
        ctx.fill();

        // Eyes
        rect(x - 6, y - 9, 3, 3, "#202020");
        rect(x + 3, y - 9, 3, 3, "#202020");

        // Nose
        rect(x - 1, y - 4, 3, 2, "#8d4f61");

        // Tail
        line(
            x + 10,
            y + 5,
            x + 22,
            y - 3,
            "#d6a16c",
            4
        );
    }

    // ------------------------------------------
    // DOG
    // ------------------------------------------

    if (isDog) {
        const x = 65;
        const y = 94;

        circle(x, y + 7, 14, "#a66f48");
        circle(x, y - 7, 11, "#a66f48");

        // Ears
        ctx.fillStyle = "#70442e";

        ctx.beginPath();
        ctx.moveTo(x - 8, y - 11);
        ctx.lineTo(x - 15, y - 4);
        ctx.lineTo(x - 10, y + 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 8, y - 11);
        ctx.lineTo(x + 15, y - 4);
        ctx.lineTo(x + 10, y + 2);
        ctx.closePath();
        ctx.fill();

        // Eyes
        rect(x - 5, y - 9, 3, 3, "#111111");
        rect(x + 3, y - 9, 3, 3, "#111111");

        // Nose
        circle(x, y - 3, 3, "#191919");

        // Tail
        line(
            x + 11,
            y + 7,
            x + 23,
            y,
            "#a66f48",
            4
        );
    }

    // ------------------------------------------
    // ROBOT
    // ------------------------------------------

    if (isRobot) {
        const x = 64;
        const y = 82;

        // Body
        rect(x - 14, y, 28, 30, "#8b939e");

        // Head
        rect(x - 15, y - 25, 30, 24, "#aab2bc");

        // Antenna
        line(x, y - 25, x, y - 35, "#aab2bc", 2);
        circle(x, y - 38, 3, "#ff5d5d");

        // Eyes
        rect(x - 9, y - 18, 6, 6, "#6ce8d0");
        rect(x + 3, y - 18, 6, 6, "#6ce8d0");

        // Mouth
        rect(x - 7, y - 7, 14, 3, "#353a40");

        // Chest
        rect(x - 7, y + 7, 14, 10, "#39434e");

        // Chest light
        circle(
            x,
            y + 12,
            3,
            "#73e4d3"
        );

        // Arms
        rect(x - 22, y + 3, 8, 22, "#777f89");
        rect(x + 14, y + 3, 8, 22, "#777f89");

        // Legs
        rect(x - 10, y + 30, 8, 15, "#686f78");
        rect(x + 2, y + 30, 8, 15, "#686f78");
    }

    // ------------------------------------------
    // HUMAN / KNIGHT
    // ------------------------------------------

    if (isHuman) {
        const x = 64;

        // Body
        rect(x - 10, 77, 20, 28, "#435b82");

        // Head
        circle(x, 67, 10, "#d59a6c");

        // Hair / helmet
        if (has("knight") || has("warrior")) {
            rect(x - 11, 56, 22, 8, "#626976");
            rect(x - 9, 54, 18, 5, "#777e8d");
            rect(x + 6, 63, 8, 5, "#4b505c");
        } else {
            rect(x - 8, 56, 16, 5, "#3b2927");
        }

        // Eyes
        rect(x - 5, 66, 2, 2, "#222222");
        rect(x + 3, 66, 2, 2, "#222222");

        // Legs
        rect(x - 8, 105, 7, 15, "#303b50");
        rect(x + 1, 105, 7, 15, "#303b50");

        // Arms
        rect(x - 17, 80, 7, 22, "#435b82");
        rect(x + 10, 80, 7, 22, "#435b82");
    }

    // ------------------------------------------
    // CAR
    // ------------------------------------------

    if (isCar) {
        const y = 100;

        rect(32, y, 65, 15, "#c94d4d");

        rect(43, y - 10, 35, 11, "#c94d4d");

        // Windows
        ctx.fillStyle = "#8fc4d0";

        ctx.beginPath();
        ctx.moveTo(47, y - 8);
        ctx.lineTo(59, y - 8);
        ctx.lineTo(59, y - 1);
        ctx.lineTo(48, y - 1);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(62, y - 8);
        ctx.lineTo(74, y - 8);
        ctx.lineTo(78, y - 1);
        ctx.lineTo(62, y - 1);
        ctx.closePath();
        ctx.fill();

        // Wheels
        circle(45, y + 15, 8, "#202020");
        circle(84, y + 15, 8, "#202020");

        circle(45, y + 15, 3, "#888888");
        circle(84, y + 15, 3, "#888888");

        // Lights
        rect(31, y + 4, 4, 4, "#ffd76a");
        rect(93, y + 4, 4, 4, "#ff6868");
    }

    // ------------------------------------------
    // ROCKET
    // ------------------------------------------

    if (isRocket) {
        const x = 64;

        // Nose
        ctx.fillStyle = "#d4d9df";

        ctx.beginPath();
        ctx.moveTo(x, 28);
        ctx.lineTo(x - 13, 55);
        ctx.lineTo(x + 13, 55);
        ctx.closePath();
        ctx.fill();

        // Body
        rect(x - 13, 53, 26, 42, "#c8cdd4");

        // Window
        circle(x, 66, 7, "#5fa9c4");
        circle(x, 0 + 66, 3, "#9fe1ef");

        // Fins
        ctx.fillStyle = "#b64b4b";

        ctx.beginPath();
        ctx.moveTo(x - 13, 80);
        ctx.lineTo(x - 24, 98);
        ctx.lineTo(x - 13, 94);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 13, 80);
        ctx.lineTo(x + 24, 98);
        ctx.lineTo(x + 13, 94);
        ctx.closePath();
        ctx.fill();

        // Fire
        ctx.fillStyle = "#ff8a1f";

        ctx.beginPath();
        ctx.moveTo(x - 9, 94);
        ctx.lineTo(x, 114);
        ctx.lineTo(x + 9, 94);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffe15a";

        ctx.beginPath();
        ctx.moveTo(x - 4, 94);
        ctx.lineTo(x, 108);
        ctx.lineTo(x + 4, 94);
        ctx.closePath();
        ctx.fill();
    }

    // ------------------------------------------
    // UFO
    // ------------------------------------------

    if (isUFO) {
        // Dome
        circle(64, 69, 13, "#7bb8c7");

        // Saucer
        ctx.fillStyle = "#8b929d";

        ctx.beginPath();
        ctx.ellipse(64, 77, 34, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lights
        const lights = [
            [43, 78],
            [53, 81],
            [64, 83],
            [75, 81],
            [85, 78]
        ];

        for (const [x, y] of lights) {
            circle(
                x,
                y,
                2,
                "#7dffbf"
            );
        }
    }

    // ------------------------------------------
    // SWORD
    // ------------------------------------------

    if (isSword) {
        const x = 65;

        // Blade
        ctx.fillStyle = "#dce7ed";

        ctx.beginPath();
        ctx.moveTo(x, 38);
        ctx.lineTo(x - 6, 91);
        ctx.lineTo(x + 6, 91);
        ctx.closePath();
        ctx.fill();

        // Blade shine
        line(
            x,
            44,
            x - 2,
            83,
            "#ffffff",
            1
        );

        // Guard
        rect(x - 16, 90, 32, 4, "#d3a24e");

        // Handle
        rect(x - 3, 94, 6, 15, "#68422f");

        // Pommel
        circle(x, 111, 4, "#d3a24e");
    }

    // ------------------------------------------
    // FLOWERS
    // ------------------------------------------

    if (isFlower) {
        for (let i = 0; i < 12; i++) {
            const x = 5 + rand() * 118;
            const y = 105 + rand() * 18;

            line(
                x,
                y,
                x,
                y - 8,
                "#4d8a45",
                2
            );

            const flowerColor = [
                "#ff8da1",
                "#ffd45e",
                "#c28cff",
                "#ffffff"
            ][Math.floor(rand() * 4)];

            circle(x, y - 10, 3, flowerColor);
            circle(x + 3, y - 10, 2, flowerColor);
            circle(x - 3, y - 10, 2, flowerColor);
            circle(x, y - 13, 2, flowerColor);
            circle(x, y - 7, 2, flowerColor);

            circle(x, y - 10, 1, "#ffd75e");
        }
    }

    // ------------------------------------------
    // MUSHROOMS
    // ------------------------------------------

    if (isMushroom) {
        for (let i = 0; i < 7; i++) {
            const x = 10 + rand() * 108;
            const y = 95 + rand() * 20;

            rect(
                x - 2,
                y,
                5,
                10,
                "#e5c49a"
            );

            circle(
                x,
                y,
                7,
                chance(0.5)
                    ? "#d95757"
                    : "#9d65c7"
            );

            circle(
                x - 2,
                y - 2,
                1,
                "#ffffff"
            );

            circle(
                x + 3,
                y - 1,
                1,
                "#ffffff"
            );
        }
    }

    // ------------------------------------------
    // SKULL
    // ------------------------------------------

    if (isSkull) {
        // Head
        circle(64, 70, 20, "#d8d2bd");

        // Jaw
        rect(52, 79, 24, 13, "#d8d2bd");

        // Eyes
        circle(57, 68, 6, "#202020");
        circle(71, 68, 6, "#202020");

        // Nose
        ctx.fillStyle = "#202020";

        ctx.beginPath();
        ctx.moveTo(64, 70);
        ctx.lineTo(60, 77);
        ctx.lineTo(68, 77);
        ctx.closePath();
        ctx.fill();

        // Teeth
        for (let x = 55; x <= 73; x += 5) {
            rect(x, 82, 3, 6, "#ffffff");
        }
    }

    // ------------------------------------------
    // PORTAL
    // ------------------------------------------

    if (isPortal) {
        ctx.strokeStyle = "#b56cff";
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.ellipse(
            64,
            77,
            24,
            34,
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();

        ctx.strokeStyle = "#6d39b8";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.ellipse(
            64,
            77,
            17,
            27,
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();

        ctx.fillStyle = "#1b0b35";

        ctx.beginPath();
        ctx.ellipse(
            64,
            77,
            14,
            24,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Portal particles
        for (let i = 0; i < 18; i++) {
            circle(
                64 + (rand() - 0.5) * 55,
                77 + (rand() - 0.5) * 65,
                1 + rand() * 2,
                "#d69aff"
            );
        }
    }

    // ------------------------------------------
    // HEART
    // ------------------------------------------

    if (isHeart) {
        ctx.fillStyle = "#ef5572";

        circle(57, 72, 10, "#ef5572");
        circle(71, 72, 10, "#ef5572");

        ctx.beginPath();
        ctx.moveTo(48, 76);
        ctx.lineTo(64, 101);
        ctx.lineTo(80, 76);
        ctx.closePath();
        ctx.fill();

        // Shine
        rect(55, 68, 4, 4, "#ffb3c0");
    }

    // ------------------------------------------
    // GENERIC CREATURE
    // ------------------------------------------

    if (
        isAnimal &&
        !isCat &&
        !isDog &&
        !isRobot &&
        !isHuman
    ) {
        const x = 64;
        const y = 88;

        circle(x, y, 20, "#7c8fd6");

        // Ears
        ctx.fillStyle = "#7c8fd6";

        ctx.beginPath();
        ctx.moveTo(x - 12, y - 13);
        ctx.lineTo(x - 19, y - 28);
        ctx.lineTo(x - 3, y - 18);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 12, y - 13);
        ctx.lineTo(x + 19, y - 28);
        ctx.lineTo(x + 3, y - 18);
        ctx.closePath();
        ctx.fill();

        // Eyes
        circle(x - 7, y - 3, 4, "#202020");
        circle(x + 7, y - 3, 4, "#202020");

        // Mouth
        line(
            x - 6,
            y + 9,
            x + 6,
            y + 9,
            "#202020",
            2
        );
    }

    // ------------------------------------------
    // GENERIC FALLBACK
    // ------------------------------------------

    const hasRecognizedSubject =
        isCat ||
        isDog ||
        isAnimal ||
        isRobot ||
        isHuman ||
        isCar ||
        isRocket ||
        isUFO ||
        isCastle ||
        isHouse ||
        isComputer ||
        isSword ||
        isFlower ||
        isMushroom ||
        isSkull ||
        isPortal ||
        isHeart ||
        isPlanet ||
        isCity ||
        isForest ||
        isDesert ||
        isOcean ||
        isBeach ||
        isVolcano ||
        isFire ||
        isMountain;

    if (!hasRecognizedSubject) {
        // Abstract pixel-art scene

        for (let i = 0; i < 25; i++) {
            const x = rand() * 128;
            const y = 50 + rand() * 70;
            const size = 2 + rand() * 8;

            const colors = [
                "#8b78d8",
                "#62b7b4",
                "#e18a73",
                "#e5c45c",
                "#6f89c7"
            ];

            rect(
                x,
                y,
                size,
                size,
                colors[Math.floor(rand() * colors.length)]
            );
        }

        // Central abstract shape
        ctx.fillStyle = "#8d6ed1";

        ctx.beginPath();
        ctx.moveTo(64, 40);
        ctx.lineTo(88, 72);
        ctx.lineTo(72, 105);
        ctx.lineTo(42, 91);
        ctx.lineTo(36, 61);
        ctx.closePath();
        ctx.fill();

        circle(
            64,
            72,
            12,
            "#d5a7ff"
        );
    }

    // ------------------------------------------
    // COMPUTER
    // ------------------------------------------

    if (isComputer) {
        // Monitor
        rect(38, 48, 52, 38, "#777f88");

        rect(43, 53, 42, 27, "#172c3b");

        // Screen glow
        rect(47, 57, 34, 19, "#234b59");

        // Screen lines
        for (let i = 0; i < 5; i++) {
            rect(
                49,
                59 + i * 3,
                10 + rand() * 20,
                1,
                "#62d1c3"
            );
        }

        // Stand
        rect(59, 86, 10, 8, "#737b84");
        rect(51, 94, 26, 4, "#737b84");

        // Keyboard
        rect(42, 100, 44, 10, "#636b74");

        for (let x = 45; x < 83; x += 5) {
            rect(
                x,
                103,
                3,
                2,
                "#aab0b6"
            );
        }
    }

    // ------------------------------------------
    // PIXEL LIGHTING
    // ------------------------------------------

    const lighting = ctx.createLinearGradient(
        0,
        0,
        128,
        128
    );

    lighting.addColorStop(
        0,
        "rgba(255,255,255,0.08)"
    );

    lighting.addColorStop(
        0.5,
        "rgba(255,255,255,0)"
    );

    lighting.addColorStop(
        1,
        "rgba(0,0,0,0.15)"
    );

    ctx.fillStyle = lighting;
    ctx.fillRect(0, 0, 128, 128);

    // ------------------------------------------
    // VIGNETTE
    // ------------------------------------------

    const vignette = ctx.createRadialGradient(
        64,
        64,
        35,
        64,
        64,
        90
    );

    vignette.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    vignette.addColorStop(
        1,
        "rgba(0,0,0,0.22)"
    );

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 128, 128);

    // ------------------------------------------
    // PIXEL BORDER
    // ------------------------------------------

    ctx.strokeStyle = "#151515";
    ctx.lineWidth = 3;

    ctx.strokeRect(
        1.5,
        1.5,
        125,
        125
    );

    // ------------------------------------------
    // RETURN ART
    // ------------------------------------------

    return canvas;
}