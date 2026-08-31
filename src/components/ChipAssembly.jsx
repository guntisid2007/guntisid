import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createDetailedChip } from "./createDetailedChip";

// Conceptual processor package, not a model of a specific product or project.
export default function ChipAssembly({ paused = false, exploded = true, resetKey = 0, onInteract, fallback = null }) {
  const hostRef = useRef(null);
  const stateRef = useRef({ paused, exploded });
  const wakeRef = useRef(() => {});
  const resetRef = useRef(() => {});
  const interactRef = useRef(onInteract);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    stateRef.current = { paused, exploded };
    wakeRef.current();
  }, [paused, exploded]);

  useEffect(() => { interactRef.current = onInteract; }, [onInteract]);
  useEffect(() => { resetRef.current(); }, [resetKey]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    let frame = 0;
    let disposed = false;
    let visible = true;
    let previousTime = 0;
    let elapsed = 0;
    let distance = 9.8;
    let separation = stateRef.current.exploded ? 1 : 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();
    const cleanup = [];

    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      wakeRef.current = () => {};
      resetRef.current = () => {};
      cleanup.forEach((fn) => fn());
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      }
    };

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.domElement.tabIndex = 0;
      renderer.domElement.setAttribute("role", "img");
      renderer.domElement.setAttribute("aria-label", "3D microchip. Drag to rotate, or use arrow keys. Press Home to reset the view.");
      renderer.domElement.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight ArrowUp ArrowDown Home");
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const environmentRoom = new RoomEnvironment();
      const environmentGenerator = new THREE.PMREMGenerator(renderer);
      cleanup.push(() => environmentRoom.dispose(), () => environmentGenerator.dispose());
      const environment = environmentGenerator.fromScene(environmentRoom, 0.04);
      scene.environment = environment.texture;
      scene.environmentIntensity = 0.85;
      cleanup.push(() => environment.dispose());
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
      const homeDirection = new THREE.Vector3(0.58, 0.48, 0.72).normalize();
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.15, 0);
      camera.position.copy(homeDirection).multiplyScalar(distance).add(controls.target);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = false;
      controls.rotateSpeed = 0.65;
      controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: null, RIGHT: null };
      controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: null };
      controls.update();
      cleanup.push(() => controls.dispose());
      const assembly = new THREE.Group();
      assembly.rotation.y = -0.28;
      scene.add(assembly);
      scene.add(new THREE.HemisphereLight(0xf4f5f0, 0x363c36, 0.6));
      const key = new THREE.DirectionalLight(0xfff1dd, 3.2);
      key.position.set(3, 7, 5);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = key.shadow.camera.bottom = -4;
      key.shadow.camera.right = key.shadow.camera.top = 4;
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 18;
      key.shadow.bias = -0.0001;
      key.shadow.normalBias = 0.015;
      cleanup.push(() => key.shadow.dispose());
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xe8edf0, 1.6);
      fill.position.set(-5, 2, -3);
      scene.add(fill);

      const { board, chip, lid } = createDetailedChip(assembly, { geometries, materials, textures });

      const positionLayers = () => {
        board.position.y = -0.52 - separation * 0.26;
        chip.position.y = -0.27 + separation * 0.32;
        lid.position.y = 0.08 + separation * 1.13;
      };
      positionLayers();

      const renderFrame = (time) => {
        frame = 0;
        if (disposed || !visible || document.hidden) {
          previousTime = 0;
          return;
        }
        const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
        previousTime = time;
        const moving = !motion.matches && !stateRef.current.paused;
        const wanted = stateRef.current.exploded ? 1 : 0;
        const ease = motion.matches ? 1 : 1 - Math.exp(-delta * 7);
        separation += (wanted - separation) * ease;
        if (Math.abs(wanted - separation) < 0.001) separation = wanted;
        positionLayers();
        if (moving) {
          elapsed += delta;
          assembly.rotation.y += (-0.28 + Math.sin(elapsed * 0.35) * 0.18 - assembly.rotation.y) * ease;
        }
        renderer.render(scene, camera);
        if (moving || separation !== wanted) frame = requestAnimationFrame(renderFrame);
        else previousTime = 0;
      };
      const wake = () => {
        if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(renderFrame);
      };
      wakeRef.current = wake;
      const stopAmbientMotion = () => {
        stateRef.current.paused = true;
        interactRef.current?.();
        wake();
      };
      const onDragStart = () => {
        renderer.domElement.focus({ preventScroll: true });
        renderer.domElement.classList.add("is-dragging");
        stopAmbientMotion();
      };
      const onDragEnd = () => renderer.domElement.classList.remove("is-dragging");
      controls.addEventListener("change", wake);
      controls.addEventListener("start", onDragStart);
      controls.addEventListener("end", onDragEnd);
      cleanup.push(() => {
        controls.removeEventListener("change", wake);
        controls.removeEventListener("start", onDragStart);
        controls.removeEventListener("end", onDragEnd);
      });
      const resetView = () => {
        controls.target.set(0, 0.15, 0);
        camera.position.copy(homeDirection).multiplyScalar(distance).add(controls.target);
        assembly.rotation.set(0, -0.28, 0);
        elapsed = 0;
        controls.update();
        wake();
      };
      resetRef.current = resetView;
      const onKeyDown = (event) => {
        const rotations = {
          ArrowLeft: ["rotateLeft", Math.PI / 18],
          ArrowRight: ["rotateLeft", -Math.PI / 18],
          ArrowUp: ["rotateUp", Math.PI / 18],
          ArrowDown: ["rotateUp", -Math.PI / 18],
        };
        if (!rotations[event.key] && event.key !== "Home") return;
        event.preventDefault();
        stopAmbientMotion();
        if (event.key === "Home") resetView();
        else {
          const [method, angle] = rotations[event.key];
          controls[method](angle);
        }
      };
      renderer.domElement.addEventListener("keydown", onKeyDown);
      cleanup.push(() => renderer.domElement.removeEventListener("keydown", onKeyDown));

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Fit the full exploded assembly into narrow desktop and mobile panels.
        distance = Math.max(10.2, 8.5 / camera.aspect);
        const direction = camera.position.clone().sub(controls.target).normalize();
        camera.position.copy(direction).multiplyScalar(distance).add(controls.target);
        controls.update();
        camera.updateProjectionMatrix();
        wake();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      cleanup.push(() => resizeObserver.disconnect());
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
        else { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
      });
      observer.observe(host);
      cleanup.push(() => observer.disconnect());

      const onVisibilityChange = () => {
        if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
        else wake();
      };
      const onMotionChange = () => { previousTime = 0; wake(); };
      const onContextLost = (event) => { event.preventDefault(); dispose(); setFailed(true); };
      document.addEventListener("visibilitychange", onVisibilityChange);
      motion.addEventListener("change", onMotionChange);
      renderer.domElement.addEventListener("webglcontextlost", onContextLost);
      cleanup.push(() => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        motion.removeEventListener("change", onMotionChange);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      });
      resize();
      wake();
      return dispose;
    } catch {
      dispose();
      setFailed(true);
      return undefined;
    }
  }, []);

  if (failed) return fallback;
  return <div className="chip-assembly" ref={hostRef} />;
}
