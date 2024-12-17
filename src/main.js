import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapTexture = textureLoader.load('/matcaps/5.png');
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const textTexture = textureLoader.load('/matcaps/4.png');
textTexture.colorSpace = THREE.SRGBColorSpace;

// Object
const extrudeSettings = {
	depth: 1,
	bevelEnabled: false,
};

// Heart Shape
const x = 0;
const y = 0;
const heartShape = new THREE.Shape();

heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

// Object
const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
const heartMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

// Fonts
const fontLoader = new FontLoader();
fontLoader.load('/fonts/sans.json', (font) => {
	const textGeometry = new TextGeometry('Kocham cię Emilia', {
		font: font,
		size: 0.7,
		depth: 0.2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 4,
	});

	textGeometry.center();

	const material = new THREE.MeshMatcapMaterial({ matcap: textTexture });
	const text = new THREE.Mesh(textGeometry, material);
	scene.add(text);

	for (let i = 0; i < 150; i++) {
		// Create heart mest
		const heartMesh = new THREE.Mesh(geometry, heartMaterial);

		// Randomize position
		heartMesh.position.set((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25);

		// Randomize scale
		const scale = Math.random() / 8;
		heartMesh.scale.set(scale, scale, scale);

		// Randomize rotation
		heartMesh.rotation.x = Math.PI;
		heartMesh.rotation.y = Math.random() * Math.PI;

		// Smooth tilting animation with GSAP

		gsap.to(heartMesh.rotation, { duration: 2, z: Math.PI / 8, repeat: -1, yoyo: true, ease: 'power1.inOut' });

		// Add mesh to the scene
		scene.add(heartMesh);
	}
});

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Resize
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

// Camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const animate = () => {
	controls.update();

	renderer.render(scene, camera);

	requestAnimationFrame(animate);
};

animate();
