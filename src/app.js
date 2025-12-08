const THREE = require('three');
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js');

// Canvas
const canvas = document.querySelector('canvas.webgl'); 
const scene = new THREE.Scene();

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Object
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
);
cube.position.y = 1.5;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

// Lighting
let ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight;

function addAmbientLight(scene) {
  ambientLight = new THREE.AmbientLight(0x0000ff, 0.5);
  scene.add(ambientLight);
}

function addDirectionalLight(scene) {
  directionalLight = new THREE.DirectionalLight(0x00ff00, 0.3);
  scene.add(directionalLight);
}

function addHemisphereLight(scene) {
  hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
  scene.add(hemisphereLight);
}

function addPointLight(scene) {
  pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
  pointLight.position.set(1, -0.5, 1);
  scene.add(pointLight);
}

function addRectAreaLight(scene) {
  rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
  rectAreaLight.position.set(-1.5, 0, 1.5);
  rectAreaLight.lookAt(new THREE.Vector3());
  scene.add(rectAreaLight);
}

function addSpotLight(scene) {
  spotLight = new THREE.SpotLight(0xffff00, 0.8, 10, Math.PI * 0.1, 0.25, 1);
  spotLight.position.set(0, 2, 3);
  spotLight.target.position.x = -0.75;
  scene.add(spotLight);
  scene.add(spotLight.target);
}

/* functions call for later use */
addAmbientLight(scene);
addDirectionalLight(scene);
addHemisphereLight(scene);
addPointLight(scene);
addRectAreaLight(scene);
addSpotLight(scene);

// Toggle functions for lights
function toggleLight(light, button, sliderPanelId) {
  if (light.visible) {
    light.visible = false;
    button.classList.remove('active');
    const sliderPanel = document.getElementById(sliderPanelId);
    if (sliderPanel) {
      sliderPanel.style.display = 'none';
    }
  } else {
    light.visible = true;
    button.classList.add('active');
    const sliderPanel = document.getElementById(sliderPanelId);
    if (sliderPanel) {
      sliderPanel.style.display = 'block';
    }
  }
}

// Setup intensity slider for a light
function setupIntensitySlider(light, intensityId, intensityValueId) {
  const intensitySlider = document.getElementById(intensityId);
  if (intensitySlider && light) {
    // Initialize with current light intensity
    intensitySlider.value = light.intensity;
    const valueDisplay = document.getElementById(intensityValueId);
    if (valueDisplay) {
      valueDisplay.textContent = light.intensity.toFixed(1);
    }
    
    // Add event listener
    intensitySlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      light.intensity = value;
      const valueDisplay = document.getElementById(intensityValueId);
      if (valueDisplay) {
        valueDisplay.textContent = value.toFixed(1);
      }
    });
  }
}

// Setup toggle buttons
function setupLightToggles() {
  const toggles = {
    'toggle-ambient': { light: ambientLight, sliderId: 'slider-ambient' },
    'toggle-directional': { light: directionalLight, sliderId: 'slider-directional' },
    'toggle-hemisphere': { light: hemisphereLight, sliderId: 'slider-hemisphere' },
    'toggle-point': { light: pointLight, sliderId: 'slider-point' },
    'toggle-rectarea': { light: rectAreaLight, sliderId: 'slider-rectarea' },
    'toggle-spot': { light: spotLight, sliderId: 'slider-spot' }
  };

  Object.entries(toggles).forEach(([buttonId, { light, sliderId }]) => {
    const button = document.getElementById(buttonId);
    if (button && light) {
      // Set initial active state
      if (light.visible) {
        button.classList.add('active');
        const sliderPanel = document.getElementById(sliderId);
        if (sliderPanel) {
          sliderPanel.style.display = 'block';
        }
      }
      button.addEventListener('click', () => toggleLight(light, button, sliderId));
    }
  });
  
  // Setup intensity sliders
  setupIntensitySlider(ambientLight, 'intensity-ambient', 'intensity-ambient-value');
  setupIntensitySlider(directionalLight, 'intensity-directional', 'intensity-directional-value');
  setupIntensitySlider(hemisphereLight, 'intensity-hemisphere', 'intensity-hemisphere-value');
  setupIntensitySlider(pointLight, 'intensity-point', 'intensity-point-value');
  setupIntensitySlider(rectAreaLight, 'intensity-rectarea', 'intensity-rectarea-value');
  setupIntensitySlider(spotLight, 'intensity-spot', 'intensity-spot-value');
}

// Initialize toggles after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLightToggles);
} else {
  setupLightToggles();
}

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

// Handle resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;
  
  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
