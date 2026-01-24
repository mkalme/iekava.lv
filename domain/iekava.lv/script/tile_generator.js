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
            drawTiles();
        }
    }

    // Create and load image objects
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

    function drawTiles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const tilesX = Math.ceil(canvas.width / tileSize);
        const tilesY = Math.ceil(canvas.height / tileSize);

        ctx.imageSmoothingEnabled = false;

        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                // Pick a random image from the loaded images
                const randomValue = seededRandom(seed, x, y);
                const imageIndex = Math.floor(randomValue * loadedImages.length);
                const randomImg = loadedImages[imageIndex];
                
                if (randomImg && randomImg.complete) {
                    ctx.drawImage(randomImg, x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
    }

    const resizeHandler = () => {
        if (imagesLoaded === images.length) {
            drawTiles();
        }
    };

    window.addEventListener('resize', resizeHandler);
}