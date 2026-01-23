const canvas = document.getElementById('glslCanvas');
const gl = canvas.getContext('webgl2'); // Changed from 'webgl' to 'webgl2'

if (!gl) {
    console.error('WebGL 2 not supported, falling back to WebGL 1');
    gl = canvas.getContext('webgl');
}

startTime = performance.now();

// Mouse tracking
let mouse = { x: 0, y: 0, z: 0, w: 0 };
let mouseDown = false;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = canvas.height - (e.clientY - rect.top);
});

canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouse.z = mouse.x;
    mouse.w = mouse.y;
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

// Keyboard tracking
let keysPressed = {};
window.addEventListener('keydown', (e) => {
    keysPressed[e.key.toUpperCase()] = true;
});
window.addEventListener('keyup', (e) => {
    keysPressed[e.key.toUpperCase()] = false;
});

// Resize canvas
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const consoleDiv = document.getElementById('shaderConsole');
const consoleBadge = document.getElementById('consoleBadge');

function logShaderError(message) {
    consoleDiv.textContent = message;
    consoleBadge.textContent = "!";
    consoleBadge.style.visibility = "visible";
}

function clearShaderError() {
    consoleDiv.textContent = '';
    consoleBadge.style.visibility = "hidden";
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    clearShaderError();
    startTime = performance.now();

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const msg = gl.getShaderInfoLog(shader);
        console.error("Shader compile error:", msg);
        logShaderError(`Shader compile error:\n${msg}`);
        return null;
    }
    return shader;
}

let program = null;
let uniformLocations = {};

function createProgram(fragmentSrc) {
    if (program) gl.deleteProgram(program);

    const vertexSrc = `#version 300 es
        in vec4 a_position;
        void main() { gl_Position = a_position; }
    `;

    // Add ShaderToy compatibility wrapper for WebGL 2
    const wrappedFragmentSrc = `#version 300 es
        precision highp float;
        precision highp int;
        
        // ShaderToy uniforms
        uniform float iTime;
        uniform float iTimeDelta;
        uniform float iFrame;
        uniform vec3 iResolution;
        uniform vec4 iMouse;
        uniform vec4 iDate;
        
        // Keyboard support
        uniform float iKeys[256];
        
        // Output
        out vec4 fragColor;
        
        // Helper functions
        #define CHAR_A 65.0
        #define CHAR_B 66.0
        #define CHAR_C 67.0
        #define CHAR_D 68.0
        #define CHAR_E 69.0
        #define CHAR_F 70.0
        #define CHAR_G 71.0
        #define CHAR_H 72.0
        #define CHAR_I 73.0
        #define CHAR_J 74.0
        #define CHAR_K 75.0
        #define CHAR_L 76.0
        #define CHAR_M 77.0
        #define CHAR_N 78.0
        #define CHAR_O 79.0
        #define CHAR_P 80.0
        #define CHAR_Q 81.0
        #define CHAR_R 82.0
        #define CHAR_S 83.0
        #define CHAR_T 84.0
        #define CHAR_U 85.0
        #define CHAR_V 86.0
        #define CHAR_W 87.0
        #define CHAR_X 88.0
        #define CHAR_Y 89.0
        #define CHAR_Z 90.0
        #define CHAR_0 48.0
        #define CHAR_1 49.0
        #define CHAR_2 50.0
        #define CHAR_3 51.0
        #define CHAR_4 52.0
        #define CHAR_5 53.0
        #define CHAR_6 54.0
        #define CHAR_7 55.0
        #define CHAR_8 56.0
        #define CHAR_9 57.0
        
        bool key(float keyCode) {
            int idx = int(keyCode);
            if (idx < 0 || idx >= 256) return false;
            return iKeys[idx] > 0.5;
        }
        
        // Common constants
        #define PI 3.14159265359
        #define TWOPI 6.28318530718
        
        // Hash functions (now with proper uint support!)
        uint ihash(uint x) {
            x = ((x >> 16u) ^ x) * 0x45d9f3bu;
            x = ((x >> 16u) ^ x) * 0x45d9f3bu;
            x = (x >> 16u) ^ x;
            return x;
        }
        
        float hash(float n) {
            return fract(sin(n) * 43758.5453);
        }
        
        vec3 h2rgb(float h) {
            h = fract(h);
            return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        }
        
        // Stereographic projection
        vec3 istereo(vec2 uv, out float k) {
            float r2 = dot(uv, uv);
            k = 2.0 / (1.0 + r2);
            return vec3(k * uv, k - 1.0);
        }
        
        bool alert = false;
        
        ${fragmentSrc}
        
        void main() {
            mainImage(fragColor, gl_FragCoord.xy);
        }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, wrappedFragmentSrc);
    if (!vertexShader || !fragmentShader) return;

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const msg = gl.getProgramInfoLog(program);
        console.error("Program link error:", msg);
        logShaderError(`Program link error:\n${msg}`);
        return;
    }
    gl.useProgram(program);

    // Attributes (WebGL 2 uses different attribute setup)
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    uniformLocations = {
        iTime: gl.getUniformLocation(program, 'iTime'),
        iTimeDelta: gl.getUniformLocation(program, 'iTimeDelta'),
        iFrame: gl.getUniformLocation(program, 'iFrame'),
        iResolution: gl.getUniformLocation(program, 'iResolution'),
        iMouse: gl.getUniformLocation(program, 'iMouse'),
        iDate: gl.getUniformLocation(program, 'iDate'),
        iKeys: gl.getUniformLocation(program, 'iKeys')
    };
}

let frame = 0;
let lastTime = Date.now();

function updateUniforms() {
    if (!program) return;
    
    const now = performance.now();
    const time = (now - startTime) / 1000; // seconds since start
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    
    if (uniformLocations.iTime) {
        gl.uniform1f(uniformLocations.iTime, time);
    }
    if (uniformLocations.iTimeDelta) {
        gl.uniform1f(uniformLocations.iTimeDelta, delta);
    }
    if (uniformLocations.iFrame) {
        gl.uniform1f(uniformLocations.iFrame, frame);
    }
    if (uniformLocations.iResolution) {
        gl.uniform3f(uniformLocations.iResolution, canvas.width, canvas.height, canvas.width / canvas.height);
    }
    if (uniformLocations.iMouse) {
        gl.uniform4f(uniformLocations.iMouse, mouse.x, mouse.y, mouse.z, mouse.w);
    }
    if (uniformLocations.iDate) {
        const date = new Date();
        gl.uniform4f(uniformLocations.iDate, 
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
        );
    }
    
    if (uniformLocations.iKeys) {
        const keyArray = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
            const char = String.fromCharCode(i);
            keyArray[i] = keysPressed[char] ? 1.0 : 0.0;
        }
        gl.uniform1fv(uniformLocations.iKeys, keyArray);
    }
    
    frame++;
}

function draw() {
    updateUniforms();
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(draw);
}
draw();

function updateShader() {
    createProgram(editor.getValue());
}

editor.on('change', () => {
    updateShader();
});

updateShader();