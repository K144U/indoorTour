// Configuration constants
export const CONFIG = {
  // Camera settings
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    minFov: 20,
    maxFov: 100,
  },

  // Sphere settings
  sphere: {
    radius: 500,
    widthSegments: 60,
    heightSegments: 40,
  },

  // Controls settings
  controls: {
    rotationSpeed: 0.005,
    zoomSpeed: 0.05,
    maxPolarAngle: Math.PI / 2,
    minPolarAngle: -Math.PI / 2,
  },

  // Texture settings
  texture: {
    // Place your panorama image in public/textures/
    path: '/textures/panorama.jpg',
    fallbackColor: 0x4444ff,
  },

  // Renderer settings
  renderer: {
    antialias: true,
    powerPreference: 'high-performance',
  },
};
