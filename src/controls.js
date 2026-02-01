import * as THREE from 'three';
import { CONFIG } from './config.js';

export class CameraControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.previousTouchPosition = { x: 0, y: 0 };

    // Track rotation using spherical coordinates
    this.lon = 0; // Longitude (horizontal rotation)
    this.lat = 0; // Latitude (vertical rotation)

    // Velocity tracking for momentum
    this.velocity = { x: 0, y: 0 };
    this.velocityHistory = [];
    this.maxVelocitySamples = 5;
    this.lastMoveTime = 0;

    // Momentum configuration - smooth & gradual feel
    this.momentumEnabled = true;
    this.friction = 0.92;
    this.minVelocity = 0.01;
    this.velocityMultiplier = 0.15;

    // Animation frame for momentum
    this.animationFrameId = null;
    this.isAnimating = false;

    this.init();
  }

  init() {
    // Mouse controls
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.domElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    // Touch controls
    this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));

    // Zoom controls
    this.domElement.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

    // Prevent context menu on right-click
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  onMouseDown(event) {
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };

    // Reset velocity tracking on new drag
    this.velocity = { x: 0, y: 0 };
    this.velocityHistory = [];
    this.lastMoveTime = performance.now();

    // Stop any ongoing momentum animation
    this.stopMomentum();
  }

  onMouseMove(event) {
    if (!this.isDragging) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastMoveTime;

    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;

    // Calculate instantaneous velocity (normalized to ~60fps)
    if (deltaTime > 0) {
      const instantVelocity = {
        x: deltaX / Math.max(deltaTime, 8) * 16,
        y: deltaY / Math.max(deltaTime, 8) * 16
      };

      // Add to velocity history for smoothing
      this.velocityHistory.push(instantVelocity);
      if (this.velocityHistory.length > this.maxVelocitySamples) {
        this.velocityHistory.shift();
      }
    }

    this.updateRotation(deltaX, deltaY);

    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
    this.lastMoveTime = currentTime;
  }

  onMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;

    // Calculate average velocity from recent samples
    if (this.momentumEnabled && this.velocityHistory.length > 0) {
      const avgVelocity = this.velocityHistory.reduce(
        (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
        { x: 0, y: 0 }
      );

      this.velocity = {
        x: (avgVelocity.x / this.velocityHistory.length) * this.velocityMultiplier,
        y: (avgVelocity.y / this.velocityHistory.length) * this.velocityMultiplier
      };

      // Only start momentum if velocity is significant
      const totalVelocity = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
      if (totalVelocity > this.minVelocity) {
        this.startMomentum();
      }
    }
  }

  onMouseLeave() {
    if (this.isDragging) {
      this.onMouseUp();
    }
  }

  /**
   * Start the momentum animation loop
   */
  startMomentum() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.animateMomentum();
  }

  /**
   * Stop momentum animation
   */
  stopMomentum() {
    this.isAnimating = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.velocity = { x: 0, y: 0 };
  }

  /**
   * Momentum animation frame
   */
  animateMomentum() {
    if (!this.isAnimating) return;

    // Apply velocity to rotation
    this.updateRotation(this.velocity.x, this.velocity.y);

    // Apply friction (exponential decay)
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    // Check if velocity is below threshold
    const totalVelocity = Math.sqrt(
      this.velocity.x * this.velocity.x +
      this.velocity.y * this.velocity.y
    );

    if (totalVelocity < this.minVelocity) {
      this.stopMomentum();
      return;
    }

    // Continue animation
    this.animationFrameId = requestAnimationFrame(this.animateMomentum.bind(this));
  }

  onTouchStart(event) {
    if (event.touches.length === 1) {
      this.previousTouchPosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };

      // Reset velocity tracking
      this.velocity = { x: 0, y: 0 };
      this.velocityHistory = [];
      this.lastMoveTime = performance.now();
      this.stopMomentum();
      this.isDragging = true;
    }
  }

  onTouchMove(event) {
    if (event.touches.length === 1 && this.isDragging) {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastMoveTime;

      const deltaX = event.touches[0].clientX - this.previousTouchPosition.x;
      const deltaY = event.touches[0].clientY - this.previousTouchPosition.y;

      // Track velocity
      if (deltaTime > 0) {
        const instantVelocity = {
          x: deltaX / Math.max(deltaTime, 8) * 16,
          y: deltaY / Math.max(deltaTime, 8) * 16
        };

        this.velocityHistory.push(instantVelocity);
        if (this.velocityHistory.length > this.maxVelocitySamples) {
          this.velocityHistory.shift();
        }
      }

      this.updateRotation(deltaX, deltaY);

      this.previousTouchPosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      this.lastMoveTime = currentTime;
    }
  }

  onTouchEnd() {
    // Apply momentum on touch end (same as mouse up)
    this.onMouseUp();
  }

  onWheel(event) {
    event.preventDefault();

    this.camera.fov += event.deltaY * CONFIG.controls.zoomSpeed;
    this.camera.fov = Math.max(
      CONFIG.camera.minFov,
      Math.min(CONFIG.camera.maxFov, this.camera.fov)
    );
    this.camera.updateProjectionMatrix();
  }

  updateRotation(deltaX, deltaY) {
    // Convert pixel movement to degrees
    const rotationSpeed = 0.1;

    // Update longitude and latitude based on mouse/touch movement
    this.lon += deltaX * rotationSpeed;
    this.lat -= deltaY * rotationSpeed;

    // Limit vertical rotation to prevent flipping
    this.lat = Math.max(-85, Math.min(85, this.lat));

    // Convert to radians
    const phi = THREE.MathUtils.degToRad(90 - this.lat);
    const theta = THREE.MathUtils.degToRad(this.lon);

    // Update camera rotation using Euler angles with proper order
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = theta;
    this.camera.rotation.x = -THREE.MathUtils.degToRad(this.lat);
  }

  dispose() {
    // Stop momentum animation
    this.stopMomentum();

    // Remove all event listeners
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('mouseleave', this.onMouseLeave);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
    this.domElement.removeEventListener('wheel', this.onWheel);
  }
}
