void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy - 0.5;

    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    float r = 0.5 + 0.5 * sin(angle * 5.0 + iTime);
    float g = 0.5 + 0.5 * sin(angle * 5.0 + iTime + 2.0);
    float b = 0.5 + 0.5 * sin(angle * 5.0 + iTime + 4.0);

    vec3 col = vec3(r, g, b) * (1.0 - radius);

    fragColor = vec4(col, 1.0);
}