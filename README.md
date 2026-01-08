# Three.js 3D Website

A fully-fledged interactive Three.js website featuring a 3D sphere with real-time controls and beautiful visual effects.

## Features

- Interactive 3D sphere with smooth animations
- Orbit controls for camera manipulation
- Real-time color customization
- Adjustable rotation speed
- Wireframe mode toggle
- FPS counter and statistics
- Particle system background
- Dynamic lighting that follows mouse movement
- Responsive design
- Modern UI with glassmorphism effects

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Project

Start the development server:
```bash
npm run dev
```

Then open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

## Controls

- **Mouse Drag**: Rotate the camera around the sphere
- **Mouse Wheel**: Zoom in/out
- **Color Picker**: Change the sphere color
- **Rotation Speed Slider**: Adjust rotation speed
- **Wireframe Toggle**: Switch between solid and wireframe view
- **Reset Button**: Reset camera to default position

## Project Structure

```
002/
├── index.html      # Main HTML file
├── style.css       # Styling and UI
├── main.js         # Three.js scene and logic
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

## Technologies Used

- Three.js (3D rendering)
- Vite (Build tool and dev server)
- Modern ES6+ JavaScript
- CSS3 with Glassmorphism effects
