import * as THREE from 'three';
import { CONFIG } from './config.js';

export class PanoramaSphere {
  constructor() {
    this.mesh = null;
    this.textureLoader = new THREE.TextureLoader();
    this.isLoaded = false;
  }

  async load(onProgress, onError) {
    return new Promise((resolve, reject) => {
      // Create sphere geometry
      const geometry = new THREE.SphereGeometry(
        CONFIG.sphere.radius,
        CONFIG.sphere.widthSegments,
        CONFIG.sphere.heightSegments
      );

      // Flip geometry to show texture on inside
      geometry.scale(-1, 1, 1);

      // Load texture
      this.textureLoader.load(
        CONFIG.texture.path,
        (texture) => {
          // Success callback
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.FrontSide,
          });

          this.mesh = new THREE.Mesh(geometry, material);
          this.isLoaded = true;

          if (onProgress) onProgress();
          resolve(this.mesh);
        },
        undefined,
        (error) => {
          // Error callback - create fallback sphere
          console.warn('Failed to load texture, using fallback color:', error);

          const material = new THREE.MeshBasicMaterial({
            color: CONFIG.texture.fallbackColor,
            side: THREE.FrontSide,
          });

          this.mesh = new THREE.Mesh(geometry, material);
          this.isLoaded = true;

          if (onError) onError(error);
          resolve(this.mesh);
        }
      );
    });
  }

  getMesh() {
    return this.mesh;
  }

  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      if (this.mesh.material.map) {
        this.mesh.material.map.dispose();
      }
    }
  }
}
