/**
 * Scene Router - Manages switching between aerial and interior scenes
 */
export class SceneRouter {
  constructor() {
    this.scenes = {};
    this.currentSceneName = null;
  }

  /**
   * Register a scene with a name
   * @param {string} name - Scene identifier
   * @param {object} scene - Scene instance with init() and dispose() methods
   */
  register(name, scene) {
    this.scenes[name] = scene;
  }

  /**
   * Get the currently active scene name
   * @returns {string|null}
   */
  getCurrentScene() {
    return this.currentSceneName;
  }

  /**
   * Switch to a different scene
   * @param {string} name - Name of the scene to switch to
   */
  async switchTo(name) {
    if (!this.scenes[name]) {
      console.error(`Scene "${name}" not found`);
      return;
    }

    // Dispose current scene if exists
    if (this.currentSceneName && this.scenes[this.currentSceneName]) {
      const currentScene = this.scenes[this.currentSceneName];
      if (typeof currentScene.dispose === 'function') {
        await currentScene.dispose();
      }
    }

    // Initialize new scene
    this.currentSceneName = name;
    const newScene = this.scenes[name];
    if (typeof newScene.init === 'function') {
      await newScene.init();
    }

    console.log(`Switched to scene: ${name}`);
  }

  /**
   * Dispose all scenes
   */
  disposeAll() {
    Object.values(this.scenes).forEach(scene => {
      if (typeof scene.dispose === 'function') {
        scene.dispose();
      }
    });
    this.scenes = {};
    this.currentSceneName = null;
  }
}
