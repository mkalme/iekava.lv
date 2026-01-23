void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float intensity = 0.5 + 0.5 * sin(iTime);
    fragColor = vec4(intensity, 0.0, 0.0, 1.0);
}