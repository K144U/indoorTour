/**
 * Marker Configuration
 *
 * Add your markers here. Each marker needs:
 * - lat: Latitude in degrees (-90 to 90, where 0 is equator, 90 is top, -90 is bottom)
 * - lon: Longitude in degrees (-180 to 180, where 0 is front)
 * - title: The title shown in the popup
 * - description: Detailed description (optional)
 * - color (optional): Hex color for the marker (default: 0xff6b6b)
 * - icon (optional): URL or path to an icon image for the popup card
 * - link (optional): External link for "Learn More"
 *
 * How to find coordinates:
 * 1. Look at the spot you want to mark
 * 2. Check browser console - it logs your current view direction
 * 3. Use those lat/lon values for your marker
 */

export const MARKERS = [
  {
    lat: 0,
    lon: 20,
    title: "Cologne Cathedral",
    description: "famous Gothic cathedral",
    color: 0xff4444, // Red
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/K%C3%B6lner_Dom_-_Westfassade_2022_ohne_Ger%C3%BCst-0968_b.jpg/250px-K%C3%B6lner_Dom_-_Westfassade_2022_ohne_Ger%C3%BCst-0968_b.jpg", // Add your custom icon here
  },
  {
    lat: -6,
    lon: 99,
    title: "The Rhine River",
    description: "The Rhine River",
    color: 0x4169e1, // Blue
    // icon: "/path/to/icon.png",
  },
  {
    lat: -15,
    lon: -75,
    title: "Cologne City Hall",
    description: "historic tower of the City Hall",
    color: 0x32cd32, // Green
    // icon: "/path/to/icon.png",
  },
  {
    lat: -30,
    lon: 230,
    title: "Subway entrance",
    description: "this is the subway entrance to the city of munich",
    color: 0x9b59b6, // Purple
    // icon: "/path/to/icon.png",
  },
  {
    lat: -65,
    lon: 95,
    title: "Garden Plaza",
    description: "Outdoor recreational space",
    color: 0xff8c00, // Orange
    // icon: "/path/to/icon.png",
  },
  {
    lat: -85,
    lon: 0,
    title: "Jan-von-Werth-Brunnen",
    description: "This is the fountain right in the center of the square (Alter Markt). It features a statue of the cavalry general Jan von Werth",
    color: 0x00ced1, // Cyan
    // icon: "/path/to/icon.png",
  },
  {
    lat: -20,
    lon: 132,
    title: "Great St. Martin Church",
    description: "Romanesque church",
    color: 0xffd700, // Yellow
    // icon: "/path/to/icon.png",
  },
  
  // Add more markers below:
  // {
  //   lat: 0,
  //   lon: 180,
  //   title: "Your Location Name",
  //   description: "Description of this location",
  //   color: 0xd94a38,
  //   icon: "/path/to/your-icon.png",
  //   link: "https://example.com",
  // },
];
