import * as THREE from 'three';

// Individual popup instance
class PopupInstance {
  constructor(markerData, markerPosition, camera, renderer, onClose) {
    this.markerData = markerData;
    this.markerPosition = markerPosition;
    this.camera = camera;
    this.renderer = renderer;
    this.onClose = onClose;
    this.element = null;
    this.isVisible = false;
    this.createPopup();
  }

  createPopup() {
    // Create popup container
    this.element = document.createElement('div');
    this.element.className = 'marker-popup hidden';

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => this.hide());

    // Create content container with icon and text layout
    const contentElement = document.createElement('div');
    contentElement.className = 'popup-content';

    // Build content with icon and text layout
    let content = '<div class="popup-layout">';

    // Icon section - make it clickable if link exists
    if (this.markerData.link) {
      content += `<a href="${this.markerData.link}" target="_blank" class="popup-icon-link">`;
    }
    content += '<div class="popup-icon">';
    if (this.markerData.icon) {
      content += `<img src="${this.markerData.icon}" alt="icon" />`;
    } else {
      // Default icon if none provided
      content += '<div class="popup-icon-default">📍</div>';
    }
    content += '</div>';
    if (this.markerData.link) {
      content += '</a>';
    }

    // Text section
    content += '<div class="popup-text">';
    if (this.markerData.title) {
      content += `<h2 class="popup-title">${this.markerData.title}</h2>`;
    }

    if (this.markerData.description) {
      content += `<p class="popup-description">${this.markerData.description}</p>`;
    }

    if (this.markerData.link) {
      content += `<a href="${this.markerData.link}" target="_blank" class="popup-link">Learn More →</a>`;
    }
    content += '</div>';

    content += '</div>';

    contentElement.innerHTML = content;

    // Assemble popup
    this.element.appendChild(closeBtn);
    this.element.appendChild(contentElement);

    // Add to DOM
    document.body.appendChild(this.element);

    // Show popup
    setTimeout(() => {
      this.element.classList.remove('hidden');
      this.element.classList.add('visible');
      this.isVisible = true;
    }, 10);
  }

  updatePosition() {
    if (!this.markerPosition || !this.isVisible) return;

    // Convert 3D position to 2D screen coordinates
    const vector = this.markerPosition.clone();
    vector.project(this.camera);

    // Convert to screen space
    const x = (vector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
    const y = (-(vector.y * 0.5) + 0.5) * this.renderer.domElement.clientHeight;

    // Check if marker is behind camera
    if (vector.z > 1) {
      this.element.style.opacity = '0';
      return;
    }

    // Position popup near the marker with offset
    const offsetX = 25; // Offset to the right of marker
    const offsetY = -10; // Slight offset up

    this.element.style.left = `${x + offsetX}px`;
    this.element.style.top = `${y + offsetY}px`;
    this.element.style.transform = 'translate(0, -50%)';
    this.element.style.opacity = '1';
  }

  hide() {
    this.element.classList.remove('visible');
    this.element.classList.add('hidden');
    this.isVisible = false;

    // Call onClose callback after animation
    setTimeout(() => {
      if (this.onClose) {
        this.onClose(this);
      }
    }, 300);
  }

  dispose() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Manager for multiple popups
export class Popup {
  constructor(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.popups = [];
  }

  show(markerData, markerPosition) {
    // Check if popup for this marker already exists
    const existingPopup = this.popups.find(
      p => p.markerData === markerData
    );

    // If it already exists, close it (toggle behavior)
    if (existingPopup) {
      existingPopup.hide();
      return;
    }

    // Create new popup instance
    const popup = new PopupInstance(
      markerData,
      markerPosition,
      this.camera,
      this.renderer,
      (instance) => this.removePopup(instance)
    );

    this.popups.push(popup);
  }

  removePopup(popupInstance) {
    const index = this.popups.indexOf(popupInstance);
    if (index > -1) {
      this.popups.splice(index, 1);
      popupInstance.dispose();
    }
  }

  update() {
    // Update positions of all visible popups
    this.popups.forEach(popup => {
      if (popup.isVisible) {
        popup.updatePosition();
      }
    });
  }

  dispose() {
    this.popups.forEach(popup => popup.dispose());
    this.popups = [];
  }
}
