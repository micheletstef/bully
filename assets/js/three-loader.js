import * as THREE from "./three.module.min.js";
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";

window.THREE = THREE;
window.THREE_GLTFLoader = GLTFLoader;
window.dispatchEvent(new Event("three-ready"));
