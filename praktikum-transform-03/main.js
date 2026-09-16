import { Mat3 } from "./matrix3.js";

const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
  throw new Error("WebGL2 tidak tersedia.");
}

gl.viewport(0, 0, canvas.width, canvas.height);

const vertices = new Float32Array([
  -0.18, -0.15,
   0.18, -0.15,
   0.00,  0.22
]);

const vertexShaderSource = `#version 300 es

in vec2 a_position;

uniform mat3 u_matrix;

void main() {
  vec3 p = u_matrix * vec3(a_position, 1.0);
  gl_Position = vec4(p.xy, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

function createShader(glContext, type, source) {
  const shader = glContext.createShader(type);
  glContext.shaderSource(shader, source);
  glContext.compileShader(shader);

  const success = glContext.getShaderParameter(
    shader,
    glContext.COMPILE_STATUS
  );

  if (!success) {
    const info = glContext.getShaderInfoLog(shader);
    glContext.deleteShader(shader);
    throw new Error("Shader compile error:\n" + info);
  }

  return shader;
}

function createProgram(glContext, vertexShader, fragmentShader) {
  const program = glContext.createProgram();
  glContext.attachShader(program, vertexShader);
  glContext.attachShader(program, fragmentShader);
  glContext.linkProgram(program);

  const success = glContext.getProgramParameter(
    program,
    glContext.LINK_STATUS
  );

  if (!success) {
    const info = glContext.getProgramInfoLog(program);
    glContext.deleteProgram(program);
    throw new Error("Program link error:\n" + info);
  }

  return program;
}

const vertexShader = createShader(
  gl,
  gl.VERTEX_SHADER,
  vertexShaderSource
);

const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

const program = createProgram(
  gl,
  vertexShader,
  fragmentShader
);

gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(
  program,
  "a_position"
);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(
  positionLocation,
  2,
  gl.FLOAT,
  false,
  0,
  0
);

const matrixLocation = gl.getUniformLocation(
  program,
  "u_matrix"
);

const colorLocation = gl.getUniformLocation(
  program,
  "u_color"
);

function degToRad(degree) {
  return degree * Math.PI / 180;
}

const objectA = {
  x: -0.35,
  y: 0.0,
  rotation: 0.0,
  scaleX: 1.0,
  scaleY: 1.0
};

const colorA = new Float32Array([
  0.10,
  0.75,
  1.00,
  1.00
]);

const colorB = new Float32Array([
  1.00,
  0.55,
  0.10,
  1.00
]);

function createTRSMatrix(transform) {
  const t = Mat3.translation(transform.x, transform.y);
  const r = Mat3.rotation(degToRad(transform.rotation));
  const s = Mat3.scaling(transform.scaleX, transform.scaleY);

  let matrix = Mat3.identity();
  matrix = Mat3.multiply(matrix, s);
  matrix = Mat3.multiply(matrix, r);
  matrix = Mat3.multiply(matrix, t);

  return matrix;
}

function createRTMatrix(transform) {
  const t = Mat3.translation(transform.x, transform.y);
  const r = Mat3.rotation(degToRad(transform.rotation));

  let matrix = Mat3.identity();
  matrix = Mat3.multiply(matrix, t);
  matrix = Mat3.multiply(matrix, r);

  return matrix;
}

function drawObject(matrix, color) {
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
  gl.uniform4fv(colorLocation, color);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

const axisVertices = new Float32Array([
  -1.0, 0.0,
   1.0, 0.0,
   0.0, -1.0,
   0.0, 1.0
]);

const axisBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
gl.bufferData(gl.ARRAY_BUFFER, axisVertices, gl.STATIC_DRAW);

function drawAxes() {
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.uniformMatrix3fv(matrixLocation, false, Mat3.identity());
  gl.uniform4fv(colorLocation, new Float32Array([0.25, 0.35, 0.45, 1.0]));
  gl.drawArrays(gl.LINES, 0, 4);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

function createObjectBMatrix(seconds) {
  const rotation = seconds * 70.0;
  const scale = 1.0 + Math.sin(seconds * 2.0) * 0.25;

  const transformB = {
    x: 0.42,
    y: 0.0,
    rotation,
    scaleX: scale,
    scaleY: scale
  };

  return createTRSMatrix(transformB);
}

function drawScene(seconds) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.03, 0.05, 0.10, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  drawAxes();
  drawObject(createTRSMatrix(objectA), colorA);
  drawObject(createObjectBMatrix(seconds), colorB);
}

const keys = {};

window.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;

  if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }

  if (
    event.key.toLowerCase() === "r" &&
    !event.repeat
  ) {
    resetObjectA();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

const moveSpeed = 0.65;
const rotationSpeed = 100.0;
const scaleSpeed = 0.8;

function updateTranslation(dt) {
  if (keys["arrowleft"]) {
    objectA.x -= moveSpeed * dt;
  }

  if (keys["arrowright"]) {
    objectA.x += moveSpeed * dt;
  }

  if (keys["arrowup"]) {
    objectA.y += moveSpeed * dt;
  }

  if (keys["arrowdown"]) {
    objectA.y -= moveSpeed * dt;
  }
}

function updateRotation(dt) {
  if (keys.q) {
    objectA.rotation -= rotationSpeed * dt;
  }

  if (keys.e) {
    objectA.rotation += rotationSpeed * dt;
  }
}

function updateUniformScale(dt) {
  if (keys["+"] || keys["="]) {
    objectA.scaleX += scaleSpeed * dt;
    objectA.scaleY += scaleSpeed * dt;
  }

  if (keys["-"] || keys["_"]) {
    objectA.scaleX -= scaleSpeed * dt;
    objectA.scaleY -= scaleSpeed * dt;
  }
}

function updateNonUniformScale(dt) {
  if (keys.z) {
    objectA.scaleX -= scaleSpeed * dt;
  }

  if (keys.x) {
    objectA.scaleX += scaleSpeed * dt;
  }

  if (keys.c) {
    objectA.scaleY -= scaleSpeed * dt;
  }

  if (keys.v) {
    objectA.scaleY += scaleSpeed * dt;
  }
}

function clampObjectA() {
  objectA.x = Math.max(-0.8, Math.min(0.8, objectA.x));
  objectA.y = Math.max(-0.75, Math.min(0.75, objectA.y));
  objectA.scaleX = Math.max(0.2, Math.min(2.5, objectA.scaleX));
  objectA.scaleY = Math.max(0.2, Math.min(2.5, objectA.scaleY));
}

function resetObjectA() {
  objectA.x = -0.35;
  objectA.y = 0.0;
  objectA.rotation = 0.0;
  objectA.scaleX = 1.0;
  objectA.scaleY = 1.0;
}

function update(dt) {
  updateTranslation(dt);
  updateRotation(dt);
  updateUniformScale(dt);
  updateNonUniformScale(dt);
  clampObjectA();
}

const positionInfo = document.getElementById("positionInfo");
const rotationInfo = document.getElementById("rotationInfo");
const scaleInfo = document.getElementById("scaleInfo");

function updateHUD() {
  positionInfo.textContent =
    `(${objectA.x.toFixed(2)}, ${objectA.y.toFixed(2)})`;

  rotationInfo.textContent =
    `${objectA.rotation.toFixed(1)}°`;

  scaleInfo.textContent =
    `(${objectA.scaleX.toFixed(2)}, ${objectA.scaleY.toFixed(2)})`;
}

let lastTime = 0;

function render(time) {
  const seconds = time * 0.001;
  let dt = (time - lastTime) * 0.001;
  lastTime = time;
  dt = Math.min(dt, 0.05);

  update(dt);
  updateHUD();
  drawScene(seconds);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

void createRTMatrix;