precision mediump float;
uniform float u_time;

void main() {
    float intensity = 0.5 + 0.5 * sin(u_time);
    gl_FragColor = vec4(intensity, 0.0, 0.0, 1.0);
}