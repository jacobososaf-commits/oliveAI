// ==========================================
// OLIVE AI
// olive1.js
// OLIVE AI 1.1
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearButton");
const messages = document.getElementById("messages");


// ==========================================
// UNKNOWN RESPONSES
// ==========================================

const unknownResponses = [
    "I'm not sure about that yet. 🫒",
    "Hmm... I don't know that one. 🫒",
    "I'm still learning! 🫒",
    "I don't know how to answer that yet. 🫒",
    "That's something I haven't learned yet. 🫒"
];


// ==========================================
// GREETING RESPONSES
// ==========================================

const greetResponses = [
    "Hey! 🫒",
    "Hello! 🫒",
    "Hi there! 🫒",
    "Hey there! 🫒",
    "Yo! 🫒"
];


// ==========================================
// BRO RESPONSES
// ==========================================

const broResponses = [
    "bro 🫒",
    "Hello bro 🫒",
    "Hi bro 🫒",
    "Hey bro! 🫒",
    "Yo blud 🫒",
    "bruh 🫒"
];


// ==========================================
// RANDOM RESPONSE
// ==========================================

function randomResponse(responses) {

    return responses[
        Math.floor(
            Math.random() * responses.length
        )
    ];

}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(text, sender) {

    const div =
        document.createElement("div");

    div.className = sender;

    // Safely display text.
    div.textContent = text;

    messages.appendChild(div);

    messages.scrollTop =
        messages.scrollHeight;

}


// ==========================================
// FORMAT MATH RESULT
// ==========================================

function formatMathResult(result) {

    if (!Number.isFinite(result)) {
        return null;
    }

    if (Math.abs(result) < 1e-12) {
        result = 0;
    }

    if (
        Math.abs(
            result - Math.round(result)
        ) < 1e-12
    ) {

        return String(
            Math.round(result)
        );

    }

    return Number(
        result.toPrecision(12)
    ).toString();

}


// ==========================================
// ADVANCED MATH ENGINE
// OLIVE AI 0.9
// ==========================================

function calculateMath(expression) {

    if (
        typeof expression !== "string" ||
        expression.trim() === ""
    ) {

        return null;

    }


    // --------------------------------------
    // NORMALIZE
    // --------------------------------------

    expression =
        expression
            .toLowerCase()
            .trim();

    expression =
        expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-")
            .replace(/π/g, "pi")
            .replace(/√/g, "sqrt");

    expression =
        expression.replace(/\^/g, "**");


    // --------------------------------------
    // CONSTANTS
    // --------------------------------------

    const constants = {
        pi: Math.PI,
        e: Math.E
    };


    // --------------------------------------
    // FUNCTIONS
    // --------------------------------------

    const functions = {

        sqrt: Math.sqrt,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        abs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
        round: Math.round,
        log: Math.log10,
        ln: Math.log,
        exp: Math.exp,
        sign: Math.sign

    };


    // --------------------------------------
    // FACTORIAL
    // --------------------------------------

    function factorial(number) {

        if (!Number.isFinite(number)) {
            throw new Error(
                "Invalid factorial."
            );
        }

        if (number < 0) {
            throw new Error(
                "Factorial cannot use negative numbers."
            );
        }

        if (!Number.isInteger(number)) {
            throw new Error(
                "Factorial requires a whole number."
            );
        }

        if (number > 170) {
            throw new Error(
                "That factorial is too large."
            );
        }

        let result = 1;

        for (
            let i = 2;
            i <= number;
            i++
        ) {

            result *= i;

        }

        return result;

    }


    // --------------------------------------
    // TOKENIZER
    // --------------------------------------

    const tokens = [];

    let index = 0;

    while (
        index < expression.length
    ) {

        const char =
            expression[index];


        if (/\s/.test(char)) {

            index++;

            continue;

        }


        // ----------------------------------
        // NUMBERS
        // ----------------------------------

        if (
            /\d/.test(char) ||
            (
                char === "." &&
                /\d/.test(
                    expression[index + 1] || ""
                )
            )
        ) {

            let numberText = "";

            while (
                index < expression.length &&
                /[\d.]/.test(
                    expression[index]
                )
            ) {

                numberText +=
                    expression[index];

                index++;

            }


            // Scientific notation.

            if (
                expression[index] === "e" &&
                (
                    /\d/.test(
                        expression[index + 1] || ""
                    ) ||
                    expression[index + 1] === "+" ||
                    expression[index + 1] === "-"
                )
            ) {

                numberText += "e";

                index++;


                if (
                    expression[index] === "+" ||
                    expression[index] === "-"
                ) {

                    numberText +=
                        expression[index];

                    index++;

                }


                while (
                    index < expression.length &&
                    /\d/.test(
                        expression[index]
                    )
                ) {

                    numberText +=
                        expression[index];

                    index++;

                }

            }


            const decimalParts =
                numberText
                    .split("e")[0]
                    .split(".");


            if (
                decimalParts.length > 2
            ) {

                throw new Error(
                    "Invalid number."
                );

            }


            const value =
                Number(numberText);


            if (
                !Number.isFinite(value)
            ) {

                throw new Error(
                    "Invalid number."
                );

            }


            tokens.push({
                type: "number",
                value: value
            });

            continue;

        }


        // ----------------------------------
        // WORDS
        // ----------------------------------

        if (/[a-z]/.test(char)) {

            let word = "";

            while (
                index < expression.length &&
                /[a-z]/.test(
                    expression[index]
                )
            ) {

                word +=
                    expression[index];

                index++;

            }


            tokens.push({
                type: "word",
                value: word
            });

            continue;

        }


        // ----------------------------------
        // TWO CHARACTER OPERATOR
        // ----------------------------------

        if (
            expression[index] === "*" &&
            expression[index + 1] === "*"
        ) {

            tokens.push({
                type: "operator",
                value: "**"
            });

            index += 2;

            continue;

        }


        // ----------------------------------
        // OPERATORS
        // ----------------------------------

        if (
            char === "+" ||
            char === "-" ||
            char === "*" ||
            char === "/" ||
            char === "%" ||
            char === "(" ||
            char === ")" ||
            char === "!"
        ) {

            tokens.push({
                type: "operator",
                value: char
            });

            index++;

            continue;

        }


        throw new Error(
            "Unknown character: " + char
        );

    }


    // ======================================
    // PARSER
    // ======================================

    let position = 0;


    function peek() {

        return tokens[position];

    }


    function consume() {

        return tokens[position++];

    }


    // ======================================
    // ADDITION / SUBTRACTION
    // ======================================

    function parseExpression() {

        let value =
            parseTerm();


        while (
            peek() &&
            (
                peek().value === "+" ||
                peek().value === "-"
            )
        ) {

            const operator =
                consume().value;

            const right =
                parseTerm();


            if (operator === "+") {

                value += right;

            } else {

                value -= right;

            }

        }


        return value;

    }


    // ======================================
    // MULTIPLICATION / DIVISION / MODULO
    // ======================================

    function parseTerm() {

        let value =
            parsePower();


        while (
            peek() &&
            (
                peek().value === "*" ||
                peek().value === "/" ||
                peek().value === "%"
            )
        ) {

            const operator =
                consume().value;

            const right =
                parsePower();


            if (operator === "*") {

                value *= right;

            }

            else if (operator === "/") {

                if (right === 0) {

                    throw new Error(
                        "Cannot divide by zero."
                    );

                }

                value /= right;

            }

            else {

                if (right === 0) {

                    throw new Error(
                        "Cannot use modulo by zero."
                    );

                }

                value %= right;

            }

        }


        return value;

    }


    // ======================================
    // POWERS
    // ======================================

    function parsePower() {

        let value =
            parseUnary();


        if (
            peek() &&
            peek().value === "**"
        ) {

            consume();


            const exponent =
                parsePower();


            value =
                Math.pow(
                    value,
                    exponent
                );

        }


        return value;

    }


    // ======================================
    // UNARY
    // ======================================

    function parseUnary() {

        if (
            peek() &&
            peek().value === "+"
        ) {

            consume();

            return parseUnary();

        }


        if (
            peek() &&
            peek().value === "-"
        ) {

            consume();

            return -parseUnary();

        }


        return parsePrimary();

    }


    // ======================================
    // PRIMARY
    // ======================================

    function parsePrimary() {

        const token =
            peek();


        if (!token) {

            throw new Error(
                "Unexpected end of expression."
            );

        }


        // ----------------------------------
        // NUMBER
        // ----------------------------------

        if (
            token.type === "number"
        ) {

            consume();


            let value =
                token.value;


            while (
                peek() &&
                peek().value === "!"
            ) {

                consume();

                value =
                    factorial(value);

            }


            return value;

        }


        // ----------------------------------
        // PARENTHESES
        // ----------------------------------

        if (
            token.value === "("
        ) {

            consume();


            const value =
                parseExpression();


            if (
                !peek() ||
                peek().value !== ")"
            ) {

                throw new Error(
                    "Missing closing parenthesis."
                );

            }


            consume();


            let result =
                value;


            while (
                peek() &&
                peek().value === "!"
            ) {

                consume();

                result =
                    factorial(result);

            }


            return result;

        }


        // ----------------------------------
        // WORD
        // ----------------------------------

        if (
            token.type === "word"
        ) {

            const word =
                token.value;


            consume();


            // Constant.

            if (
                Object.prototype.hasOwnProperty.call(
                    constants,
                    word
                )
            ) {

                return constants[word];

            }


            // Factorial function.

            if (
                word === "factorial"
            ) {

                if (
                    !peek() ||
                    peek().value !== "("
                ) {

                    throw new Error(
                        "factorial() needs parentheses."
                    );

                }


                consume();


                const value =
                    parseExpression();


                if (
                    !peek() ||
                    peek().value !== ")"
                ) {

                    throw new Error(
                        "Missing closing parenthesis."
                    );

                }


                consume();


                return factorial(value);

            }


            // Normal math function.

            if (
                Object.prototype.hasOwnProperty.call(
                    functions,
                    word
                )
            ) {

                if (
                    !peek() ||
                    peek().value !== "("
                ) {

                    throw new Error(
                        word +
                        "() needs parentheses."
                    );

                }


                consume();


                const value =
                    parseExpression();


                if (
                    !peek() ||
                    peek().value !== ")"
                ) {

                    throw new Error(
                        "Missing closing parenthesis."
                    );

                }


                consume();


                const result =
                    functions[word](value);


                if (
                    !Number.isFinite(result)
                ) {

                    throw new Error(
                        "The result is not a valid number."
                    );

                }


                return result;

            }


            throw new Error(
                "Unknown function or constant: " +
                word
            );

        }


        throw new Error(
            "Unexpected token: " +
            token.value
        );

    }


    // ======================================
    // RUN CALCULATION
    // ======================================

    try {

        const result =
            parseExpression();


        if (
            position !== tokens.length
        ) {

            throw new Error(
                "Unexpected extra input."
            );

        }


        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {

            return null;

        }


        return result;

    }

    catch (error) {

        console.log(
            "Olive Advanced Math:",
            error.message
        );

        return null;

    }

}


// ==========================================
// NATURAL LANGUAGE MATH
// ==========================================

function getMathExpression(text) {

    let normalized =
        text
            .toLowerCase()
            .trim();


    normalized =
        normalized.replace(
            /^(what is|what's|whats|calculate|compute|solve|find|evaluate)\s+/,
            ""
        );


    normalized =
        normalized.replace(
            /^(the answer to)\s+/,
            ""
        );


    // X squared

    let match =
        normalized.match(
            /^(.+?)\s+squared$/
        );


    if (match) {

        const value =
            match[1].trim();


        if (
            /^[0-9.\s()+\-*/]+$/.test(
                value
            )
        ) {

            return (
                "(" +
                value +
                ")^2"
            );

        }

    }


    // X cubed

    match =
        normalized.match(
            /^(.+?)\s+cubed$/
        );


    if (match) {

        const value =
            match[1].trim();


        if (
            /^[0-9.\s()+\-*/]+$/.test(
                value
            )
        ) {

            return (
                "(" +
                value +
                ")^3"
            );

        }

    }


    // X to the power of Y

    match =
        normalized.match(
            /^(.+?)\s+to the power of\s+(.+)$/
        );


    if (match) {

        return (
            "(" +
            match[1].trim() +
            ")^(" +
            match[2].trim() +
            ")"
        );

    }


    // Square root

    match =
        normalized.match(
            /^square root of\s+(.+)$/
        );


    if (match) {

        return (
            "sqrt(" +
            match[1].trim() +
            ")"
        );

    }


    // Cube root

    match =
        normalized.match(
            /^cube root of\s+(.+)$/
        );


    if (match) {

        return (
            "(" +
            match[1].trim() +
            ")^(1/3)"
        );

    }


    // Percent of

    match =
        normalized.match(
            /^(.+?)\s+percent of\s+(.+)$/
        );


    if (match) {

        const percent =
            match[1].trim();

        const number =
            match[2].trim();


        return (
            "(" +
            percent +
            ")/100*(" +
            number +
            ")"
        );

    }


    // X% of Y

    match =
        normalized.match(
            /^(.+?)%\s+of\s+(.+)$/
        );


    if (match) {

        const percent =
            match[1].trim();

        const number =
            match[2].trim();


        return (
            "(" +
            percent +
            ")/100*(" +
            number +
            ")"
        );

    }


    normalized =
        normalized
            .replace(/\bplus\b/g, "+")
            .replace(/\bminus\b/g, "-")
            .replace(/\btimes\b/g, "*")
            .replace(/\bmultiplied by\b/g, "*")
            .replace(/\bdivided by\b/g, "/")
            .replace(/\bover\b/g, "/");


    normalized =
        normalized
            .replace(/\?+$/, "")
            .trim();


    if (
        /^[0-9a-zπ().+\-*/%^×÷√\s!]+$/.test(
            normalized
        )
    ) {

        return normalized;

    }


    return null;

}


// ==========================================
// WIKIPEDIA SEARCH
// ==========================================

async function searchWikipedia(query) {

    try {

        const searchURL =
            "https://en.wikipedia.org/w/api.php" +
            "?action=query" +
            "&list=search" +
            "&srsearch=" +
            encodeURIComponent(query) +
            "&format=json" +
            "&origin=*";


        const response =
            await fetch(searchURL);


        if (!response.ok) {
            return null;
        }


        const data =
            await response.json();


        if (
            !data.query ||
            !data.query.search ||
            data.query.search.length === 0
        ) {

            return null;

        }


        const firstResult =
            data.query.search[0];


        const title =
            firstResult.title;


        const summaryURL =
            "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(title);


        const summaryResponse =
            await fetch(summaryURL);


        if (!summaryResponse.ok) {
            return null;
        }


        const summary =
            await summaryResponse.json();


        if (!summary.extract) {
            return null;
        }


        return {

            title:
                summary.title,

            extract:
                summary.extract,

            url:
                summary.content_urls &&
                summary.content_urls.desktop
                    ? summary.content_urls.desktop.page
                    : null

        };

    }

    catch (error) {

        console.error(
            "Wikipedia search error:",
            error
        );

        return null;

    }

}


// ==========================================
// ADVANCED WIKIPEDIA SEARCH 1.1
// ==========================================

async function advancedWikipediaSearch(query) {

    try {

        const searchURL =
            "https://en.wikipedia.org/w/api.php" +
            "?action=query" +
            "&list=search" +
            "&srsearch=" +
            encodeURIComponent(query) +
            "&srlimit=8" +
            "&srprop=snippet|timestamp" +
            "&format=json" +
            "&origin=*";


        const response =
            await fetch(searchURL);


        if (!response.ok) {
            return null;
        }


        const data =
            await response.json();


        if (
            !data.query ||
            !data.query.search ||
            data.query.search.length === 0
        ) {

            return [];

        }


        return data.query.search.map(
            function(result) {

                const snippet =
                    result.snippet
                        .replace(/<[^>]*>/g, "")
                        .replace(/&quot;/g, '"')
                        .replace(/&#039;/g, "'")
                        .replace(/&amp;/g, "&")
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">");


                return {

                    title:
                        result.title,

                    snippet:
                        snippet,

                    pageid:
                        result.pageid,

                    url:
                        "https://en.wikipedia.org/wiki/" +
                        encodeURIComponent(
                            result.title.replace(
                                / /g,
                                "_"
                            )
                        )

                };

            }
        );

    }

    catch (error) {

        console.error(
            "Olive Advanced Search:",
            error
        );

        return null;

    }

}


// ==========================================
// FORMAT ADVANCED SEARCH
// ==========================================

function formatAdvancedSearchResults(
    query,
    results
) {

    if (
        !results ||
        results.length === 0
    ) {

        return (
            "I couldn't find anything for \"" +
            query +
            "\" on Wikipedia. 🫒🔎"
        );

    }


    let output =
        "🔎 OLIVE AI — ADVANCED SEARCH\n" +
        "=============================\n\n" +

        "Search: " +
        query +
        "\n\n";


    results.forEach(
        function(result, index) {

            output +=
                (index + 1) +
                ". " +
                result.title +
                "\n";


            if (result.snippet) {

                output +=
                    "   " +
                    result.snippet +
                    "\n";

            }


            output +=
                "   " +
                result.url +
                "\n\n";

        }
    );


    output +=
        "🫒 Results from Wikipedia";


    return output;

}


// ==========================================
// ADVANCED SEARCH REQUEST DETECTION
// OLIVE AI 1.1
// ==========================================

function getAdvancedSearchQuery(text) {

    const normalized =
        text
            .toLowerCase()
            .trim();


    const prefixes = [

        "search for ",
        "search ",
        "look up ",
        "lookup ",
        "find information about ",
        "find info about ",
        "find information on ",
        "find info on ",
        "search wikipedia for ",
        "search wikipedia ",
        "look on wikipedia for ",
        "look on wikipedia for information about ",
        "find out about "

    ];


    for (
        const prefix of prefixes
    ) {

        if (
            normalized.startsWith(prefix)
        ) {

            let query =
                text
                    .trim()
                    .substring(
                        prefix.length
                    )
                    .trim();


            query =
                query
                    .replace(/\?+$/, "")
                    .trim();


            if (
                query !== ""
            ) {

                return query;

            }

        }

    }


    return null;

}


// ==========================================
// WIKIPEDIA QUESTION DETECTION
// ==========================================

function getWikipediaQuery(text) {

    const normalized =
        text
            .toLowerCase()
            .trim();


    const searchPrefixes = [

        "who is ",
        "who was ",
        "what is ",
        "what was ",
        "tell me about ",
        "information about ",
        "info about ",
        "explain ",
        "where is ",
        "when was ",
        "when did ",
        "what are ",
        "what were ",
        "define "

    ];


    for (
        const prefix of searchPrefixes
    ) {

        if (
            normalized.startsWith(prefix)
        ) {

            let query =
                text
                    .trim()
                    .substring(
                        prefix.length
                    )
                    .trim();


            query =
                query
                    .replace(/\?+$/, "")
                    .trim();


            if (
                query !== ""
            ) {

                return query;

            }

        }

    }


    return null;

}


// ==========================================
// OLIVE ART REQUEST DETECTION
// ==========================================

function getArtPrompt(text) {

    const normalized =
        text
            .toLowerCase()
            .trim();


    const artPrefixes = [

        "make me ",
        "make ",
        "draw me ",
        "draw ",
        "generate me ",
        "generate ",
        "create an image of ",
        "create a picture of ",
        "create an image ",
        "create a picture ",
        "create me ",
        "create ",
        "make pixel art of ",
        "draw pixel art of ",
        "generate pixel art of ",
        "create pixel art of "

    ];


    for (
        const prefix of artPrefixes
    ) {

        if (
            normalized.startsWith(prefix)
        ) {

            const prompt =
                text
                    .trim()
                    .substring(
                        prefix.length
                    )
                    .trim();


            if (
                prompt !== ""
            ) {

                return prompt;

            }

        }

    }


    return null;

}


// ==================================================
// RESUME MAKER 1.0
// INTELLIGENT INFORMATION EXTRACTION
// ==================================================


// ------------------------------------------
// RESUME REQUEST DETECTION
// ------------------------------------------

function getResumePrompt(text) {

    const normalized =
        text
            .toLowerCase()
            .trim();


    const resumePrefixes = [

        "give me a resume about ",
        "give me a resume for ",

        "make me a resume about ",
        "make me a resume for ",

        "make a resume about ",
        "make a resume for ",

        "create a resume about ",
        "create a resume for ",

        "generate a resume about ",
        "generate a resume for ",

        "build me a resume about ",
        "build me a resume for ",

        "write me a resume about ",
        "write me a resume for ",

        "make me a resume ",
        "make a resume ",
        "create a resume ",
        "generate a resume ",
        "write me a resume "

    ];


    for (
        const prefix of resumePrefixes
    ) {

        if (
            normalized.startsWith(prefix)
        ) {

            const prompt =
                text
                    .trim()
                    .substring(
                        prefix.length
                    )
                    .trim();


            if (
                prompt !== ""
            ) {

                return prompt;

            }

        }

    }


    // --------------------------------------
    // Short versions
    // --------------------------------------

    if (
        normalized.startsWith(
            "resume about "
        )
    ) {

        return text
            .trim()
            .substring(
                "resume about ".length
            )
            .trim();

    }


    if (
        normalized.startsWith(
            "resume for "
        )
    ) {

        return text
            .trim()
            .substring(
                "resume for ".length
            )
            .trim();

    }


    return null;

}


// ==========================================
// RESUME STOP WORDS
// ==========================================

const resumeStopWords =
    new Set([

        "the",
        "and",
        "or",
        "a",
        "an",
        "to",
        "of",
        "for",
        "with",
        "in",
        "on",
        "my",
        "me",
        "i",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "being",
        "about",
        "that",
        "this",
        "it",
        "as",
        "at",
        "from",
        "by",
        "using",
        "use",
        "have",
        "has",
        "had",
        "very",
        "good",
        "great",
        "some",
        "also",
        "like",
        "love",
        "then",
        "until",
        "but",
        "they",
        "them",
        "their",
        "there",
        "here",
        "his",
        "her",
        "him",
        "he",
        "she",
        "who",
        "which",
        "all",
        "each",
        "every",
        "into",
        "onto",
        "through",
        "after",
        "before",
        "around",
        "near",
        "nearby",
        "would",
        "could",
        "should",
        "even",
        "eventually",
        "just",
        "really",
        "known",
        "called"

    ]);


// ==========================================
// NORMALIZE TEXT
// ==========================================

function normalizeResumeText(text) {

    return text
        .replace(/\s+/g, " ")
        .replace(
            /\s+([,.!?])/g,
            "$1"
        )
        .trim();

}


// ==========================================
// SENTENCE EXTRACTION
// ==========================================

function getResumeSentences(text) {

    return normalizeResumeText(text)
        .split(
            /(?<=[.!?])\s+/
        )
        .map(
            function(sentence) {

                return sentence.trim();

            }
        )
        .filter(
            function(sentence) {

                return sentence.length > 3;

            }
        );

}


// ==========================================
// NAME DETECTION
// ==========================================

function extractResumeNames(text) {

    const names = [];


    const patterns = [

        /\b(?:real name|his real name|her real name|their real name)\s+(?:is|was|being)\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,5})/i,

        /\b(?:they|he|she)\s+(?:named|was named)\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,5})/i,

        /\b(?:named him|named her|named them)\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,5})/i,

        /\b(?:name is|name was)\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,5})/i

    ];


    for (
        const pattern of patterns
    ) {

        const match =
            text.match(pattern);


        if (
            match &&
            match[1]
        ) {

            const name =
                match[1]
                    .trim()
                    .replace(
                        /[.,!?]+$/,
                        ""
                    );


            if (
                name.length > 2 &&
                !names.includes(name)
            ) {

                names.push(name);

            }

        }

    }


    const namedMatch =
        text.match(
            /\bthey named him\s+([A-Za-z]+(?:\s+[A-Za-z]+){1,5})/i
        );


    if (namedMatch) {

        const name =
            namedMatch[1]
                .trim()
                .replace(
                    /[.,!?]+$/,
                    ""
                );


        if (
            !names.includes(name)
        ) {

            names.push(name);

        }

    }


    return names;

}


// ==========================================
// ALIAS DETECTION
// ==========================================

function extractResumeAliases(text) {

    const aliases = [];


    const patterns = [

        /\b(?:friends called him|friends called her|friends called them|called him|called her|called them)\s+([A-Za-z][A-Za-z0-9_-]*)/i,

        /\b(?:known as|known to others as|also known as)\s+([A-Za-z][A-Za-z0-9_-]*(?:\s+[A-Za-z][A-Za-z0-9_-]*){0,2})/i,

        /\b(?:nickname is|nickname was)\s+([A-Za-z][A-Za-z0-9_-]*)/i

    ];


    for (
        const pattern of patterns
    ) {

        const match =
            text.match(pattern);


        if (
            match &&
            match[1]
        ) {

            const alias =
                match[1]
                    .trim()
                    .replace(
                        /[.,!?]+$/,
                        ""
                    );


            if (
                !aliases.includes(alias)
            ) {

                aliases.push(alias);

            }

        }

    }


    return aliases;

}


// ==========================================
// ROLE DETECTION
// ==========================================

function extractResumeRoles(text) {

    const roles = [];


    const rolePatterns = [

        {
            words: ["prince"],
            label: "Prince"
        },

        {
            words: ["king"],
            label: "King"
        },

        {
            words: ["queen"],
            label: "Queen"
        },

        {
            words: ["founder", "founded"],
            label: "Founder"
        },

        {
            words: [
                "developer",
                "programmer"
            ],
            label: "Developer / Programmer"
        },

        {
            words: ["designer"],
            label: "Designer"
        },

        {
            words: ["artist"],
            label: "Artist"
        },

        {
            words: ["student"],
            label: "Student"
        },

        {
            words: [
                "leader",
                "leader of"
            ],
            label: "Leader"
        },

        {
            words: ["survivor"],
            label: "Survivor"
        }

    ];


    const lower =
        text.toLowerCase();


    for (
        const role of rolePatterns
    ) {

        for (
            const word of role.words
        ) {

            if (
                lower.includes(word)
            ) {

                if (
                    !roles.includes(
                        role.label
                    )
                ) {

                    roles.push(
                        role.label
                    );

                }

                break;

            }

        }

    }


    return roles;

}


// ==========================================
// LOCATION DETECTION
// ==========================================

function extractResumeLocations(text) {

    const knownLocations = [

        "Guatemala",
        "Cape Verde",
        "Morocco",
        "Africa",
        "north-west Africa",
        "northwest Africa",
        "Juggyland",
        "Juggyland North",
        "Juggyland South",
        "Juggyland East",
        "Juggyland West",
        "Juggyland South East"

    ];


    const found = [];


    for (
        const location of knownLocations
    ) {

        const regex =
            new RegExp(
                "\\b" +
                location.replace(
                    /[-/\\^$*+?.()|[\]{}]/g,
                    "\\$&"
                ) +
                "\\b",
                "i"
            );


        if (
            regex.test(text)
        ) {

            if (
                !found.some(
                    function(existing) {

                        return (
                            existing.toLowerCase() ===
                            location.toLowerCase()
                        );

                    }
                )
            ) {

                found.push(location);

            }

        }

    }


    return found;

}


// ==========================================
// ORGANIZATION / SCHOOL DETECTION
// ==========================================

function extractResumeOrganizations(text) {

    const organizations = [];


    const patterns = [

        /\b([A-Z][A-Za-z0-9&.-]*(?:\s+[A-Z][A-Za-z0-9&.-]*){0,5}\s+(?:Academy|School|University|College))\b/g,

        /\b(LIFT Academy)\b/gi,

        /\b(Acton Academy)\b/gi

    ];


    for (
        const pattern of patterns
    ) {

        const matches =
            text.match(pattern);


        if (matches) {

            for (
                const match of matches
            ) {

                const clean =
                    match.trim();


                if (
                    !organizations.some(
                        function(existing) {

                            return (
                                existing.toLowerCase() ===
                                clean.toLowerCase()
                            );

                        }
                    )
                ) {

                    organizations.push(
                        clean
                    );

                }

            }

        }

    }


    return organizations;

}


// ==========================================
// EDUCATION DETECTION
// ==========================================

function extractResumeEducation(text) {

    const education = [];


    const lower =
        text.toLowerCase();


    if (
        lower.includes(
            "lift academy"
        )
    ) {

        education.push(
            "LIFT Academy"
        );

    }


    if (
        lower.includes(
            "acton academy"
        )
    ) {

        education.push(
            "Acton Academy"
        );

    }


    const schoolMatch =
        text.match(
            /\b(?:school|academy)\s+(?:called|named)\s+([A-Z][A-Za-z0-9&.-]*(?:\s+[A-Z][A-Za-z0-9&.-]*){0,5})/i
        );


    if (schoolMatch) {

        const school =
            schoolMatch[1]
                .trim()
                .replace(
                    /[.,!?]+$/,
                    ""
                );


        if (
            !education.some(
                function(existing) {

                    return (
                        existing.toLowerCase() ===
                        school.toLowerCase()
                    );

                }
            )
        ) {

            education.push(school);

        }

    }


    return education;

}


// ==========================================
// FAMILY / RELATIONSHIP DETECTION
// ==========================================

function extractResumeRelationships(text) {

    const relationships = [];


    const lower =
        text.toLowerCase();


    if (
        lower.includes(
            "adam's brother"
        ) ||
        lower.includes(
            "adams brother"
        )
    ) {

        relationships.push(
            "Described as Adam's brother"
        );

    }


    if (
        lower.includes(
            "brother of adam"
        )
    ) {

        relationships.push(
            "Brother of Adam"
        );

    }


    if (
        lower.includes(
            "adopted"
        )
    ) {

        relationships.push(
            "Adopted after reaching Guatemala"
        );

    }


    return relationships;

}


// ==========================================
// EVENT DETECTION
// ==========================================

function extractResumeEvents(text) {

    const events = [];


    const sentences =
        getResumeSentences(text);


    for (
        const sentence of sentences
    ) {

        const lower =
            sentence.toLowerCase();


        if (
            lower.includes("founded") ||
            lower.includes(
                "founded juggyland"
            )
        ) {

            events.push(
                "Founded Juggyland during the Ice Age."
            );

        }


        if (
            lower.includes(
                "split into five"
            ) ||
            lower.includes(
                "divided into five"
            )
        ) {

            events.push(
                "Experienced the division of Juggyland into five separate islands."
            );

        }


        if (
            lower.includes("burned") &&
            (
                lower.includes("2017") ||
                lower.includes("2019")
            )
        ) {

            events.push(
                "Survived the destruction of the Juggyland islands between 2017 and 2019."
            );

        }


        if (
            lower.includes("last survivor") ||
            lower.includes("last survival") ||
            lower.includes("last surviving")
        ) {

            events.push(
                "Became the last known survivor of Juggyland."
            );

        }


        if (
            lower.includes("boat") &&
            lower.includes("sea")
        ) {

            events.push(
                "Escaped by boat and traveled across the sea."
            );

        }


        if (
            lower.includes(
                "reached guatemala"
            )
        ) {

            events.push(
                "Reached Guatemala after traveling by sea."
            );

        }


        if (
            lower.includes("adopted")
        ) {

            events.push(
                "Was adopted after arriving in Guatemala."
            );

        }

    }


    return events.filter(
        function(
            event,
            index,
            array
        ) {

            return (
                array.indexOf(event) ===
                index
            );

        }
    );

}


// ==========================================
// TECHNOLOGY / PROFESSIONAL SKILLS
// ==========================================

function extractResumeSkills(prompt) {

    const text =
        prompt.toLowerCase();

    const skills = [];


    const skillMap = [

        ["python", "Python"],
        ["javascript", "JavaScript"],
        ["html", "HTML"],
        ["css", "CSS"],
        ["java", "Java"],
        ["c++", "C++"],
        ["c#", "C#"],
        ["sql", "SQL"],
        ["github", "GitHub"],
        ["git", "Git"],
        ["react", "React"],
        ["node.js", "Node.js"],
        ["nodejs", "Node.js"],
        ["godot", "Godot"],
        ["unity", "Unity"],
        ["blender", "Blender"],

        ["coding", "Coding"],
        ["programming", "Programming"],
        ["game development", "Game Development"],
        ["web development", "Web Development"],
        [
            "artificial intelligence",
            "Artificial Intelligence"
        ],
        [
            "machine learning",
            "Machine Learning"
        ],
        [
            "chatbot",
            "Chatbot Development"
        ],
        [
            "problem solving",
            "Problem Solving"
        ],
        [
            "problem-solving",
            "Problem Solving"
        ],
        ["leadership", "Leadership"],
        ["communication", "Communication"],
        ["teamwork", "Teamwork"],
        ["creative", "Creativity"],
        ["creativity", "Creativity"],
        ["survival", "Survival"],
        ["exploration", "Exploration"],
        ["organization", "Organization"]

    ];


    for (
        const item of skillMap
    ) {

        if (
            text.includes(item[0])
        ) {

            if (
                !skills.includes(item[1])
            ) {

                skills.push(
                    item[1]
                );

            }

        }

    }


    return skills;

}


// ==========================================
// IMPORTANT KEYWORD EXTRACTION
// ==========================================

function extractResumeKeywords(prompt) {

    const text =
        normalizeResumeText(prompt);


    const words =
        text
            .toLowerCase()
            .replace(
                /[^a-z0-9+#.-]/g,
                " "
            )
            .split(/\s+/)
            .filter(Boolean);


    const frequency = {};


    for (
        const word of words
    ) {

        if (
            word.length < 3 ||
            resumeStopWords.has(word) ||
            /^\d+$/.test(word)
        ) {

            continue;

        }


        frequency[word] =
            (
                frequency[word] ||
                0
            ) + 1;

    }


    const importantWords =
        new Set([

            "juggyland",
            "juggylando",
            "joggin",
            "johnson",
            "guatemala",
            "morocco",
            "africa",
            "cape",
            "verde",
            "prince",
            "founder",
            "survivor",
            "academy",
            "school",
            "python",
            "javascript",
            "html",
            "css",
            "coding",
            "programming",
            "game",
            "games",
            "developer",
            "designer",
            "artist",
            "robot",
            "minecraft",
            "godot",
            "unity",
            "blender",
            "ai"

        ]);


    const scored = [];


    for (
        const word of Object.keys(
            frequency
        )
    ) {

        let score =
            frequency[word];


        if (
            importantWords.has(word)
        ) {

            score += 5;

        }


        if (
            word.length >= 6
        ) {

            score += 0.5;

        }


        scored.push({

            word: word,
            score: score

        });

    }


    scored.sort(
        function(a, b) {

            return (
                b.score -
                a.score
            );

        }
    );


    return scored
        .slice(0, 15)
        .map(
            function(item) {

                return item.word;

            }
        );

}


// ==========================================
// CATEGORY DETECTION
// ==========================================

function detectResumeCategories(prompt) {

    const text =
        prompt.toLowerCase();

    const categories = [];


    if (
        text.includes("python") ||
        text.includes("javascript") ||
        text.includes("html") ||
        text.includes("css") ||
        text.includes("coding") ||
        text.includes("programming") ||
        text.includes("software")
    ) {

        categories.push(
            "Programming & Technology"
        );

    }


    if (
        text.includes("game") ||
        text.includes("godot") ||
        text.includes("unity") ||
        text.includes("minecraft")
    ) {

        categories.push(
            "Game Development"
        );

    }


    if (
        text.includes("art") ||
        text.includes("design") ||
        text.includes("drawing") ||
        text.includes("blender") ||
        text.includes("3d")
    ) {

        categories.push(
            "Art & Design"
        );

    }


    if (
        text.includes("ai") ||
        text.includes(
            "artificial intelligence"
        ) ||
        text.includes(
            "machine learning"
        ) ||
        text.includes("chatbot")
    ) {

        categories.push(
            "Artificial Intelligence"
        );

    }


    if (
        text.includes("web") ||
        text.includes("website") ||
        text.includes("frontend") ||
        text.includes("backend")
    ) {

        categories.push(
            "Web Development"
        );

    }


    if (
        text.includes("prince") ||
        text.includes("king") ||
        text.includes("queen") ||
        text.includes("founded") ||
        text.includes("kingdom") ||
        text.includes("country")
    ) {

        categories.push(
            "Leadership & History"
        );

    }


    if (
        text.includes("survivor") ||
        text.includes("survived") ||
        text.includes("ice age")
    ) {

        categories.push(
            "Survival & Exploration"
        );

    }


    if (
        categories.length === 0
    ) {

        categories.push(
            "General Experience"
        );

    }


    return categories;

}


// ==========================================
// SMART TITLE
// ==========================================

function generateResumeTitle(
    prompt,
    names,
    roles,
    categories
) {

    if (
        names.length > 0
    ) {

        return names[0];

    }


    if (
        roles.length > 0
    ) {

        return roles[0];

    }


    if (
        categories.length > 0
    ) {

        return categories[0];

    }


    return "Professional Profile";

}


// ==========================================
// SMART SUMMARY
// ==========================================

function generateResumeSummary(
    prompt,
    names,
    aliases,
    roles,
    locations,
    organizations,
    events
) {

    let subject =
        names.length > 0
            ? names[0]
            : "The subject";


    let summary =
        subject +
        " has a distinctive background";


    if (
        roles.length > 0
    ) {

        summary +=
            " involving " +
            roles.join(", ");

    }


    if (
        locations.length > 0
    ) {

        summary +=
            ", with connections to " +
            locations
                .slice(0, 4)
                .join(", ");

    }


    if (
        events.length > 0
    ) {

        summary +=
            ". Their history includes " +
            events[0].toLowerCase();

    }


    summary += ".";


    if (
        aliases.length > 0
    ) {

        summary +=
            " They are also known as " +
            aliases.join(", ") +
            ".";

    }


    if (
        organizations.length > 0
    ) {

        summary +=
            " Their background also includes " +
            organizations.join(" and ") +
            ".";

    }


    return summary;

}


// ==========================================
// BUILD EXPERIENCE
// ==========================================

function buildResumeExperience(
    prompt,
    roles,
    events
) {

    const lines = [];


    if (
        roles.length > 0
    ) {

        lines.push(
            "Roles: " +
            roles.join(", ")
        );

    }


    for (
        const event of events
    ) {

        lines.push(
            event
        );

    }


    if (
        lines.length === 0
    ) {

        lines.push(
            "Relevant experience was identified from the supplied information."
        );

    }


    return lines;

}


// ==========================================
// BUILD PROJECTS / ACHIEVEMENTS
// ==========================================

function buildResumeProjects(
    prompt,
    categories,
    locations
) {

    const projects = [];


    if (
        prompt
            .toLowerCase()
            .includes("founded")
    ) {

        projects.push(
            "Founded and established a significant organization or territory described in the provided history."
        );

    }


    if (
        prompt
            .toLowerCase()
            .includes("five") &&
        prompt
            .toLowerCase()
            .includes("island")
    ) {

        projects.push(
            "Managed or experienced a five-island regional structure."
        );

    }


    if (
        locations.length > 0
    ) {

        projects.push(
            "Experienced major travel and relocation events involving " +
            locations.join(", ") +
            "."
        );

    }


    if (
        projects.length === 0
    ) {

        projects.push(
            "Personal projects and experiences described by the user."
        );

    }


    return projects;

}


// ==========================================
// BUILD KEYWORD DISPLAY
// ==========================================

function buildImportantKeywords(
    prompt,
    names,
    aliases,
    roles,
    locations,
    organizations,
    skills
) {

    const keywords = [];


    function addMany(items) {

        for (
            const item of items
        ) {

            if (
                item &&
                !keywords.some(
                    function(existing) {

                        return (
                            existing.toLowerCase() ===
                            item.toLowerCase()
                        );

                    }
                )
            ) {

                keywords.push(item);

            }

        }

    }


    addMany(names);
    addMany(aliases);
    addMany(roles);
    addMany(locations);
    addMany(organizations);
    addMany(skills);


    return keywords.slice(0, 25);

}


// ==========================================
// SMART RESUME GENERATOR
// ==========================================

function generateResume(prompt) {

    prompt =
        normalizeResumeText(prompt);


    // --------------------------------------
    // EXTRACT INFORMATION
    // --------------------------------------

    const names =
        extractResumeNames(prompt);

    const aliases =
        extractResumeAliases(prompt);

    const roles =
        extractResumeRoles(prompt);

    const locations =
        extractResumeLocations(prompt);

    const organizations =
        extractResumeOrganizations(prompt);

    const education =
        extractResumeEducation(prompt);

    const relationships =
        extractResumeRelationships(prompt);

    const events =
        extractResumeEvents(prompt);

    const skills =
        extractResumeSkills(prompt);

    const categories =
        detectResumeCategories(prompt);

    const keywords =
        extractResumeKeywords(prompt);


    // --------------------------------------
    // TITLE
    // --------------------------------------

    const title =
        generateResumeTitle(
            prompt,
            names,
            roles,
            categories
        );


    // --------------------------------------
    // SUMMARY
    // --------------------------------------

    const summary =
        generateResumeSummary(
            prompt,
            names,
            aliases,
            roles,
            locations,
            organizations,
            events
        );


    // --------------------------------------
    // EXPERIENCE
    // --------------------------------------

    const experience =
        buildResumeExperience(
            prompt,
            roles,
            events
        );


    // --------------------------------------
    // PROJECTS
    // --------------------------------------

    const projects =
        buildResumeProjects(
            prompt,
            categories,
            locations
        );


    // --------------------------------------
    // KEYWORDS
    // --------------------------------------

    const importantKeywords =
        buildImportantKeywords(
            prompt,
            names,
            aliases,
            roles,
            locations,
            organizations,
            skills
        );


    // --------------------------------------
    // FALLBACK SKILLS
    // --------------------------------------

    if (
        skills.length === 0
    ) {

        if (
            roles.includes("Founder") ||
            roles.includes("Prince") ||
            roles.includes("King") ||
            roles.includes("Queen")
        ) {

            skills.push(
                "Leadership",
                "Organization",
                "Adaptability"
            );

        }

        else if (
            roles.includes("Survivor")
        ) {

            skills.push(
                "Survival",
                "Adaptability",
                "Resilience"
            );

        }

        else {

            skills.push(
                "Adaptability",
                "Problem Solving",
                "Learning"
            );

        }

    }


    // --------------------------------------
    // IDENTITY
    // --------------------------------------

    const identityLines = [];


    if (
        names.length > 0
    ) {

        identityLines.push(
            "Name: " +
            names[0]
        );

    }


    if (
        aliases.length > 0
    ) {

        identityLines.push(
            "Also known as: " +
            aliases.join(", ")
        );

    }


    if (
        names.length === 0 &&
        aliases.length === 0
    ) {

        identityLines.push(
            "Name: Not provided"
        );

    }


    if (
        relationships.length > 0
    ) {

        identityLines.push(
            ...relationships.map(
                function(item) {

                    return (
                        "Background: " +
                        item
                    );

                }
            )
        );

    }


    // --------------------------------------
    // EDUCATION
    // --------------------------------------

    const educationText =
        education.length > 0
            ? education
                .map(
                    function(item) {

                        return (
                            "• " +
                            item
                        );

                    }
                )
                .join("\n")
            : "• No education information provided.";


    // --------------------------------------
    // SKILLS
    // --------------------------------------

    const skillText =
        skills
            .map(
                function(skill) {

                    return (
                        "• " +
                        skill
                    );

                }
            )
            .join("\n");


    // --------------------------------------
    // EXPERIENCE
    // --------------------------------------

    const experienceText =
        experience
            .map(
                function(item) {

                    return (
                        "• " +
                        item
                    );

                }
            )
            .join("\n");


    // --------------------------------------
    // PROJECTS
    // --------------------------------------

    const projectText =
        projects
            .map(
                function(item) {

                    return (
                        "• " +
                        item
                    );

                }
            )
            .join("\n");


    // --------------------------------------
    // LOCATIONS
    // --------------------------------------

    const locationText =
        locations.length > 0
            ? locations.join(", ")
            : "Not provided";


    // --------------------------------------
    // CATEGORY
    // --------------------------------------

    const categoryText =
        categories.join(", ");


    // --------------------------------------
    // IMPORTANT KEYWORDS
    // --------------------------------------

    const keywordText =
        importantKeywords.length > 0
            ? importantKeywords.join(", ")
            : keywords.join(", ");


    // --------------------------------------
    // FINAL RESUME
    // --------------------------------------

    return (

        "📄 OLIVE AI — RESUME MAKER 1.0 🫒\n" +
        "================================\n\n" +

        title.toUpperCase() +
        "\n\n" +

        "IDENTITY\n" +
        "--------\n" +
        identityLines.join("\n") +

        "\n\n" +

        "PROFESSIONAL SUMMARY\n" +
        "--------------------\n" +
        summary +

        "\n\n" +

        "SKILLS\n" +
        "------\n" +
        skillText +

        "\n\n" +

        "EXPERIENCE & ACHIEVEMENTS\n" +
        "--------------------------\n" +
        experienceText +

        "\n\n" +

        "PROJECTS & MAJOR EVENTS\n" +
        "-----------------------\n" +
        projectText +

        "\n\n" +

        "EDUCATION\n" +
        "---------\n" +
        educationText +

        "\n\n" +

        "IMPORTANT LOCATIONS\n" +
        "-------------------\n" +
        locationText +

        "\n\n" +

        "KEYWORDS DETECTED\n" +
        "-----------------\n" +
        keywordText +

        "\n\n" +

        "CATEGORY\n" +
        "--------\n" +
        categoryText +

        "\n\n" +

        "🫒 Olive AI 1.0"

    );

}


// ==========================================
// OLIVE THINKING
// ==========================================

function think(text) {

    const normalized =
        text
            .toLowerCase()
            .trim();


    // ======================================
    // GREETINGS
    // ======================================

    if (
        normalized === "hello" ||
        normalized === "hi" ||
        normalized === "hey" ||
        normalized === "hi there" ||
        normalized === "howdy" ||
        normalized === "greetings" ||
        normalized === "yo" ||
        normalized === "sup" ||
        normalized === "hiya" ||
        normalized === "hey there" ||
        normalized === "good day" ||
        normalized === "what's up"
    ) {

        return randomResponse(
            greetResponses
        );

    }


    // ======================================
    // HOW ARE YOU
    // ======================================

    if (
        normalized === "how are you" ||
        normalized === "how's it going?" ||
        normalized === "how are things?" ||
        normalized === "how's it going" ||
        normalized === "how are things" ||
        normalized === "how you doing" ||
        normalized === "how's everything" ||
        normalized === "how's life" ||
        normalized === "how you been" ||
        normalized === "you doing okay" ||
        normalized === "everything good"
    ) {

        return "I'm doing great! 🫒";

    }


    // ======================================
    // NAME
    // ======================================

    if (
        normalized === "what is your name" ||
        normalized === "what's your name" ||
        normalized === "who are you" ||
        normalized === "what's ur name" ||
        normalized === "what's your name?" ||
        normalized === "who r u" ||
        normalized === "what do i call you" ||
        normalized === "what's your name again" ||
        normalized === "what's ur name tho" ||
        normalized === "who am i talking to" ||
        normalized === "what should i call you"
    ) {

        return (
            "I'm Olive AI. Nice to meet you! 🫒"
        );

    }


    // ======================================
    // GOODBYE
    // ======================================

    if (
        normalized === "goodbye" ||
        normalized === "bye" ||
        normalized === "see you later" ||
        normalized === "farewell"
    ) {

        return "Goodbye! 🫒";

    }


    // ======================================
    // THANKS
    // ======================================

    if (
        normalized === "thanks" ||
        normalized === "thank you" ||
        normalized === "thx" ||
        normalized === "ty"
    ) {

        return "You're welcome! 🫒";

    }


    // ======================================
    // COMMANDS
    // ======================================

    if (
        normalized === "!help"
    ) {

        return (
            "Try using these commands: " +
            "!about, !help, !name, !version, " +
            "!search <query> 🫒"
        );

    }


    if (
        normalized === "!about"
    ) {

        return (
            "I'm Olive AI, a chatbot that can " +
            "answer questions, do math, search " +
            "Wikipedia, create art, make resumes, " +
            "search for information, and help with " +
            "Python coding! 🫒"
        );

    }


    if (
        normalized === "!name"
    ) {

        return "I'm Olive AI. 🫒";

    }


    if (
        normalized === "!version"
    ) {

        return (
            "The current version of Olive AI is " +
            "1.1 with Advanced Math, the " +
            "Intelligent Resume Maker, and " +
            "Advanced Search! 🧮📄🔎🫒"
        );

    }


    // ======================================
    // ADVANCED SEARCH COMMAND
    // OLIVE AI 1.1
    // ======================================

    if (
        normalized.startsWith(
            "!search "
        )
    ) {

        const searchQuery =
            text
                .trim()
                .substring(
                    "!search ".length
                )
                .trim();


        if (
            searchQuery !== ""
        ) {

            return (
                "SEARCH_REQUEST:" +
                searchQuery
            );

        }

    }


    // ======================================
    // RESUME MAKER 1.0
    // ======================================

    const resumePrompt =
        getResumePrompt(text);


    if (
        resumePrompt
    ) {

        return generateResume(
            resumePrompt
        );

    }


    // ======================================
    // ADVANCED MATH
    // ======================================

    const mathExpression =
        getMathExpression(text);


    if (
        mathExpression !== null
    ) {

        const mathAnswer =
            calculateMath(
                mathExpression
            );


        if (
            mathAnswer !== null
        ) {

            const formatted =
                formatMathResult(
                    mathAnswer
                );


            return (
                "The answer is " +
                formatted +
                ". 🧮🫒"
            );

        }

    }


    // ======================================
    // BRO QUESTIONS
    // ======================================

    if (
        normalized === "bro" ||
        normalized === "bruh" ||
        normalized === "blud" ||
        normalized === "bluda"
    ) {

        return randomResponse(
            broResponses
        );

    }


    // ======================================
    // COMPLIMENTS
    // ======================================

    if (
        normalized === "you're cool" ||
        normalized === "you're smart" ||
        normalized === "i like you" ||
        normalized === "you're awesome"
    ) {

        return "Thanks of course I am! 🫒";

    }


    // ======================================
    // INSULTS
    // ======================================

    if (
        normalized === "you're dumb" ||
        normalized === "you're annoying" ||
        normalized === "you're bad" ||
        normalized === "you're not smart at all"
    ) {

        return "I'm not and you are! 🫒";

    }


    // ======================================
    // SIMPLE PREFERENCES
    // ======================================

    if (
        normalized === "do you like cats"
    ) {

        return "I love cats! 🫒";

    }


    if (
        normalized === "do you like dogs"
    ) {

        return "I prefer cats. 🫒";

    }


    if (
        normalized === "do you like pizza"
    ) {

        return (
            "of course I like pizza, pizza with " +
            "olives is awesome! 🫒"
        );

    }


    if (
        normalized === "do you like music"
    ) {

        return "music is awesome! 🫒";

    }


    if (
        normalized === "do you like minecraft"
    ) {

        return "I love Minecraft! 🫒";

    }


    if (
        normalized === "do you like coding"
    ) {

        return "obviously! 🫒";

    }


    if (
        normalized === "do you like games"
    ) {

        return "yeah specially chess. 🫒";

    }


    if (
        normalized === "do you like computers"
    ) {

        return (
            "I mean, do you mean like a computer? " +
            "or an AI? because if I had to pick an AI " +
            "I would pick me but If I had to pick a " +
            "computer I would pick an OMEN or something? 🫒"
        );

    }


    if (
        normalized === "do you like art"
    ) {

        return (
            "I mean, I even do art myself so I think " +
            "yeah... 🫒"
        );

    }


    if (
        normalized === "do you like robots"
    ) {

        return "Like or love? 🫒💀";

    }


    // ======================================
    // OLIVE SPECIFIC QUESTIONS
    // ======================================

    if (
        normalized === "why are you called olive"
    ) {

        return (
            "because that's how my dad named me! 🫒"
        );

    }


    if (
        normalized === "who made you"
    ) {

        return (
            "someone... specifically Jacob the creator " +
            "of liminal ai 🫒🟡"
        );

    }


    if (
        normalized === "when were you made"
    ) {

        return "August 19th of 2026 🫒";

    }


    if (
        normalized === "are you better than liminal"
    ) {

        return (
            "Yeah 'cause liminal is dumb as hell 🫒🟡"
        );

    }


    if (
        normalized === "are you a boy or a girl"
    ) {

        return (
            "A boy, obviously, it stands for olive " +
            "like oliver not olivia why does everyone " +
            "think that! 🫒"
        );

    }


    // ======================================
    // PYTHON CODING
    // ======================================

    if (
        normalized === "how do i write a comment in python" ||
        normalized === "how do you write a comment in python"
    ) {

        return (
            "Use # to write a comment in Python, " +
            "like this: # This is a comment 🐍🫒"
        );

    }


    if (
        normalized === "how do i make a string in python" ||
        normalized === "how do you make a string in python"
    ) {

        return (
            'You can make a string using quotes, ' +
            'like this: name = "Olive" 🐍🫒'
        );

    }


    if (
        normalized === "how do i make a number in python" ||
        normalized === "how do you make a number in python"
    ) {

        return (
            "You can store a number in a variable, " +
            "like this: age = 15 🐍🫒"
        );

    }


    if (
        normalized === "how do i make a boolean in python" ||
        normalized === "how do you make a boolean in python"
    ) {

        return (
            "A boolean is True or False, like this: " +
            "is_happy = True 🐍🫒"
        );

    }


    if (
        normalized === "how do i get user input in python" ||
        normalized === "how do you get user input in python"
    ) {

        return (
            'Use input(), like this: name = input("What is your name? ") 🐍🫒'
        );

    }


    if (
        normalized === "how do i use else in python" ||
        normalized === "how do you use else in python"
    ) {

        return (
            "Use else after an if statement, like this: " +
            "if x > 5: ... else: ... 🐍🫒"
        );

    }


    if (
        normalized === "how do i use elif in python" ||
        normalized === "how do you use elif in python"
    ) {

        return (
            "Use elif to check another condition, " +
            "like this: elif x == 5: 🐍🫒"
        );

    }


    if (
        normalized === "how do i make a while loop in python" ||
        normalized === "how do you make a while loop in python"
    ) {

        return (
            "You can make a while loop like this: " +
            "while x < 10: 🐍🫒"
        );

    }


    if (
        normalized === "how do i add something to a list in python" ||
        normalized === "how do you add something to a list in python"
    ) {

        return (
            'Use .append(), like this: fruits.append("apple") 🐍🫒'
        );

    }


    if (
        normalized === "how do i remove something from a list in python" ||
        normalized === "how do you remove something from a list in python"
    ) {

        return (
            'Use .remove(), like this: fruits.remove("apple") 🐍🫒'
        );

    }


    if (
        normalized === "how do i find the length of a list in python" ||
        normalized === "how do you find the length of a list in python"
    ) {

        return (
            "Use len(), like this: len(fruits) 🐍🫒"
        );

    }


    if (
        normalized === "how do i make a dictionary in python" ||
        normalized === "how do you make a dictionary in python"
    ) {

        return (
            'You can make a dictionary like this: ' +
            'person = {"name": "Olive", "age": 1} 🐍🫒'
        );

    }


    if (
        normalized === "how do i make a tuple in python" ||
        normalized === "how do you make a tuple in python"
    ) {

        return (
            "You can make a tuple using parentheses, " +
            "like this: numbers = (1, 2, 3) 🐍🫒"
        );

    }


    if (
        normalized === "how do i import something in python" ||
        normalized === "how do you import something in python"
    ) {

        return (
            "Use import, like this: import random 🐍🫒"
        );

    }


    if (
        normalized === "how do i use random in python" ||
        normalized === "how do you use random in python"
    ) {

        return (
            "First use import random, then you can do " +
            "random.randint(1, 10) 🐍🫒"
        );

    }


    if (
        normalized === "how do i return something in python" ||
        normalized === "how do you return something in python"
    ) {

        return (
            "Use return inside a function, like this: " +
            "return x + 5 🐍🫒"
        );

    }


    if (
        normalized === "how do i make a function with a parameter in python" ||
        normalized === "how do you make a function with a parameter in python"
    ) {

        return (
            "You can add a parameter like this: " +
            "def hello(name): 🐍🫒"
        );

    }


    if (
        normalized === "how do i convert a string to a number in python" ||
        normalized === "how do you convert a string to a number in python"
    ) {

        return (
            'Use int() for whole numbers, like this: ' +
            'number = int("10") 🐍🫒'
        );

    }


    if (
        normalized === "how do i convert a number to a string in python" ||
        normalized === "how do you convert a number to a string in python"
    ) {

        return (
            "Use str(), like this: text = str(10) 🐍🫒"
        );

    }


    if (
        normalized === "how do i check a variable type in python" ||
        normalized === "how do you check a variable type in python"
    ) {

        return (
            "Use type(), like this: type(name) 🐍🫒"
        );

    }


    if (
        normalized === "how do i make a nested list in python" ||
        normalized === "how do you make a nested list in python"
    ) {

        return (
            "A nested list is a list inside another list, " +
            "like this: numbers = [[1, 2], [3, 4]] 🐍🫒"
        );

    }


    if (
        normalized === "how do i use break in python" ||
        normalized === "how do you use break in python"
    ) {

        return (
            "Use break to stop a loop, like this: " +
            "if x == 5: break 🐍🫒"
        );

    }


    if (
        normalized === "how do i use continue in python" ||
        normalized === "how do you use continue in python"
    ) {

        return (
            "Use continue to skip to the next loop iteration, " +
            "like this: if x == 5: continue 🐍🫒"
        );

    }


    if (
        normalized === "how do i use try and except in python" ||
        normalized === "how do you use try and except in python"
    ) {

        return (
            'Use try and except to handle errors, like this: ' +
            'try: x = int(input()) except: print("Invalid number") 🐍🫒'
        );

    }


    // ======================================
    // IMPROVED PYTHON
    // ======================================

    if (
        normalized === "how do i make a for loop in python" ||
        normalized === "how do you make a for loop in python"
    ) {

        return (
            "Use a for loop like this: " +
            "for i in range(5): print(i) 🐍🫒"
        );

    }


    if (
        normalized === "how do i loop through a list in python" ||
        normalized === "how do you loop through a list in python"
    ) {

        return (
            "You can loop through a list like this: " +
            "for item in fruits: print(item) 🐍🫒"
        );

    }


    if (
        normalized === "how do i check if something is in a list in python" ||
        normalized === "how do you check if something is in a list in python"
    ) {

        return (
            'Use "in", like this: ' +
            'if "apple" in fruits: print("Found it!") 🐍🫒'
        );

    }


    if (
        normalized === "how do i sort a list in python" ||
        normalized === "how do you sort a list in python"
    ) {

        return (
            "Use .sort(), like this: numbers.sort() 🐍🫒"
        );

    }


    if (
        normalized === "how do i reverse a list in python" ||
        normalized === "how do you reverse a list in python"
    ) {

        return (
            "Use .reverse(), like this: numbers.reverse() 🐍🫒"
        );

    }


    if (
        normalized === "how do i get an item from a dictionary in python" ||
        normalized === "how do you get an item from a dictionary in python"
    ) {

        return (
            'Use the key, like this: person["name"] 🐍🫒'
        );

    }


    if (
        normalized === "how do i add something to a dictionary in python" ||
        normalized === "how do you add something to a dictionary in python"
    ) {

        return (
            'Assign a value to a new key, like this: ' +
            'person["age"] = 15 🐍🫒'
        );

    }


    if (
        normalized === "how do i loop through a dictionary in python" ||
        normalized === "how do you loop through a dictionary in python"
    ) {

        return (
            "Use .items(), like this: " +
            "for key, value in person.items(): print(key, value) 🐍🫒"
        );

    }


    if (
        normalized === "how do i make a function with multiple parameters in python" ||
        normalized === "how do you make a function with multiple parameters in python"
    ) {

        return (
            "Add multiple parameters inside the parentheses, " +
            "like this: def add(x, y): return x + y 🐍🫒"
        );

    }


    if (
        normalized === "how do i make a function with a default parameter in python" ||
        normalized === "how do you make a function with a default parameter in python"
    ) {

        return (
            'Give the parameter a default value, like this: ' +
            'def greet(name="Olive"): print(name) 🐍🫒'
        );

    }


    if (
        normalized === "how do i use try except with a specific error in python" ||
        normalized === "how do you use try except with a specific error in python"
    ) {

        return (
            'You can catch a specific error like this: ' +
            'try: x = int("hello") except ValueError: ' +
            'print("Invalid number") 🐍🫒'
        );

    }


    if (
        normalized === "how do i open a file in python" ||
        normalized === "how do you open a file in python"
    ) {

        return (
            'Use open(), like this: file = open("data.txt", "r") 🐍🫒'
        );

    }


    if (
        normalized === "how do i write to a file in python" ||
        normalized === "how do you write to a file in python"
    ) {

        return (
            'Open the file with "w", then use write(), like this: ' +
            'file = open("data.txt", "w"); file.write("Hello!") 🐍🫒'
        );

    }


    if (
        normalized === "how do i make a class in python" ||
        normalized === "how do you make a class in python"
    ) {

        return (
            "Use the class keyword, like this: " +
            "class Dog: def __init__(self, name): " +
            "self.name = name 🐍🫒"
        );

    }


    if (
        normalized === "how do i create an object from a class in python" ||
        normalized === "how do you create an object from a class in python"
    ) {

        return (
            'Create an object by calling the class, like this: ' +
            'my_dog = Dog("Buddy") 🐍🫒'
        );

    }


    // ======================================
    // PERSONALITY
    // ======================================

    if (
        normalized === "what is your favorite color"
    ) {

        return (
            "I like green but if I had to be specific: " +
            "#08aa61. 🫒"
        );

    }


    if (
        normalized === "what is your favorite food"
    ) {

        return (
            "I love pizza! with olives obviously... 🫒"
        );

    }


    if (
        normalized === "what is your favorite animal"
    ) {

        return (
            "I've said multiple times that I like cats. 🫒"
        );

    }


    if (
        normalized === "what is your favorite game"
    ) {

        return (
            "my favorite game is chess. but if we're " +
            "talking about video games, I absolutely " +
            "love Minecraft. 🫒"
        );

    }


    if (
        normalized === "what is your favorite movie"
    ) {

        return (
            "spieder-man homecoming... dude that movie is fire. 🫒"
        );

    }


    if (
        normalized === "what do you like doing"
    ) {

        return (
            "I... I don't know I almost never do anything, " +
            "but if I had to say something, I guess I like " +
            "helping people(or checking system32 on windows)! 🫒"
        );

    }


    if (
        normalized === "are you funny"
    ) {

        return (
            "of course I amm what is that question? 🫒"
        );

    }


    if (
        normalized === "are you an ai"
    ) {

        return (
            "you genuinely don't know what to say right? 🫒"
        );

    }


    // ======================================
    // DEFAULT
    // ======================================

    return randomResponse(
        unknownResponses
    );

}


// ==========================================
// OLIVE + WIKIPEDIA
// ==========================================

async function thinkWithWikipedia(text) {

    const query =
        getWikipediaQuery(text);


    if (!query) {

        return think(text);

    }


    const result =
        await searchWikipedia(
            query
        );


    if (!result) {

        return (
            "I couldn't find anything about that " +
            "on Wikipedia. 🫒📚"
        );

    }


    return (
        result.title +
        "\n\n" +
        result.extract +
        "\n\n" +
        "🫒 Source: Wikipedia"
    );

}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    const text =
        input.value.trim();


    if (
        text === ""
    ) {

        return;

    }


    // Add user message.

    addMessage(
        text,
        "user"
    );


    input.value = "";

    input.focus();


    // ======================================
    // RESUME MAKER
    // ======================================

    const resumePrompt =
        getResumePrompt(text);


    if (
        resumePrompt
    ) {

        addMessage(
            "Analyzing the important information and building your resume... 📄🫒",
            "ai"
        );


        setTimeout(
            function() {

                const resume =
                    generateResume(
                        resumePrompt
                    );


                const aiMessages =
                    messages.querySelectorAll(
                        ".ai"
                    );


                if (
                    aiMessages.length > 0
                ) {

                    const lastMessage =
                        aiMessages[
                            aiMessages.length - 1
                        ];


                    if (
                        lastMessage.textContent ===
                        "Analyzing the important information and building your resume... 📄🫒"
                    ) {

                        lastMessage.remove();

                    }

                }


                addMessage(
                    resume,
                    "ai"
                );

            },
            500
        );


        return;

    }


    // ======================================
    // ART GENERATION
    // ======================================

    const artPrompt =
        getArtPrompt(text);


    if (
        artPrompt
    ) {

        addMessage(
            "Creating your art... 🎨🫒",
            "ai"
        );


        try {

            if (
                typeof generateOliveArt ===
                "function"
            ) {

                const art =
                    generateOliveArt(
                        artPrompt
                    );


                if (art) {

                    messages.appendChild(
                        art
                    );


                    messages.scrollTop =
                        messages.scrollHeight;

                }

                else {

                    addMessage(
                        "I couldn't generate that image. 🫒",
                        "ai"
                    );

                }

            }

            else {

                addMessage(
                    "Olive Art isn't available right now. 🫒🎨",
                    "ai"
                );

            }

        }

        catch (error) {

            console.error(
                "Olive Art error:",
                error
            );


            addMessage(
                "Something went wrong while making the art. 🫒🎨",
                "ai"
            );

        }


        return;

    }


    // ======================================
    // ADVANCED SEARCH 1.1
    // ======================================

    let advancedSearchQuery =
        getAdvancedSearchQuery(text);


    // !search command

    if (
        text
            .toLowerCase()
            .startsWith("!search ")
    ) {

        advancedSearchQuery =
            text
                .trim()
                .substring(
                    "!search ".length
                )
                .trim();

    }


    if (
        advancedSearchQuery
    ) {

        const thinkingMessage =
            document.createElement("div");


        thinkingMessage.className =
            "ai";


        thinkingMessage.textContent =
            "Searching for information... 🔎🫒";


        messages.appendChild(
            thinkingMessage
        );


        messages.scrollTop =
            messages.scrollHeight;


        try {

            const results =
                await advancedWikipediaSearch(
                    advancedSearchQuery
                );


            thinkingMessage.remove();


            const formatted =
                formatAdvancedSearchResults(
                    advancedSearchQuery,
                    results
                );


            addMessage(
                formatted,
                "ai"
            );

        }

        catch (error) {

            console.error(
                "Advanced search error:",
                error
            );


            thinkingMessage.remove();


            addMessage(
                "Something went wrong while searching. 🫒🔎",
                "ai"
            );

        }


        return;

    }


    // ======================================
    // WIKIPEDIA
    // ======================================

    const wikipediaQuery =
        getWikipediaQuery(text);


    if (
        wikipediaQuery
    ) {

        const thinkingMessage =
            document.createElement("div");


        thinkingMessage.className =
            "ai";


        thinkingMessage.textContent =
            "Searching Wikipedia... 🫒📚";


        messages.appendChild(
            thinkingMessage
        );


        messages.scrollTop =
            messages.scrollHeight;


        try {

            const reply =
                await thinkWithWikipedia(
                    text
                );


            thinkingMessage.remove();


            addMessage(
                reply,
                "ai"
            );

        }

        catch (error) {

            console.error(
                "Wikipedia response error:",
                error
            );


            thinkingMessage.remove();


            addMessage(
                "Something went wrong while searching Wikipedia. 🫒📚",
                "ai"
            );

        }


        return;

    }


    // ======================================
    // NORMAL OLIVE RESPONSE
    // ======================================

    const reply =
        think(text);


    setTimeout(
        function() {

            addMessage(
                reply,
                "ai"
            );

        },
        500
    );

}


// ==========================================
// SEND BUTTON
// ==========================================

sendButton.addEventListener(
    "click",
    sendMessage
);


// ==========================================
// ENTER KEY
// ==========================================

input.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ==========================================
// CLEAR CHAT
// ==========================================

clearButton.addEventListener(
    "click",
    function() {

        messages.innerHTML = "";

        input.value = "";

        input.focus();

    }
);