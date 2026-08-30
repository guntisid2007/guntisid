import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function seededRandom(seed) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export default function HydrogenField({ paused = false, fallback = null }) {
  const hostRef = useRef(null);
  const pausedRef = useRef(paused);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !window.WebGLRenderingContext) {
      setFailed(true);
      return undefined;
    }

    let renderer;
    let frame = 0;
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      const testCanvas = document.createElement("canvas");
      const context = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!context) {
        setFailed(true);
        return undefined;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 11);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);

      const field = new THREE.Group();
      scene.add(field);
      const random = seededRandom(721);
      const compact = window.matchMedia("(max-width: 720px)").matches;
      const pointCount = compact ? 170 : 360;
      const positions = new Float32Array(pointCount * 3);

      for (let index = 0; index < pointCount; index += 1) {
        const x = (random() - 0.5) * 10.5;
        const wave = Math.sin(x * 1.18) * 1.25;
        positions[index * 3] = x;
        positions[index * 3 + 1] = wave + (random() - 0.5) * 3.8;
        positions[index * 3 + 2] = (random() - 0.5) * 3.6;
      }

      const pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pointMaterial = new THREE.PointsMaterial({ color: 0xf3f0e8, size: compact ? 0.035 : 0.045, transparent: true, opacity: 0.8 });
      field.add(new THREE.Points(pointGeometry, pointMaterial));

      const curve = new THREE.CatmullRomCurve3(
        Array.from({ length: 15 }, (_, index) => {
          const x = -5.2 + (index / 14) * 10.4;
          return new THREE.Vector3(x, Math.sin(x * 1.18) * 1.28, Math.cos(x * 0.52) * 0.28);
        }),
      );
      const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(180));
      const curveMaterial = new THREE.LineBasicMaterial({ color: 0xcfb46a, transparent: true, opacity: 0.95 });
      field.add(new THREE.Line(curveGeometry, curveMaterial));

      const barGeometry = new THREE.BoxGeometry(0.025, 1, 0.025);
      const barMaterial = new THREE.MeshBasicMaterial({ color: 0xcfb46a, transparent: true, opacity: 0.15 });
      const barCount = compact ? 48 : 86;
      const bars = new THREE.InstancedMesh(barGeometry, barMaterial, barCount);
      const matrix = new THREE.Matrix4();
      for (let index = 0; index < barCount; index += 1) {
        const x = -5.1 + (index / (barCount - 1)) * 10.2;
        const height = 1.2 + random() * 4.2;
        matrix.makeScale(1, height, 1);
        matrix.setPosition(x, 0, -1.2 + random() * 0.5);
        bars.setMatrixAt(index, matrix);
      }
      bars.instanceMatrix.needsUpdate = true;
      field.add(bars);

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      }, { rootMargin: "120px" });
      intersectionObserver.observe(host);

      const onPointerMove = (event) => {
        const rect = host.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.16;
        pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.1;
      };
      host.addEventListener("pointermove", onPointerMove, { passive: true });

      const render = (time = 0) => {
        if (visible && !document.hidden) {
          if (!reduced && !pausedRef.current) {
            field.rotation.y += (pointerX + Math.sin(time * 0.00018) * 0.035 - field.rotation.y) * 0.025;
            field.rotation.x += (-pointerY + Math.cos(time * 0.00013) * 0.018 - field.rotation.x) * 0.025;
          }
          renderer.render(scene, camera);
        }
        frame = requestAnimationFrame(render);
      };

      resize();
      frame = requestAnimationFrame(render);

      const onContextLost = (event) => {
        event.preventDefault();
        setFailed(true);
      };
      renderer.domElement.addEventListener("webglcontextlost", onContextLost, false);

      return () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        host.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        pointGeometry.dispose();
        pointMaterial.dispose();
        curveGeometry.dispose();
        curveMaterial.dispose();
        barGeometry.dispose();
        barMaterial.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      };
    } catch {
      if (renderer) renderer.dispose();
      setFailed(true);
      return undefined;
    }
  }, []);

  if (failed) return fallback;
  return <div className="hydrogen-field" ref={hostRef} aria-hidden="true" />;
}
