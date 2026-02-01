import './styles/main.css';
import { SceneManager } from './scene.js';
import { PanoramaSphere } from './sphere.js';
import { CameraControls } from './controls.js';
import { MarkerManager } from './markers.js';
import { Popup } from './popup.js';
import { MARKERS } from './markerData.js';
import { InteriorScene } from './interior/InteriorScene.js';

class App {
  constructor() {
    this.sceneManager = null;
    this.sphere = null;
    this.controls = null;
    this.markerManager = null;
    this.popup = null;
    this.isRunning = false;

    // Interior scene
    this.interiorScene = null;
    this.currentView = 'aerial'; // 'aerial' or 'interior'

    // UI elements
    this.goInsideBtn = null;
    this.backAerialBtn = null;

    this.init();
  }

  async init() {
    try {
      // Get canvas element
      const canvas = document.getElementById('webgl-canvas');
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      // Setup navigation buttons
      this.setupNavigationUI();

      // Initialize scene manager
      this.sceneManager = new SceneManager(canvas);

      // Create and load panorama sphere
      this.sphere = new PanoramaSphere();

      const loadingElement = document.getElementById('loading');

      const sphereMesh = await this.sphere.load(
        () => {
          // On successful load
          console.log('Panorama loaded successfully');
          if (loadingElement) {
            loadingElement.style.display = 'none';
          }
          // Show "Go Inside" button after aerial view loads
          this.showGoInsideButton();
        },
        (error) => {
          // On error (using fallback)
          console.warn('Using fallback sphere due to texture loading error');
          if (loadingElement) {
            loadingElement.innerHTML = '<p>Using default texture (add your image to public/textures/panorama.jpg)</p>';
            setTimeout(() => {
              loadingElement.style.display = 'none';
            }, 3000);
          }
          // Still show button even with fallback
          this.showGoInsideButton();
        }
      );

      // Add sphere to scene
      this.sceneManager.addToScene(sphereMesh);

      // Setup camera controls
      this.controls = new CameraControls(
        this.sceneManager.getCamera(),
        this.sceneManager.getRenderer().domElement
      );

      // Setup popup first (needs camera and renderer)
      this.popup = new Popup(
        this.sceneManager.getCamera(),
        this.sceneManager.getRenderer()
      );

      // Setup markers
      this.markerManager = new MarkerManager(
        this.sceneManager.scene,
        this.sceneManager.getCamera(),
        this.sceneManager.getRenderer().domElement
      );

      // Add markers from configuration
      this.markerManager.addMarkers(MARKERS);

      // Handle marker clicks
      this.markerManager.onMarkerClick = (markerData, markerPosition) => {
        this.popup.show(markerData, markerPosition);
      };

      // Handle window resize
      window.addEventListener('resize', this.handleResize.bind(this));

      // Start animation loop
      this.isRunning = true;
      this.animate();

      console.log('App initialized successfully');
      console.log(`Loaded ${MARKERS.length} markers`);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError(error.message);
    }
  }

  /**
   * Setup navigation UI buttons
   */
  setupNavigationUI() {
    // Get button elements
    this.goInsideBtn = document.getElementById('go-inside-btn');
    this.backAerialBtn = document.getElementById('back-aerial-btn');

    if (this.goInsideBtn) {
      this.goInsideBtn.addEventListener('click', () => this.switchToInterior());
    }

    if (this.backAerialBtn) {
      this.backAerialBtn.addEventListener('click', () => this.switchToAerial());
    }
  }

  /**
   * Show the "Go Inside" button
   */
  showGoInsideButton() {
    if (this.goInsideBtn) {
      this.goInsideBtn.classList.remove('hidden');
    }
  }

  /**
   * Hide the "Go Inside" button
   */
  hideGoInsideButton() {
    if (this.goInsideBtn) {
      this.goInsideBtn.classList.add('hidden');
    }
  }

  /**
   * Show the "Back to Aerial" button
   */
  showBackButton() {
    if (this.backAerialBtn) {
      this.backAerialBtn.classList.remove('hidden');
    }
  }

  /**
   * Hide the "Back to Aerial" button
   */
  hideBackButton() {
    if (this.backAerialBtn) {
      this.backAerialBtn.classList.add('hidden');
    }
  }

  /**
   * Switch to interior tour view
   */
  async switchToInterior() {
    console.log('Switching to interior view...');

    // Stop aerial animation
    this.isRunning = false;

    // Hide "Go Inside" button
    this.hideGoInsideButton();

    // Hide info panel
    const infoPanel = document.getElementById('info');
    if (infoPanel) {
      infoPanel.classList.add('hidden');
    }

    // Dispose aerial components (but keep canvas)
    this.disposeAerialComponents();

    // Get canvas
    const canvas = document.getElementById('webgl-canvas');

    // Create and initialize interior scene
    this.interiorScene = new InteriorScene(canvas, () => this.switchToAerial());
    await this.interiorScene.init();

    // Update current view
    this.currentView = 'interior';

    // Show "Back" button
    this.showBackButton();

    console.log('Switched to interior view');
  }

  /**
   * Switch back to aerial view
   */
  async switchToAerial() {
    console.log('Switching to aerial view...');

    // Hide "Back" button
    this.hideBackButton();

    // Dispose interior scene
    if (this.interiorScene) {
      this.interiorScene.dispose();
      this.interiorScene = null;
    }

    // Re-initialize aerial view
    await this.reinitializeAerial();

    // Update current view
    this.currentView = 'aerial';

    // Show info panel
    const infoPanel = document.getElementById('info');
    if (infoPanel) {
      infoPanel.classList.remove('hidden');
    }

    // Show "Go Inside" button
    this.showGoInsideButton();

    console.log('Switched to aerial view');
  }

  /**
   * Dispose aerial-specific components (not the canvas)
   */
  disposeAerialComponents() {
    if (this.markerManager) {
      this.markerManager.dispose();
      this.markerManager = null;
    }

    if (this.popup) {
      this.popup.dispose();
      this.popup = null;
    }

    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }

    if (this.sphere) {
      this.sphere.dispose();
      this.sphere = null;
    }

    if (this.sceneManager) {
      this.sceneManager.dispose();
      this.sceneManager = null;
    }
  }

  /**
   * Reinitialize aerial view after returning from interior
   */
  async reinitializeAerial() {
    const canvas = document.getElementById('webgl-canvas');

    // Initialize scene manager
    this.sceneManager = new SceneManager(canvas);

    // Create and load panorama sphere
    this.sphere = new PanoramaSphere();
    const sphereMesh = await this.sphere.load(
      () => console.log('Aerial panorama reloaded'),
      () => console.warn('Using fallback for aerial')
    );

    // Add sphere to scene
    this.sceneManager.addToScene(sphereMesh);

    // Setup camera controls
    this.controls = new CameraControls(
      this.sceneManager.getCamera(),
      this.sceneManager.getRenderer().domElement
    );

    // Setup popup
    this.popup = new Popup(
      this.sceneManager.getCamera(),
      this.sceneManager.getRenderer()
    );

    // Setup markers
    this.markerManager = new MarkerManager(
      this.sceneManager.scene,
      this.sceneManager.getCamera(),
      this.sceneManager.getRenderer().domElement
    );
    this.markerManager.addMarkers(MARKERS);
    this.markerManager.onMarkerClick = (markerData, markerPosition) => {
      this.popup.show(markerData, markerPosition);
    };

    // Restart animation loop
    this.isRunning = true;
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate.bind(this));

    // Update markers (for pulsing animation)
    if (this.markerManager) {
      this.markerManager.update();
    }

    // Update popup position
    if (this.popup) {
      this.popup.update();
    }

    if (this.sceneManager) {
      this.sceneManager.render();
    }
  }

  handleResize() {
    if (this.sceneManager) {
      this.sceneManager.handleResize();
    }
  }

  showError(message) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
    }
  }

  dispose() {
    this.isRunning = false;

    if (this.interiorScene) {
      this.interiorScene.dispose();
    }

    this.disposeAerialComponents();

    window.removeEventListener('resize', this.handleResize);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
