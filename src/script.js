import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Debug
 */
const gui = new GUI();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const snowNormalTexture = textureLoader.load('/textures/snow/snow_02_nor_gl_1k.jpg');
snowNormalTexture.wrapS = THREE.RepeatWrapping;
snowNormalTexture.wrapT = THREE.RepeatWrapping;
snowNormalTexture.colorSpace = THREE.SRGBColorSpace;

const snowDisplacementTexture = textureLoader.load('/textures/snow/snow_02_disp_1k.png');
snowDisplacementTexture.wrapS = THREE.RepeatWrapping;
snowDisplacementTexture.wrapT = THREE.RepeatWrapping;
snowDisplacementTexture.repeat.set(2, 2);
snowDisplacementTexture.colorSpace = THREE.SRGBColorSpace;

const snowARMTexture = textureLoader.load('/textures/snow/snow_02_arm_1k.png');
snowARMTexture.wrapS = THREE.RepeatWrapping;
snowARMTexture.wrapT = THREE.RepeatWrapping;
snowARMTexture.repeat.set(2, 2);
snowARMTexture.colorSpace = THREE.SRGBColorSpace;

const snowAOTexture = textureLoader.load('/textures/snow/snow_02_ao_1k.jpg');
snowAOTexture.wrapS = THREE.RepeatWrapping;
snowAOTexture.wrapT = THREE.RepeatWrapping;
snowAOTexture.repeat.set(2, 2);
snowAOTexture.colorSpace = THREE.SRGBColorSpace;

const snowAlphaMap = textureLoader.load('/textures/snow/alpha.webp');
snowAlphaMap.colorSpace = THREE.SRGBColorSpace;

const brickColorTexture = textureLoader.load('/textures/brick/red_bricks_04_diff_1k.jpg');
brickColorTexture.wrapS = THREE.RepeatWrapping;
brickColorTexture.wrapT = THREE.RepeatWrapping;
brickColorTexture.repeat.set(2, 2);
brickColorTexture.colorSpace = THREE.SRGBColorSpace;

const brickDisplacementTexture = textureLoader.load('/textures/brick/red_bricks_04_disp_1k.png');
brickDisplacementTexture.wrapS = THREE.RepeatWrapping;
brickDisplacementTexture.wrapT = THREE.RepeatWrapping;
brickDisplacementTexture.repeat.set(2, 2);
brickDisplacementTexture.colorSpace = THREE.SRGBColorSpace;

const brickARMTexture = textureLoader.load('/textures/brick/red_bricks_04_arm_1k.jpg');
brickARMTexture.wrapS = THREE.RepeatWrapping;
brickARMTexture.wrapT = THREE.RepeatWrapping;
brickARMTexture.repeat.set(2, 2);
brickARMTexture.colorSpace = THREE.SRGBColorSpace;

const brickAOTexture = textureLoader.load('/textures/brick/red_bricks_04_ao_1k.jpg');
brickAOTexture.wrapS = THREE.RepeatWrapping;
brickAOTexture.wrapT = THREE.RepeatWrapping;
brickAOTexture.repeat.set(2, 2);
brickAOTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Base Setup
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 2);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 5);

scene.add(ambientLight);

/**
 * Snow Plane
 */
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    normalMap: snowNormalTexture,
    displacementMap: snowDisplacementTexture,
    displacementScale: 0.1,
    aoMap: snowAOTexture,
    aoMapIntensity: 0.1,
    roughnessMap: snowARMTexture,
    roughness: 0.1,
    metalness: 0.1,
    metalnessMap: snowARMTexture
});

const snowPlaneGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
const snowPlane = new THREE.Mesh(snowPlaneGeometry, planeMaterial);
snowPlane.rotation.x = -Math.PI / 2;
snowPlane.receiveShadow = true;
snowPlane.renderOrder = 1;
scene.add(snowPlane);

/**
 * Snowglobe Group
 */
const snowglobeGroup = new THREE.Group();
scene.add(snowglobeGroup);

const count = 1000;
const radius = 3;

const snowBufferGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array(3 * count);

for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    vertices[3 * i] = Math.sin(phi) * Math.cos(theta) * radius;
    vertices[3 * i + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    vertices[3 * i + 2] = Math.cos(phi) * radius;
}

snowBufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const snowMaterial = new THREE.PointsMaterial({
    color: '#999999',
    size: 0.05
});

const snowMesh = new THREE.Points(snowBufferGeometry, snowMaterial);
snowMesh.renderOrder = 1;
snowglobeGroup.add(snowMesh);

const sphereGeometry = new THREE.SphereGeometry(3, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0,
    transmission: 1,
    thickness: 1,
    ior: 1.5,
    reflectivity: 1,

});

const snowGlobeSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
snowGlobeSphere.renderOrder = 2;
scene.add(snowGlobeSphere);

/**
 * House Group
 */
const houseGroup = new THREE.Group();
scene.add(houseGroup);

const houseBrickMaterial = new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    displacementMap: brickDisplacementTexture,
    displacementScale: 0.01,
    aoMap: brickAOTexture,
    aoMapIntensity: 1,
    roughnessMap: brickARMTexture,
    roughness: 1,
    metalness: 1,
    metalnessMap: brickARMTexture
});

const houseWallGeometry1 = new THREE.BoxGeometry(2, 1, 2, 256, 256, 256);
const houseMesh1 = new THREE.Mesh(houseWallGeometry1, houseBrickMaterial);
houseMesh1.position.y += 0.5;
houseMesh1.renderOrder = 1;
houseGroup.add(houseMesh1);

const houseWallGeometry2 = new THREE.BoxGeometry(1, 1, 1, 256, 256, 256);
const houseMesh2 = new THREE.Mesh(houseWallGeometry2, houseBrickMaterial);
houseMesh2.position.set(1.5, 0.5, 0);
houseMesh2.renderOrder = 1;
houseGroup.add(houseMesh2);

houseGroup.position.x -= 0.5;

/**
 * Fog
 */
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;

/**
 * Animation Loop
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update();

    const positions = snowBufferGeometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
        positions[3 * i + 1] -= 0.01;

        const distanceFromCenter = Math.sqrt(
            positions[3 * i] ** 2 + positions[3 * i + 1] ** 2 + positions[3 * i + 2] ** 2
        );
        if (distanceFromCenter > radius) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            vertices[3 * i] = Math.sin(phi) * Math.cos(theta) * radius;
            vertices[3 * i + 1] = Math.sin(phi) * Math.sin(theta) * radius;
            vertices[3 * i + 2] = Math.cos(phi) * radius;
        }
    }
    snowBufferGeometry.attributes.position.needsUpdate = true;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
