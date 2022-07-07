precision highp float;
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;
uniform vec3 vLightPosition;
uniform vec3 vColor;
void main(void) {
    float ToonThresholds[2];
    ToonThresholds[0] = 0.8;
    ToonThresholds[1] = 0.2;
    float ToonBrightnessLevels[3];
    ToonBrightnessLevels[0] = 1.0;
    ToonBrightnessLevels[1] = 0.8;
    ToonBrightnessLevels[2] = 0.5;
    vec3 lightVectorW = normalize(vLightPosition - vPositionW);
    float diffuse = max(0.0, dot(vNormalW, lightVectorW));
    vec3 color = vColor;
    if (diffuse > ToonThresholds[0]) {
    color *= ToonBrightnessLevels[0];
    } else if (diffuse > ToonThresholds[1]) {
    color *= ToonBrightnessLevels[1];
    } else {
    color *= ToonBrightnessLevels[2];
    }
    gl_FragColor = vec4(color, 1.0);
}