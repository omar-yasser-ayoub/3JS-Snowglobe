import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { texture } from 'three/examples/jsm/nodes/Nodes.js'

/**
 * Debug
 */
const gui = new GUI()

const textureLoader = new THREE.TextureLoader()
const snowNormalTexture = textureLoader.load('/textures/snow/snow_02_nor_gl_1k.jpg')
snowNormalTexture.wrapS = THREE.RepeatWrapping
snowNormalTexture.wrapT = THREE.RepeatWrapping
snowNormalTexture.colorSpace = THREE.SRGBColorSpace
const snowDisplacementTexture = textureLoader.load('/textures/snow/snow_02_disp_1k.png')
snowDisplacementTexture.wrapS = THREE.RepeatWrapping
snowDisplacementTexture.wrapT = THREE.RepeatWrapping
snowDisplacementTexture.repeat.set(2, 2)
snowDisplacementTexture.colorSpace = THREE.SRGBColorSpace
const snowARMTexture = textureLoader.load('/textures/snow/snow_02_arm_1k.png')
snowARMTexture.wrapS = THREE.RepeatWrapping
snowARMTexture.wrapT = THREE.RepeatWrapping
snowARMTexture.repeat.set(2, 2)
snowARMTexture.colorSpace = THREE.SRGBColorSpace
const snowAOTexture = textureLoader.load('/textures/snow/snow_02_ao_1k.jpg')
snowAOTexture.wrapS = THREE.RepeatWrapping
snowAOTexture.wrapT = THREE.RepeatWrapping
snowAOTexture.repeat.set(2, 2)
snowAOTexture.colorSpace = THREE.SRGBColorSpace
const snowAlphaMap = textureLoader.load('/textures/snow/alpha.webp')
snowAlphaMap.colorSpace = THREE.SRGBColorSpace

const brickColorTexture = textureLoader.load('/textures/brick/red_bricks_04_diff_1k.jpg')
brickColorTexture.wrapS = THREE.RepeatWrapping
brickColorTexture.wrapT = THREE.RepeatWrapping
brickColorTexture.repeat.set(2, 2)
brickColorTexture.colorSpace = THREE.SRGBColorSpace
const brickDisplacementTexture = textureLoader.load('/textures/brick/red_bricks_04_disp_1k.png')
brickDisplacementTexture.wrapS = THREE.RepeatWrapping
brickDisplacementTexture.wrapT = THREE.RepeatWrapping
brickDisplacementTexture.repeat.set(2, 2)
brickDisplacementTexture.colorSpace = THREE.SRGBColorSpace
const brickARMTexture = textureLoader.load('/textures/brick/red_bricks_04_arm_1k.jpg')
brickARMTexture.wrapS = THREE.RepeatWrapping
brickARMTexture.wrapT = THREE.RepeatWrapping
brickARMTexture.repeat.set(2, 2)
brickARMTexture.colorSpace = THREE.SRGBColorSpace
const brickAOTexture = textureLoader.load('/textures/brick/red_bricks_04_ao_1k.jpg')
brickAOTexture.wrapS = THREE.RepeatWrapping
brickAOTexture.wrapT = THREE.RepeatWrapping
brickAOTexture.repeat.set(2, 2)
brickAOTexture.colorSpace = THREE.SRGBColorSpace


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
// scene.add(cube)
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 5, 0)
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    normalMap: snowNormalTexture,
    displacementMap: snowDisplacementTexture,
    displacementScale: 0.1,
    alphaMap: snowAlphaMap,
    transparent: true,
    aoMap: snowAOTexture,
    aoMapIntensity: 0.1,
    roughnessMap: snowARMTexture,
    roughness: 0.1,
    metalness: 0.1,
    metalnessMap: snowARMTexture,
})
const snowPlaneGeometry = new THREE.PlaneGeometry(10, 10, 128, 128)
const snowPlane = new THREE.Mesh(snowPlaneGeometry, planeMaterial)
const count = 1000
const snowglobeGroup = new THREE.Group()
const snowBufferGeometry = new THREE.BufferGeometry()
const vertices = new Float32Array(3 * count)
const radius = 3
for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2*Math.random() - 1)

    vertices[3 * i] = Math.sin(phi) * Math.cos(theta) * radius
    vertices[3 * i + 1] = Math.sin(phi) * Math.sin(theta) * radius
    vertices[3 * i + 2] = Math.cos(phi) * radius
}
snowBufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

const snowMaterial = new THREE.PointsMaterial({
    color: '#999999',
    size: 0.05,
})
const snowMesh = new THREE.Points(snowBufferGeometry, snowMaterial)

snowPlane.rotation.x = -Math.PI / 2
snowPlane.position.y = -1
snowPlane.receiveShadow = true
directionalLight.lookAt(snowPlane.position)
directionalLight.castShadow = true

snowglobeGroup.add(snowMesh)
scene.add(snowglobeGroup, ambientLight, snowPlane, directionalLight)

const houseGroup = new THREE.Group()
const houseBrickMaterial = new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    displacementMap: brickDisplacementTexture,
    displacementScale: 0.01,
    aoMap: brickAOTexture,
    aoMapIntensity: 1,
    roughnessMap: brickARMTexture,
    roughness: 1,
    metalness: 1,
    metalnessMap: brickARMTexture,
})
const houseWallGeometry1 = new THREE.BoxGeometry(2,1,2, 256, 256, 256)
const houseMesh1 = new THREE.Mesh(houseWallGeometry1, houseBrickMaterial)
const houseWallGeometry2 = new THREE.BoxGeometry(1,1,1, 256, 256, 256)
const houseMesh2 = new THREE.Mesh(houseWallGeometry2, houseBrickMaterial)

houseMesh1.position.y -= 0.5
houseMesh2.position.y -= 0.5
houseMesh2.position.x += 1.5
houseGroup.add(houseMesh1, houseMesh2)

scene.add(houseGroup)


const fog = new THREE.Fog('#262837', 1, 10)
scene.fog = fog
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2
camera.position.y = 2 // Position above the plane
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    const positions = snowBufferGeometry.attributes.position.array
    for (let i = 0; i < count; i++) {
        positions[3 * i + 1] -= 0.01


        // positions[3 * i] += (Math.sin(elapsedTime * 0.1) + Math.sin(elapsedTime * 0.59090134)) * 0.001
        // positions[3 * i + 2] += (Math.cos(elapsedTime * 0.1) + Math.cos(elapsedTime * 0.514213)) * 0.001

        const distanceFromCenter = Math.sqrt(
            positions[3 * i] ** 2 + positions[3 * i + 1] ** 2 + positions[3 * i + 2] ** 2
        )
        if (distanceFromCenter > radius) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2*Math.random() - 1)

            vertices[3 * i] = Math.sin(phi) * Math.cos(theta) * radius
            vertices[3 * i + 1] = Math.sin(phi) * Math.sin(theta) * radius
            vertices[3 * i + 2] = Math.cos(phi) * radius
        }
    }
    snowBufferGeometry.attributes.position.needsUpdate = true

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
