const sceneSize = {width: 0, height: 0};
function resizeCanvas() {
    sceneSize.width = document.documentElement.clientWidth;
    sceneSize.height = document.documentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);

window.addEventListener("load", async () => {
    const config = await fetch("./animation/config.json").then(r => r.json());

    const canvas = document.getElementById("rain");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resizeCanvas();

    const gl = canvas.getContext("webgl2", { antialias: true });
    if (!gl) alert("WebGL2 not supported!");

    // ----- Characters -----
    const chars = config.visual.chars.split("");
    const charSize = config.visual.charSize;
    const padding = config.visual.padding;
    const atlasCols = config.visual.atlasCols;
    const atlasRows = Math.ceil(chars.length / atlasCols);

    // ----- Create atlas -----
    const atlasCanvas = document.createElement("canvas");
    atlasCanvas.width = atlasCols * (charSize + padding);
    atlasCanvas.height = atlasRows * (charSize + padding);
    const ctx = atlasCanvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, atlasCanvas.width, atlasCanvas.height);
    ctx.fillStyle = "white";
    ctx.font = `${charSize}px Courier New`;
    ctx.textBaseline = "top";

    chars.forEach((c, i) => {
        const col = i % atlasCols;
        const row = Math.floor(i / atlasCols);
        const x = col * (charSize + padding) + padding / 2;
        const y = row * (charSize + padding) + padding / 2;
        ctx.fillText(c, x, y);
    });

    // ----- Texture -----
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ----- Load shaders from HTML or files -----
    function compileShader(src, type) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
        return s;
    }

    // Example: fetch shader text from script tags
    const vertexSrc = await fetch('./animation/shader/vertex.glsl').then(r => r.text());
    const fragmentSrc = await fetch('./animation/shader/fragment.glsl').then(r => r.text());

    const program = gl.createProgram();
    gl.attachShader(program, compileShader(vertexSrc, gl.VERTEX_SHADER));
    gl.attachShader(program, compileShader(fragmentSrc, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    // ----- Quad setup -----
    const quadVertices = new Float32Array([
        0, 0, 0, 0,
        1, 0, 1, 0,
        0, 1, 0, 1,
        1, 1, 1, 1
    ]);
    const quadIndices = new Uint16Array([0, 1, 2, 2, 1, 3]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const quadVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(program, "aPos");
    const aUVLoc = gl.getAttribLocation(program, "aUV");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(aUVLoc);
    gl.vertexAttribPointer(aUVLoc, 2, gl.FLOAT, false, 16, 8);

    const quadEBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadEBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quadIndices, gl.STATIC_DRAW);

    // ----- Particle setup -----
    const NUM_PARTICLES = config.scene.numParticles;
    const offsets = new Float32Array(NUM_PARTICLES * 2);
    const sizes = new Float32Array(NUM_PARTICLES);
    const colors = new Float32Array(NUM_PARTICLES * 3);
    const charIndices = new Float32Array(NUM_PARTICLES);

    const offsetBuffer = gl.createBuffer();
    const sizeBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const charBuffer = gl.createBuffer();

    function setupInstanced(buffer, loc, size) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(loc, 1);
    }

    setupInstanced(offsetBuffer, gl.getAttribLocation(program, "aOffset"), 2);
    setupInstanced(sizeBuffer, gl.getAttribLocation(program, "aSize"), 1);
    setupInstanced(colorBuffer, gl.getAttribLocation(program, "aColor"), 3);
    setupInstanced(charBuffer, gl.getAttribLocation(program, "aCharIndex"), 1);

    // ----- Particle class -----
    class Particle {
        constructor() {
            this.padding = config.scene.padding;
            this.reset();
        }

        interpolate(min, max, d) {
            return min + (max - min) * d;
        }

        reset(initial=false) {
            this.depth = Math.pow(Math.random(), 4);
            this.size = (config.depth.maxParticleSize - config.depth.minParticleSize) * this.depth + config.depth.minParticleSize;
            this.speed = config.animation.minParticleSpeedFactor + (config.animation.maxParticleSpeedFactor - config.animation.minParticleSpeedFactor) * this.depth;
            
            this.x = Math.random() * (sceneSize.width + this.size - config.scene.padding * 2) - this.size + config.scene.padding;
            this.y = initial 
                ? Math.random() * (sceneSize.height + this.size - config.scene.padding * 2) - this.size + config.scene.padding
                : -this.size + config.scene.padding;
            
            this.brightness = [
                this.interpolate(config.depth.minParticleColor[0], config.depth.maxParticleColor[0], this.depth),
                this.interpolate(config.depth.minParticleColor[1], config.depth.maxParticleColor[1], this.depth),
                this.interpolate(config.depth.minParticleColor[2], config.depth.maxParticleColor[2], this.depth)];

            this.charIndex = Math.floor(Math.random() * chars.length);
            this.vx = 0;
            this.vy = 0;
        }

        update() {
            this.y += this.speed + this.vy;
            this.x += this.vx;
            this.vx *= 0.95;
            this.vy *= 0.95;

            const EPSILON = 0.001;
            if ((this.y < -this.size - EPSILON + this.padding) ||
                (this.y > sceneSize.height - this.padding) ||
                (this.x < -this.size + this.padding) ||
                (this.x > sceneSize.width - this.padding)
            ){
                this.reset(false);
                return;
            }

            // Mouse interaction
            if (mouse.down && mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                const influence = (config.animation.maxParticleMouseInfluence - config.animation.minParticleMouseInfluence) * this.depth + config.animation.minParticleMouseInfluence;
                const influenceSq = influence * influence;

                if (distSq < influenceSq) {
                    const dist = Math.sqrt(distSq);
                    const force = (influence - dist) / influence;
                    this.vx += (dx / dist) * force;
                    this.vy += (dy / dist) * force;
                }
            }
        }
    }

    const particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = new Particle();
        p.reset(true); // populate on-screen immediately
        particles.push(p);
    }

    // Track mouse position and button state
    const mouse = { x: null, y: null, down: false };

    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mousedown", () => { mouse.down = true; });
    window.addEventListener("mouseup", () => { mouse.down = false; });

    // ----- Animation -----
    function animate() {
        particles.forEach(p => p.update());
        particles.sort((a, b) => a.size - b.size); // depth effect

        particles.forEach((p, i) => {
            offsets[i * 2] = p.x;
            offsets[i * 2 + 1] = p.y;
            sizes[i] = p.size;
            colors[i * 3] = p.brightness[0];
            colors[i * 3 + 1] = p.brightness[1];
            colors[i * 3 + 2] = p.brightness[2];
            charIndices[i] = p.charIndex;
        });

        gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer); gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer); gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, charBuffer); gl.bufferData(gl.ARRAY_BUFFER, charIndices, gl.DYNAMIC_DRAW);

        gl.clearColor(config.visual.canvasBackground[0], config.visual.canvasBackground[1], config.visual.canvasBackground[2], 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform2f(gl.getUniformLocation(program, "uResolution"), canvas.width, canvas.height);
        gl.uniform2f(gl.getUniformLocation(program, "uAtlasCharSize"), charSize + padding, charSize + padding);
        gl.uniform2f(gl.getUniformLocation(program, "uAtlasTexSize"), atlasCanvas.width, atlasCanvas.height);
        gl.uniform1f(gl.getUniformLocation(program, "atlasCols"), atlasCols);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

        gl.bindVertexArray(vao);
        gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, NUM_PARTICLES);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});