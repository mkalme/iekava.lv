#version 300 es
precision highp float;

in vec2 vUV;
in vec3 vColor;
out vec4 outColor;

uniform sampler2D uTexture;

void main(){
    float alpha = texture(uTexture,vUV).r; // red channel for white glyphs
    outColor = vec4(vColor, alpha);
}
