export function initCanvas(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with id "${canvasId}" not found`);
        return null;
    }

    // Default options
    const {
        text = "this domain is for sale  ",
        textColor = '#272728',
        backgroundColor = '#0E0E10',
        fontSize = 70,
        shiftPerLine = 90
    } = options;

    const ctx = canvas.getContext('2d');
    const lineHeight = fontSize * 1.04;
    const seed = Math.floor(Math.random() * 1000000);

    // Set background color
    document.body.style.backgroundColor = backgroundColor;

    function seededRandom(seed) {
        let state = seed;
        return function () {
            state = (state * 1664525 + 1013904223) % 4294967296;
            return state / 4294967296;
        };
    }

    function draw() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = textColor;
        ctx.textBaseline = 'top';
        const textWidth = ctx.measureText(text).width;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const random = seededRandom(seed);

        const lines = Math.ceil(canvas.height / lineHeight) + 1;
        for (let i = 0; i < lines; i++) {
            const y = i * lineHeight;
            const variation = ((random() * 0.05) + 1) * textWidth;
            const offset = (i * shiftPerLine + variation) % textWidth - textWidth;

            let x = offset;
            while (x < canvas.width) {
                ctx.fillText(text, x, y);
                x += textWidth;
            }
        }
    }

    draw();

    const resizeHandler = () => {
        draw();
    };

    window.addEventListener('resize', resizeHandler);
}