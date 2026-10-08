
/*
 * OLIVE ART v0.4.0
 * Procedural pixel-art generator
 * Internal resolution: 128 × 128
 *
 * Usage:
 *   const art = generateOliveArt("a red robot in a neon city");
 *   if (art) document.body.appendChild(art);
 *
 * Unsupported prompt:
 *   generateOliveArt("a dragon riding a bicycle") -> null
 *
 * This is a procedural renderer, not a neural image model.
 */

"use strict";

function generateOliveArt(input) {
    const SIZE = 128;

    const prompt = String(input ?? "")
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();

    generateOliveArt.lastError = "";

    if (!prompt) {
        generateOliveArt.lastError = "Enter a prompt first.";
        return null;
    }

    const words = prompt.match(/[\p{L}\p{N}]+/gu) || [];

    const stopWords = new Set([
        "a", "an", "the", "of", "in", "on", "at", "by", "for",
        "with", "and", "or", "to", "from", "under", "over",
        "behind", "beside", "near", "inside", "around", "through",
        "above", "below", "into", "against", "between", "upon",
        "is", "are", "was", "be", "make", "draw", "create",
        "generate", "paint", "show", "picture", "image", "art",
        "artwork", "pixel", "pixelart", "pixelated", "style",
        "of", "please", "me", "my", "some", "one", "very",
        "beautiful", "pretty", "cool", "amazing", "epic", "nice",
        "little", "big", "small", "large", "tiny", "giant",
        "old", "new", "ancient", "modern", "futuristic", "retro",
        "cute", "scary", "dark", "bright", "glowing", "shiny",
        "magical", "mysterious", "peaceful", "lonely", "abandoned",
        "realistic", "fantasy", "dreamy", "surreal", "simple",
        "detailed", "colorful", "colourful", "vintage", "classic",
        "epic", "epically", "soft", "hard", "cold", "warm",
        "floating", "flying", "running", "walking", "sitting",
        "standing", "sleeping", "happy", "sad", "angry",
        "red", "blue", "green", "yellow", "orange", "purple",
        "pink", "black", "white", "gray", "grey", "brown",
        "cyan", "teal", "gold", "golden", "silver", "lime",
        "violet", "magenta", "crimson", "navy", "dark", "light",
        "brightly", "neon", "rainbow", "monochrome",
        "sunny", "starry", "stormy", "foggy", "misty", "windy",
        "rainy", "snowy", "cloudy", "clear", "moonlit",
        "sunset", "sunrise", "midnight", "daytime", "nighttime",
        "day", "night", "dawn", "dusk", "noon",
        "top", "view", "scene", "landscape", "background",
        "foreground", "environment", "world", "place", "area",
        "somewhere", "here", "there", "outdoors", "outside",
        "indoors", "inside", "underwater", "space", "outer",
        "deep", "vast", "endless", "distant", "faraway",
        "with", "without", "wearing", "holding", "carrying",
        "its", "their", "his", "her", "it", "that", "this",
        "who", "which", "what", "as", "like", "than",
        "version", "edition", "inspired", "inspiration",
        "game", "video", "concept", "design", "scene"
    ]);

    // Only recognized vocabulary is allowed.
    // This stops an unknown subject being silently replaced by scenery.
    const supportedWords = new Set([
        ...stopWords,

        // Animals and creatures
        "cat", "cats", "kitten", "kittens", "kitty", "feline",
        "dog", "dogs", "puppy", "puppies", "doggy", "canine",
        "animal", "animals", "pet", "pets", "bird", "birds",
        "fish", "shark", "whale", "turtle", "rabbit", "bunny",
        "fox", "frog", "bear", "deer", "owl", "butterfly",

        // Characters and machines
        "robot", "robots", "robotic", "droid", "mech", "android",
        "human", "person", "people", "character", "knight",
        "warrior", "astronaut", "alien", "monster", "ghost",
        "skeleton", "skull", "zombie", "vampire", "witch",
        "wizard", "pirate", "ninja", "king", "queen",
        "princess", "prince", "hero", "villain",

        // Vehicles and technology
        "car", "cars", "automobile", "vehicle", "racecar",
        "truck", "bus", "motorcycle", "bike", "bicycle",
        "train", "plane", "airplane", "helicopter", "boat",
        "ship", "submarine", "rocket", "spacecraft", "spaceship",
        "shuttle", "ufo", "uap", "saucer", "computer",
        "desktop", "laptop", "monitor", "keyboard", "phone",
        "telephone", "camera", "television", "tv", "radio",
        "console", "arcade", "server", "satellite", "drone",

        // Buildings and objects
        "castle", "citadel", "palace", "fortress", "house",
        "home", "cottage", "cabin", "mansion", "tower",
        "lighthouse", "church", "temple", "school", "factory",
        "building", "city", "town", "village", "bridge",
        "door", "window", "room", "hallway", "corridor",
        "chair", "table", "lamp", "clock", "book", "books",
        "chest", "treasure", "key", "sword", "katana", "blade",
        "saber", "shield", "axe", "staff", "wand", "crystal",
        "gem", "diamond", "crown", "ring", "bottle", "vase",
        "mug", "cup", "lamp", "lantern", "candle", "mirror",

        // Nature and fantasy objects
        "flower", "flowers", "blossom", "rose", "tulip",
        "sunflower", "tree", "trees", "pine", "palm",
        "mushroom", "mushrooms", "fern", "grass", "bush",
        "rock", "rocks", "stone", "stones", "crystal",
        "portal", "gate", "heart", "planet", "moon", "sun",
        "star", "stars", "comet", "meteor", "galaxy", "nebula",
        "earth", "mars", "saturn", "jupiter", "ringed",

        // Settings and scenery
        "ocean", "sea", "underwater", "marine", "beach",
        "shore", "island", "coral", "reef", "forest", "woods",
        "woodland", "jungle", "rainforest", "desert", "dunes",
        "snow", "snowfield", "ice", "icy", "glacier", "arctic",
        "mountain", "mountains", "hill", "hills", "peak",
        "valley", "canyon", "cliff", "waterfall", "river",
        "lake", "pond", "swamp", "marsh", "volcano", "lava",
        "fire", "flames", "flame", "smoke", "cloud", "clouds",
        "rain", "storm", "lightning", "thunder", "fog", "mist",
        "sunset", "sunrise", "sunlight", "moonlight", "night",
        "space", "cosmos", "stars", "sky", "horizon", "field",
        "meadow", "garden", "park", "graveyard", "cemetery",
        "ruins", "backrooms", "liminal", "highway", "street",
        "road", "alley", "rooftop", "skyscraper", "cityscape",
        "neon", "cyberpunk", "futuristic", "sci", "fi"
    ]);

    const unknownWords = words.filter(
        word => !supportedWords.has(word)
    );

    if (unknownWords.length > 0) {
        generateOliveArt.lastError =
            `Olive Art doesn't understand: ${unknownWords.join(", ")}.`;
        return null;
    }

    const has = (...terms) => {
        const set = new Set(words);
        return terms.some(term => set.has(term));
    };

    const hasPhrase = (...phrases) =>
        phrases.some(phrase => prompt.includes(phrase));

    const scenes = {
        space: has("space", "cosmos", "galaxy", "nebula", "planet",
            "satellite", "astronaut", "rocket", "ufo", "uap") ||
            hasPhrase("outer space", "deep space"),

        ocean: has("ocean", "sea", "underwater", "marine", "coral",
            "reef", "shark", "whale", "fish", "submarine"),

        beach: has("beach", "shore", "island", "palm"),

        forest: has("forest", "woods", "woodland", "jungle",
            "rainforest", "tree", "trees", "fern"),

        desert: has("desert", "dunes", "canyon"),

        snow: has("snow", "snowfield", "ice", "icy", "glacier",
            "arctic", "snowy"),

        fire: has("fire", "flames", "flame", "lava", "volcano",
            "smoke"),

        rain: has("rain", "storm", "lightning", "thunder",
            "rainy", "stormy"),

        city: has("city", "town", "village", "street", "road",
            "highway", "alley", "rooftop", "skyscraper",
            "cityscape", "building", "buildings", "neon",
            "cyberpunk", "factory"),

        sunset: has("sunset", "sunrise", "dawn", "dusk",
            "sunlight", "sunny"),

        mountains: has("mountain", "mountains", "hill", "hills",
            "peak", "valley", "cliff"),

        graveyard: has("graveyard", "cemetery", "ghost", "zombie"),

        ruins: has("ruins", "castle", "citadel", "fortress",
            "temple", "ancient"),

        backrooms: has("backrooms", "liminal") ||
            hasPhrase("liminal space")
    };

    const subjects = {
        cat: has("cat", "cats", "kitten", "kittens", "kitty", "feline"),
        dog: has("dog", "dogs", "puppy", "puppies", "doggy", "canine"),
        animal: has("animal", "animals", "bird", "birds", "fish",
            "shark", "whale", "turtle", "rabbit", "bunny", "fox",
            "frog", "bear", "deer", "owl", "butterfly"),
        robot: has("robot", "robots", "robotic", "droid", "mech", "android"),
        human: has("human", "person", "people", "character", "knight",
            "warrior", "astronaut", "pirate", "ninja", "king",
            "queen", "princess", "prince", "hero", "villain",
            "wizard", "witch"),
        alien: has("alien", "monster", "ghost", "skeleton", "skull",
            "zombie", "vampire"),
        car: has("car", "cars", "automobile", "vehicle", "racecar",
            "truck", "bus", "motorcycle", "bike", "bicycle"),
        plane: has("plane", "airplane", "helicopter", "drone"),
        ship: has("ship", "boat", "submarine", "train"),
        rocket: has("rocket", "spacecraft", "spaceship", "shuttle"),
        ufo: has("ufo", "uap", "saucer") ||
            hasPhrase("flying saucer"),
        castle: has("castle", "citadel", "palace", "fortress"),
        house: has("house", "home", "cottage", "cabin", "mansion"),
        computer: has("computer", "desktop", "laptop", "monitor",
            "keyboard", "server", "console", "arcade"),
        phone: has("phone", "telephone", "camera", "television", "tv", "radio"),
        sword: has("sword", "katana", "blade", "saber", "shield",
            "axe", "staff", "wand"),
        flower: has("flower", "flowers", "blossom", "rose",
            "tulip", "sunflower"),
        mushroom: has("mushroom", "mushrooms"),
        portal: has("portal", "gate"),
        heart: has("heart"),
        planet: has("planet", "earth", "mars", "saturn", "jupiter"),
        moon: has("moon", "moonlight"),
        sun: has("sun", "sunlight"),
        tree: has("tree", "trees", "pine", "palm"),
        crystal: has("crystal", "gem", "diamond"),
        lighthouse: has("lighthouse"),
        tower: has("tower", "skyscraper"),
        houseObject: has("chair", "table", "lamp", "clock", "book",
            "books", "chest", "treasure", "key", "crown", "ring",
            "bottle", "vase", "mug", "cup", "lantern", "candle", "mirror")
    };

    const hasSubject = Object.values(subjects).some(Boolean);
    const hasScene = Object.values(scenes).some(Boolean);

    // Reject prompts that contain no supported subject or scene.
    if (!hasSubject && !hasScene) {
        generateOliveArt.lastError =
            "No supported subject or scene was found in that prompt.";
        return null;
    }

    // Deterministic pseudo-random generator.
    // The same prompt produces the same artwork.
    let seed = 2166136261;

    for (let i = 0; i < prompt.length; i++) {
        seed ^= prompt.charCodeAt(i);
        seed = Math.imul(seed, 16777619);
    }

    function random() {
        seed += 0x6D2B79F5;
        let t = seed;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;

    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = false;

    const palettes = {
        space: ["#080b20", "#151b42", "#34366c", "#7779c8", "#d6c5ff"],
        ocean: ["#062e49", "#075b78", "#108da0", "#43c4c0", "#c4fff0"],
        beach: ["#f7b96b", "#e88b63", "#a95469", "#4b426b", "#fbe6a1"],
        forest: ["#101f2b", "#1d4038", "#31634a", "#67935b", "#c4d98a"],
        desert: ["#633c45", "#a85f50", "#d58b60", "#efbb7a", "#ffe0a2"],
        snow: ["#253c5b", "#496b8c", "#8db4cb", "#d1e9ed", "#ffffff"],
        fire: ["#311e38", "#722b3e", "#c84c3e", "#f28c45", "#ffe49b"],
        rain: ["#111d35", "#263d5c", "#426584", "#779db0", "#d2e7e7"],
        city: ["#11162b", "#272849", "#44365d", "#84516d", "#f3a16c"],
        sunset: ["#49305e", "#92516d", "#e17a75", "#f6b16e", "#ffe7a3"],
        mountains: ["#202e48", "#384d6a", "#617a91", "#a0b7bb", "#e4e5d1"],
        graveyard: ["#141e2c", "#263343", "#47515d", "#7d7777", "#c3b4a0"],
        ruins: ["#263a3b", "#456052", "#79836a", "#b3a47a", "#e6d5a2"],
        backrooms: ["#4e4a27", "#777340", "#a5a05a", "#d1ca86", "#f0e8ad"]
    };

    let scene = "sunset";

    for (const name of [
        "backrooms", "space", "ocean", "beach", "forest",
        "desert", "snow", "fire", "rain", "graveyard",
        "ruins", "city", "mountains", "sunset"
    ]) {
        if (scenes[name]) {
            scene = name;
            break;
        }
    }

    // Use the first recognized scene palette.
    const palette = palettes[scene];

    const C = {
        sky: palette[0],
        far: palette[1],
        mid: palette[2],
        near: palette[3],
        light: palette[4],
        black: "#10121d",
        outline: "#171a29",
        white: "#fff5df",
        shadow: "#29273d",
        red: "#e35c57",
        orange: "#f29b52",
        yellow: "#f7d66b",
        green: "#6fc48a",
        blue: "#64b9ed",
        purple: "#a78be7",
        pink: "#ef94b8",
        metal: "#aab9c9"
    };

    function rect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(x), Math.round(y),
            Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
    }

    function line(x1, y1, x2, y2, color, width = 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function outlinedRect(x, y, w, h, fill, outline = C.outline) {
        rect(x - 1, y - 1, w + 2, h + 2, outline);
        rect(x, y, w, h, fill);
    }

    function pixelCircle(cx, cy, r, color) {
        const steps = Math.max(8, Math.floor(r * 5));
        for (let i = 0; i < steps; i++) {
            const a = i / steps * Math.PI * 2;
            rect(cx + Math.cos(a) * r, cy + Math.sin(a) * r,
                Math.max(1, r / 3), Math.max(1, r / 3), color);
        }
    }

    function starfield(count, color) {
        for (let i = 0; i < count; i++) {
            const x = Math.floor(random() * SIZE);
            const y = Math.floor(random() * 78);
            const s = random() > 0.85 ? 2 : 1;
            rect(x, y, s, s, color);
        }
    }

    function cloud(x, y, scale, color) {
        rect(x + 2 * scale, y, 7 * scale, 3 * scale, color);
        rect(x, y + 2 * scale, 13 * scale, 4 * scale, color);
        rect(x + 4 * scale, y - 2 * scale, 5 * scale, 4 * scale, color);
        rect(x + 2 * scale, y + 6 * scale, 9 * scale, scale, color);
    }

    function mountain(x, base, w, h, color, snow = false) {
        for (let row = 0; row < h; row++) {
            const half = Math.floor((row / h) * w / 2);
            rect(x + Math.floor(w / 2) - half, base - h + row,
                half * 2 + 1, 1, color);
        }
        if (snow) {
            for (let i = 0; i < Math.floor(w / 4); i++) {
                rect(x + w / 2 - 2 + i, base - h + i, 2, 1, C.white);
            }
        }
    }

    function building(x, base, w, h, color, lit = true) {
        outlinedRect(x, base - h, w, h, color);
        rect(x + 2, base - h + 3, Math.max(1, w - 4), 1, C.mid);

        for (let yy = base - h + 4; yy < base - 3; yy += 6) {
            for (let xx = x + 3; xx < x + w - 2; xx += 5) {
                if (lit && random() > 0.3) {
                    rect(xx, yy, 2, 3, C.yellow);
                } else {
                    rect(xx, yy, 2, 3, C.shadow);
                }
            }
        }
    }

    function drawBackground() {
        rect(0, 0, SIZE, SIZE, C.sky);

        // Sky bands create a deliberate pixel-art gradient.
        for (let y = 0; y < 78; y += 6) {
            const index = Math.min(
                palette.length - 1,
                Math.floor(y / 78 * palette.length)
            );
            rect(0, y, SIZE, 6, palette[index]);
        }

        if (scene === "space") {
            starfield(105, "#fff1d1");

            // Nebula bands.
            rect(14, 20, 45, 3, "#483d83");
            rect(22, 23, 42, 3, "#5c438e");
            rect(31, 26, 30, 3, "#765398");
            rect(75, 42, 31, 2, "#493d83");

        } else if (scene === "ocean") {
            cloud(13, 18, 2, "#8ed8d9");
            cloud(82, 28, 1, "#b2e5de");

            for (let y = 66; y < SIZE; y += 5) {
                rect(0, y, SIZE, 2, y % 10 ? "#08738e" : "#1395a5");
            }

            for (let i = 0; i < 23; i++) {
                const x = Math.floor(random() * SIZE);
                const y = 68 + Math.floor(random() * 55);
                rect(x, y, 3 + Math.floor(random() * 7), 1, "#52d2ca");
            }

        } else if (scene === "beach") {
            rect(0, 52, SIZE, 28, "#f4c77f");
            rect(0, 80, SIZE, 48, "#d59a65");

            for (let y = 79; y < 87; y += 3) {
                rect(0, y, SIZE, 1, "#f8df9a");
            }

            pixelCircle(95, 23, 8, "#ffe9a2");
            cloud(15, 25, 1, "#ffe2bd");

        } else if (scene === "forest") {
            rect(0, 58, SIZE, 70, "#152c2b");

            for (let i = 0; i < 11; i++) {
                const x = i * 13 - 4;
                const h = 30 + Math.floor(random() * 25);
                rect(x + 4, 72 - h, 5, h, "#3c4439");
                rect(x, 67 - h, 13, 15, "#1f4b3e");
                rect(x + 2, 60 - h, 9, 13, "#2e6347");
                rect(x + 4, 54 - h, 5, 10, "#477a50");
            }

            rect(0, 104, SIZE, 24, "#203d32");
            rect(0, 112, SIZE, 16, "#31523b");

        } else if (scene === "desert") {
            pixelCircle(96, 24, 8, "#ffe1a0");
            mountain(-10, 90, 76, 25, "#b96c5c");
            mountain(50, 95, 88, 32, "#d08a62");
            rect(0, 96, SIZE, 32, "#e8b676");
            rect(0, 115, SIZE, 13, "#f3cb87");

        } else if (scene === "snow") {
            mountain(-8, 91, 85, 56, "#587a97", true);
            mountain(52, 92, 90, 62, "#789bb2", true);
            rect(0, 92, SIZE, 36, "#c9e4e8");
            rect(0, 112, SIZE, 16, "#e9f3ed");

        } else if (scene === "fire") {
            rect(0, 78, SIZE, 50, "#3a2838");
            mountain(-10, 95, 90, 52, "#532d3b");
            mountain(45, 96, 90, 43, "#733b3c");
            rect(0, 104, SIZE, 24, "#b84e3e");
            for (let i = 0; i < 15; i++) {
                rect(random() * SIZE, 80 + random() * 40, 2, 2, "#ffbd62");
            }

        } else if (scene === "rain") {
            cloud(10, 22, 2, "#4d6079");
            cloud(69, 28, 2, "#40546d");
            for (let i = 0; i < 70; i++) {
                const x = Math.floor(random() * SIZE);
                const y = Math.floor(random() * 76);
                line(x, y, x - 2, y + 5, "#739db5", 1);
            }
            rect(0, 82, SIZE, 46, "#293c53");

        } else if (scene === "city") {
            starfield(35, "#d6d8ef");
            for (let i = 0; i < 9; i++) {
                const x = i * 15 - 3;
                const w = 9 + Math.floor(random() * 5);
                const h = 25 + Math.floor(random() * 35);
                building(x, 111, w, h, i % 2 ? "#272d4c" : "#30324e");
            }
            rect(0, 111, SIZE, 17, "#181d32");
            line(0, 116, SIZE, 116, "#544568", 1);

        } else if (scene === "mountains") {
            starfield(32, "#f2e9d0");
            mountain(-12, 99, 85, 50, "#384c67");
            mountain(35, 101, 100, 57, "#566b80", true);
            rect(0, 100, SIZE, 28, "#293c50");

        } else if (scene === "graveyard") {
            pixelCircle(93, 22, 7, "#d8d9c4");
            rect(0, 89, SIZE, 39, "#26323a");

        } else if (scene === "ruins") {
            rect(0, 82, SIZE, 46, "#34473f");
            for (let i = 0; i < 6; i++) {
                rect(i * 23, 69 + (i % 2) * 7, 14, 35, "#66745f");
                rect(i * 23 - 2, 66 + (i % 2) * 7, 18, 4, "#8e9471");
            }

        } else if (scene === "backrooms") {
            rect(0, 0, SIZE, SIZE, "#aaa46a");
            rect(0, 0, SIZE, 9, "#d0ca8b");
            for (let x = 0; x < SIZE; x += 16) {
                rect(x, 0, 1, 83, "#827d4b");
            }
            for (let y = 0; y < 85; y += 14) {
                rect(0, y, SIZE, 1, "#827d4b");
            }
            // Receding hallway.
            rect(0, 84, SIZE, 44, "#827d4b");
            line(0, 84, 64, 66, "#d2cb91", 2);
            line(128, 84, 64, 66, "#d2cb91", 2);
            line(0, 128, 64, 66, "#b5ae75", 2);
            line(128, 128, 64, 66, "#b5ae75", 2);

        } else {
            pixelCircle(96, 24, 8, "#ffe7a4");
            cloud(14, 25, 1, "#c8b5c8");
            cloud(74, 38, 1, "#a38cae");
            mountain(-10, 95, 82, 38, "#5e526f");
            mountain(44, 98, 92, 33, "#403d60");
            rect(0, 98, SIZE, 30, "#303650");
        }

        // Subtle horizon haze.
        rect(0, 77, SIZE, 2, scene === "space" ? "#4b427e" : C.near);
    }

    function drawCat() {
        const fur = has("black") ? "#30303e" :
            has("white") ? "#f3e8d7" :
            has("orange", "ginger") ? "#e99a56" : "#a5a2af";

        // Tail
        rect(76, 76, 5, 12, fur);
        rect(72, 73, 7, 5, fur);
        rect(69, 68, 5, 7, fur);

        // Body and head
        outlinedRect(42, 71, 38, 22, fur);
        outlinedRect(42, 52, 28, 24, fur);

        // Ears
        rect(43, 45, 7, 10, fur);
        rect(57, 45, 7, 10, fur);
        rect(45, 48, 3, 5, "#d9788e");
        rect(59, 48, 3, 5, "#d9788e");

        // Face
        rect(48, 61, 4, 4, "#2d2939");
        rect(60, 61, 4, 4, "#2d2939");
        rect(54, 67, 4, 3, "#e98fa3");
        line(56, 69, 56, 72, "#443340");
        line(56, 71, 51, 73, "#443340");
        line(56, 71, 61, 73, "#443340");

        // Paws
        rect(45, 89, 10, 5, "#d9c9bd");
        rect(66, 89, 10, 5, "#d9c9bd");

        // Highlights
        rect(45, 74, 12, 2, "#ffffff");
        rect(46, 55, 6, 2, "#ffffff");
    }

    function drawDog() {
        const fur = has("brown", "orange", "golden") ?
            "#c98552" : "#c8b9a2";

        outlinedRect(39, 68, 43, 25, fur);
        outlinedRect(42, 51, 30, 25, fur);

        // Ears
        rect(39, 54, 7, 15, "#8d604d");
        rect(68, 54, 7, 15, "#8d604d");

        // Snout
        outlinedRect(48, 65, 23, 12, "#ead3ad");
        rect(56, 67, 5, 4, "#302b32");
        rect(50, 58, 4, 4, "#292b35");
        rect(63, 58, 4, 4, "#292b35");

        // Collar
        rect(43, 77, 30, 4, "#d95760");
        rect(55, 80, 5, 5, "#f5d66b");

        rect(44, 90, 12, 5, "#ead3ad");
        rect(67, 90, 12, 5, "#ead3ad");
        rect(45, 71, 8, 2, "#ffffff");
    }

    function drawRobot() {
        // Feet and legs
        outlinedRect(40, 91, 16, 9, "#5f7799");
        outlinedRect(69, 91, 16, 9, "#5f7799");
        rect(45, 80, 6, 14, "#8ca6c2");
        rect(73, 80, 6, 14, "#8ca6c2");

        // Arms
        outlinedRect(28, 58, 12, 25, "#7287a5");
        outlinedRect(86, 58, 12, 25, "#7287a5");
        rect(29, 78, 10, 6, "#d1d9e3");
        rect(87, 78, 10, 6, "#d1d9e3");

        // Body
        outlinedRect(39, 54, 47, 33, "#94a9c0");
        rect(43, 58, 39, 4, "#d5e1e9");
        outlinedRect(51, 65, 24, 15, "#263a51");
        rect(55, 69, 5, 5, C.blue);
        rect(66, 69, 5, 5, C.green);

        // Head
        outlinedRect(43, 30, 39, 26, "#aebdce");
        rect(48, 35, 29, 15, "#25384c");
        rect(51, 39, 7, 6, C.blue);
        rect(67, 39, 7, 6, C.blue);
        rect(59, 47, 8, 2, "#d3e3ef");

        // Antenna
        rect(61, 24, 3, 7, "#aebdce");
        rect(58, 21, 9, 4, C.red);

        // Panel lights
        rect(46, 73, 2, 5, C.yellow);
        rect(78, 73, 2, 5, C.red);
    }

    function drawHuman() {
        const skin = has("brown", "dark") ? "#a96d4e" : "#e7b38c";
        const outfit = has("red") ? C.red :
            has("blue") ? "#4878b8" : "#48516f";

        // Legs
        outlinedRect(47, 81, 12, 17, "#34384d");
        outlinedRect(65, 81, 12, 17, "#34384d");
        rect(43, 95, 18, 5, "#20263a");
        rect(63, 95, 18, 5, "#20263a");

        // Body and arms
        outlinedRect(43, 55, 38, 29, outfit);
        rect(35, 58, 9, 23, outfit);
        rect(80, 58, 9, 23, outfit);
        rect(35, 77, 9, 6, skin);
        rect(80, 77, 9, 6, skin);

        // Head
        outlinedRect(49, 31, 26, 26, skin);
        rect(48, 29, 28, 7, "#3b3040");
        rect(49, 34, 5, 8, "#3b3040");
        rect(69, 34, 5, 6, "#3b3040");

        rect(54, 42, 4, 4, "#302c3b");
        rect(66, 42, 4, 4, "#302c3b");
        rect(59, 49, 7, 2, "#9b514e");

        // Shirt detail
        rect(59, 58, 5, 18, "#d6d8e1");
        rect(52, 61, 19, 2, "#d6d8e1");
    }

    function drawAlien() {
        outlinedRect(43, 35, 42, 44, "#6bb99d");
        rect(47, 40, 34, 34, "#8be0ba");

        // Oversized eyes
        outlinedRect(48, 47, 12, 13, "#101b30");
        outlinedRect(68, 47, 12, 13, "#101b30");
        rect(51, 49, 5, 6, "#7ad5e7");
        rect(71, 49, 5, 6, "#7ad5e7");

        rect(58, 65, 10, 3, "#4c947f");
        rect(54, 72, 17, 2, "#4c947f");

        rect(51, 79, 7, 13, "#5caa91");
        rect(70, 79, 7, 13, "#5caa91");
        rect(46, 91, 15, 5, "#438873");
        rect(67, 91, 15, 5, "#438873");

        rect(61, 26, 3, 9, "#6bb99d");
        pixelCircle(63, 23, 3, C.pink);
    }

    function drawCar() {
        // Shadow
        rect(25, 90, 80, 5, "#20243b");

        // Wheels
        outlinedRect(36, 79, 17, 17, "#252a3b");
        outlinedRect(78, 79, 17, 17, "#252a3b");
        rect(41, 84, 7, 7, "#b5c2ca");
        rect(83, 84, 7, 7, "#b5c2ca");

        // Car silhouette
        outlinedRect(23, 66, 83, 20, has("red") ? C.red :
            has("blue") ? "#4387c1" :
            has("green") ? "#4b9c78" : "#d66d70");

        rect(40, 57, 44, 12, "#d4e1e7");
        rect(44, 60, 15, 7, "#4a627f");
        rect(62, 60, 17, 7, "#4a627f");

        rect(26, 71, 6, 4, "#ffe7a2");
        rect(98, 71, 6, 4, "#ffe7a2");
        rect(44, 70, 35, 2, "#ffffff");
    }

    function drawPlane() {
        // Wings
        outlinedRect(15, 61, 98, 9, "#aebdcb");
        rect(26, 51, 26, 14, "#d4dee5");
        rect(76, 51, 26, 14, "#d4dee5");

        // Body
        outlinedRect(23, 58, 83, 12, "#dfe6e9");
        rect(100, 61, 10, 6, "#dfe6e9");
        rect(29, 61, 4, 3, "#5e9ed3");
        rect(39, 61, 4, 3, "#5e9ed3");
        rect(49, 61, 4, 3, "#5e9ed3");
        rect(59, 61, 4, 3, "#5e9ed3");
        rect(69, 61, 4, 3, "#5e9ed3");
        rect(79, 61, 4, 3, "#5e9ed3");

        rect(26, 70, 24, 4, "#7d8fa6");
    }

    function drawShip() {
        // Hull
        outlinedRect(22, 72, 84, 15, "#d1d9df");
        rect(17, 82, 94, 7, "#8c9cab");
        rect(27, 89, 75, 3, "#607b91");

        // Deck
        outlinedRect(42, 55, 45, 18, "#a7b8c6");
        rect(49, 47, 29, 9, "#d3dce3");
        rect(53, 50, 7, 4, "#527c9c");
        rect(65, 50, 7, 4, "#527c9c");

        // Portholes
        for (let x = 32; x < 96; x += 12) {
            rect(x, 77, 4, 4, "#4b8ca6");
        }
    }

    function drawRocket() {
        // Exhaust
        rect(53, 83, 7, 17, "#f5c96e");
        rect(60, 85, 8, 19, "#f18d58");
        rect(68, 83, 7, 17, "#f5c96e");

        // Fins
        outlinedRect(42, 68, 13, 21, C.red);
        outlinedRect(73, 68, 13, 21, C.red);

        // Body
        outlinedRect(51, 34, 26, 52, "#dce5e9");
        rect(54, 39, 20, 4, "#ffffff");
        rect(55, 56, 18, 3, "#a8b9c8");

        // Nose cone
        rect(57, 26, 14, 8, C.red);
        rect(60, 22, 8, 4, C.red);
        rect(63, 18, 2, 4, C.red);

        // Window
        outlinedRect(56, 45, 16, 12, "#34435b");
        rect(59, 48, 10, 6, C.blue);
        rect(59, 48, 4, 2, "#d8f7ff");
    }

    function drawUfo() {
        // Beam
        for (let y = 63; y < 94; y += 5) {
            rect(45 - (y - 63) / 4, y, 38 + (y - 63) / 2,
                3, "#6edfe0");
        }

        // Dome
        outlinedRect(48, 39, 33, 15, "#9ce5df");
        rect(53, 35, 23, 5, "#b9fff0");
        rect(58, 32, 13, 3, "#b9fff0");

        // Saucer
        outlinedRect(27, 51, 75, 12, "#aebed0");
        rect(21, 56, 87, 4, "#dce5ed");
        rect(34, 63, 61, 3, "#617b9c");

        for (let x = 38; x < 93; x += 14) {
            rect(x, 58, 5, 2, C.yellow);
        }
    }

    function drawCastle() {
        // Walls
        outlinedRect(25, 60, 78, 37, "#a2a08e");
        rect(29, 65, 70, 5, "#c8bda0");

        // Towers
        for (const x of [19, 40, 79, 98]) {
            outlinedRect(x, 42, 12, 55, "#b8b29a");
            rect(x - 2, 39, 16, 5, "#7f877c");
            rect(x + 3, 48, 3, 7, "#3b4a57");
            rect(x + 7, 48, 3, 7, "#3b4a57");
        }

        // Battlements
        for (let x = 29; x < 99; x += 12) {
            rect(x, 55, 6, 6, "#b8b29a");
        }

        // Gate
        outlinedRect(53, 74, 23, 24, "#343a4b");
        rect(57, 78, 15, 20, "#4a4b56");
        rect(62, 83, 3, 3, C.yellow);

        // Flag
        rect(63, 26, 2, 13, "#d4d7d2");
        rect(65, 27, 12, 7, C.red);
    }

    function drawHouse() {
        // House body
        outlinedRect(31, 56, 67, 43, "#d7b98b");

        // Roof
        for (let y = 30; y < 57; y += 1) {
            const half = Math.floor((y - 30) * 1.35);
            rect(64 - half, y, half * 2, 1, "#8e4f52");
        }
        rect(28, 54, 72, 4, "#b56b5e");

        // Windows
        outlinedRect(39, 65, 16, 15, "#4b7f9a");
        outlinedRect(75, 65, 16, 15, "#4b7f9a");
        rect(46, 65, 2, 15, "#d4c9a6");
        rect(39, 71, 16, 2, "#d4c9a6");
        rect(82, 65, 2, 15, "#d4c9a6");
        rect(75, 71, 16, 2, "#d4c9a6");

        // Door
        outlinedRect(57, 76, 16, 23, "#785147");
        rect(67, 87, 2, 2, C.yellow);
    }

    function drawComputer() {
        // Desk
        rect(22, 87, 84, 6, "#886b61");
        rect(29, 93, 6, 13, "#5c4c50");
        rect(93, 93, 6, 13, "#5c4c50");

        // Monitor
        outlinedRect(34, 35, 60, 49, "#8998a8");
        rect(39, 40, 50, 37, "#18263d");

        // Screen content
        rect(43, 44, 29, 2, C.green);
        rect(43, 49, 39, 2, C.blue);
        rect(43, 54, 21, 2, C.pink);
        rect(43, 59, 35, 2, C.yellow);
        rect(43, 64, 26, 2, C.green);
        rect(43, 69, 37, 2, C.blue);

        // Stand
        rect(59, 84, 10, 5, "#8998a8");
        rect(51, 89, 26, 3, "#8998a8");

        // Keyboard
        outlinedRect(39, 94, 49, 7, "#9da9b6");
        for (let x = 42; x < 85; x += 6) {
            rect(x, 96, 3, 2, "#49556a");
        }
    }

    function drawPhone() {
        outlinedRect(42, 27, 44, 75, "#bac8d2");
        rect(46, 35, 36, 57, "#263b53");
        rect(55, 30, 18, 2, "#6d7e8c");

        // Screen illustration
        rect(50, 40, 28, 3, C.pink);
        rect(50, 47, 28, 19, "#5e8db0");
        rect(54, 51, 8, 8, "#d9c6aa");
        rect(64, 51, 10, 8, "#e7b48d");
        rect(50, 70, 28, 2, C.green);
        rect(50, 75, 20, 2, C.blue);
        rect(50, 80, 25, 2, C.yellow);

        pixelCircle(64, 97, 2, "#4a5d6c");
    }

    function drawSword() {
        // Handle
        outlinedRect(59, 79, 10, 21, "#805442");
        rect(55, 83, 18, 4, "#d4ba80");
        rect(61, 92, 6, 7, "#bd8b63");

        // Blade
        outlinedRect(58, 26, 12, 54, "#dbe6eb");
        rect(61, 28, 4, 47, "#ffffff");
        rect(54, 29, 4, 45, "#91a9c0");
        rect(62, 19, 4, 8, "#e5edf0");
        rect(61, 16, 4, 4, "#e5edf0");
    }

    function drawFlower() {
        const petal = has("red") ? "#e76b75" :
            has("blue") ? "#83a7ed" :
            has("purple") ? "#b59ae9" : "#f1a4c2";

        // Stem and leaves
        rect(62, 55, 4, 45, "#4d996b");
        rect(49, 72, 14, 5, "#65b57b");
        rect(66, 81, 14, 5, "#65b57b");
        rect(47, 69, 5, 3, "#65b57b");
        rect(77, 78, 5, 3, "#65b57b");

        // Layered petals
        rect(55, 30, 8, 11, petal);
        rect(67, 30, 8, 11, petal);
        rect(46, 39, 11, 8, petal);
        rect(73, 39, 11, 8, petal);
        rect(49, 48, 11, 8, petal);
        rect(70, 48, 11, 8, petal);
        rect(57, 53, 7, 8, petal);
        rect(65, 53, 7, 8, petal);

        outlinedRect(58, 39, 14, 14, "#e7c55f");
        rect(62, 43, 5, 5, "#8f6248");
        rect(60, 40, 3, 3, "#fff0a0");
    }

    function drawMushroom() {
        // Stem
        outlinedRect(51, 58, 26, 39, "#e8d7b9");
        rect(57, 62, 5, 27, "#fff1d5");

        // Cap
        outlinedRect(34, 38, 60, 23, "#d95e61");
        rect(39, 33, 50, 6, "#e77772");
        rect(44, 30, 39, 4, "#e77772");

        // Spots
        rect(47, 41, 7, 5, "#fff0d4");
        rect(70, 39, 8, 5, "#fff0d4");
        rect(58, 49, 6, 4, "#fff0d4");
        rect(79, 51, 5, 4, "#fff0d4");
        rect(40, 51, 5, 3, "#fff0d4");

        // Ground
        rect(33, 97, 62, 4, "#527a52");
    }

    function drawPortal() {
        // Ground shadow
        rect(26, 98, 76, 5, "#25273d");

        // Outer ring
        outlinedRect(38, 25, 52, 76, "#514b87");
        rect(33, 34, 5, 56, "#514b87");
        rect(90, 34, 5, 56, "#514b87");
        rect(43, 20, 42, 5, "#8f81c6");
        rect(43, 101, 42, 5, "#8f81c6");

        // Energy
        rect(44, 30, 40, 66, "#1e4268");
        rect(49, 35, 30, 56, "#246f91");
        rect(54, 40, 20, 46, "#4ad1d2");

        for (let i = 0; i < 17; i++) {
            const x = 47 + random() * 33;
            const y = 32 + random() * 62;
            rect(x, y, 2 + random() * 3, 2, "#d7ffff");
        }

        // Ring highlights
        rect(39, 35, 3, 21, "#b8a7f0");
        rect(86, 63, 3, 25, "#b8a7f0");
        rect(48, 22, 13, 2, "#d6d0ff");
    }

    function drawHeart() {
        const heartColor = has("blue") ? "#65a8ef" :
            has("purple") ? "#a68ae9" :
            has("black") ? "#343344" : "#e65e73";

        rect(39, 39, 18, 18, heartColor);
        rect(71, 39, 18, 18, heartColor);
        rect(31, 46, 58, 22, heartColor);
        rect(39, 64, 42, 10, heartColor);
        rect(47, 74, 26, 9, heartColor);
        rect(55, 83, 10, 8, heartColor);

        rect(42, 43, 10, 4, "#ffabb4");
        rect(75, 43, 8, 4, "#ffabb4");
    }

    function drawPlanet() {
        const planetColor = has("red", "mars") ? "#d56e59" :
            has("green", "earth") ? "#4d9e89" :
            has("purple") ? "#8c78c6" : "#5799ce";

        // Atmosphere
        pixelCircle(64, 61, 31, "#6b82b6");

        // Planet body
        pixelCircle(64, 61, 26, planetColor);

        // Surface bands
        rect(43, 48, 16, 4, "#e3a16d");
        rect(69, 55, 17, 5, "#e3a16d");
        rect(49, 68, 24, 4, "#3f739b");
        rect(57, 79, 14, 3, "#e3a16d");

        // Highlights
        rect(48, 46, 10, 4, "#b8d5e8");
        rect(44, 52, 4, 10, "#b8d5e8");

        // Orbit ring
        if (has("saturn", "ringed")) {
            rect(26, 59, 76, 3, "#e5c78f");
            rect(31, 66, 66, 3, "#e5c78f");
        }
    }

    function drawMoon() {
        pixelCircle(64, 54, 25, "#e6e3d1");
        rect(72, 32, 17, 17, C.sky);
        rect(80, 46, 11, 17, C.sky);
        rect(71, 65, 14, 13, C.sky);

        pixelCircle(51, 46, 4, "#c2c4bd");
        pixelCircle(58, 63, 3, "#c2c4bd");
        pixelCircle(72, 54, 5, "#c2c4bd");
    }

    function drawSun() {
        rect(48, 25, 32, 5, "#ffdd81");
        rect(39, 34, 50, 31, "#ffdd81");
        rect(48, 65, 32, 5, "#ffdd81");
        rect(42, 29, 44, 5, "#ffe9a5");
        rect(43, 62, 42, 5, "#ffe9a5");

        rect(55, 42, 5, 5, "#d97a58");
        rect(69, 42, 5, 5, "#d97a58");
        rect(58, 55, 13, 3, "#d97a58");
    }

    function drawTree() {
        // Trunk
        outlinedRect(57, 61, 15, 39, "#8b5c45");
        rect(61, 65, 3, 26, "#b37b51");

        // Foliage layers
        outlinedRect(41, 39, 47, 29, "#2f714e");
        rect(47, 31, 35, 11, "#3f915b");
        rect(53, 25, 23, 9, "#54a86a");
        rect(36, 46, 9, 13, "#3b8857");
        rect(83, 46, 9, 13, "#3b8857");

        // Light
        rect(49, 35, 17, 3, "#77c77a");
        rect(44, 44, 7, 5, "#77c77a");
    }

    function drawCrystal() {
        outlinedRect(49, 40, 29, 51, "#6f9dd5");
        rect(55, 30, 17, 10, "#8cc6ee");
        rect(59, 24, 9, 6, "#b4e9f8");
        rect(54, 43, 6, 39, "#b8e8ff");
        rect(62, 43, 5, 42, "#6fb4e4");
        rect(70, 44, 4, 36, "#497fb7");

        // Shards
        rect(36, 71, 10, 20, "#6e91c6");
        rect(39, 64, 4, 7, "#b5e8ff");
        rect(81, 73, 11, 18, "#6e91c6");
        rect(85, 66, 4, 7, "#b5e8ff");
    }

    function drawLighthouse() {
        // Light beams
        rect(62, 27, 56, 2, "#ffe9a0");
        rect(72, 30, 42, 2, "#ffe9a0");
        rect(0, 30, 45, 2, "#ffe9a0");

        // Base
        outlinedRect(47, 49, 35, 51, "#eee0c1");
        rect(52, 57, 25, 5, "#d55e60");
        rect(52, 70, 25, 5, "#d55e60");
        rect(52, 83, 25, 5, "#d55e60");

        // Lantern room
        outlinedRect(50, 34, 29, 16, "#3d4c60");
        rect(53, 37, 23, 8, "#ffe7a1");
        rect(45, 48, 39, 4, "#b9c6cc");

        // Roof
        rect(48, 30, 33, 4, "#a94f52");
        rect(55, 26, 19, 4, "#a94f52");
        rect(61, 21, 7, 5, "#a94f52");
    }

    function drawTower() {
        outlinedRect(45, 29, 39, 70, "#8d9a9f");
        rect(41, 27, 47, 5, "#bac4c5");

        for (let y = 39; y < 86; y += 13) {
            rect(53, y, 8, 7, "#33485e");
            rect(68, y, 8, 7, "#33485e");
        }

        rect(59, 50, 11, 49, "#6b7d87");
        rect(57, 22, 15, 5, "#a7b6bf");
        rect(62, 16, 5, 6, "#e2e8e9");
    }

    function drawHouseObject() {
        if (has("clock")) {
            outlinedRect(39, 26, 50, 75, "#b2b9bd");
            rect(45, 32, 38, 63, "#dfe4dd");
            pixelCircle(64, 57, 17, "#fff2d3");
            rect(62, 43, 4, 15, "#30394a");
            rect(64, 56, 12, 4, "#30394a");
            rect(59, 93, 10, 4, "#7d8c98");
        } else if (has("lamp", "lantern", "candle")) {
            rect(61, 46, 6, 48, "#98704f");
            outlinedRect(49, 29, 30, 20, "#e9c57c");
            rect(53, 33, 22, 12, "#ffe8a5");
            rect(59, 23, 10, 6, "#f1a55c");
            rect(62, 17, 4, 6, "#fff1b2");
            rect(48, 94, 32, 4, "#6c5361");
        } else if (has("chair")) {
            outlinedRect(41, 48, 46, 10, "#956344");
            outlinedRect(41, 55, 8, 34, "#956344");
            rect(45, 85, 5, 17, "#6d4b3d");
            rect(79, 85, 5, 17, "#6d4b3d");
            rect(46, 59, 36, 23, "#b87d51");
        } else if (has("table")) {
            outlinedRect(25, 52, 78, 11, "#b77d51");
            rect(32, 62, 8, 35, "#805640");
            rect(88, 62, 8, 35, "#805640");
        } else if (has("book", "books")) {
            outlinedRect(35, 43, 58, 47, "#9b4f54");
            rect(42, 49, 43, 34, "#e9d7b1");
            rect(46, 53, 31, 2, "#a8a080");
            rect(46, 60, 31, 2, "#a8a080");
            rect(46, 67, 25, 2, "#a8a080");
            rect(46, 74, 28, 2, "#a8a080");
            rect(39, 44, 4, 44, "#d7b76c");
        } else if (has("chest", "treasure")) {
            outlinedRect(31, 55, 66, 35, "#9b6448");
            rect(35, 59, 58, 6, "#d8a15e");
            rect(35, 77, 58, 8, "#754d42");
            outlinedRect(57, 66, 15, 13, "#e8c96e");
            rect(62, 70, 5, 6, "#77533e");
        } else if (has("key")) {
            outlinedRect(32, 43, 28, 28, "#e6c76f");
            rect(41, 51, 11, 11, "#27334b");
            rect(56, 53, 43, 9, "#e6c76f");
            rect(87, 61, 7, 13, "#e6c76f");
            rect(77, 61, 7, 8, "#e6c76f");
        } else if (has("crown")) {
            rect(33, 54, 63, 24, "#edc65e");
            rect(33, 45, 9, 14, "#edc65e");
            rect(47, 36, 9, 21, "#edc65e");
            rect(63, 30, 9, 27, "#edc65e");
            rect(79, 36, 9, 21, "#edc65e");
            rect(90, 45, 7, 14, "#edc65e");
            rect(38, 78, 54, 5, "#b47e47");
            rect(46, 60, 7, 7, C.blue);
            rect(63, 60, 7, 7, C.red);
            rect(79, 60, 7, 7, C.green);
        } else if (has("mirror")) {
            outlinedRect(39, 23, 50, 74, "#a58a63");
            rect(44, 28, 40, 64, "#507c99");
            rect(49, 34, 7, 50, "#b8dce7");
            rect(60, 34, 3, 26, "#8fc0d5");
            rect(46, 100, 36, 4, "#a58a63");
        } else {
            outlinedRect(40, 38, 48, 52, "#b9c2c7");
            rect(46, 44, 36, 40, "#e2e6e4");
            rect(50, 48, 28, 32, "#f2e8d1");
            rect(59, 52, 9, 23, "#b9c2c7");
        }
    }

    function drawGenericAnimal() {
        outlinedRect(37, 55, 54, 29, "#a7b1a7");
        outlinedRect(43, 38, 40, 25, "#c3c8ba");
        rect(50, 47, 5, 5, "#242a35");
        rect(70, 47, 5, 5, "#242a35");
        rect(57, 55, 9, 3, "#4b5554");
        rect(43, 83, 11, 12, "#a7b1a7");
        rect(72, 83, 11, 12, "#a7b1a7");
    }

    function drawSceneObject() {
        if (subjects.cat) drawCat();
        else if (subjects.dog) drawDog();
        else if (subjects.robot) drawRobot();
        else if (subjects.human) drawHuman();
        else if (subjects.alien) drawAlien();
        else if (subjects.car) drawCar();
        else if (subjects.plane) drawPlane();
        else if (subjects.ship) drawShip();
        else if (subjects.rocket) drawRocket();
        else if (subjects.ufo) drawUfo();
        else if (subjects.castle) drawCastle();
        else if (subjects.house) drawHouse();
        else if (subjects.computer) drawComputer();
        else if (subjects.phone) drawPhone();
        else if (subjects.sword) drawSword();
        else if (subjects.flower) drawFlower();
        else if (subjects.mushroom) drawMushroom();
        else if (subjects.portal) drawPortal();
        else if (subjects.heart) drawHeart();
        else if (subjects.planet) drawPlanet();
        else if (subjects.moon) drawMoon();
        else if (subjects.sun) drawSun();
        else if (subjects.tree) drawTree();
        else if (subjects.crystal) drawCrystal();
        else if (subjects.lighthouse) drawLighthouse();
        else if (subjects.tower) drawTower();
        else if (subjects.houseObject) drawHouseObject();
        else if (subjects.animal) drawGenericAnimal();
    }

    function addSceneDetails() {
        // Trees in scenes without their own foreground.
        if (["sunset", "mountains", "beach"].includes(scene)) {
            for (let i = 0; i < 5; i++) {
                const x = 4 + i * 27;
                if (scene === "beach") {
                    rect(x + 5, 63, 4, 24, "#79513d");
                    rect(x - 2, 59, 12, 3, "#367b60");
                    rect(x + 1, 54, 11, 3, "#367b60");
                    rect(x + 6, 50, 10, 3, "#367b60");
                }
            }
        }

        if (scene === "city") {
            // Street and lane markings.
            rect(0, 119, SIZE, 9, "#25283b");
            for (let x = 8; x < SIZE; x += 25) {
                rect(x, 123, 12, 2, "#e5c987");
            }
        }

        if (scene === "graveyard") {
            // Small tombstones.
            for (let i = 0; i < 5; i++) {
                const x = i * 25 + 7;
                outlinedRect(x, 79 + (i % 2) * 6, 11, 19, "#899092");
                rect(x + 4, 84 + (i % 2) * 6, 3, 7, "#59646b");
            }
        }

        if (scene === "forest") {
            for (let i = 0; i < 14; i++) {
                rect(random() * SIZE, 105 + random() * 20,
                    2 + random() * 3, 2, "#7eae6c");
            }
        }
    }

    function addLighting() {
        // Small highlight accents give forms depth without blurring pixels.
        if (scene === "space") {
            rect(0, 0, SIZE, 1, "#32345e");
        }

        // Corner vignette in discrete pixel blocks.
        rect(0, 0, SIZE, 2, "#101526");
        rect(0, 126, SIZE, 2, "#101526");
        rect(0, 0, 2, SIZE, "#101526");
        rect(126, 0, 2, SIZE, "#101526");

        rect(2, 2, 4, 1, "#171a2c");
        rect(122, 2, 4, 1, "#171a2c");
        rect(2, 125, 4, 1, "#171a2c");
        rect(122, 125, 4, 1, "#171a2c");

        // Highlight pixels.
        for (let i = 0; i < 7; i++) {
            const x = Math.floor(random() * SIZE);
            const y = Math.floor(random() * 45);
            if (scene === "space" || scene === "sunset") {
                rect(x, y, 1, 1, "#fff0cf");
            }
        }
    }

    drawBackground();
    addSceneDetails();

    if (hasSubject) {
        drawSceneObject();
    }

    addLighting();

    canvas.style.width = "384px";
    canvas.style.height = "384px";
    canvas.style.imageRendering = "pixelated";
    canvas.style.display = "block";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", `Olive Art: ${prompt}`);
    canvas.dataset.prompt = prompt;
    canvas.dataset.version = "0.4.0";

    return canvas;
}

generateOliveArt.lastError = "";