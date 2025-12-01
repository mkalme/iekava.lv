precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float stripes = sin((uv.y + u_time) * 20.0);
    float color = 0.5 + 0.5 * stripes;
    gl_FragColor = vec4(color, color, color, 1.0);
}