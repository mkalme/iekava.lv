// Complex fractal / Mandelbrot-inspired shader
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

// Function to compute a simple fractal
float mandelbrot(vec2 c) {
    vec2 z = vec2(0.0);
    float iterations = 0.0;
    const float maxIter = 50.0;
    for (float i = 0.0; i < maxIter; i++) {
        z = vec2(
            z.x*z.x - z.y*z.y + c.x,
            2.0*z.x*z.y + c.y
        );
        if (length(z) > 4.0) break;
        iterations += 1.0;
    }
    return iterations / maxIter;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution.xy) / u_resolution.y;
    
    // Animate zoom/pan over time
    float t = u_time * 0.2;
    vec2 c = uv * 2.0 - vec2(sin(t)*0.5, cos(t)*0.5);
    
    float m = mandelbrot(c * 1.5);

    // Color mapping
    vec3 col = vec3(
        0.5 + 0.5*cos(3.0 + m*5.0 + t),
        0.5 + 0.5*sin(1.0 + m*5.0 + t),
        0.5 + 0.5*cos(2.0 + m*10.0 - t)
    );

    gl_FragColor = vec4(col, 1.0);
}