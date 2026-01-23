float sphere(vec3 p, float r) { return length(p)-r; }
float box(vec3 p, vec3 b) { vec3 q = abs(p)-b; return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0); }
float torus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz)-t.x, p.y); return length(q)-t.y; }
float map(vec3 p) {
    float d1 = sphere(p - vec3(sin(iTime), 0.5, 5.0), 1.0);
    float d2 = box(p - vec3(-1.0, 0.5, 3.0), vec3(0.5));
    float d3 = torus(p - vec3(1.0, 0.3, 4.0), vec2(0.5,0.2));
    float d4 = sphere(p - vec3(0.0, -100.0, 0.0), 99.0);
    return min(min(d1,d2), min(d3,d4));
}
vec3 getNormal(vec3 p) {
    float eps = 0.001;
    return normalize(vec3(
        map(p + vec3(eps,0,0)) - map(p - vec3(eps,0,0)),
        map(p + vec3(0,eps,0)) - map(p - vec3(0,eps,0)),
        map(p + vec3(0,0,eps)) - map(p - vec3(0,0,eps))
    ));
}
float softShadow(vec3 ro, vec3 rd) {
    float res = 1.0;
    float t = 0.01;
    for(int i=0; i<30; i++){
        float h = map(ro + rd*t);
        res = min(res, 8.0*h/t);
        t += clamp(h,0.01,0.5);
        if(h<0.001) break;
    }
    return clamp(res,0.0,1.0);
}
float rayMarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    for(int i=0;i<100;i++){
        float d = map(ro + rd*t);
        if(d<0.001) break;
        t += d;
        if(t>20.0) break;
    }
    return t;
}
vec3 getLight(vec3 p, vec3 normal) {
    vec3 lightPos = vec3(5.0*sin(iTime),5.0,5.0*cos(iTime));
    vec3 lightDir = normalize(lightPos - p);
    float diff = max(dot(normal, lightDir),0.0);
    float shadow = softShadow(p + normal*0.001, lightDir);
    vec3 col = 0.5 + 0.5*normal;
    col = mix(col, vec3(1.0,0.8,0.6)*diff*shadow, 0.8);
    return col;
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
    vec3 ro = vec3(4.0*sin(iTime*0.3),1.5,4.0*cos(iTime*0.3)-3.0);
    vec3 target = vec3(0.0,0.5,3.0);
    vec3 f = normalize(target - ro);
    vec3 r = normalize(cross(vec3(0,1,0), f));
    vec3 u = cross(f,r);
    vec3 rd = normalize(f + uv.x*r + uv.y*u);
    float t = rayMarch(ro, rd);
    vec3 pos = ro + rd*t;
    vec3 sky = mix(vec3(0.2,0.1,0.3), vec3(0.4,0.7,1.0), uv.y + 0.5);
    vec3 color = sky;
    if(t<20.0) {
        vec3 normal = getNormal(pos);
        color = getLight(pos, normal);
        float fog = exp(-0.03*t*t);
        color = mix(sky, color, fog);
    }
    fragColor = vec4(color,1.0);
}