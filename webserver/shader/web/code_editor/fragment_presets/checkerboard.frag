precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 uv = floor(gl_FragCoord.xy / 50.0);
    float checker = mod(uv.x + uv.y, 2.0);
    gl_FragColor = vec4(vec3(checker), 1.0);
}