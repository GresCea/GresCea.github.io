import { Mat4 } from "./math3d.js";

const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
  throw new Error("WebGL2 tidak tersedia.");
}

gl.viewport(0, 0, canvas.width, canvas.height);

gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

const vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_color;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec3 v_color;

void main() {
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
  v_color = a_color;
}`;

const fragmentShaderSource = `#version 300 es

precision highp float;

in vec3 v_color;
out vec4 outColor;

void main() {
  outColor = vec4(v_color, 1.0);
}`;

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Shader compile error:\n" + info);
  }

  return shader;
}

function createProgram(vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("Program link error:\n" + info);
  }

  return program;
}

const program = createProgram(
  createShader(gl.VERTEX_SHADER, vertexShaderSource),
  createShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
);

gl.useProgram(program);

const positionLocation = gl.getAttribLocation(program, "a_position");
const colorLocation = gl.getAttribLocation(program, "a_color");
const modelLocation = gl.getUniformLocation(program, "u_model");
const viewLocation = gl.getUniformLocation(program, "u_view");
const projectionLocation = gl.getUniformLocation(program, "u_projection");

const faceDefinitions = [
  {
    corners: [
      [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5]
    ],
    color: [0.0, 0.8, 1.0]
  },
  {
    corners: [
      [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5]
    ],
    color: [0.2, 0.3, 1.0]
  },
  {
    corners: [
      [-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5],
      [-0.5, 0.5, -0.5]
    ],
    color: [1.0, 0.5, 0.1]
  },
  {
    corners: [
      [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5],
      [0.5, 0.5, 0.5]
    ],
    color: [0.2, 1.0, 0.4]
  },
  {
    corners: [
      [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5]
    ],
    color: [1.0, 0.2, 0.8]
  },
  {
    corners: [
      [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5]
    ],
    color: [1.0, 0.9, 0.1]
  }
];

const cubePositions = [];
const cubeColors = [];

for (const face of faceDefinitions) {
  const [a, b, c, d] = face.corners;
  const triangleVertices = [a, b, c, a, c, d];

  for (const vertex of triangleVertices) {
    cubePositions.push(...vertex);
    cubeColors.push(...face.color);
  }
}

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(cubePositions),
  gl.STATIC_DRAW
);

gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(
  positionLocation,
  3,
  gl.FLOAT,
  false,
  0,
  0
);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(cubeColors),
  gl.STATIC_DRAW
);

gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(
  colorLocation,
  3,
  gl.FLOAT,
  false,
  0,
  0
);

function degToRad(degree) {
  return degree * Math.PI / 180;
}

const cube = {
  rotationX: 20,
  rotationY: 30
};

const camera = {
  position: [0.0, 1.5, 4.0],
  target: [0.0, 0.0, 0.0],
  up: [0.0, 1.0, 0.0]
};

const projectionState = {
  mode: "perspective",
  fov: 60,
  near: 0.1,
  far: 100.0
};

const clipPresets = [
  { near: 0.1, far: 100 },
  { near: 1.0, far: 20 },
  { near: 2.5, far: 8 }
];

let clipPresetIndex = 0;
let depthEnabled = true;
let cubePaused = false;
const keys = {};

function createModelMatrix(position = [0, 0, 0], scale = 1) {
  const translation = Mat4.translation(position[0], position[1], position[2]);
  const rotationX = Mat4.rotationX(degToRad(cube.rotationX));
  const rotationY = Mat4.rotationY(degToRad(cube.rotationY));
  const scaling = Mat4.scaling(scale, scale, scale);

  let model = Mat4.identity();
  model = Mat4.multiply(model, translation);
  model = Mat4.multiply(model, rotationX);
  model = Mat4.multiply(model, rotationY);
  model = Mat4.multiply(model, scaling);
  return model;
}

function createProjectionMatrix() {
  const aspect = canvas.width / canvas.height;

  if (projectionState.mode === "perspective") {
    return Mat4.perspective(
      degToRad(projectionState.fov),
      aspect,
      projectionState.near,
      projectionState.far
    );
  }

  const size = 2.0;
  return Mat4.orthographic(
    -size * aspect,
    size * aspect,
    -size,
    size,
    projectionState.near,
    projectionState.far
  );
}

function updateCube(dt) {
  if (cubePaused) return;

  cube.rotationX += 25 * dt;
  cube.rotationY += 40 * dt;
}


function updateCamera(dt) {
  const cameraSpeed = 2.0;

  if (keys.arrowleft) camera.position[0] -= cameraSpeed * dt;
  if (keys.arrowright) camera.position[0] += cameraSpeed * dt;
  if (keys.arrowup) camera.position[1] += cameraSpeed * dt;
  if (keys.arrowdown) camera.position[1] -= cameraSpeed * dt;
  if (keys.w) camera.position[2] -= cameraSpeed * dt;
  if (keys.s) camera.position[2] += cameraSpeed * dt;

  camera.position[1] = Math.max(-2.5, Math.min(4.5, camera.position[1]));
  camera.position[2] = Math.max(1.5, Math.min(12, camera.position[2]));
}

function updateFOV(dt) {
  const fovSpeed = 35.0;
  if (keys["["]) projectionState.fov -= fovSpeed * dt;
  if (keys["]"]) projectionState.fov += fovSpeed * dt;
  projectionState.fov = Math.max(30, Math.min(100, projectionState.fov));
}

function nextClipPreset() {
  clipPresetIndex = (clipPresetIndex + 1) % clipPresets.length;
  projectionState.near = clipPresets[clipPresetIndex].near;
  projectionState.far = clipPresets[clipPresetIndex].far;
}

function resetScene() {
  camera.position = [0.0, 1.5, 4.0];
  projectionState.mode = "perspective";
  projectionState.fov = 60;
  projectionState.near = 0.1;
  projectionState.far = 100.0;
  clipPresetIndex = 0;
  depthEnabled = true;
  cubePaused = false;
  cube.rotationX = 20;
  cube.rotationY = 30;
}

function drawCube(model, view, projection, position) {
  gl.uniformMatrix4fv(modelLocation, false, Mat4.multiply(model, Mat4.translation(...position)));
  gl.uniformMatrix4fv(viewLocation, false, view);
  gl.uniformMatrix4fv(projectionLocation, false, projection);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
}

const projectionInfo = document.getElementById("projectionInfo");
const cameraInfo = document.getElementById("cameraInfo");
const fovInfo = document.getElementById("fovInfo");
const clipInfo = document.getElementById("clipInfo");
const depthInfo = document.getElementById("depthInfo");

function updateHUD() {
  projectionInfo.textContent = projectionState.mode;
  cameraInfo.textContent = `(${camera.position[0].toFixed(2)}, ${camera.position[1].toFixed(2)}, ${camera.position[2].toFixed(2)})`;
  fovInfo.textContent = `${projectionState.fov.toFixed(1)}°`;
  clipInfo.textContent = `${projectionState.near} / ${projectionState.far}`;
  depthInfo.textContent = depthEnabled ? "ON" : "OFF";
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  keys[key] = true;

  if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }

  if (event.repeat) return;
  if (key === "p") {
    projectionState.mode = projectionState.mode === "perspective"
      ? "orthographic"
      : "perspective";
  }
  if (key === "n") nextClipPreset();
  if (key === "d") depthEnabled = !depthEnabled;
  if (key === "k") cubePaused = !cubePaused;
  if (key === "r") resetScene();
  if (key === "1") projectionState.fov = 35;
  if (key === "2") projectionState.fov = 60;
  if (key === "3") projectionState.fov = 90;
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

let lastTime = 0;
function render(time) {
  const dt = Math.min((time - lastTime) * 0.001 || 0, 0.05);
  lastTime = time;

  updateCube(dt);
  updateCamera(dt);
  updateFOV(dt);

  if (depthEnabled) {
    gl.enable(gl.DEPTH_TEST);
  } else {
    gl.disable(gl.DEPTH_TEST);
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.03, 0.05, 0.10, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);

  const model = createModelMatrix();
  const view = Mat4.lookAt(camera.position, camera.target, camera.up);
  const projection = createProjectionMatrix();

  drawCube(model, view, projection, [0, 0, 0]);
  drawCube(model, view, projection, [-1.45, 0, -1.5]);
  drawCube(model, view, projection, [1.45, 0, 1.5]);

  updateHUD();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
