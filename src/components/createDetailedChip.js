import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// A conceptual wire-bonded package. The markings identify this as an illustration,
// and do not assert a manufacturer, part number, or measured hardware specification.
export function createDetailedChip(assembly, { geometries, materials, textures }) {
  let seed = 417;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const geometry = (value) => { geometries.add(value); return value; };
  const material = (settings) => {
    const value = new THREE.MeshStandardMaterial(settings);
    materials.add(value);
    return value;
  };
  const texture = (size, draw, color = true) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas textures unavailable");
    draw(context, size);
    const value = new THREE.CanvasTexture(canvas);
    if (color) value.colorSpace = THREE.SRGBColorSpace;
    value.anisotropy = 4;
    textures.add(value);
    return value;
  };
  const grain = texture(256, (ctx, size) => {
    const pixels = ctx.createImageData(size, size);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const shade = 105 + random() * 46;
      pixels.data.set([shade, shade, shade, 255], i);
    }
    ctx.putImageData(pixels, 0, 0);
  }, false);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(3, 3);
  const brushed = texture(512, (ctx, size) => {
    ctx.fillStyle = "#bdbdbd";
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 1) {
      const shade = 145 + random() * 56;
      ctx.strokeStyle = `rgb(${shade} ${shade} ${shade})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
    }
  }, false);
  const solderMask = material({ color: 0x183f32, roughness: 0.68, metalness: 0.12, bumpMap: grain, bumpScale: 0.009 });
  const laminate = material({ color: 0x51462c, roughness: 0.82, metalness: 0.08 });
  const ceramic = material({ color: 0x16191a, roughness: 0.65, metalness: 0.12, bumpMap: grain, bumpScale: 0.005 });
  const gold = material({ color: 0xc9a55b, metalness: 0.87, roughness: 0.28 });
  const copper = material({ color: 0x7e774a, metalness: 0.72, roughness: 0.48 });
  const solder = material({ color: 0xc7cac7, metalness: 0.92, roughness: 0.3 });
  const resistor = material({ color: 0x282c2b, roughness: 0.74 });
  const capacitor = material({ color: 0x9c845d, roughness: 0.55, metalness: 0.1 });
  const lidMetal = material({ color: 0xd3d6d3, metalness: 0.95, roughness: 0.38, roughnessMap: brushed, bumpMap: brushed, bumpScale: 0.0015 });
  const board = new THREE.Group();
  const chip = new THREE.Group();
  const lid = new THREE.Group();
  assembly.add(board, chip, lid);

  const addMesh = (parent, shape, surface, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(shape, surface);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const rounded = (parent, w, h, d, radius, surface, x = 0, y = 0, z = 0) =>
    addMesh(parent, geometry(new RoundedBoxGeometry(w, h, d, 2, radius)), surface, x, y, z);

  // Hundreds of tiny pads/components share a few instanced draw calls.
  const unitBox = geometry(new THREE.BoxGeometry(1, 1, 1));
  const boxBatches = new Map();
  const box = (parent, w, h, d, x, y, z, surface) => {
    let batches = boxBatches.get(parent);
    if (!batches) { batches = new Map(); boxBatches.set(parent, batches); }
    if (!batches.has(surface)) batches.set(surface, []);
    batches.get(surface).push({ w, h, d, x, y, z });
  };

  const shape = new THREE.Shape();
  const half = 1.675;
  const radius = 0.12;
  shape.moveTo(-half + radius, -half);
  shape.lineTo(half - radius, -half);
  shape.quadraticCurveTo(half, -half, half, -half + radius);
  shape.lineTo(half, half - radius);
  shape.quadraticCurveTo(half, half, half - radius, half);
  shape.lineTo(-half + radius, half);
  shape.quadraticCurveTo(-half, half, -half, half - radius);
  shape.lineTo(-half, -half + radius);
  shape.quadraticCurveTo(-half, -half, -half + radius, -half);
  for (const x of [-1.42, 1.42]) for (const z of [-1.42, 1.42]) {
    const hole = new THREE.Path();
    hole.absarc(x, z, 0.068, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const boardGeometry = geometry(new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, steps: 1, curveSegments: 12 }));
  boardGeometry.rotateX(-Math.PI / 2);
  boardGeometry.translate(0, -0.07, 0);
  // Extruded sides are laminate, top/bottom are solder mask.
  addMesh(board, boardGeometry, [solderMask, laminate]);
  const mountRing = geometry(new THREE.RingGeometry(0.07, 0.112, 32));
  mountRing.rotateX(-Math.PI / 2);
  for (const x of [-1.42, 1.42]) for (const z of [-1.42, 1.42]) {
    addMesh(board, mountRing, gold, x, 0.078, z);
    const bottomRing = addMesh(board, mountRing, gold, x, -0.078, z);
    bottomRing.rotation.z = Math.PI;
  }

  // Silkscreen component footprints and plain, honest model identification.
  const silk = texture(1024, (ctx, size) => {
    const px = (value) => (value / 3.35 + 0.5) * size;
    ctx.strokeStyle = "#d8dbd0";
    ctx.fillStyle = "#d8dbd0";
    ctx.lineWidth = 1.4;
    ctx.font = "14px monospace";
    ctx.fillText("CONCEPT / WIRE-BONDED PACKAGE", 145, 70);
    ctx.fillText("SID GUNTI", 145, 978);
    for (let side = 0; side < 4; side += 1) {
      ctx.save(); ctx.translate(size / 2, size / 2); ctx.rotate(side * Math.PI / 2); ctx.translate(-size / 2, -size / 2);
      for (let i = 0; i < 5; i += 1) {
        const x = px(-0.9 + i * 0.45), y = px(1.48);
        ctx.strokeRect(x - 20, y - 11, 40, 22);
        ctx.fillText(`${side % 2 ? "R" : "C"}${side * 5 + i + 1}`, x - 18, y - 18);
      }
      ctx.restore();
    }
    ctx.strokeRect(px(-1.02), px(-1.02), px(1.02) - px(-1.02), px(1.02) - px(-1.02));
  });
  const silkMaterial = material({ map: silk, transparent: true, roughness: 0.92, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
  const silkPlane = geometry(new THREE.PlaneGeometry(3.35, 3.35));
  silkPlane.rotateX(-Math.PI / 2);
  addMesh(board, silkPlane, silkMaterial, 0, 0.079, 0).castShadow = false;

  const viaGeometry = geometry(new THREE.RingGeometry(0.009, 0.021, 10));
  viaGeometry.rotateX(-Math.PI / 2);
  const pinCount = 16;
  const pitch = 0.105;
  for (let side = 0; side < 4; side += 1) {
    const edge = new THREE.Group();
    edge.rotation.y = side * Math.PI / 2;
    board.add(edge);
    for (let pin = 0; pin < pinCount; pin += 1) {
      const x = (pin - 7.5) * pitch;
      box(edge, 0.055, 0.012, 0.23, x, 0.083, 1.13, gold);
      box(edge, 0.047, 0.022, 0.135, x, 0.094, 1.15, solder);
      const end = 1.28 + (pin % 4) * 0.035;
      box(edge, 0.012, 0.003, end - 1.24, x, 0.079, (end + 1.24) / 2, copper);
      const shift = (pin % 2 ? 1 : -1) * 0.033;
      const route = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, 0.081, end),
        new THREE.Vector3(x + shift, 0.081, end + 0.04),
        new THREE.Vector3(x + shift, 0.081, end + 0.11),
      ]);
      const tube = geometry(new THREE.TubeGeometry(route, 4, 0.004, 3, false));
      addMesh(edge, tube, copper).castShadow = false;
      addMesh(edge, viaGeometry, gold, x + shift, 0.083, end + 0.11).castShadow = false;
    }
    for (let part = 0; part < 5; part += 1) {
      const x = -0.9 + part * 0.45;
      box(edge, 0.15, 0.018, 0.075, x, 0.087, 1.49, solder);
      box(edge, 0.09, 0.047, 0.065, x, 0.111, 1.49, side % 2 ? resistor : capacitor);
      for (const offset of [-0.052, 0.052]) box(edge, 0.025, 0.048, 0.065, x + offset, 0.111, 1.49, solder);
    }
    // Via stitching and a small pin-header footprint around each corner.
    for (let i = 0; i < 8; i += 1) addMesh(edge, viaGeometry, gold, -1.24 + i * 0.35, 0.079, 1.61).castShadow = false;
  }

  rounded(chip, 1.9, 0.18, 1.9, 0.035, ceramic);
  box(chip, 1.74, 0.013, 1.74, 0, -0.087, 0, copper);
  // The exposed die is one continuous silicon surface with dense block-level detail.
  const dieTexture = texture(1024, (ctx, size) => {
    ctx.fillStyle = "#273338"; ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#a79f78"; ctx.lineWidth = 3; ctx.strokeRect(22, 22, size - 44, size - 44);
    for (let bank = 0; bank < 8; bank += 1) {
      const x = 60 + (bank % 4) * 233, y = 64 + Math.floor(bank / 4) * 476;
      ctx.fillStyle = bank % 3 === 0 ? "#6a7166" : "#495859";
      ctx.fillRect(x, y, 204, 418);
      for (let row = 0; row < 40; row += 1) {
        ctx.fillStyle = row % 4 === 0 ? "#979979" : "#253239";
        ctx.fillRect(x + 8, y + 10 + row * 10, 188, 3);
        for (let column = 0; column < 12; column += 1) {
          if ((column + row + bank) % 5 === 0) continue;
          ctx.fillStyle = "#87918a";
          ctx.fillRect(x + 8 + column * 16, y + 14 + row * 10, 7, 3);
        }
      }
    }
    ctx.fillStyle = "#bdac70";
    for (let i = 0; i < 32; i += 1) {
      const p = 46 + i * 29;
      ctx.fillRect(p, 27, 14, 13); ctx.fillRect(p, 984, 14, 13);
      ctx.fillRect(27, p, 13, 14); ctx.fillRect(984, p, 13, 14);
    }
  });
  const dieMaterial = material({ map: dieTexture, color: 0xe0e6df, metalness: 0.8, roughness: 0.24 });
  rounded(chip, 0.97, 0.06, 0.97, 0.006, ceramic, 0, 0.123, 0);
  const diePlane = geometry(new THREE.PlaneGeometry(0.95, 0.95));
  diePlane.rotateX(-Math.PI / 2);
  addMesh(chip, diePlane, dieMaterial, 0, 0.154, 0);
  const dot = geometry(new THREE.CylinderGeometry(0.035, 0.035, 0.004, 20));
  addMesh(chip, dot, copper, -0.79, 0.093, -0.79);

  // Thin formed gull-wing leads replace the original chunky right-angle blocks.
  const leadShape = new THREE.Shape();
  leadShape.moveTo(0.89, 0.01); leadShape.lineTo(0.99, 0.01);
  leadShape.quadraticCurveTo(1.04, 0.01, 1.065, -0.07);
  leadShape.lineTo(1.085, -0.137); leadShape.quadraticCurveTo(1.09, -0.158, 1.115, -0.158);
  leadShape.lineTo(1.22, -0.158); leadShape.lineTo(1.22, -0.18);
  leadShape.lineTo(1.1, -0.18); leadShape.quadraticCurveTo(1.07, -0.18, 1.063, -0.15);
  leadShape.lineTo(1.04, -0.075); leadShape.quadraticCurveTo(1.02, -0.012, 0.99, -0.012);
  leadShape.lineTo(0.89, -0.012); leadShape.closePath();
  const leadGeometry = geometry(new THREE.ExtrudeGeometry(leadShape, { depth: 0.045, bevelEnabled: false, curveSegments: 5, steps: 1 }));
  leadGeometry.rotateY(-Math.PI / 2);
  leadGeometry.translate(0.0225, 0, 0);
  for (let side = 0; side < 4; side += 1) {
    const edge = new THREE.Group(); edge.rotation.y = side * Math.PI / 2; chip.add(edge);
    const leads = new THREE.InstancedMesh(leadGeometry, solder, pinCount);
    leads.castShadow = leads.receiveShadow = true;
    const matrix = new THREE.Matrix4();
    for (let pin = 0; pin < pinCount; pin += 1) {
      const x = (pin - 7.5) * pitch;
      matrix.makeTranslation(x, 0, 0); leads.setMatrixAt(pin, matrix);
      box(edge, 0.04, 0.012, 0.09, x, 0.096, 0.82, gold);
      const bond = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(x * 0.56, 0.157, 0.45),
        new THREE.Vector3(x * 0.76, 0.31 + (pin % 2) * 0.012, 0.65),
        new THREE.Vector3(x, 0.108, 0.82),
      );
      addMesh(edge, geometry(new THREE.TubeGeometry(bond, 10, 0.0038, 4, false)), gold).castShadow = false;
    }
    edge.add(leads);
  }

  // Chamfered brushed metal, an underside contact plate, and subtle laser etching.
  rounded(lid, 1.83, 0.14, 1.83, 0.045, lidMetal);
  // The perimeter skirt seats against the ceramic rim in the assembled view.
  for (const offset of [-0.85, 0.85]) {
    box(lid, 1.74, 0.18, 0.04, 0, -0.17, offset, lidMetal);
    box(lid, 0.04, 0.18, 1.66, offset, -0.17, 0, lidMetal);
  }
  rounded(lid, 1.59, 0.024, 1.59, 0.01, copper, 0, -0.076, 0);
  rounded(lid, 0.99, 0.025, 0.99, 0.008, solder, 0, -0.095, 0);
  const etching = texture(512, (ctx) => {
    ctx.fillStyle = "rgba(35,39,39,0.72)";
    ctx.font = "500 36px monospace"; ctx.fillText("SID GUNTI", 56, 223);
    ctx.font = "19px monospace"; ctx.fillText("PROCESSOR CONCEPT", 57, 261);
    ctx.font = "14px monospace"; ctx.fillText("HARDWARE / SOFTWARE", 57, 292);
    ctx.beginPath(); ctx.moveTo(57, 333); ctx.lineTo(350, 333); ctx.strokeStyle = "rgba(45,49,49,0.45)"; ctx.lineWidth = 1; ctx.stroke();
    // Orientation dot, not a serial number or a fake certification mark.
    ctx.beginPath(); ctx.arc(65, 66, 8, 0, Math.PI * 2); ctx.fill();
  });
  const etchMaterial = material({ map: etching, transparent: true, roughness: 0.6, metalness: 0.25, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
  const etchPlane = geometry(new THREE.PlaneGeometry(1.68, 1.68));
  etchPlane.rotateX(-Math.PI / 2);
  addMesh(lid, etchPlane, etchMaterial, 0, 0.071, 0).castShadow = false;

  for (const [parent, batches] of boxBatches) for (const [surface, items] of batches) {
    const mesh = new THREE.InstancedMesh(unitBox, surface, items.length);
    const matrix = new THREE.Matrix4();
    items.forEach(({ w, h, d, x, y, z }, index) => {
      matrix.makeScale(w, h, d); matrix.setPosition(x, y, z); mesh.setMatrixAt(index, matrix);
    });
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
  }
  // Batch the static wires, vias, and traces per moving layer. This retains all
  // the fine geometry while avoiding hundreds of draw calls during rotation.
  assembly.updateMatrixWorld(true);
  for (const layer of [board, chip, lid]) {
    const inverse = layer.matrixWorld.clone().invert();
    const batches = new Map();
    layer.traverse((mesh) => {
      if (!mesh.isMesh || mesh.isInstancedMesh || Array.isArray(mesh.material) || mesh.material.transparent) return;
      const key = `${mesh.material.id}:${mesh.castShadow}:${mesh.receiveShadow}`;
      if (!batches.has(key)) batches.set(key, []);
      batches.get(key).push(mesh);
    });
    for (const meshes of batches.values()) {
      if (meshes.length < 2) continue;
      const parts = meshes.map((mesh) => {
        const part = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
        return part.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld));
      });
      const merged = mergeGeometries(parts);
      parts.forEach((part) => part.dispose());
      if (!merged) continue;
      const combined = new THREE.Mesh(geometry(merged), meshes[0].material);
      combined.castShadow = meshes[0].castShadow;
      combined.receiveShadow = meshes[0].receiveShadow;
      meshes.forEach((mesh) => mesh.removeFromParent());
      layer.add(combined);
    }
  }
  return { board, chip, lid };
}
