import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 0.1);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false; // Disable default zoom, we'll use FOV zoom
controls.enablePan = false;
controls.rotateSpeed = -0.5;
controls.target.set(0, 0, 0);
controls.update();

// Custom FOV-based zoom for 360 panorama
let targetFov = 75;
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const zoomSpeed = 0.05;
    targetFov += event.deltaY * zoomSpeed;
    targetFov = Math.max(20, Math.min(100, targetFov)); // Clamp between 20 and 100
});

// 360 Images Array - arranged in numerical order (1-40, missing 12)
const images = [
    'https://upload.wikimedia.org/wikipedia/commons/e/e6/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_1.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/4/4d/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/52/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_3.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/7/74/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_4.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/f/f4/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_5.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/10/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_6.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/a/ab/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_7.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d9/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_8.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/8/8e/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_9.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e5/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_10.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/c/ce/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_11.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/7/72/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_13.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/19/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_14.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/35/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_15.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9f/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_16.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/00/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_17.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/62/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_18.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9f/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_19.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/99/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_20.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/f/f0/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_21.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d1/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_22.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d9/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_23.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/05/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_24.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/a/af/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_25.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/16/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_26.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/c/ca/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_27.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/06/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_28.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/f/f6/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_30.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/32/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_31.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/7/7a/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_32.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/a/ae/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_33.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/a/ac/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_34.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d6/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_35.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/4/42/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_36.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e8/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_37.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d9/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_38.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/1e/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_39.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/08/360_%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BE%D1%82_%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD_%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_40.jpg'
];

console.log(images.length);

let currentImageIndex = 0;
const textureLoader = new THREE.TextureLoader();

const hotspotConfig = {
    0: [{ target: 1, position: { x: 230, y: -90, z: -20 } }],
    1: [
        { target: 0, position: { x: -300, y: -100, z: 0 } },
        { target: 2, position: { x: 250, y: -55, z: 30 } }
    ],
    2: [
        { target: 1, position: { x: -250, y: -55, z: -10 } },
        { target: 3, position: { x: -483, y: 87, z: 97 } }
    ],
    3: [
        { target: 2, position: { x: 475, y: 110, z: -110 } },
        { target: 4, position: { x: 499, y: -16, z: 13 } }
    ],
    4: [
        { target: 3, position: { x: -490, y: -100, z: -20 } },
        { target: 5, position: { x: 50, y: 0, z: -100 } }
    ],
    5: [
        { target: 4, position: { x: 257, y: 85, z: -419 } },
        { target: 6, position: { x: -396, y: 82, z: -292 } }
    ],
    6: [
        { target: 5, position: { x: -50, y: 0, z: -100 } },
        { target: 7, position: { x: 470, y: -168, z: 23 } }
    ],
    7: [
        { target: 6, position: { x: -443, y: -231, z: 4 } },
        { target: 8, position: { x: 136, y: -230, z: -422 } }
    ],
    8: [
        { target: 7, position: { x: 62, y: -183, z: 460 } },
        { target: 9, position: { x: 66, y: -193, z: -456 } }
    ],
    9: [
        { target: 8, position: { x: 99, y: -178, z: 456 } },
        { target: 10, position: { x: -468, y: -164, z: -59 } }
    ],
    10: [
        { target: 9, position: { x: 484, y: -124, z: 4 } },
        { target: 11, position: { x: -494, y: -71, z: -12 } }
    ],
    11: [
        { target: 10, position: { x: 493, y: -73, z: 35 } },
        { target: 12, position: { x: -455, y: -57, z: -198 } }
    ],
    12: [
        { target: 11, position: { x: 444, y: -134, z: 186 } },
        { target: 13, position: { x: 50, y: 0, z: -100 } }
    ],
    13: [
        { target: 12, position: { x: -274, y: -105, z: 405 } },
        { target: 14, position: { x: 50, y: 0, z: -100 } }
    ],
    14: [
        { target: 13, position: { x: -50, y: 0, z: -100 } },
        { target: 15, position: { x: 50, y: 0, z: -100 } }
    ],
    15: [
        { target: 14, position: { x: -50, y: 0, z: -100 } },
        { target: 16, position: { x: 50, y: 0, z: -100 } }
    ],
    16: [
        { target: 15, position: { x: -50, y: 0, z: -100 } },
        { target: 17, position: { x: 50, y: 0, z: -100 } }
    ],
    17: [
        { target: 16, position: { x: -50, y: 0, z: -100 } },
        { target: 18, position: { x: 50, y: 0, z: -100 } }
    ],
    18: [
        { target: 17, position: { x: -50, y: 0, z: -100 } },
        { target: 19, position: { x: 50, y: 0, z: -100 } }
    ],
    19: [
        { target: 18, position: { x: -50, y: 0, z: -100 } },
        { target: 20, position: { x: 50, y: 0, z: -100 } }
    ],
    20: [
        { target: 19, position: { x: -50, y: 0, z: -100 } },
        { target: 21, position: { x: 50, y: 0, z: -100 } }
    ],
    21: [
        { target: 20, position: { x: -50, y: 0, z: -100 } },
        { target: 22, position: { x: 50, y: 0, z: -100 } }
    ],
    22: [
        { target: 21, position: { x: -50, y: 0, z: -100 } },
        { target: 23, position: { x: 50, y: 0, z: -100 } }
    ],
    23: [
        { target: 22, position: { x: -50, y: 0, z: -100 } },
        { target: 24, position: { x: 50, y: 0, z: -100 } }
    ],
    24: [
        { target: 23, position: { x: -50, y: 0, z: -100 } },
        { target: 25, position: { x: 50, y: 0, z: -100 } }
    ],
    25: [
        { target: 24, position: { x: -50, y: 0, z: -100 } },
        { target: 26, position: { x: 50, y: 0, z: -100 } }
    ],
    26: [
        { target: 25, position: { x: -50, y: 0, z: -100 } },
        { target: 27, position: { x: 50, y: 0, z: -100 } }
    ],
    27: [
        { target: 26, position: { x: -50, y: 0, z: -100 } },
        { target: 28, position: { x: 50, y: 0, z: -100 } }
    ],
    28: [
        { target: 27, position: { x: -50, y: 0, z: -100 } },
        { target: 29, position: { x: 50, y: 0, z: -100 } }
    ],
    29: [
        { target: 28, position: { x: -50, y: 0, z: -100 } },
        { target: 30, position: { x: 50, y: 0, z: -100 } }
    ],
    30: [
        { target: 29, position: { x: -50, y: 0, z: -100 } },
        { target: 31, position: { x: 50, y: 0, z: -100 } }
    ],
    31: [
        { target: 30, position: { x: -50, y: 0, z: -100 } },
        { target: 32, position: { x: 50, y: 0, z: -100 } }
    ],
    32: [
        { target: 31, position: { x: -50, y: 0, z: -100 } },
        { target: 33, position: { x: 50, y: 0, z: -100 } }
    ],
    33: [
        { target: 32, position: { x: -50, y: 0, z: -100 } },
        { target: 34, position: { x: 50, y: 0, z: -100 } }
    ],
    34: [
        { target: 33, position: { x: -50, y: 0, z: -100 } },
        { target: 35, position: { x: 50, y: 0, z: -100 } }
    ],
    35: [
        { target: 34, position: { x: -50, y: 0, z: -100 } },
        { target: 36, position: { x: 50, y: 0, z: -100 } }
    ],
    36: [
        { target: 35, position: { x: -50, y: 0, z: -100 } },
        { target: 37, position: { x: 50, y: 0, z: -100 } }
    ],
    37: [
        { target: 36, position: { x: -50, y: 0, z: -100 } },
        { target: 38, position: { x: 50, y: 0, z: -100 } }
    ],
    38: [{ target: 37, position: { x: -50, y: 0, z: -100 } }]
};

// Hotspot configuration - Auto-generated for all 39 scenes
// Each scene has a "Previous" button (left) and "Next" button (right)
// const hotspotConfig = Object.fromEntries(
//   images.map((_, i) => {
//     const links = [];
//     if (i > 0) {
//       links.push({ target: i - 1, position: { x: -100, y: -80, z: -100 } });
//     }
//     if (i < images.length - 1) {
//       links.push({ target: i + 1, position: { x: 100, y: -80, z: -100 } });
//     }
//     return [i, links];
//   })
// );




// Hotspot objects
let hotspots = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredHotspot = null;

// Create Sphere for 360 view
const sphereGeometry = new THREE.SphereGeometry(500, 64, 64);
const sphereMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    transparent: true,
    opacity: 1
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

// Add axis helper (X=red, Y=green, Z=blue)
const axesHelper = new THREE.AxesHelper(200);
//#######################################################################################scene.add(axesHelper);

// Transition state
let isTransitioning = false;

// Load initial texture with fade transition
function loadTexture(index) {
    if (isTransitioning) return; // Prevent multiple transitions at once

    isTransitioning = true;
    const fadeDuration = 500; // milliseconds
    const startTime = performance.now();

    // Fade out
    function fadeOut() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);

        sphereMaterial.opacity = 1 - progress;

        if (progress < 1) {
            requestAnimationFrame(fadeOut);
        } else {
            // Load new texture after fade out completes
            textureLoader.load(images[index], (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                sphereMaterial.map = texture;
                sphereMaterial.needsUpdate = true;

                // Start fade in
                const fadeInStartTime = performance.now();
                function fadeIn() {
                    const elapsed = performance.now() - fadeInStartTime;
                    const progress = Math.min(elapsed / fadeDuration, 1);

                    sphereMaterial.opacity = progress;

                    if (progress < 1) {
                        requestAnimationFrame(fadeIn);
                    } else {
                        isTransitioning = false;
                    }
                }
                fadeIn();
            });
        }
    }

    fadeOut();

    // Update hotspots for new scene
    createHotspots(index);

    // Preload adjacent images for smooth navigation
    preloadAdjacentImages(index);
}

// Preload next and previous images for faster navigation
function preloadAdjacentImages(currentIndex) {
    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;

    // Preload next image
    textureLoader.load(images[nextIndex]);
    // Preload previous image
    textureLoader.load(images[prevIndex]);
}

// Create hotspots for current scene
function createHotspots(sceneIndex) {
    // Clear existing hotspots
    hotspots.forEach(hotspot => {
        scene.remove(hotspot.mesh);
        if (hotspot.sprite) scene.remove(hotspot.sprite);
    });
    hotspots = [];

    // Get hotspot configuration for this scene
    const config = hotspotConfig[sceneIndex];
    if (!config) return;

    // Create new hotspots
    config.forEach(hotspotData => {
        // Create glowing sphere
        const geometry = new THREE.SphereGeometry(8, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.9
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            hotspotData.position.x,
            hotspotData.position.y,
            hotspotData.position.z
        );

        // Create sprite label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 100;
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'bold 24px Arial';
        context.fillStyle = '#00ff88';
        context.textAlign = 'center';
        // Auto-label using the target index + 1 for human-friendly numbering
        const labelText = hotspotData.label || `Scene ${hotspotData.target }`;
        context.fillText(labelText, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(
            hotspotData.position.x,
            hotspotData.position.y + 10,
            hotspotData.position.z
        );
        sprite.scale.set(20, 5, 1);

        scene.add(mesh);
        scene.add(sprite);

        hotspots.push({
            mesh: mesh,
            sprite: sprite,
            targetScene: hotspotData.target,
            originalColor: 0x00ff88
        });
    });
}

// Load initial image
loadTexture(currentImageIndex);

// UI Controls
const loadingScreen = document.getElementById('loading-screen');

// Navigation between images
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    loadTexture(currentImageIndex);
}

function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    loadTexture(currentImageIndex);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        nextImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        previousImage();
    }
});

// TEMPORARY: Coordinate logging mode
let coordinateModeActive = false;
let lastLoggedCoordinate = null;
let logThrottle = null;

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        nextImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        previousImage();
    } else if (e.key === 'c' || e.key === 'C') {
        // Toggle coordinate mode
        coordinateModeActive = !coordinateModeActive;
        if (coordinateModeActive) {
            console.log('%c✅ COORDINATE MODE ON - Move cursor to see position', 'color: green; font-size: 16px; font-weight: bold; background: black; padding: 5px;');
            document.body.style.cursor = 'crosshair';
        } else {
            console.log('%c❌ COORDINATE MODE OFF', 'color: red; font-size: 16px; font-weight: bold; background: black; padding: 5px;');
            document.body.style.cursor = 'default';
            lastLoggedCoordinate = null;
        }
    }
});

// Mouse interaction for hotspots
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // If coordinate mode is active, log coordinates
    if (coordinateModeActive) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(sphere);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            const rounded = { x: Math.round(point.x), y: Math.round(point.y), z: Math.round(point.z) };
            
            const coordString = `${rounded.x},${rounded.y},${rounded.z}`;
            if (lastLoggedCoordinate !== coordString) {
                lastLoggedCoordinate = coordString;
                console.log(`%c📍 Scene ${currentImageIndex}: { x: ${rounded.x}, y: ${rounded.y}, z: ${rounded.z} }`, 'color: cyan; font-size: 13px; font-weight: bold;');
            }
        }
        return; // Skip hotspot detection in coordinate mode
    }

    // Raycast to detect hotspot hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hotspots.map(h => h.mesh));

    // Reset previous hover
    if (hoveredHotspot) {
        hoveredHotspot.mesh.material.color.setHex(hoveredHotspot.originalColor);
        hoveredHotspot.mesh.scale.set(1, 1, 1);
        canvas.style.cursor = 'grab';
    }

    // Set new hover
    if (intersects.length > 0) {
        const hotspot = hotspots.find(h => h.mesh === intersects[0].object);
        if (hotspot) {
            hoveredHotspot = hotspot;
            hotspot.mesh.material.color.setHex(0xffffff);
            hotspot.mesh.scale.set(1.3, 1.3, 1.3);
            canvas.style.cursor = 'pointer';
        }
    } else {
        hoveredHotspot = null;
    }
}

function onMouseClick(event) {
    // If coordinate mode is active, log coordinates instead of navigating
    if (coordinateModeActive) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(sphere);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            const rounded = { x: Math.round(point.x), y: Math.round(point.y), z: Math.round(point.z) };
            console.log(`%cScene ${currentImageIndex}: { x: ${rounded.x}, y: ${rounded.y}, z: ${rounded.z} }`, 'color: blue; font-size: 12px; font-weight: bold');
        }
        return; // Don't navigate when in coordinate mode
    }

    // Normal hotspot navigation
    if (hoveredHotspot) {
        currentImageIndex = hoveredHotspot.targetScene;
        loadTexture(currentImageIndex);
    }
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('click', onMouseClick);

// Window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Animate hotspots (pulsing effect)
    hotspots.forEach((hotspot, index) => {
        if (hotspot !== hoveredHotspot) {
            const pulse = Math.sin(time * 2 + index) * 0.1 + 1;
            hotspot.mesh.scale.set(pulse, pulse, pulse);
            hotspot.mesh.material.opacity = 0.6 + Math.sin(time * 2 + index) * 0.2;
        }
    });

    // Smooth FOV zoom
    camera.fov += (targetFov - camera.fov) * 0.1;
    camera.updateProjectionMatrix();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// Hide loading screen and start animation
setTimeout(() => {
    loadingScreen.classList.add('hidden');
    animate();
}, 1000);
