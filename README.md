# 360° Sphere Panorama Viewer

A professional Three.js web application that displays 360° panoramic images inside an interactive sphere. The camera is positioned at the center, allowing users to look around in all directions.

## Features

- **Immersive 360° View**: Camera positioned inside the sphere for full panoramic experience
- **Interactive Markers**: Add clickable hotspots to highlight points of interest
- **Interactive Controls**:
  - Mouse drag to look around
  - Mouse wheel to zoom in/out
  - Touch support for mobile devices
  - Click markers to view details
- **Modern Build System**: Vite for fast development and optimized production builds
- **Modular Architecture**: Clean, maintainable code structure
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Production Ready**: Optimized for deployment

## Project Structure

```
threejs-sphere-viewer/
├── src/
│   ├── main.js           # Application entry point
│   ├── scene.js          # Three.js scene manager
│   ├── sphere.js         # Panorama sphere creation
│   ├── controls.js       # Camera controls
│   ├── markers.js        # Interactive marker system
│   ├── markerData.js     # Marker configuration (EDIT THIS!)
│   ├── popup.js          # Popup UI component
│   ├── config.js         # Configuration constants
│   └── styles/
│       └── main.css      # Application styles
├── public/
│   └── textures/
│       └── panorama.jpg  # Your 360° image goes here
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your panoramic image:
   - Place your 360° panoramic image in `public/textures/`
   - Name it `panorama.jpg` (or update the path in `src/config.js`)
   - Recommended: Equirectangular projection, 4096x2048px or higher

### Development

Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

Preview the production build locally:
```bash
npm run preview
```

## Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to Netlify:
   - Via Netlify CLI: `netlify deploy --prod --dir=dist`
   - Via Netlify web interface: Drag and drop the `dist/` folder

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install -D gh-pages
```

2. Add to `package.json` scripts:
```json
"deploy": "npm run build && gh-pages -d dist"
```

3. Update `vite.config.js` base path:
```javascript
base: '/your-repo-name/'
```

4. Deploy:
```bash
npm run deploy
```

### Option 4: Any Static Host

Simply upload the contents of the `dist/` folder to any static hosting service:
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- Render
- Surge.sh

## Configuration

Edit `src/config.js` to customize:

- **Camera settings**: FOV, zoom limits
- **Sphere settings**: Radius, segments
- **Controls**: Rotation speed, zoom speed
- **Texture path**: Location of your panoramic image

## Adding Your Panoramic Image

1. **Prepare your image**:
   - Format: JPG or PNG
   - Projection: Equirectangular (360° x 180°)
   - Recommended resolution: 4096x2048px or higher
   - Keep file size reasonable (< 5MB for web)

2. **Add to project**:
   - Place in `public/textures/panorama.jpg`
   - Or update path in `src/config.js`:
   ```javascript
   texture: {
     path: '/textures/your-image.jpg',
   }
   ```

3. **Get panoramic images**:
   - Capture with 360° camera
   - Create from multiple photos using stitching software
   - Download from free sources (ensure licensing)
   - Generate using AI tools

## Adding Interactive Markers

Markers are clickable hotspots you can place anywhere in the panorama. When clicked, they show a popup with information.

### How to Add Markers

1. **Edit `src/markerData.js`**:
   ```javascript
   export const MARKERS = [
     {
       lat: 0,           // Latitude: -90 (bottom) to 90 (top)
       lon: 0,           // Longitude: -180 to 180 (0 is front)
       title: "My Location",
       description: "This is an interesting spot!",
       color: 0xff6b6b, // Hex color (optional)
       image: "/path/to/image.jpg", // Optional image
       link: "https://example.com", // Optional external link
     },
     // Add more markers...
   ];
   ```

2. **Finding Coordinates**:
   - Look at the spot where you want to place a marker
   - Open browser console (F12)
   - The app logs camera direction as you move
   - Use those lat/lon values for your marker

3. **Marker Properties**:
   - `lat` (required): Vertical position (-90 to 90)
   - `lon` (required): Horizontal position (-180 to 180)
   - `title` (required): Popup title
   - `description` (required): Popup description text
   - `color` (optional): Marker color in hex (default: `0xff6b6b`)
   - `image` (optional): Path to an image to show in popup
   - `link` (optional): External URL for "Learn More" button

### Example: Complete Marker

```javascript
{
  lat: 20,
  lon: -45,
  title: "Historic Building",
  description: "Built in 1850, this building served as the town hall for over a century.",
  color: 0x4ecdc4,
  image: "/images/building.jpg",
  link: "https://example.com/history",
}
```

### Tips

- Start with 3-5 markers to avoid clutter
- Use contrasting colors for different marker types
- Keep descriptions concise (2-3 sentences)
- Test marker positions by looking around first
- Markers pulse gently to attract attention

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Optimize images**: Use compressed JPEGs
2. **Resize appropriately**: 4096x2048px is usually sufficient
3. **Use CDN**: Host images on a CDN for faster loading
4. **Enable caching**: Configure proper cache headers on your server

## Troubleshooting

**Texture not loading:**
- Check image path in `src/config.js`
- Ensure image is in `public/textures/`
- Check browser console for errors
- Verify image file isn't corrupted

**Performance issues:**
- Reduce image resolution
- Lower sphere segment count in `src/config.js`
- Check device GPU capabilities

**Build errors:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist .vite`
- Update Node.js to latest LTS version

## License

MIT

## Credits

Built with:
- [Three.js](https://threejs.org/) - 3D graphics library
- [Vite](https://vitejs.dev/) - Build tool
