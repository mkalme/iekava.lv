void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float color = 0.5 + 0.5 * sin(uv.x * 10.0 + iTime) * cos(uv.y * 10.0 + iTime);
    fragColor = vec4(color, color * 0.7, 1.0 - color, 1.0);
}