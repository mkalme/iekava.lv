precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float r = uv.x + 0.5 * sin(u_time);
    float g = uv.y + 0.5 * cos(u_time);
    float b = 0.5 + 0.5 * sin(u_time + uv.x + uv.y);
    gl_FragColor = vec4(r, g, b, 1.0);
}