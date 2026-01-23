void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float stripes = sin((uv.y + iTime) * 20.0);
    float color = 0.5 + 0.5 * stripes;
    fragColor = vec4(color, color, color, 1.0);
}