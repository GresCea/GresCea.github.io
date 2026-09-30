import { Mat4, Vec3, normalMatrixFromMat4 } from "./math3d.js";

const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
  throw new Error("WebGL2 tidak tersedia.");
}

gl.enable(gl.DEPTH_TEST);

// ============================================================
// Canvas
// ============================================================

function autoResize() {
  const dpr = window.devicePixelRatio || 1;

  const width = Math.round(canvas.clientWidth * dpr);
  const height = Math.round(canvas.clientHeight * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", autoResize);
autoResize();

// ============================================================
// Shaders
// ============================================================

const vertexSource = `#version 300 es
in vec3 a_position;
in vec3 a_normal;
in vec2 a_texCoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normalMatrix;
uniform float u_uvScale;

out vec3 v_worldPosition;
out vec3 v_normal;
out vec2 v_texCoord;

void main() {
  vec4 worldPosition = u_model * vec4(a_position, 1.0);

  v_worldPosition = worldPosition.xyz;
  v_normal = normalize(u_normalMatrix * a_normal);
  v_texCoord = a_texCoord * u_uvScale;

  gl_Position = u_projection * u_view * worldPosition;
}
`;

const fragmentSource = `#version 300 es
precision highp float;

in vec3 v_worldPosition;
in vec3 v_normal;
in vec2 v_texCoord;

uniform vec3 u_lightPosition;
uniform vec3 u_lightColor;
uniform vec3 u_cameraPosition;
uniform float u_ambientStrength;
uniform float u_shininess;
uniform sampler2D u_texture;
uniform bool u_useTexture;
uniform bool u_useAmbient;
uniform bool u_useDiffuse;
uniform bool u_useSpecular;

out vec4 outColor;

void main() {
  vec3 N = normalize(v_normal);
  vec3 L = normalize(u_lightPosition - v_worldPosition);
  vec3 V = normalize(u_cameraPosition - v_worldPosition);

  float diffuseFactor = max(dot(N, L), 0.0);

  vec3 reflection = reflect(-L, N);

  float specularFactor = 0.0;

  if (diffuseFactor > 0.0) {
    specularFactor =
      pow(max(dot(reflection, V), 0.0), u_shininess);
  }

  vec3 texColor = texture(u_texture, v_texCoord).rgb;

  vec3 ambient = u_useAmbient ? u_ambientStrength * u_lightColor : vec3(0.0);
  vec3 diffuse = u_useDiffuse ? diffuseFactor * u_lightColor : vec3(0.0);
  vec3 specular = u_useSpecular ? specularFactor * u_lightColor : vec3(0.0);


  outColor = vec4(texColor * (ambient + diffuse) + specular, 1.0);
}
`;

const lightVertexSource = `#version 300 es
in vec3 a_position;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {
  gl_Position =
    u_projection *
    u_view *
    u_model *
    vec4(a_position, 1.0);
}
`;

const lightFragmentSource = `#version 300 es
precision highp float;

uniform vec3 u_lightColor;

out vec4 outColor;

void main() {
  outColor = vec4(u_lightColor, 1.0);
}
`;

// ============================================================
// Shader & Program Helpers
// ============================================================

function createShader(type, source) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Gagal membuat shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);

    throw new Error(`Shader compilation gagal:\n${error}`);
  }

  return shader;
}

function createProgram(vertexShader, fragmentShader) {
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Gagal membuat WebGL program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);

    throw new Error(`Program linking gagal:\n${error}`);
  }

  return program;
}

const vertexShader = createShader(
  gl.VERTEX_SHADER,
  vertexSource
);

const fragmentShader = createShader(
  gl.FRAGMENT_SHADER,
  fragmentSource
);

const gpuProgram = createProgram(
  vertexShader,
  fragmentShader
);

const lightProgram = createProgram(
  createShader(gl.VERTEX_SHADER, lightVertexSource),
  createShader(gl.FRAGMENT_SHADER, lightFragmentSource)
);

// ============================================================
// Shader Locations
// ============================================================

const locations = {
  position: gl.getAttribLocation(gpuProgram, "a_position"),
  normal: gl.getAttribLocation(gpuProgram, "a_normal"),
  uv: gl.getAttribLocation(gpuProgram, "a_texCoord"),

  model: gl.getUniformLocation(gpuProgram, "u_model"),
  view: gl.getUniformLocation(gpuProgram, "u_view"),
  projection: gl.getUniformLocation(gpuProgram, "u_projection"),
  normalMatrix: gl.getUniformLocation(
    gpuProgram,
    "u_normalMatrix"
  ),

  light: gl.getUniformLocation(
    gpuProgram,
    "u_lightPosition"
  ),

  lightColor: gl.getUniformLocation(
    gpuProgram,
    "u_lightColor"
  ),

  camera: gl.getUniformLocation(
    gpuProgram,
    "u_cameraPosition"
  ),

  ambient: gl.getUniformLocation(
    gpuProgram,
    "u_ambientStrength"
  ),

  shininess: gl.getUniformLocation(
    gpuProgram,
    "u_shininess"
  ),

  texture: gl.getUniformLocation(
    gpuProgram,
    "u_texture"
  ),

  uvScale: gl.getUniformLocation(
    gpuProgram,
    "u_uvScale"
  ),

  useAmbient: gl.getUniformLocation(
    gpuProgram,
    "u_useAmbient"
  ),

  useDiffuse: gl.getUniformLocation(
    gpuProgram,
    "u_useDiffuse"
  ),

  useSpecular: gl.getUniformLocation(
    gpuProgram,
    "u_useSpecular"
  ),
};

const lightLocations = {
  position: gl.getAttribLocation(
    lightProgram,
    "a_position"
  ),

  model: gl.getUniformLocation(
    lightProgram,
    "u_model"
  ),

  view: gl.getUniformLocation(
    lightProgram,
    "u_view"
  ),

  projection: gl.getUniformLocation(
    lightProgram,
    "u_projection"
  ),

  color: gl.getUniformLocation(
    lightProgram,
    "u_lightColor"
  ),
};

// ============================================================
// Cube Geometry
// ============================================================

const faces = [
  [
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, 0.5],
    [0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [0, 0, 1],
  ],
  [
    [0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0, 0, -1],
  ],
  [
    [-0.5, -0.5, -0.5],
    [-0.5, -0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, 0.5, -0.5],
    [-1, 0, 0],
  ],
  [
    [0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, 0.5, 0.5],
    [1, 0, 0],
  ],
  [
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [0, 1, 0],
  ],
  [
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],
    [0.5, -0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [0, -1, 0],
  ],
];

const positions = [];
const flatNormals = [];
const smoothNormals = [];
const uvs = [];

for (const [a, b, c, d, normal] of faces) {
  const vertices = [a, b, c, a, c, d];

  for (const vertex of vertices) {
    positions.push(...vertex);
    flatNormals.push(...normal);

    // Vertex cube normals.
    // Untuk cube yang benar-benar smooth, normal harus
    // merupakan hasil rata-rata face normals pada setiap corner.
    const length = Math.hypot(...vertex);

    smoothNormals.push(
      vertex[0] / length,
      vertex[1] / length,
      vertex[2] / length
    );
  }

  uvs.push(
    0, 0,
    1, 0,
    1, 1,

    0, 0,
    1, 1,
    0, 1
  );
}

// ============================================================
// Buffer Helpers
// ============================================================

function createBuffer(data) {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error("Gagal membuat buffer.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(data),
    gl.STATIC_DRAW
  );

  return buffer;
}

function setAttribute(buffer, location, size) {
  if (location < 0) {
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.enableVertexAttribArray(location);

  gl.vertexAttribPointer(
    location,
    size,
    gl.FLOAT,
    false,
    0,
    0
  );
}

const positionBuffer = createBuffer(positions);
const flatBuffer = createBuffer(flatNormals);
const smoothBuffer = createBuffer(smoothNormals);
const uvBuffer = createBuffer(uvs);

// ============================================================
// Light Geometry
// ============================================================

const lightVertices = [
  -0.12, -0.12, 0.12,
   0.12, -0.12, 0.12,
   0.12,  0.12, 0.12,

  -0.12, -0.12, 0.12,
   0.12,  0.12, 0.12,
  -0.12,  0.12, 0.12,

   0.12, -0.12, -0.12,
  -0.12, -0.12, -0.12,
  -0.12,  0.12, -0.12,

   0.12, -0.12, -0.12,
  -0.12,  0.12, -0.12,
   0.12,  0.12, -0.12,

  -0.12, -0.12, -0.12,
  -0.12, -0.12,  0.12,
  -0.12,  0.12,  0.12,

  -0.12, -0.12, -0.12,
  -0.12,  0.12,  0.12,
  -0.12,  0.12, -0.12,

   0.12, -0.12,  0.12,
   0.12, -0.12, -0.12,
   0.12,  0.12, -0.12,

   0.12, -0.12,  0.12,
   0.12,  0.12, -0.12,
   0.12,  0.12,  0.12,

  -0.12,  0.12,  0.12,
   0.12,  0.12,  0.12,
   0.12,  0.12, -0.12,

  -0.12,  0.12,  0.12,
   0.12,  0.12, -0.12,
  -0.12,  0.12, -0.12,

  -0.12, -0.12, -0.12,
   0.12, -0.12, -0.12,
   0.12, -0.12,  0.12,

  -0.12, -0.12, -0.12,
   0.12, -0.12,  0.12,
  -0.12, -0.12,  0.12
];

const lightPositionBuffer = createBuffer(
  lightVertices
);

// ============================================================
// Texture
// ============================================================

function createTexture() {
  const source = document.createElement("canvas");

  source.width = 64;
  source.height = 64;

  const context = source.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D tidak tersedia.");
  }

  const cellCount = 8;
  const cellSize = 8;

  for (let y = 0; y < cellCount; y++) {
    for (let x = 0; x < cellCount; x++) {
      context.fillStyle =
        (x + y) % 2 === 0
          ? "#f8fafc"
          : "#0ea5e9";

      context.fillRect(
        x * cellSize,
        y * cellSize,
        cellSize,
        cellSize
      );
    }
  }

  const texture = gl.createTexture();

  if (!texture) {
    throw new Error("Gagal membuat texture.");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    source
  );

  gl.generateMipmap(gl.TEXTURE_2D);

  return texture;
}

const texture = createTexture();

const filterModes = [
  "LINEAR",
  "NEAREST",
];

const wrapModes = [
  "REPEAT",
  "CLAMP_TO_EDGE",
  "MIRRORED_REPEAT",
];

let filterIndex = 0;
let wrapIndex = 0;

// ============================================================
// Scene State
// ============================================================

let shadingMode = "FLAT";
let uvScale = 1;
let shininess = 32;
let ambientStrength = 0.18;
let cubePaused = false;

const cube = {
  rotationX: 20,
  rotationY: 30,
};

const camera = {
  position: [0, 1.4, 4],
  target: [0, 0, 0],
  up: [0, 1, 0],
};

const light = {
  position: [2, 2, 2],
};

let components = {
  ambient: true,
  diffuse: true,
  specular: true,
}

const keys = Object.create(null);

// ============================================================
// Texture State
// ============================================================

function applyTextureState() {
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const filter =
    filterModes[filterIndex] === "LINEAR"
      ? gl.LINEAR
      : gl.NEAREST;

  const wrapModesGL = [
    gl.REPEAT,
    gl.CLAMP_TO_EDGE,
    gl.MIRRORED_REPEAT,
  ];

  const wrap = wrapModesGL[wrapIndex];

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    filter
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    filter
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_S,
    wrap
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_T,
    wrap
  );
}

// ============================================================
// Math Helpers
// ============================================================

function degToRad(value) {
  return value * Math.PI / 180;
}

function getModelMatrix() {
  let model = Mat4.identity();

  model = Mat4.multiply(
    model,
    Mat4.rotationX(
      degToRad(cube.rotationX)
    )
  );

  model = Mat4.multiply(
    model,
    Mat4.rotationY(
      degToRad(cube.rotationY)
    )
  );

  return model;
}

// ============================================================
// Input & Update
// ============================================================

function updateCube(deltaTime) {
  if (cubePaused) {
    return;
  }

  cube.rotationX += 25 * deltaTime;
  cube.rotationY += 40 * deltaTime;
}

function update(deltaTime) {
  const speed = 2;

  // Light movement
  if (keys.arrowleft) {
    light.position[0] -= speed * deltaTime;
  }

  if (keys.arrowright) {
    light.position[0] += speed * deltaTime;
  }

  if (keys.arrowup) {
    light.position[1] += speed * deltaTime;
  }

  if (keys.arrowdown) {
    light.position[1] -= speed * deltaTime;
  }

  if (keys.w) {
    light.position[2] -= speed * deltaTime;
  }

  if (keys.s) {
    light.position[2] += speed * deltaTime;
  }

  // Manual cube rotation
  if (keys.i) {
    cube.rotationX -= 40 * deltaTime;
  }

  if (keys.k) {
    cube.rotationX += 40 * deltaTime;
  }

  if (keys.j) {
    cube.rotationY -= 40 * deltaTime;
  }

  if (keys.l) {
    cube.rotationY += 40 * deltaTime;
  }

  // UV scale
  if (keys["["]) {
    uvScale = Math.max(
      0.25,
      uvScale - 1.5 * deltaTime
    );
  }

  if (keys["]"]) {
    uvScale = Math.min(
      5,
      uvScale + 1.5 * deltaTime
    );
  }

  // Shininess
  if (keys["-"]) {
    shininess = Math.max(
      2,
      shininess - 50 * deltaTime
    );
  }

  if (keys["_"]) {
    shininess = Math.min(
      128,
      shininess + 50 * deltaTime
    );
  }

  // Ambient Strength
  if (keys["="]) {
    ambientStrength = Math.max(
      0,
      ambientStrength - 0.5 * deltaTime
    );
  }

  if (keys["+"]) {
    ambientStrength = Math.min(
      1,
      ambientStrength + 0.5 * deltaTime
    );
  }
}

function reset() {
  light.position = [2, 2, 2];
  ambientStrength = 0.18;

  cube.rotationX = 20;
  cube.rotationY = 30;

  shadingMode = "FLAT";
  filterIndex = 0;
  wrapIndex = 0;
  uvScale = 1;
  shininess = 32;
  cubePaused = false;
  components.ambient = true;
  components.diffuse = true;
  components.specular = true;

  for (const key in keys) {
    keys[key] = false;
  }

  applyTextureState();
}

// ============================================================
// Keyboard Controls
// ============================================================

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  keys[key] = true;

  if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }

  if (event.repeat) {
    return;
  }

  // F: Flat / Smooth
  if (key === "f") {
    shadingMode =
      shadingMode === "FLAT"
        ? "SMOOTH"
        : "FLAT";
  }

  // T: Filtering
  if (key === "t") {
    filterIndex =
      (filterIndex + 1) % filterModes.length;

    applyTextureState();
  }

  // G: Wrapping
  if (key === "g") {
    wrapIndex =
      (wrapIndex + 1) % wrapModes.length;

    applyTextureState();
  }

  // R: Reset
  if (key === "r") {
    reset();
  }

  // P: Pause
  if (key === "p") {
    cubePaused = !cubePaused;
  }

  // Toggle components

  if (key === "1") {
    components.ambient = !components.ambient;
  }

  if (key === "2") {
    components.diffuse = !components.diffuse;
  }

  if (key === "3") {
    components.specular = !components.specular;
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

// ============================================================
// HUD
// ============================================================

const info = {
  shading: document.getElementById("shadingInfo"),
  filter: document.getElementById("filterInfo"),
  wrap: document.getElementById("wrapInfo"),
  uv: document.getElementById("uvInfo"),
  shininess: document.getElementById("shininessInfo"),
  light: document.getElementById("lightInfo"),
  ambientStrength: document.getElementById("ambientStrengthInfo"),
  rotation: document.getElementById("rotationInfo"),
  ambient: document.getElementById("ambientInfo"),
  diffuse: document.getElementById("diffuseInfo"),
  specular: document.getElementById("specularInfo"),
};

function updateHUD() {
  if (info.shading) {
    info.shading.textContent = shadingMode;
  }

  if (info.filter) {
    info.filter.textContent =
      filterModes[filterIndex];
  }

  if (info.wrap) {
    info.wrap.textContent =
      wrapModes[wrapIndex];
  }

  if (info.uv) {
    info.uv.textContent =
      uvScale.toFixed(2);
  }

  if (info.shininess) {
    info.shininess.textContent =
      shininess.toFixed(1);
  }

  if (info.light) {
    info.light.textContent =
      `(${light.position
        .map((value) => value.toFixed(2))
        .join(", ")})`;
  }

  if (info.ambientStrength) {
    info.ambientStrength.textContent =
      ambientStrength.toFixed(2);
  }

  if (info.rotation) {
    info.rotation.textContent =
      cubePaused
        ? "PAUSED"
        : "RUNNING";
  }

  if (info.ambient) {
    info.ambient.textContent =
      components.ambient
        ? "ACTIVATED"
        : "DEACTIVATED";
  }

  if (info.diffuse) {
    info.diffuse.textContent =
      components.diffuse
        ? "ACTIVATED"
        : "DEACTIVATED";
  }

  if (info.specular) {
    info.specular.textContent =
      components.specular
        ? "ACTIVATED"
        : "DEACTIVATED";
  }
}

// ============================================================
// Rendering
// ============================================================

function drawLight(view, projection) {
  let model = Mat4.identity();

  model = Mat4.multiply(
    model,
    Mat4.translation(
      light.position[0],
      light.position[1],
      light.position[2]
    )
  );

  model = Mat4.multiply(
    model,
    Mat4.scaling(0.2, 0.2, 0.2)
  )

  gl.useProgram(lightProgram);

  setAttribute(
    lightPositionBuffer,
    lightLocations.position,
    3
  );

  gl.uniformMatrix4fv(
    lightLocations.model,
    false,
    model
  );

  gl.uniformMatrix4fv(
    lightLocations.view,
    false,
    view
  );

  gl.uniformMatrix4fv(
    lightLocations.projection,
    false,
    projection
  );

  gl.uniform3f(
    lightLocations.color,
    1.0,
    0.85,
    0.2
  );

  gl.disable(gl.DEPTH_TEST);

  gl.drawArrays(
    gl.TRIANGLES,
    0,
    36
  );

  gl.enable(gl.DEPTH_TEST);
}

function draw() {
  autoResize();

  const model = getModelMatrix();

  const view = Mat4.lookAt(
    camera.position,
    camera.target,
    camera.up
  );

  const aspect =
    canvas.height === 0
      ? 1
      : canvas.width / canvas.height;

  const projection = Mat4.perspective(
    degToRad(60),
    aspect,
    0.1,
    100
  );

  gl.clearColor(
    0.025,
    0.04,
    0.08,
    1
  );

  gl.clear(
    gl.COLOR_BUFFER_BIT |
    gl.DEPTH_BUFFER_BIT
  );

  // ==========================================================
  // Cube
  // ==========================================================

  gl.useProgram(gpuProgram);

  setAttribute(
    positionBuffer,
    locations.position,
    3
  );

  setAttribute(
    shadingMode === "FLAT"
      ? flatBuffer
      : smoothBuffer,
    locations.normal,
    3
  );

  setAttribute(
    uvBuffer,
    locations.uv,
    2
  );

  // Matrices
  gl.uniformMatrix4fv(
    locations.model,
    false,
    model
  );

  gl.uniformMatrix4fv(
    locations.view,
    false,
    view
  );

  gl.uniformMatrix4fv(
    locations.projection,
    false,
    projection
  );

  gl.uniformMatrix3fv(
    locations.normalMatrix,
    false,
    normalMatrixFromMat4(model)
  );

  // Lighting
  gl.uniform3fv(
    locations.light,
    light.position
  );

  gl.uniform3f(
    locations.lightColor,
    1,
    1,
    1
  );

  gl.uniform3fv(
    locations.camera,
    camera.position
  );

  gl.uniform1f(
    locations.ambient,
    ambientStrength
  );

  gl.uniform1f(
    locations.shininess,
    shininess
  );

  // Texture
  gl.uniform1f(
    locations.uvScale,
    uvScale
  );

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(
    gl.TEXTURE_2D,
    texture
  );

  gl.uniform1i(
    locations.texture,
    0
  );

  gl.uniform1i(
    locations.useAmbient,
    components.ambient
  );

  gl.uniform1i(
    locations.useDiffuse,
    components.diffuse
  );

  gl.uniform1i(
    locations.useSpecular,
    components.specular
  );

  gl.drawArrays(
    gl.TRIANGLES,
    0,
    36
  );

  // ==========================================================
  // Light cube
  // ==========================================================

  drawLight(view, projection);
}

// ============================================================
// Animation Loop
// ============================================================

let lastTime = 0;

function render(time) {
  const deltaTime =
    Math.min(
      (time - lastTime) * 0.001,
      0.05
    );

  lastTime = time;

  updateCube(deltaTime);
  update(deltaTime);

  draw();
  updateHUD();

  requestAnimationFrame(render);
}

// ============================================================
// Start
// ============================================================

applyTextureState();
updateHUD();

requestAnimationFrame(render);
