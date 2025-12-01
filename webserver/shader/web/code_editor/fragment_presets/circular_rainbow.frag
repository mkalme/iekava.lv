precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy - 0.5;
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float r = 0.5 + 0.5 * sin(angle*5.0 + u_time);
    float g = 0.5 + 0.5 * sin(angle*5.0 + u_time + 2.0);
    float b = 0.5 + 0.5 * sin(angle*5.0 + u_time + 4.0);
    gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - radius);
}