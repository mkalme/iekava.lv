void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float r = uv.x + 0.5 * sin(iTime);
    float g = uv.y + 0.5 * cos(iTime);
    float b = 0.5 + 0.5 * sin(iTime + uv.x + uv.y);
    fragColor = vec4(r, g, b, 1.0);
}