import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
      renderer.toneMappingExposure = 1.35;
      renderer.domElement.tabIndex = 0;
      renderer.domElement.setAttribute("role", "img");
      renderer.domElement.setAttribute("aria-label", "3D microchip. Drag to rotate, or use arrow keys. Press Home to reset the view.");
      renderer.domElement.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight ArrowUp ArrowDown Home");
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
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
      scene.add(new THREE.HemisphereLight(0xfff4dc, 0x454a40, 2.6));
      const key = new THREE.DirectionalLight(0xffedca, 4);
      key.position.set(3, 7, 5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xf2f4ee, 2.5);
      fill.position.set(-5, 2, -3);
      scene.add(fill);

      const material = (color, metalness = 0, roughness = 0.45) => {
        const result = new THREE.MeshStandardMaterial({ color, metalness, roughness });
        materials.add(result);
        return result;
      };
      const boardMaterial = material(0x343e31, 0.25, 0.6);
      const ceramic = material(0x222722, 0.3, 0.4);
      const gold = material(0xcfb46a, 0.65, 0.28);
      const darkGold = material(0x8f753b, 0.55, 0.4);
      const silicon = material(0x646b61, 0.7, 0.22);
      const lidMaterial = material(0xa9aea1, 0.65, 0.32);
      const unitBox = new THREE.BoxGeometry(1, 1, 1);
      geometries.add(unitBox);
      const box = (parent, width, height, depth, x, y, z, surface) => {
        const mesh = new THREE.Mesh(unitBox, surface);
        mesh.scale.set(width, height, depth);
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
      };

      const board = new THREE.Group();
      const chip = new THREE.Group();
      const lid = new THREE.Group();
      assembly.add(board, chip, lid);
      box(board, 3.35, 0.16, 3.35, 0, 0, 0, boardMaterial);
      box(board, 2.12, 0.035, 2.12, 0, 0.098, 0, darkGold);
      box(board, 1.94, 0.04, 1.94, 0, 0.12, 0, ceramic);

      // Etched traces and contact pads make the bottom layer readable as a PCB.
      for (let side = 0; side < 4; side += 1) {
        const edge = new THREE.Group();
        edge.rotation.y = side * Math.PI / 2;
        board.add(edge);
        for (let pin = 0; pin < 10; pin += 1) {
          const x = (pin - 4.5) * 0.19;
          const reach = 0.27 + (pin % 3) * 0.09;
          box(edge, 0.075, 0.025, 0.18, x, 0.104, 1.17, gold);
          box(edge, 0.018, 0.009, reach, x, 0.085, 1.25 + reach / 2, darkGold);
          box(edge, 0.07, 0.009, 0.07, x, 0.088, 1.25 + reach, gold);
        }
      }
      const ringGeometry = new THREE.TorusGeometry(0.095, 0.022, 6, 20);
      geometries.add(ringGeometry);
      for (const x of [-1.42, 1.42]) {
        for (const z of [-1.42, 1.42]) {
          const ring = new THREE.Mesh(ringGeometry, gold);
          ring.rotation.x = Math.PI / 2;
          ring.position.set(x, 0.091, z);
          board.add(ring);
        }
      }

      box(chip, 1.9, 0.18, 1.9, 0, 0, 0, ceramic);
      box(chip, 1.0, 0.075, 1.0, 0, 0.13, 0, silicon);
      // Individual die blocks and bonding wires reveal the scale of the package.
      for (let x = 0; x < 4; x += 1) {
        for (let z = 0; z < 4; z += 1) {
          box(chip, 0.175, 0.012, 0.175, (x - 1.5) * 0.225, 0.174, (z - 1.5) * 0.225, (x + z) % 3 === 0 ? gold : ceramic);
        }
      }
      for (let side = 0; side < 4; side += 1) {
        const edge = new THREE.Group();
        edge.rotation.y = side * Math.PI / 2;
        chip.add(edge);
        for (let pin = 0; pin < 10; pin += 1) {
          const x = (pin - 4.5) * 0.165;
          box(edge, 0.06, 0.05, 0.22, x, -0.03, 1.04, gold);
          box(edge, 0.06, 0.14, 0.06, x, -0.1, 1.12, gold);
          if (pin > 0 && pin < 9) {
            const wirePath = new THREE.QuadraticBezierCurve3(
              new THREE.Vector3(x * 0.57, 0.17, 0.48),
              new THREE.Vector3(x * 0.8, 0.36, 0.68),
              new THREE.Vector3(x, 0.105, 0.87),
            );
            const wireGeometry = new THREE.TubeGeometry(wirePath, 8, 0.007, 4, false);
            geometries.add(wireGeometry);
            edge.add(new THREE.Mesh(wireGeometry, gold));
          }
        }
      }

      box(lid, 1.84, 0.15, 1.84, 0, 0, 0, lidMaterial);
      box(lid, 1.64, 0.045, 1.64, 0, 0.096, 0, silicon);
      // Machined parallel channels catch the light without a fabricated brand.
      for (let index = 0; index < 7; index += 1) {
        box(lid, 1.25, 0.008, 0.023, 0, 0.122, (index - 3) * 0.16, ceramic);
      }
      box(lid, 0.12, 0.008, 0.12, -0.64, 0.123, -0.64, gold);

      const positionLayers = () => {
        board.position.y = -0.52 - separation * 0.26;
        chip.position.y = -0.27 + separation * 0.32;
        lid.position.y = -0.01 + separation * 1.22;
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
