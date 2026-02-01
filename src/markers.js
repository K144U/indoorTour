import * as THREE from 'three';

export class Marker {
  constructor(data) {
    this.data = data;
    this.mesh = null;
    this.createMesh();
  }

  createMesh() {
    // Create a sphere marker
    const geometry = new THREE.SphereGeometry(10, 16, 16); // Increased from 5 to 10
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });

    this.mesh = new THREE.Mesh(geometry, material);

    // Position the marker based on spherical coordinates
    const phi = THREE.MathUtils.degToRad(90 - this.data.lat);
    const theta = THREE.MathUtils.degToRad(this.data.lon);
    const radius = this.data.radius || 480; // Slightly inside the sphere

    this.mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
    this.mesh.position.y = radius * Math.cos(phi);
    this.mesh.position.z = radius * Math.sin(phi) * Math.sin(theta);

    // Store reference to data for click handling
    this.mesh.userData = {
      isMarker: true,
      markerData: this.data,
    };
  }

  getMesh() {
    return this.mesh;
  }

  animate() {
    // Gentle pulsing animation
    const scale = 1 + Math.sin(Date.now() * 0.003) * 0.2;
    this.mesh.scale.set(scale, scale, scale);
  }

  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
  }
}

export class MarkerManager {
  constructor(scene, camera, domElement) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    this.markers = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.onMarkerClick = null;

    this.init();
  }

  init() {
    this.domElement.addEventListener('click', this.handleClick.bind(this));
    this.domElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  addMarker(markerData) {
    const marker = new Marker(markerData);
    this.markers.push(marker);
    this.scene.add(marker.getMesh());
    return marker;
  }

  addMarkers(markersData) {
    markersData.forEach((data) => this.addMarker(data));
  }

  handleClick(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with markers
    const markerMeshes = this.markers.map((m) => m.getMesh());
    const intersects = this.raycaster.intersectObjects(markerMeshes);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const clickedMarker = clickedObject.userData.markerData;
      const markerPosition = clickedObject.position;

      if (this.onMarkerClick) {
        this.onMarkerClick(clickedMarker, markerPosition);
      }
    }
  }

  handleMouseMove(event) {
    // Calculate mouse position
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections
    const markerMeshes = this.markers.map((m) => m.getMesh());
    const intersects = this.raycaster.intersectObjects(markerMeshes);

    // Change cursor on hover
    if (intersects.length > 0) {
      this.domElement.style.cursor = 'pointer';
    } else {
      this.domElement.style.cursor = 'grab';
    }
  }

  update() {
    // Animate all markers
    this.markers.forEach((marker) => marker.animate());
  }

  dispose() {
    this.markers.forEach((marker) => marker.dispose());
    this.markers = [];
    this.domElement.removeEventListener('click', this.handleClick);
    this.domElement.removeEventListener('mousemove', this.handleMouseMove);
  }
}
