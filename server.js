const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(__dirname));

// Endpoint to receive coordinates from browser
app.post('/log-coordinate', (req, res) => {
    const { x, y, z, scene } = req.body;
    console.log(`\x1b[36m📍 Scene ${scene}: \x1b[33m{ x: ${x}, y: ${y}, z: ${z} }\x1b[0m`);
    res.json({ success: true });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `\n🚀 Server running at http://localhost:${PORT}`);
    console.log('\x1b[33m%s\x1b[0m', '👉 Press C to activate coordinate mode');
    console.log('\x1b[33m%s\x1b[0m', '👉 Move cursor over the scene to see coordinates here\n');
});
