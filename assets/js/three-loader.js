import * as THREE from "./three.module.min.js";
window.THREE = THREE;

async function loadGLTFLoader() {
  const candidates = [
    "https://unpkg.com/three@0.181.0/examples/jsm/loaders/GLTFLoader.js?module",
    "./GLTFLoader.js",
    "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js",
    "/node_modules/three/examples/jsm/loaders/GLTFLoader.js"
  ];
  for (const specifier of candidates) {
    try {
      const moduleNs = await import(specifier);
      if (moduleNs && moduleNs.GLTFLoader) {
        window.THREE_GLTFLoader = moduleNs.GLTFLoader;
        window.THREE_GLTFLoaderSource = specifier;
        return;
      }
    } catch (error) {
      // Try next source.
    }
  }
  window.THREE_GLTFLoader = null;
  window.THREE_GLTFLoaderSource = "unavailable";
}

async function bootThree() {
  try {
    await loadGLTFLoader();
  } catch (error) {
    // Keep 3D alive even if GLTF loader resolution fails.
    window.THREE_GLTFLoader = null;
    window.THREE_GLTFLoaderSource = "failed";
  } finally {
    window.dispatchEvent(new Event("three-ready"));
  }
}

bootThree();
