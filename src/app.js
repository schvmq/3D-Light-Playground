const THREE = require('three');
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js');


// Canvas

const canvas = document.querySelector('canvas.webgl'); 
const scene = new THREE.Scene();


// Size

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// Material

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4


// Object

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)


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

/* functions call for later use*/
// addAmbientLight(scene);
// addDirectionalLight(scene);
// addHemisphereLight(scene);
// addPointLight(scene);
// addRectAreaLight(scene);
// addSpotLight(scene);


// Camera 

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// Renderer 

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// Handle resize

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement ||
    document.webkitFullscreenElement
    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
    }
    else if(canvas.webkitRequestFullscreen)
    {
        canvas.webkitRequestFullscreen()
    }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
        document.webkitExitFullscreen()
        }
    }
})


// Animate

const clock = new THREE.Clock()
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()