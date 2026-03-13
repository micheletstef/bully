import * as THREE from "./three.module.min.js";
window.THREE = THREE;

async function bootThree() {
  try {
    const loaderModule = await import("../../node_modules/three/examples/jsm/loaders/GLTFLoader.js");
    window.THREE_GLTFLoader = loaderModule && loaderModule.GLTFLoader ? loaderModule.GLTFLoader : null;
  } catch (error) {
    // Keep 3D alive even if GLTF loader path is unavailable in deployed environments.
    window.THREE_GLTFLoader = null;
  } finally {
    window.dispatchEvent(new Event("three-ready"));
  }
}

bootThree();
