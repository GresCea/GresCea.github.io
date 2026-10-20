console.log("main.js berhasil dijalankan dengan semua Challenge");
console.log("App element:", document.getElementById("app"));

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import "./style.css";

const app = document.getElementById("app");
const hud = document.getElementById("hud");

// Mengambil referensi UI
const hoverInfo = document.getElementById("hoverInfo");
const selectedInfo = document.getElementById("selectedInfo");
const animationInfo = document.getElementById("animationInfo");
const loadingInfo = document.getElementById("loadingInfo");

// Mengambil referensi UI tambahan untuk Challenge C & H
const envStateSpan = document.getElementById("envState");
const detailsInfoText = document.getElementById("detailsInfo");

// Inisialisasi Scene Dasar
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(5, 3.5, 7);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.8, 0);
controls.enableDamping = true;
controls.saveState();
controls.update();

// Pencahayaan
scene.add(new THREE.AmbientLight(0xffffff, 0.45));
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(4, 7, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20), 
  new THREE.MeshStandardMaterial({ color: 0x263449, roughness: 0.85, metalness: 0 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const interactiveObjects = [];

// Fungsi utilitas untuk meregistrasi objek interaktif
function registerSelectable(object, label) {
  object.userData.selectable = true;
  object.userData.label = label;
  object.userData.baseScale = object.scale.clone();
  interactiveObjects.push(object);
}

// -------------------------------------------------------------
// Scene Graph Dasar (Modul Praktikum)
// -------------------------------------------------------------
const hierarchyGroup = new THREE.Group();
hierarchyGroup.name = "Hierarchy Group";
hierarchyGroup.position.set(-2, 0, 0);
scene.add(hierarchyGroup);

const parent = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 0.6, 1), 
  new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.45, metalness: 0.15 })
);
parent.name = "Parent Object";
parent.position.y = 0.8;
parent.castShadow = true;
hierarchyGroup.add(parent);

const child = new THREE.Mesh(
  new THREE.BoxGeometry(0.45, 0.45, 0.45), 
  new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.1 })
);
child.name = "Child Object";
child.position.set(1, 0, 0);
child.castShadow = true;
parent.add(child);

registerSelectable(hierarchyGroup, "Hierarchy Group");

const pbrSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 48, 24), 
  new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.25, metalness: 0.1 })
);
pbrSphere.name = "PBR Sphere";
pbrSphere.position.set(0, 0.8, 0);
pbrSphere.castShadow = true;
scene.add(pbrSphere);
registerSelectable(pbrSphere, "PBR Sphere");

// -------------------------------------------------------------
// Challenge D: Hierarchical Solar System
// -------------------------------------------------------------
const solarSystemGroup = new THREE.Group();
solarSystemGroup.position.set(-3, 2, -3);
scene.add(solarSystemGroup);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 32, 32), 
  new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: 0.5 })
);
solarSystemGroup.add(sun);
registerSelectable(sun, "Sun (Solar System)");

const earthOrbit = new THREE.Group();
sun.add(earthOrbit);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32), 
  new THREE.MeshStandardMaterial({ color: 0x2233ff, roughness: 0.4, metalness: 0.1 })
);
earth.position.x = 2; // Jarak orbit Earth dari Sun
earthOrbit.add(earth);
registerSelectable(earth, "Earth (Solar System)");

const moonOrbit = new THREE.Group();
earth.add(moonOrbit);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 32, 32), 
  new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.8 })
);
moon.position.x = 0.6; // Jarak orbit Moon dari Earth
moonOrbit.add(moon);
registerSelectable(moon, "Moon (Solar System)");

// -------------------------------------------------------------
// Challenge E: PBR Material Gallery
// -------------------------------------------------------------
const pbrGalleryGroup = new THREE.Group();
pbrGalleryGroup.position.set(4, 0.5, -3);
scene.add(pbrGalleryGroup);

const roughnessValues = [0.1, 0.5, 0.9];
const metalnessValues = [0.0, 0.5, 1.0];

for (let r = 0; r < roughnessValues.length; r++) {
  for (let m = 0; m < metalnessValues.length; m++) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xe53e3e,
      roughness: roughnessValues[r],
      metalness: metalnessValues[m]
    });
    const sph = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 16), mat);
    sph.position.set((r - 1) * 1.0, 0, (m - 1) * 1.0);
    sph.castShadow = true;
    sph.receiveShadow = true;
    pbrGalleryGroup.add(sph);
    registerSelectable(sph, `PBR Gallery (R:${roughnessValues[r]}, M:${metalnessValues[m]})`);
  }
}

// -------------------------------------------------------------
// Raycasting dan State Interaksi
// -------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredObject = null;
let selectedObject = null;

let importedModel = null;
let mixer = null;
let activeAction = null;
let allActions = []; // Digunakan untuk Challenge A
let animationEnabled = true;
let environmentEnabled = true;
let gesture = null;
let suppressSelection = false;

function findSelectableRoot(object) {
  let current = object;
  while (current) {
    if (current.userData.selectable) return current;
    current = current.parent;
  }
  return null;
}

// Implementasi Challenge F: Hover Emissive dan Scale Feedback
function restoreScale(object) { 
  if (!object) return;
  // Restore Base Scale
  if (object.userData.baseScale) object.scale.copy(object.userData.baseScale); 
  
  // Restore Emissive (Challenge F)
  object.traverse(child => {
    if (child.isMesh && child.material && child.material.emissive && child.userData.baseEmissive) {
      child.material.emissive.copy(child.userData.baseEmissive);
    }
  });
}

function applyVisualState(object) {
  if (!object) return;
  if (object.userData.baseScale) {
    const factor = object === selectedObject ? 1.12 : object === hoveredObject ? 1.06 : 1;
    object.scale.copy(object.userData.baseScale).multiplyScalar(factor);
  }
  
  // Menerapkan Hover Emissive (Challenge F) jika di-hover tapi tidak di-select
  if (object === hoveredObject && object !== selectedObject) {
    object.traverse(child => {
      if (child.isMesh && child.material && child.material.emissive) {
        if (!child.userData.baseEmissive) {
          child.userData.baseEmissive = child.material.emissive.clone(); // Simpan emissive asli
        }
        child.material.emissive.setHex(0x444444); // Beri warna emissive saat hover
      }
    });
  }
}

// Implementasi Challenge C: Information Panel
function updateDetailsInfo(object) {
  if (!object) {
    detailsInfoText.innerHTML = "-";
    return;
  }
  const pos = object.position;
  const rot = object.rotation;
  const scl = object.scale;
  
  let matType = "Hierarchy/Group";
  if (object.material) {
    matType = object.material.type;
  } else {
    // Cari material di anak-anaknya (untuk model GLB / Group)
    object.traverse(child => {
      if (child.isMesh && child.material && matType === "Hierarchy/Group") {
        matType = child.material.type;
      }
    });
  }

  detailsInfoText.innerHTML = `
    Name: ${object.userData.label}<br>
    Pos: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]<br>
    Rot: [${rot.x.toFixed(2)}, ${rot.y.toFixed(2)}, ${rot.z.toFixed(2)}]<br>
    Scl: [${scl.x.toFixed(2)}, ${scl.y.toFixed(2)}, ${scl.z.toFixed(2)}]<br>
    Mat: ${matType}
  `;
}

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function raycast() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactiveObjects, true);
  return hits.length ? findSelectableRoot(hits[0].object) : null;
}

function updateHover(event) {
  if (gesture) return;
  updatePointer(event);
  const nextHover = raycast();
  if (nextHover !== hoveredObject) { 
    restoreScale(hoveredObject); 
    hoveredObject = nextHover; 
    applyVisualState(hoveredObject); 
    applyVisualState(selectedObject); 
  }
  hoverInfo.textContent = hoveredObject?.userData.label ?? "-";
}

// Event Listeners untuk Interaksi
renderer.domElement.addEventListener("pointerdown", event => { suppressSelection = event.button !== 0; gesture = { id: event.pointerId, x: event.clientX, y: event.clientY }; });
window.addEventListener("pointermove", event => { if (!gesture || event.pointerId !== gesture.id) return; if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 5) suppressSelection = true; }, true);
window.addEventListener("pointerup", event => { if (event.pointerId === gesture?.id) gesture = null; });
window.addEventListener("pointercancel", () => { gesture = null; suppressSelection = true; });
renderer.domElement.addEventListener("pointermove", updateHover);
renderer.domElement.addEventListener("click", event => { 
  if (suppressSelection || event.button !== 0) { suppressSelection = false; return; } 
  updatePointer(event); 
  restoreScale(selectedObject); 
  selectedObject = raycast(); 
  applyVisualState(hoveredObject); 
  applyVisualState(selectedObject); 
  selectedInfo.textContent = selectedObject?.userData.label ?? "-";
  
  updateDetailsInfo(selectedObject); // Memperbarui panel detail (Challenge C)

  // Challenge B: Click Menjalankan Animasi
  if (selectedObject && importedModel && (selectedObject === importedModel)) {
    if (activeAction) {
      if (activeAction.isRunning()) {
        activeAction.stop();
        animationInfo.textContent = "paused (Click to play)";
      } else {
        activeAction.play();
        animationInfo.textContent = "playing";
      }
    }
  }
});

// -------------------------------------------------------------
// GLTF Loader (Asynchronous Loading)
// -------------------------------------------------------------
const loader = new GLTFLoader();
loadingInfo.textContent = "loading model...";
loader.load("./models/model.glb", gltf => {
  importedModel = gltf.scene;
  importedModel.name = "Imported GLB";
  importedModel.position.set(2.4, 0, 0);
  importedModel.scale.setScalar(0.01);
  importedModel.traverse(object => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
  scene.add(importedModel);
  registerSelectable(importedModel, "Imported GLB");
  
  if (gltf.animations.length) { 
    mixer = new THREE.AnimationMixer(importedModel); 
    
    // Menyimpan semua clip untuk Challenge A
    gltf.animations.forEach(clip => {
        allActions.push(mixer.clipAction(clip));
    });

    activeAction = allActions[0]; 
    // Challenge B: Animasi tidak langsung jalan/loop forever, menunggu interaksi klik
    animationInfo.textContent = "Click model to play (Ch.B)"; 
  } else {
    animationInfo.textContent = "No clip";
  }
  loadingInfo.textContent = "model loaded";
}, undefined, () => { 
  loadingInfo.textContent = "model unavailable; procedural scene active"; 
  animationInfo.textContent = "fallback"; 
});

// Environment Map (Procedural)
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const proceduralEnvironment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = proceduralEnvironment;

// -------------------------------------------------------------
// Global Keydown Listeners (Challenge A & H)
// -------------------------------------------------------------
window.addEventListener("keydown", event => { 
  // Toggle Animasi Global
  if (event.code === "Space" && !event.repeat) { 
    event.preventDefault(); 
    animationEnabled = !animationEnabled; 
  } 
  
  // Challenge H: Environment Toggle & Update HUD
  if (event.key.toLowerCase() === "e" && !event.repeat) { 
    environmentEnabled = !environmentEnabled; 
    scene.environment = environmentEnabled ? proceduralEnvironment : null; 
    envStateSpan.textContent = environmentEnabled ? "ON" : "OFF";
  } 
  
  // Reset Camera & Selection
  if (event.key.toLowerCase() === "r" && !event.repeat) { 
    controls.reset(); 
    restoreScale(selectedObject);
    selectedObject = null; 
    selectedInfo.textContent = "-"; 
    updateDetailsInfo(null);
  } 
  
  // Challenge A: Multiple Animation Clips (Switch dengan 1, 2, 3)
  if (["1", "2", "3"].includes(event.key)) {
    const idx = parseInt(event.key) - 1;
    if (allActions[idx] && activeAction !== allActions[idx]) {
      const prevAction = activeAction;
      activeAction = allActions[idx];
      activeAction.reset().play(); // Force play clip baru
      if (prevAction) prevAction.fadeOut(0.5);
      activeAction.fadeIn(0.5);
      animationInfo.textContent = `playing clip ${idx + 1}`;
    }
  }
});

// Responsive Resize
window.addEventListener("resize", () => { 
  camera.aspect = innerWidth / innerHeight; 
  camera.updateProjectionMatrix(); 
  renderer.setSize(innerWidth, innerHeight); 
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); 
});

// -------------------------------------------------------------
// Animation Loop
// -------------------------------------------------------------
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  
  if (animationEnabled) { 
    // Hierarchy Dasar
    hierarchyGroup.rotation.y += 0.25 * delta; 
    child.rotation.x += 1.2 * delta; 
    
    // Animasi Solar System (Challenge D)
    sun.rotation.y += 0.5 * delta;
    earthOrbit.rotation.y += 0.3 * delta;
    earth.rotation.y += 1.0 * delta;
    moonOrbit.rotation.y += 0.8 * delta;
  }
  
  if (mixer && animationEnabled) mixer.update(delta);
  
  // Challenge G: Selection Rotation
  if (selectedObject && animationEnabled) {
      selectedObject.rotation.y += 1.0 * delta;
      updateDetailsInfo(selectedObject); // Update rotasi pada Information Panel secara live
  }

  controls.update();
  
  // Menjaga status UI animasi tetap relevan kecuali saat dikontrol oleh event spesifik
  if (animationInfo.textContent !== "No clip" && animationInfo.textContent !== "fallback" && !animationInfo.textContent.includes("Click") && !animationInfo.textContent.includes("clip")) {
      animationInfo.textContent = animationEnabled ? "playing" : "paused";
  }

  renderer.render(scene, camera);
}

animate();