/**
 * Hotspot configuration for interior tour
 * Maps scene index to array of hotspots with target, position, and label
 */
export const hotspotConfig = {
  0: [{ target: 1, position: { x: 200, y: 0, z: 0 }, label: "Move Here" }],
  1: [
    { target: 0, position: { x: -200, y: -100, z: 0 }, label: "Move Back" },
    { target: 2, position: { x: 150, y: -35, z: 50 }, label: "Enter" }
  ],
  2: [
    { target: 1, position: { x: -100, y: 0, z: 0 }, label: "Exit" },
    { target: 3, position: { x: 200, y: -70, z: 0 }, label: "Next" }
  ],
  3: [
    { target: 2, position: { x: -200, y: -70, z: 0 }, label: "Previous" },
    { target: 4, position: { x: 200, y: -70, z: 10 }, label: "Next" }
  ],
  4: [
    { target: 3, position: { x: -200, y: -70, z: 0 }, label: "Previous" },
    { target: 5, position: { x: 200, y: -70, z: 30 }, label: "Next" }
  ],
  5: [
    { target: 4, position: { x: -200, y: -70, z: 0 }, label: "Previous" },
    { target: 6, position: { x: 200, y: -70, z: 10 }, label: "Next" }
  ],
  6: [
    { target: 5, position: { x: -200, y: -70, z: 0 }, label: "Previous" },
    { target: 7, position: { x: 200, y: -70, z: 20 }, label: "Next" }
  ],
  7: [
    { target: 6, position: { x: -200, y: -70, z: 0 }, label: "Previous" },
    { target: 8, position: { x: 0, y: -70, z: -200 }, label: "Next" }
  ],
  8: [
    { target: 7, position: { x: 0, y: -70, z: 200 }, label: "Previous" },
    { target: 9, position: { x: 0, y: -70, z: -200 }, label: "Next" }
  ],
  9: [
    { target: 8, position: { x: 0, y: -70, z: 200 }, label: "Previous" },
    { target: 10, position: { x: -200, y: -70, z: 0 }, label: "Next" }
  ],
  10: [
    { target: 9, position: { x: 200, y: -70, z: 0 }, label: "Previous" },
    { target: 11, position: { x: -300, y: -50, z: 0 }, label: "Next" }
  ],
  11: [
    { target: 10, position: { x: 200, y: -70, z: 0 }, label: "Previous" }
  ]
};

/**
 * Image paths for the interior tour (26 images)
 */
export const interiorImages = Array.from(
  { length: 26 },
  (_, i) => `/360-images/image-${i + 1}.jpg`
);
