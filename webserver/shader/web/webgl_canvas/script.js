const canvas = document.getElementById('glslCanvas');
const gl = canvas.getContext('webgl');
let startTime = Date.now();

// Resize canvas to match window
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

// Clear previous errors
function clearShaderError() {
    consoleDiv.textContent = '';
    consoleBadge.style.visibility = "hidden";
}

// Create simple shader program
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    clearShaderError();

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
// Uniform locations
let timeLoc = null;
let resolutionLoc = null;

function createProgram(fragmentSrc) {
    if (program) gl.deleteProgram(program);

    const vertexSrc = `
    attribute vec4 a_position;
    void main() { gl_Position = a_position; }
  `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
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

    // Attributes
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    timeLoc = gl.getUniformLocation(program, 'u_time');
    resolutionLoc = gl.getUniformLocation(program, 'u_resolution');

    // Set resolution once
    if (resolutionLoc) {
        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    }
}


// Uniform for time
function updateTimeUniform() {
    if (!program) return;
    if (timeLoc) {
        const t = (Date.now() - startTime) / 1000;
        gl.uniform1f(timeLoc, t);
    }
}


// Draw frame
function draw() {
    updateTimeUniform();
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(draw);
}
draw();

// Update shader from editor
function updateShader() {
    createProgram(editor.getValue());
}

// Listen to editor changes
editor.on('change', () => {
    updateShader();
});

// Initialize with default editor content
updateShader();