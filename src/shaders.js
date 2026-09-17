export const vertexShader = () => `#version 300 es
layout(location = 0) in vec3 aFrom;
layout(location = 1) in float aShadeFrom;
layout(location = 2) in vec3 aTo;
layout(location = 3) in float aShadeTo;
layout(location = 4) in vec2 aSeed;
uniform mat3 uRot;
uniform float uT;       // progress of this transition, 0-1
uniform float uSpread;  // how far past the frame the scatter point sits
uniform float uTime;
uniform float uJitter;
uniform vec2 uScale;
uniform vec2 uOffsetFrom; // layout change: old translation (clip space)
uniform vec2 uOffsetTo;   // layout change: new translation
uniform float uOffsetT;   // layout flight progress 0-1 (staggered per grain by seed)
uniform float uPuff;      // slight outward puff while flying to the new layout
uniform float uPointSize;
out float vAlpha;

uniform float STAGGER;
uniform float SCATTER_PHASE;
uniform float REACH;
uniform float SCATTER_DEPTH;
uniform float PICTURE_SCALE;
uniform float GRAIN_MIN;
uniform float GRAIN_SPREAD;
uniform float DEPTH_CONTRAST;
uniform float FLIGHT_FADE;
// Imaginary camera distance; only drives size and alpha by depth, never position (orthographic).
const float CAMERA = 2.3;

float ease(float x) { return x * x * (3.0 - 2.0 * x); }
float easeOut(float x) { return 1.0 - (1.0 - x) * (1.0 - x); }

void main() {
  // Stagger each grain's start so the mass reads as sand, not a sliding block.
  float t = clamp((uT - aSeed.x * STAGGER) / (1.0 - STAGGER), 0.0, 1.0);
  // Scatter point: the target pushed radially past the frame and a little away from camera.
  vec2 radial = normalize(aTo.xy + vec2(1e-4, 0.0));
  float reach = uSpread * REACH * (1.0 + aSeed.y);
  vec3 scatter = vec3(aTo.xy + radial * reach, aTo.z - SCATTER_DEPTH * (1.0 + 1.6 * aSeed.y));
  // First leg: burst outward from the previous picture (ease-out); second leg: gather
  // back in from all sides (ease-out, then settle gently).
  vec3 p;
  float flight;
  if (t < SCATTER_PHASE) {
    float k = t / SCATTER_PHASE;
    p = mix(aFrom, scatter, easeOut(k));
    flight = k;
  } else {
    float k = (t - SCATTER_PHASE) / (1.0 - SCATTER_PHASE);
    p = mix(scatter, aTo, ease(easeOut(k)));
    flight = 1.0 - k;
  }
  // Layout change: each grain flies from its old to its new spot on its own staggered
  // schedule, puffing outward a little on the way.
  float ot = clamp((uOffsetT - aSeed.x * STAGGER) / (1.0 - STAGGER), 0.0, 1.0);
  vec2 off = mix(uOffsetFrom, uOffsetTo, ease(ot));
  p.xy += radial * uPuff * sin(ot * 3.14159) * (0.4 + 0.6 * aSeed.y);
  // Once settled, every grain jitters a little on its own.
  float tt = uTime + aSeed.x * 6.2831;
  p.xy += uJitter * vec2(sin(tt * 1.3 + aSeed.y * 7.0), cos(tt * 1.1 + aSeed.x * 3.0));
  p = uRot * p;
  // Orthographic: with no tilt, depth never moves a grain, so the picture stays undistorted;
  // depth shows only as parallax under tilt (rotation mixes z into xy) and near-big far-small.
  float depth = 1.0 / max(0.1, CAMERA - p.z);
  vec2 xy = p.xy * PICTURE_SCALE;
  gl_Position = vec4(xy * uScale + off, clamp(-p.z * 0.12, -0.99, 0.99), 1.0);
  // Near grains are bigger and denser, far ones smaller and fainter; grains also vary in size.
  float grain = GRAIN_MIN + GRAIN_SPREAD * fract(aSeed.y * 7.31 + aSeed.x * 3.17);
  gl_PointSize = uPointSize * mix(1.0, 0.3 + 1.6 * depth, DEPTH_CONTRAST) * grain;
  float shade = mix(aShadeFrom, aShadeTo, smoothstep(0.3, 0.7, t));
  // Grains in flight fade a little; distant ones more, so the intro ring emerges from haze.
  float far = 0.15 + 0.85 * smoothstep(-2.4, -0.4, p.z);
  float near = mix(1.0, 0.6 + 0.4 * smoothstep(-0.3, 0.5, p.z), DEPTH_CONTRAST);
  vAlpha = shade * (1.0 - FLIGHT_FADE * flight) * far * near;
}`;
export const fragmentShader = () => `#version 300 es
precision mediump float;
uniform vec4 uColor;
in float vAlpha;
out vec4 o;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d);
  if (r > 0.25) discard;
  float edge = 1.0 - smoothstep(0.12, 0.25, r);
  o = uColor * (vAlpha * edge);
}`;
