// ShaderToy-compatible shader preset
// Copy this template for creating new shaders

// ===== AVAILABLE INPUTS =====

// iTime          : float - Current time in seconds since shader start
// iTimeDelta     : float - Time elapsed since last frame in seconds
// iFrame         : float - Current frame number
// iResolution    : vec3  - Viewport resolution (width, height, aspect ratio)
//                         	Example: iResolution.xy for width/height
// iMouse         : vec4  - Mouse position (x, y, click_x, click_y)
//                         .xy = current position, .zw = click position
// iDate          : vec4  - Current date (year, month, day, time in seconds)

// key(CHAR_X)    : bool  - Returns true if key X is pressed
//                         	Available: CHAR_A to CHAR_Z, CHAR_0 to CHAR_9

// ===== AVAILABLE CONSTANTS =====
// PI             : 3.14159265359
// TWOPI          : 6.28318530718

// ===== HELPER FUNCTIONS =====
// ihash(uint x)           : Hash function for unsigned integers
// hash(float n)           : Hash function for floats
// h2rgb(float h)          : Convert hue (0-1) to RGB color
// istereo(vec2, out float): Stereographic projection

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec3 col = vec3(0.0);
    fragColor = vec4(col, 1.0);
}