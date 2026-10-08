import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const app = document.getElementById("app");
const info = document.getElementById("info");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// ==========================================
// CHALLENGE C: Orthographic Camera & Toggle
// ==========================================
const aspect = sizes.width / sizes.height;
const cameraP = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
cameraP.position.set(4, 5, 8);

const viewSize = 10;
const cameraO = new THREE.OrthographicCamera(
  (-aspect * viewSize) / 2,
  (aspect * viewSize) / 2,
  viewSize / 2,
  -viewSize / 2,
  0.1,
  100
);
cameraO.position.set(4, 5, 8);
cameraO.lookAt(0, 0, 0);

// Set default camera
let activeCamera = cameraP;
let isPerspective = true;
scene.add(cameraP);
scene.add(cameraO);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

// ==========================================
// TUGAS UTAMA: Cube, Sphere, Ground
// ==========================================
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshLambertMaterial({ color: 0x22d3ee })
);
cube.position.set(-1.2, 0.6, 2);
cube.castShadow = true;
scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 16),
  new THREE.MeshPhongMaterial({ color: 0x4488ff, shininess: 60 })
);
sphere.position.set(1.4, 0.75, 2);
sphere.castShadow = true;
scene.add(sphere);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshLambertMaterial({ color: 0x334155 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ==========================================
// CHALLENGE A: Tambah Geometry (Cylinder & Torus)
// ==========================================
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32),
  new THREE.MeshPhongMaterial({ color: 0xee2277 })
);
cylinder.position.set(-3, 0.75, -2);
cylinder.castShadow = true;
scene.add(cylinder);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 16, 100),
  new THREE.MeshLambertMaterial({ color: 0x22ee77 })
);
torus.position.set(3, 0.75, -2);
torus.castShadow = true;
scene.add(torus);

// ==========================================
// CHALLENGE B: Material Gallery
// ==========================================
const galleryGeom = new THREE.SphereGeometry(0.4, 32, 16);
const materials = [
  new THREE.MeshBasicMaterial({ color: 0xffaa00 }),       // Basic
  new THREE.MeshNormalMaterial(),                         // Normal
  new THREE.MeshLambertMaterial({ color: 0xffaa00 }),     // Lambert
  new THREE.MeshPhongMaterial({ color: 0xffaa00 })        // Phong
];
materials.forEach((mat, index) => {
  const mesh = new THREE.Mesh(galleryGeom, mat);
  mesh.position.set(-1.5 + index, 0.4, -4);
  mesh.castShadow = true;
  scene.add(mesh);
});

// ==========================================
// LIGHTING & CHALLENGE E: Shadow Quality
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(3, 5, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024); // Default 1024
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 30;
scene.add(directionalLight);

let shadowQuality = 1024;
function updateShadowQuality(size) {
  shadowQuality = size;
  directionalLight.shadow.mapSize.set(size, size);
  if (directionalLight.shadow.map) {
    directionalLight.shadow.map.dispose();
    directionalLight.shadow.map = null;
  }
}

// OrbitControls
const controls = new OrbitControls(activeCamera, renderer.domElement);
controls.target.set(0, 0.8, 0);
controls.enableDamping = true;
controls.saveState(); // Menyimpan target & posisi awal untuk fitur reset

// ==========================================
// STATE MANAGEMENT & INPUT (CHALLENGE G & H)
// ==========================================
let animationEnabled = true;
let elapsed = 0;
const clock = new THREE.Clock();

const keys = {
  ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
  KeyQ: false, KeyE: false
};

// ==========================================
// FUNGSI RESET
// ==========================================
function resetScene() {
  cube.position.set(-1.2, 0.6, 2);
  cube.rotation.set(0, 0, 0);
  cube.scale.set(1, 1, 1);
  
  sphere.position.set(1.4, 0.75, 2);
  sphere.rotation.set(0, 0, 0);
  
  torus.rotation.set(0, 0, 0);
  cylinder.rotation.set(0, 0, 0);
  
  directionalLight.position.set(3, 5, 2);
  
  elapsed = 0;
  animationEnabled = true;
  
  // Kembalikan ke Perspective Camera
  isPerspective = true;
  activeCamera = cameraP;
  controls.object = activeCamera;
  
  // Kembalikan Shadow ke 1024
  updateShadowQuality(1024);
  
  controls.reset();
}

window.addEventListener("keydown", (event) => {
  if (keys.hasOwnProperty(event.code)) keys[event.code] = true;

  // Challenge G: Toggle Animation
  if (event.code === "Space" && !event.repeat) {
    event.preventDefault();
    animationEnabled = !animationEnabled;
  }
  
  // Challenge C: Toggle Camera
  if (event.code === "KeyP" && !event.repeat) {
    isPerspective = !isPerspective;
    activeCamera = isPerspective ? cameraP : cameraO;
    controls.object = activeCamera;
    controls.update();
  }

  // Challenge E: Ganti Shadow Quality
  if (event.code === "Digit1") updateShadowQuality(512);
  if (event.code === "Digit2") updateShadowQuality(1024);
  if (event.code === "Digit3") updateShadowQuality(2048);
  
  // Reset Scene
  if (event.key.toLowerCase() === "r" && !event.repeat) resetScene();
});

window.addEventListener("keyup", (event) => {
  if (keys.hasOwnProperty(event.code)) keys[event.code] = false;
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  const newAspect = sizes.width / sizes.height;

  // Update kedua kamera agar responsif
  cameraP.aspect = newAspect;
  cameraP.updateProjectionMatrix();

  cameraO.left = (-newAspect * viewSize) / 2;
  cameraO.right = (newAspect * viewSize) / 2;
  cameraO.top = viewSize / 2;
  cameraO.bottom = -viewSize / 2;
  cameraO.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  const currentFPS = Math.round(1 / delta);

  if (animationEnabled) {
    elapsed += delta;
    
    // Animasi dasar
    sphere.rotation.y += 0.5 * delta;
    sphere.position.y = 0.75 + Math.sin(elapsed * 2) * 0.15;
    
    torus.rotation.x += 1 * delta;
    torus.rotation.y += 0.5 * delta;

    // Challenge D: Light Animation
    directionalLight.position.x = Math.cos(elapsed * 0.5) * 5;
    directionalLight.position.z = Math.sin(elapsed * 0.5) * 5;
  }

  // Challenge H: Continuous Object Control (Cube)
  const moveSpeed = 3 * delta;
  const rotSpeed = 2 * delta;
  
  if (keys.ArrowUp) cube.position.z -= moveSpeed;
  if (keys.ArrowDown) cube.position.z += moveSpeed;
  if (keys.ArrowLeft) cube.position.x -= moveSpeed;
  if (keys.ArrowRight) cube.position.x += moveSpeed;
  if (keys.KeyQ) cube.rotation.y += rotSpeed;
  if (keys.KeyE) cube.rotation.y -= rotSpeed;

  controls.update();

  // Challenge F: Scene Information (Extended HUD)
  info.innerHTML = `
    <b>Scene Information:</b><br/>
    Objects: ${scene.children.length} | Triangles: ${renderer.info.render.triangles} | FPS: ${currentFPS}<br/>
    <br/>
    <b>State:</b><br/>
    Camera [P]: ${isPerspective ? 'Perspective' : 'Orthographic'}<br/>
    Shadow [1/2/3]: ${shadowQuality}x${shadowQuality}<br/>
    Animation [Space]: ${animationEnabled ? "ON" : "PAUSED"}<br/>
    <br/>
    <b>Controls:</b><br/>
    Arrow Keys = Move Cube | Q / E = Rotate Cube<br/>
    <b>R = Reset Scene</b>
  `;

  renderer.render(scene, activeCamera);
}

animate();