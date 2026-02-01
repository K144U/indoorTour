import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { hotspotConfig, interiorImages } from './hotspotConfig.js';

/**
 * Interior Tour Scene - Handles the 360 panorama indoor tour with hotspot navigation
 */
export class InteriorScene {
  constructor(canvas, onBackCallback) {
    this.canvas = canvas;
    this.onBack = onBackCallback;

    // Three.js objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.sphere = null;
    this.sphereMaterial = null;

    // State
    this.currentImageIndex = 0;
    this.hotspots = [];
    this.hoveredHotspot = null;
    this.isTransitioning = false;
    this.isRunning = false;
    this.targetFov = 75;

    // Utilities
    this.textureLoader = new THREE.TextureLoader();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();

    // Bound event handlers (for proper cleanup)
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseClick = this.onMouseClick.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnKeydown = this.onKeydown.bind(this);
    this.boundOnResize = this.onResize.bind(this);
    this.boundAnimate = this.animate.bind(this);
  }

  /**
   * Initialize the interior scene
   */
  async init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 0.1);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = -0.5;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    // Create panorama sphere
    const sphereGeometry = new THREE.SphereGeometry(500, 64, 64);
    this.sphereMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 1
    });
    this.sphere = new THREE.Mesh(sphereGeometry, this.sphereMaterial);
    this.sphere.position.set(0, 0, 0);
    this.scene.add(this.sphere);

    // Add event listeners
    this.canvas.addEventListener('wheel', this.boundOnWheel, { passive: false });
    this.canvas.addEventListener('mousemove', this.boundOnMouseMove);
    this.canvas.addEventListener('click', this.boundOnMouseClick);
    document.addEventListener('keydown', this.boundOnKeydown);
    window.addEventListener('resize', this.boundOnResize);

    // Load initial texture (without hotspot fade for first load)
    await this.loadInitialTexture(this.currentImageIndex);

    // Start animation loop
    this.isRunning = true;
    this.animate();

    console.log('Interior scene initialized');
  }

  /**
   * Load initial texture without fade animation
   */
  loadInitialTexture(index) {
    return new Promise((resolve) => {
      this.textureLoader.load(interiorImages[index], (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        this.sphereMaterial.map = texture;
        this.sphereMaterial.needsUpdate = true;
        this.sphereMaterial.opacity = 1;

        // Create hotspots with full opacity for initial load
        this.createHotspots(index, 1);

        // Preload adjacent images
        this.preloadAdjacentImages(index);

        resolve();
      });
    });
  }

  /**
   * Load a panorama texture with coordinated fade transitions
   * Hotspots fade out before texture, fade in after
   */
  loadTexture(index) {
    return new Promise((resolve) => {
      if (this.isTransitioning) {
        resolve();
        return;
      }

      this.isTransitioning = true;
      const textureFadeDuration = 500;
      const hotspotFadeDuration = 300;

      // Phase 1: Fade out hotspots first
      this.fadeHotspots(0, hotspotFadeDuration).then(() => {
        const startTime = performance.now();

        // Phase 2: Fade out texture
        const fadeOut = () => {
          const elapsed = performance.now() - startTime;
          const progress = Math.min(elapsed / textureFadeDuration, 1);
          this.sphereMaterial.opacity = 1 - progress;

          if (progress < 1) {
            requestAnimationFrame(fadeOut);
          } else {
            // Clear old hotspots during blackout
            this.clearHotspots();

            // Preload adjacent images
            this.preloadAdjacentImages(index);

            // Load new texture
            this.textureLoader.load(interiorImages[index], (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              this.sphereMaterial.map = texture;
              this.sphereMaterial.needsUpdate = true;

              // Phase 3: Fade in texture
              const fadeInStartTime = performance.now();
              const fadeIn = () => {
                const elapsed = performance.now() - fadeInStartTime;
                const progress = Math.min(elapsed / textureFadeDuration, 1);
                this.sphereMaterial.opacity = progress;

                if (progress < 1) {
                  requestAnimationFrame(fadeIn);
                } else {
                  // Phase 4: Create hotspots with opacity 0 and fade them in
                  this.createHotspots(index, 0);
                  this.fadeHotspots(1, hotspotFadeDuration + 100).then(() => {
                    this.isTransitioning = false;
                    resolve();
                  });
                }
              };
              fadeIn();
            });
          }
        };

        fadeOut();
      });
    });
  }

  /**
   * Fade hotspots to target opacity
   * @param {number} targetOpacity - Target opacity (0 or 1)
   * @param {number} duration - Fade duration in ms
   * @returns {Promise} Resolves when fade completes
   */
  fadeHotspots(targetOpacity, duration) {
    return new Promise((resolve) => {
      if (this.hotspots.length === 0) {
        resolve();
        return;
      }

      // Store starting opacities
      const startOpacities = this.hotspots.map(h => ({
        mesh: h.mesh.material.opacity,
        sprite: h.sprite ? h.sprite.material.opacity : 0
      }));

      const startTime = performance.now();

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out for smoother feel
        const eased = 1 - Math.pow(1 - progress, 3);

        this.hotspots.forEach((hotspot, i) => {
          // Target mesh opacity is 0.8 at full visibility
          const targetMeshOpacity = targetOpacity * 0.8;
          const meshOpacity = startOpacities[i].mesh + (targetMeshOpacity - startOpacities[i].mesh) * eased;
          const spriteOpacity = startOpacities[i].sprite + (targetOpacity - startOpacities[i].sprite) * eased;

          hotspot.mesh.material.opacity = meshOpacity;
          if (hotspot.sprite) {
            hotspot.sprite.material.opacity = spriteOpacity;
          }
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  /**
   * Clear hotspots without creating new ones
   */
  clearHotspots() {
    this.hotspots.forEach(hotspot => {
      this.scene.remove(hotspot.mesh);
      if (hotspot.sprite) this.scene.remove(hotspot.sprite);
      hotspot.mesh.geometry.dispose();
      hotspot.mesh.material.dispose();
      if (hotspot.sprite) {
        hotspot.sprite.material.map.dispose();
        hotspot.sprite.material.dispose();
      }
    });
    this.hotspots = [];
    this.hoveredHotspot = null;
  }

  /**
   * Preload adjacent images for smooth navigation
   */
  preloadAdjacentImages(currentIndex) {
    const nextIndex = (currentIndex + 1) % interiorImages.length;
    const prevIndex = (currentIndex - 1 + interiorImages.length) % interiorImages.length;
    this.textureLoader.load(interiorImages[nextIndex]);
    this.textureLoader.load(interiorImages[prevIndex]);
  }

  /**
   * Create hotspots for the current scene
   * @param {number} sceneIndex - Scene index for config lookup
   * @param {number} initialOpacity - Initial opacity (1 for normal, 0 for fade-in)
   */
  createHotspots(sceneIndex, initialOpacity = 1) {
    // Clear existing hotspots
    this.clearHotspots();

    // Get config for this scene
    const config = hotspotConfig[sceneIndex];
    if (!config) return;

    // Create new hotspots with specified initial opacity
    config.forEach(hotspotData => {
      // Create glowing sphere
      const geometry = new THREE.SphereGeometry(5, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: initialOpacity * 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        hotspotData.position.x,
        hotspotData.position.y,
        hotspotData.position.z
      );

      // Create sprite label with initial opacity
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = 'bold 24px Arial';
      context.fillStyle = '#00ff88';
      context.textAlign = 'center';
      context.fillText(hotspotData.label, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: initialOpacity
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(
        hotspotData.position.x,
        hotspotData.position.y + 10,
        hotspotData.position.z
      );
      sprite.scale.set(20, 5, 1);

      this.scene.add(mesh);
      this.scene.add(sprite);

      this.hotspots.push({
        mesh,
        sprite,
        targetScene: hotspotData.target,
        originalColor: 0x00ff88,
        baseOpacity: 0.8
      });
    });
  }

  /**
   * Navigate to next image
   */
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % interiorImages.length;
    this.loadTexture(this.currentImageIndex);
  }

  /**
   * Navigate to previous image
   */
  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + interiorImages.length) % interiorImages.length;
    this.loadTexture(this.currentImageIndex);
  }

  /**
   * Mouse move handler for hotspot hover detection
   */
  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hotspots.map(h => h.mesh));

    // Reset previous hover
    if (this.hoveredHotspot) {
      this.hoveredHotspot.mesh.material.color.setHex(this.hoveredHotspot.originalColor);
      this.hoveredHotspot.mesh.scale.set(1, 1, 1);
      this.canvas.style.cursor = 'grab';
    }

    // Set new hover
    if (intersects.length > 0) {
      const hotspot = this.hotspots.find(h => h.mesh === intersects[0].object);
      if (hotspot) {
        this.hoveredHotspot = hotspot;
        hotspot.mesh.material.color.setHex(0xffffff);
        hotspot.mesh.scale.set(1.3, 1.3, 1.3);
        this.canvas.style.cursor = 'pointer';
      }
    } else {
      this.hoveredHotspot = null;
    }
  }

  /**
   * Mouse click handler for hotspot navigation
   */
  onMouseClick() {
    if (this.hoveredHotspot && !this.isTransitioning) {
      this.currentImageIndex = this.hoveredHotspot.targetScene;
      this.loadTexture(this.currentImageIndex);
    }
  }

  /**
   * Wheel handler for FOV zoom
   */
  onWheel(event) {
    event.preventDefault();
    const zoomSpeed = 0.05;
    this.targetFov += event.deltaY * zoomSpeed;
    this.targetFov = Math.max(20, Math.min(100, this.targetFov));
  }

  /**
   * Keyboard handler for navigation
   */
  onKeydown(event) {
    if (event.key === 'ArrowRight' || event.key === 'n' || event.key === 'N') {
      this.nextImage();
    } else if (event.key === 'ArrowLeft' || event.key === 'p' || event.key === 'P') {
      this.previousImage();
    } else if (event.key === 'Escape' && this.onBack) {
      this.onBack();
    }
  }

  /**
   * Window resize handler
   */
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isRunning) return;

    requestAnimationFrame(this.boundAnimate);

    const time = this.clock.getElapsedTime();

    // Animate hotspots (pulsing effect) - skip during transitions
    if (!this.isTransitioning) {
      this.hotspots.forEach((hotspot, index) => {
        if (hotspot !== this.hoveredHotspot) {
          const pulse = Math.sin(time * 2 + index) * 0.1 + 1;
          hotspot.mesh.scale.set(pulse, pulse, pulse);

          // Pulse opacity around base opacity
          const baseOpacity = hotspot.baseOpacity || 0.8;
          const opacityPulse = baseOpacity + Math.sin(time * 2 + index) * 0.15;
          hotspot.mesh.material.opacity = Math.min(opacityPulse, 0.95);
        }
      });
    }

    // Smooth FOV zoom
    this.camera.fov += (this.targetFov - this.camera.fov) * 0.1;
    this.camera.updateProjectionMatrix();

    // Update controls
    this.controls.update();

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Dispose all resources
   */
  dispose() {
    this.isRunning = false;

    // Remove event listeners
    this.canvas.removeEventListener('wheel', this.boundOnWheel);
    this.canvas.removeEventListener('mousemove', this.boundOnMouseMove);
    this.canvas.removeEventListener('click', this.boundOnMouseClick);
    document.removeEventListener('keydown', this.boundOnKeydown);
    window.removeEventListener('resize', this.boundOnResize);

    // Dispose hotspots
    this.clearHotspots();

    // Dispose sphere
    if (this.sphere) {
      this.scene.remove(this.sphere);
      this.sphere.geometry.dispose();
      if (this.sphereMaterial.map) {
        this.sphereMaterial.map.dispose();
      }
      this.sphereMaterial.dispose();
    }

    // Dispose controls
    if (this.controls) {
      this.controls.dispose();
    }

    // Clear scene
    if (this.scene) {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }

    // Reset state
    this.currentImageIndex = 0;
    this.hoveredHotspot = null;
    this.isTransitioning = false;
    this.targetFov = 75;

    console.log('Interior scene disposed');
  }
}
