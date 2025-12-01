// Plasma effect
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float color = 0.5 + 0.5 * sin(uv.x*10.0 + u_time) 
                        * cos(uv.y*10.0 + u_time);
    gl_FragColor = vec4(color, color*0.7, 1.0-color, 1.0);
}