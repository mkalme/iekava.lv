export function initTileCanvas(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with id "${canvasId}" not found`);
        return null;
    }

    // Default options
    const {
        images = ['sponge.png', 'wet_sponge.png'],
        tileSize = 100
    } = options;

    const ctx = canvas.getContext('2d');
    const seed = Math.floor(Math.random() * 1000000);

    function seededRandom(s, x, y) {
        let hash = s;
        hash = ((hash << 5) - hash) + x;
        hash = hash & hash;
        hash = ((hash << 5) - hash) + y;
        hash = hash & hash;

        hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
        hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
        hash = hash ^ (hash >>> 16);

        return (hash >>> 0) / 4294967296;
    }

    // Load all images
    const loadedImages = [];
    let imagesLoaded = 0;

    function onImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
            resizeCanvas();
            drawTiles();
        }
    }

    images.forEach((imagePath) => {
        const img = new Image();
        img.onload = onImageLoad;
        img.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
            onImageLoad(); // Continue anyway
        };
        img.src = imagePath;
        loadedImages.push(img);
    });

    // --- PANNING STATE ---
    let offsetX = 0; // in pixels
    let offsetY = 0;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.imageSmoothingEnabled = false;
    }

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    function drawTiles() {
        if (imagesLoaded !== images.length) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Which "world" tile is at screen (0,0)?
        const baseTileX = Math.floor(offsetX / tileSize);
        const baseTileY = Math.floor(offsetY / tileSize);

        // Pixel remainder inside a tile (keep it positive so drawing is clean)
        const startX = -mod(offsetX, tileSize);
        const startY = -mod(offsetY, tileSize);

        // Draw enough tiles to cover the screen + 1
        const tilesX = Math.ceil(canvas.width / tileSize) + 1;
        const tilesY = Math.ceil(canvas.height / tileSize) + 1;

        for (let sy = 0; sy < tilesY; sy++) {
            for (let sx = 0; sx < tilesX; sx++) {
                const worldX = baseTileX + sx;
                const worldY = baseTileY + sy;

                const randomValue = seededRandom(seed, worldX, worldY);
                const imageIndex = Math.floor(randomValue * loadedImages.length);
                const img = loadedImages[imageIndex];

                if (img && img.complete) {
                    ctx.drawImage(
                        img,
                        startX + sx * tileSize,
                        startY + sy * tileSize,
                        tileSize,
                        tileSize
                    );
                }
            }
        }
    }

    // --- INPUT (MOUSE + TOUCH) ---
    function getClientPos(e) {
        if (e.touches && e.touches.length) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    function onDown(e) {
        // Prevent page scrolling/dragging images on touch
        e.preventDefault();

        const p = getClientPos(e);
        isDragging = true;
        lastX = p.x;
        lastY = p.y;

        // Capture pointer so you can drag outside canvas
        if (e.pointerId != null && canvas.setPointerCapture) {
            canvas.setPointerCapture(e.pointerId);
        }
    }

    function onMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const p = getClientPos(e);
        const dx = p.x - lastX;
        const dy = p.y - lastY;
        lastX = p.x;
        lastY = p.y;

        // Move the "camera" opposite or same direction?
        // This makes the pattern follow your mouse movement naturally.
        offsetX -= dx;
        offsetY -= dy;

        drawTiles();
    }

    function onUp(e) {
        if (!isDragging) return;
        e.preventDefault();
        isDragging = false;
    }

    // Use Pointer Events when available (covers mouse, pen, touch)
    const supportsPointer = 'PointerEvent' in window;

    if (supportsPointer) {
        canvas.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    } else {
        canvas.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        canvas.addEventListener('touchstart', onDown, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp, { passive: false });
        window.addEventListener('touchcancel', onUp, { passive: false });
    }

    // Prevent touch scrolling on the canvas area
    canvas.style.touchAction = 'none';

    const resizeHandler = () => {
        if (imagesLoaded === images.length) {
            resizeCanvas();
            drawTiles();
        }
    };

    window.addEventListener('resize', resizeHandler);

    // Optional: return controls if you want to reset offset etc.
    return {
        redraw: drawTiles,
        setOffset(x, y) { offsetX = x; offsetY = y; drawTiles(); },
        getOffset() { return { x: offsetX, y: offsetY }; }
    };
}
