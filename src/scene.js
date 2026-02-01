import * as THREE from 'three';
import { CONFIG } from './config.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.setupCamera();
    this.setupRenderer();
  }

  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(
      CONFIG.camera.fov,
      aspect,
      CONFIG.camera.near,
      CONFIG.camera.far
    );
    // Position camera at origin (inside the sphere)
    this.camera.position.set(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: CONFIG.renderer.antialias,
      powerPreference: CONFIG.renderer.powerPreference,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  addToScene(object) {
    this.scene.add(object);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  dispose() {
    this.renderer.dispose();
  }
}
