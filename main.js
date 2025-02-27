// main.js
import FlowerCanvasRenderer from './src/index.ts';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the flower animation with default settings
  // The library will create and set up the canvas automatically
  const renderer = FlowerCanvasRenderer.init();
  
  // Optional: To stop the animation when needed
  // window.stopAnimation = () => renderer.stop();
});
