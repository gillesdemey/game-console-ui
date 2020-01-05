import React from 'react'
import { Node, Shaders, GLSL } from 'gl-react'

const shaders = Shaders.create({
  Darken: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D texture;
uniform float brightness;
const vec3 L = vec3(0.2125, 0.7154, 0.0721);

void main() {
  vec4 c = texture2D(texture, uv);
  vec3 brt = c.rgb * brightness;

	gl_FragColor = vec4(mix(
    vec3(0.5),
    mix(vec3(dot(brt, L)), brt, 1.0),
    1.0), c.a);
}` }
})

// this shader will reduce the brightness of the texture,
// essentially mixing it with black
const Darken = ({ brightness, children }) => (
  <Node
    shader={shaders.Darken}
    uniforms={{ brightness, texture: children }}
  />
)

export {
  Darken
}
