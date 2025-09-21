#version 300 es
precision highp float;

in vec2 aPos;      // quad vertex 0..1
in vec2 aUV;       // quad UV 0..1
in vec2 aOffset;
in float aSize;
in vec3 aColor;
in float aCharIndex;

out vec2 vUV;
out vec3 vColor;

uniform vec2 uResolution;
uniform vec2 uAtlasCharSize; // width,height of one char in atlas
uniform vec2 uAtlasTexSize;  // full atlas size
uniform float atlasCols;

void main(){
    float col = mod(aCharIndex, atlasCols);
    float row = floor(aCharIndex / atlasCols);
    vec2 uvOffset = vec2(col*uAtlasCharSize.x, row*uAtlasCharSize.y)/uAtlasTexSize;
    vec2 uvScale = uAtlasCharSize / uAtlasTexSize;
    vUV = aUV * uvScale + uvOffset;
    vColor = aColor;

    vec2 pos = aPos*aSize + aOffset;
    vec2 clip = (pos / uResolution)*2.0 - 1.0;
    clip.y = -clip.y;
    gl_Position = vec4(clip,0,1);
}