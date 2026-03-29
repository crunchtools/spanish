import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import { tweenGroup } from '../utils/tweenGroup.js';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLOW_COLOR, GLOW_INTENSITY, GLOW_PULSE_SPEED } from '../utils/constants.js';

// Word-specific geometric models for items without GLB files
const GEOMETRIC_MODELS = {
  reloj() {
    // Wall clock: round face + frame + hands
    const group = new THREE.Group();

    // Clock body (flat box)
    const bodyGeo = new THREE.BoxGeometry(0.6, 0.6, 0.08);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Clock face (slightly in front)
    const faceGeo = new THREE.BoxGeometry(0.5, 0.5, 0.02);
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xFFFFF0, roughness: 0.3 });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = 0.05;
    group.add(face);

    // Hour hand
    const hourGeo = new THREE.BoxGeometry(0.04, 0.18, 0.02);
    const handMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const hour = new THREE.Mesh(hourGeo, handMat);
    hour.position.set(0, 0.05, 0.07);
    hour.rotation.z = -0.5;
    group.add(hour);

    // Minute hand
    const minGeo = new THREE.BoxGeometry(0.03, 0.22, 0.02);
    const minute = new THREE.Mesh(minGeo, handMat.clone());
    minute.position.set(0.03, 0.06, 0.07);
    minute.rotation.z = 0.8;
    group.add(minute);

    // Center dot
    const dotGeo = new THREE.BoxGeometry(0.05, 0.05, 0.03);
    const dot = new THREE.Mesh(dotGeo, handMat.clone());
    dot.position.z = 0.07;
    group.add(dot);

    return group;
  },

  gato() {
    // Block cat: body + head + ears + tail
    const group = new THREE.Group();
    const catMat = new THREE.MeshStandardMaterial({ color: 0xFB923C, roughness: 0.7 });

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.35, 0.25, 0.5);
    const body = new THREE.Mesh(bodyGeo, catMat);
    body.position.y = 0.25;
    group.add(body);

    // Head
    const headGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const head = new THREE.Mesh(headGeo, catMat.clone());
    head.position.set(0, 0.42, 0.3);
    group.add(head);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.08, 0.1, 0.06);
    const leftEar = new THREE.Mesh(earGeo, catMat.clone());
    leftEar.position.set(-0.1, 0.6, 0.3);
    group.add(leftEar);
    const rightEar = new THREE.Mesh(earGeo.clone(), catMat.clone());
    rightEar.position.set(0.1, 0.6, 0.3);
    group.add(rightEar);

    // Eyes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const eyeGeo = new THREE.BoxGeometry(0.05, 0.05, 0.02);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.08, 0.46, 0.46);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo.clone(), eyeMat.clone());
    rightEye.position.set(0.08, 0.46, 0.46);
    group.add(rightEye);

    // Nose
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xFF6B9D });
    const noseGeo = new THREE.BoxGeometry(0.04, 0.03, 0.02);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.40, 0.46);
    group.add(nose);

    // Tail
    const tailGeo = new THREE.BoxGeometry(0.06, 0.06, 0.4);
    const tail = new THREE.Mesh(tailGeo, catMat.clone());
    tail.position.set(0, 0.35, -0.35);
    tail.rotation.x = 0.5;
    group.add(tail);

    // Legs (4 small boxes)
    const legGeo = new THREE.BoxGeometry(0.08, 0.12, 0.08);
    const positions = [
      [-0.1, 0.06, 0.15],
      [0.1, 0.06, 0.15],
      [-0.1, 0.06, -0.15],
      [0.1, 0.06, -0.15],
    ];
    positions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo.clone(), catMat.clone());
      leg.position.set(lx, ly, lz);
      group.add(leg);
    });

    return group;
  },
  'oso de peluche'() {
    // Block teddy bear sitting on floor against wall
    const group = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xC49A6C, roughness: 0.9 });

    // Body (round-ish, use box)
    const bodyGeo = new THREE.BoxGeometry(0.35, 0.4, 0.3);
    const body = new THREE.Mesh(bodyGeo, furMat);
    body.position.y = 0.2;
    group.add(body);

    // Head
    const headGeo = new THREE.BoxGeometry(0.3, 0.3, 0.28);
    const head = new THREE.Mesh(headGeo, furMat.clone());
    head.position.set(0, 0.52, 0);
    group.add(head);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.1, 0.1, 0.08);
    const leftEar = new THREE.Mesh(earGeo, furMat.clone());
    leftEar.position.set(-0.13, 0.7, 0);
    group.add(leftEar);
    const rightEar = new THREE.Mesh(earGeo.clone(), furMat.clone());
    rightEar.position.set(0.13, 0.7, 0);
    group.add(rightEar);

    // Eyes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.BoxGeometry(0.05, 0.05, 0.02);
    const lEye = new THREE.Mesh(eyeGeo, eyeMat);
    lEye.position.set(-0.07, 0.56, 0.14);
    group.add(lEye);
    const rEye = new THREE.Mesh(eyeGeo.clone(), eyeMat.clone());
    rEye.position.set(0.07, 0.56, 0.14);
    group.add(rEye);

    // Nose
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const noseGeo = new THREE.BoxGeometry(0.06, 0.04, 0.03);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.48, 0.14);
    group.add(nose);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.12, 0.25, 0.12);
    const lArm = new THREE.Mesh(armGeo, furMat.clone());
    lArm.position.set(-0.25, 0.22, 0.05);
    lArm.rotation.z = 0.4;
    group.add(lArm);
    const rArm = new THREE.Mesh(armGeo.clone(), furMat.clone());
    rArm.position.set(0.25, 0.22, 0.05);
    rArm.rotation.z = -0.4;
    group.add(rArm);

    // Legs (sitting, splayed forward)
    const legGeo = new THREE.BoxGeometry(0.14, 0.12, 0.22);
    const lLeg = new THREE.Mesh(legGeo, furMat.clone());
    lLeg.position.set(-0.1, 0.06, 0.12);
    group.add(lLeg);
    const rLeg = new THREE.Mesh(legGeo.clone(), furMat.clone());
    rLeg.position.set(0.1, 0.06, 0.12);
    group.add(rLeg);

    return group;
  },

  lámpara() {
    // Floor lamp: tall pole + shade
    const group = new THREE.Group();

    // Base
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.6 });
    const baseGeo = new THREE.BoxGeometry(0.3, 0.05, 0.3);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.025;
    group.add(base);

    // Pole
    const poleGeo = new THREE.BoxGeometry(0.04, 1.2, 0.04);
    const pole = new THREE.Mesh(poleGeo, baseMat.clone());
    pole.position.y = 0.65;
    group.add(pole);

    // Shade (trapezoid-ish box)
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xFFF8DC,
      roughness: 0.8,
      emissive: 0xFFF8DC,
      emissiveIntensity: 0.3,
    });
    const shadeGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = 1.35;
    group.add(shade);

    return group;
  },

  libro() {
    // Small bookshelf with books on it
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.7 });

    // Shelf frame — two sides + two shelves + back
    const sideGeo = new THREE.BoxGeometry(0.05, 0.9, 0.3);
    const leftSide = new THREE.Mesh(sideGeo, woodMat);
    leftSide.position.set(-0.3, 0.45, 0);
    group.add(leftSide);
    const rightSide = new THREE.Mesh(sideGeo.clone(), woodMat.clone());
    rightSide.position.set(0.3, 0.45, 0);
    group.add(rightSide);

    const shelfGeo = new THREE.BoxGeometry(0.65, 0.04, 0.3);
    const bottomShelf = new THREE.Mesh(shelfGeo, woodMat.clone());
    bottomShelf.position.set(0, 0.02, 0);
    group.add(bottomShelf);
    const midShelf = new THREE.Mesh(shelfGeo.clone(), woodMat.clone());
    midShelf.position.set(0, 0.45, 0);
    group.add(midShelf);
    const topShelf = new THREE.Mesh(shelfGeo.clone(), woodMat.clone());
    topShelf.position.set(0, 0.9, 0);
    group.add(topShelf);

    // Back panel
    const backGeo = new THREE.BoxGeometry(0.65, 0.9, 0.02);
    const back = new THREE.Mesh(backGeo, woodMat.clone());
    back.position.set(0, 0.45, -0.14);
    group.add(back);

    // Books on shelves (colored blocks, leaning)
    const bookColors = [0xEF4444, 0x3B82F6, 0x10B981, 0xF59E0B, 0x8B5CF6, 0xEC4899];
    const bookData = [
      // Bottom shelf
      { x: -0.15, y: 0.22, w: 0.08, h: 0.35, c: 0 },
      { x: -0.05, y: 0.22, w: 0.06, h: 0.38, c: 1 },
      { x: 0.04, y: 0.22, w: 0.07, h: 0.32, c: 2 },
      { x: 0.13, y: 0.22, w: 0.06, h: 0.36, c: 3 },
      // Top shelf
      { x: -0.12, y: 0.67, w: 0.07, h: 0.34, c: 4 },
      { x: -0.03, y: 0.67, w: 0.08, h: 0.30, c: 5 },
      { x: 0.08, y: 0.67, w: 0.06, h: 0.36, c: 0 },
    ];
    bookData.forEach((b) => {
      const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[b.c], roughness: 0.6 });
      const bookGeo = new THREE.BoxGeometry(b.w, b.h, 0.2);
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(b.x, b.y, 0);
      group.add(book);
    });

    return group;
  },

  silla() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4A90D9, roughness: 0.6 });
    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), woodMat);
    seat.position.y = 0.4;
    group.add(seat);
    // Back
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), woodMat.clone());
    back.position.set(0, 0.62, -0.175);
    group.add(back);
    // Legs
    const legGeo = new THREE.BoxGeometry(0.05, 0.4, 0.05);
    [[-0.15, 0.2, 0.15], [0.15, 0.2, 0.15], [-0.15, 0.2, -0.15], [0.15, 0.2, -0.15]].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo.clone(), woodMat.clone());
      leg.position.set(x, y, z);
      group.add(leg);
    });
    return group;
  },

  escritorio() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.7 });
    // Top
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.5), woodMat);
    top.position.y = 0.65;
    group.add(top);
    // Legs
    const legGeo = new THREE.BoxGeometry(0.06, 0.65, 0.06);
    [[-0.45, 0.325, 0.2], [0.45, 0.325, 0.2], [-0.45, 0.325, -0.2], [0.45, 0.325, -0.2]].forEach(([x, y, z]) => {
      group.add(new THREE.Mesh(legGeo.clone(), woodMat.clone()).translateX(x).translateY(y).translateZ(z));
    });
    // Drawer
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0x6B4F14, roughness: 0.7 });
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.4), drawerMat);
    drawer.position.set(0.2, 0.55, 0);
    group.add(drawer);
    // Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.5 }));
    handle.position.set(0.2, 0.55, 0.21);
    group.add(handle);
    return group;
  },

  alfombra() {
    const group = new THREE.Group();
    const rugMat = new THREE.MeshStandardMaterial({ color: 0xE74C3C, roughness: 0.9 });
    const rug = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.02, 1.8), rugMat);
    rug.position.y = 0.01;
    group.add(rug);
    // Border
    const borderMat = new THREE.MeshStandardMaterial({ color: 0xF39C12, roughness: 0.9 });
    const border = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.015, 1.9), borderMat);
    border.position.y = 0.005;
    group.add(border);
    // Center pattern
    const patternMat = new THREE.MeshStandardMaterial({ color: 0x2ECC71, roughness: 0.9 });
    const diamond = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.3), patternMat);
    diamond.position.y = 0.015;
    diamond.rotation.y = Math.PI / 4;
    group.add(diamond);
    return group;
  },

  armario() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xD4A76A, roughness: 0.7 });
    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.8, 0.5), woodMat);
    body.position.y = 0.9;
    group.add(body);
    // Door line
    const lineMat = new THREE.MeshStandardMaterial({ color: 0xA07840 });
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.7, 0.01), lineMat);
    line.position.set(0, 0.9, 0.26);
    group.add(line);
    // Handles
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.5 });
    const lHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.03), handleMat);
    lHandle.position.set(-0.08, 0.9, 0.27);
    group.add(lHandle);
    const rHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.03), handleMat.clone());
    rHandle.position.set(0.08, 0.9, 0.27);
    group.add(rHandle);
    return group;
  },

  mochila() {
    const group = new THREE.Group();
    const bagMat = new THREE.MeshStandardMaterial({ color: 0x3498DB, roughness: 0.7 });
    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.15), bagMat);
    body.position.y = 0.2;
    group.add(body);
    // Front pocket
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0x2980B9, roughness: 0.7 });
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, 0.03), pocketMat);
    pocket.position.set(0, 0.12, 0.09);
    group.add(pocket);
    // Straps
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x1A5276, roughness: 0.7 });
    const strapGeo = new THREE.BoxGeometry(0.04, 0.35, 0.02);
    const lStrap = new THREE.Mesh(strapGeo, strapMat);
    lStrap.position.set(-0.1, 0.22, -0.09);
    group.add(lStrap);
    const rStrap = new THREE.Mesh(strapGeo.clone(), strapMat.clone());
    rStrap.position.set(0.1, 0.22, -0.09);
    group.add(rStrap);
    // Zipper
    const zipMat = new THREE.MeshStandardMaterial({ color: 0xF1C40F, metalness: 0.3 });
    const zip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.01), zipMat);
    zip.position.set(0, 0.38, 0.08);
    group.add(zip);
    return group;
  },

  mesita() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xB5651D, roughness: 0.7 });
    // Top
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.35), woodMat);
    top.position.y = 0.45;
    group.add(top);
    // Legs
    const legGeo = new THREE.BoxGeometry(0.05, 0.45, 0.05);
    [[-0.15, 0.225, 0.12], [0.15, 0.225, 0.12], [-0.15, 0.225, -0.12], [0.15, 0.225, -0.12]].forEach(([x, y, z]) => {
      group.add(new THREE.Mesh(legGeo.clone(), woodMat.clone()).translateX(x).translateY(y).translateZ(z));
    });
    // Drawer
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.28), drawerMat);
    drawer.position.set(0, 0.38, 0);
    group.add(drawer);
    // Drawer handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.5 }));
    handle.position.set(0, 0.38, 0.15);
    group.add(handle);
    return group;
  },

  cuadro() {
    const group = new THREE.Group();
    // Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.04), frameMat);
    group.add(frame);
    // Canvas
    const canvasMat = new THREE.MeshStandardMaterial({ color: 0xFFF8DC, roughness: 0.5 });
    const canvas = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.01), canvasMat);
    canvas.position.z = 0.025;
    group.add(canvas);
    // Simple art — sun + hill
    const sunMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24 });
    const sun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.01), sunMat);
    sun.position.set(0.15, 0.1, 0.03);
    group.add(sun);
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x4ADE80 });
    const hill = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.01), hillMat);
    hill.position.set(0, -0.1, 0.03);
    group.add(hill);
    return group;
  },

  'caja de juguetes'() {
    const group = new THREE.Group();
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xE74C3C, roughness: 0.6 });
    // Box body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.4), boxMat);
    body.position.y = 0.175;
    group.add(body);
    // Lid (slightly open)
    const lidMat = new THREE.MeshStandardMaterial({ color: 0xC0392B, roughness: 0.6 });
    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.42), lidMat);
    lid.position.set(0, 0.38, -0.08);
    lid.rotation.x = -0.3;
    group.add(lid);
    // Toys sticking out
    const toy1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.08), new THREE.MeshStandardMaterial({ color: 0x3498DB }));
    toy1.position.set(-0.12, 0.4, 0.05);
    toy1.rotation.z = 0.2;
    group.add(toy1);
    const toy2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0xF1C40F }));
    toy2.position.set(0.1, 0.38, 0);
    group.add(toy2);
    const toy3 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.06), new THREE.MeshStandardMaterial({ color: 0x2ECC71 }));
    toy3.position.set(0.02, 0.42, 0.08);
    toy3.rotation.z = -0.3;
    group.add(toy3);
    return group;
  },

  cómoda() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xC49A6C, roughness: 0.7 });
    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.4), woodMat);
    body.position.y = 0.45;
    group.add(body);
    // Drawers (3 rows)
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0xA07840 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.5 });
    for (let i = 0; i < 3; i++) {
      const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.02), drawerMat.clone());
      drawer.position.set(0, 0.18 + i * 0.28, 0.21);
      group.add(drawer);
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), handleMat.clone());
      handle.position.set(0, 0.18 + i * 0.28, 0.23);
      group.add(handle);
    }
    return group;
  },

  pelota() {
    const group = new THREE.Group();
    // Blocky ball — rotated cube
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xE74C3C, roughness: 0.5 });
    const ball = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), ballMat);
    ball.position.y = 0.18;
    ball.rotation.y = Math.PI / 4;
    group.add(ball);
    // White stripe
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.26), stripeMat);
    stripe.position.y = 0.18;
    stripe.rotation.y = Math.PI / 4;
    group.add(stripe);
    return group;
  },

  zapatos() {
    const group = new THREE.Group();
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xE74C3C, roughness: 0.6 });
    // Left shoe
    const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.25);
    const left = new THREE.Mesh(shoeGeo, shoeMat);
    left.position.set(-0.08, 0.04, 0);
    group.add(left);
    // Right shoe
    const right = new THREE.Mesh(shoeGeo.clone(), shoeMat.clone());
    right.position.set(0.08, 0.04, 0.05);
    right.rotation.y = 0.2;
    group.add(right);
    // White soles
    const soleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const soleGeo = new THREE.BoxGeometry(0.13, 0.03, 0.26);
    const lSole = new THREE.Mesh(soleGeo, soleMat);
    lSole.position.set(-0.08, 0.015, 0);
    group.add(lSole);
    const rSole = new THREE.Mesh(soleGeo.clone(), soleMat.clone());
    rSole.position.set(0.08, 0.015, 0.05);
    rSole.rotation.y = 0.2;
    group.add(rSole);
    return group;
  },

  espejo() {
    const group = new THREE.Group();
    // Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xD4A76A, roughness: 0.6 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7, 0.04), frameMat);
    group.add(frame);
    // Mirror surface
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xB0C4DE, roughness: 0.1, metalness: 0.8 });
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.62, 0.01), mirrorMat);
    mirror.position.z = 0.025;
    group.add(mirror);
    return group;
  },

  almohada() {
    const group = new THREE.Group();
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xFFF8DC, roughness: 0.9 });
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.25), pillowMat);
    pillow.position.y = 0.04;
    group.add(pillow);
    return group;
  },

  estante() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.7 });
    // Vertical sides
    const sideGeo = new THREE.BoxGeometry(0.04, 0.6, 0.2);
    const left = new THREE.Mesh(sideGeo, woodMat);
    left.position.set(-0.35, 0.3, 0);
    group.add(left);
    const right = new THREE.Mesh(sideGeo.clone(), woodMat.clone());
    right.position.set(0.35, 0.3, 0);
    group.add(right);
    // Shelves
    const shelfGeo = new THREE.BoxGeometry(0.74, 0.03, 0.2);
    for (let i = 0; i < 3; i++) {
      const shelf = new THREE.Mesh(shelfGeo.clone(), woodMat.clone());
      shelf.position.set(0, i * 0.28 + 0.02, 0);
      group.add(shelf);
    }
    // Items on shelves
    const item1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), new THREE.MeshStandardMaterial({ color: 0x9B59B6 }));
    item1.position.set(-0.15, 0.1, 0);
    group.add(item1);
    const item2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.1), new THREE.MeshStandardMaterial({ color: 0x1ABC9C }));
    item2.position.set(0.1, 0.36, 0);
    group.add(item2);
    return group;
  },

  papelera() {
    const group = new THREE.Group();
    const binMat = new THREE.MeshStandardMaterial({ color: 0x7F8C8D, roughness: 0.6 });
    // Body (slightly tapered — wider at top)
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.25), binMat);
    body.position.y = 0.175;
    group.add(body);
    // Rim
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x95A5A6 });
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.28), rimMat);
    rim.position.y = 0.36;
    group.add(rim);
    // Crumpled paper
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xFFFFF0 });
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.08), paperMat);
    paper.position.set(0.03, 0.38, -0.02);
    paper.rotation.set(0.3, 0.5, 0.2);
    group.add(paper);
    return group;
  },

  planta() {
    const group = new THREE.Group();
    // Pot
    const potMat = new THREE.MeshStandardMaterial({ color: 0xC0392B, roughness: 0.7 });
    const pot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), potMat);
    pot.position.y = 0.1;
    group.add(pot);
    // Soil
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const soil = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.18), soilMat);
    soil.position.y = 0.21;
    group.add(soil);
    // Stem
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x27AE60 });
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.25, 0.03), stemMat);
    stem.position.y = 0.35;
    group.add(stem);
    // Leaves
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2ECC71 });
    const leaf1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 0.03), leafMat);
    leaf1.position.set(0.06, 0.4, 0);
    leaf1.rotation.z = -0.3;
    group.add(leaf1);
    const leaf2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.03), leafMat.clone());
    leaf2.position.set(-0.05, 0.45, 0.02);
    leaf2.rotation.z = 0.4;
    group.add(leaf2);
    const leaf3 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.06, 0.03), leafMat.clone());
    leaf3.position.set(0.02, 0.48, -0.03);
    leaf3.rotation.z = -0.1;
    group.add(leaf3);
    return group;
  },
};

export class VocabObject {
  constructor(wordData, game) {
    this.wordData = wordData;
    this.game = game;
    this.group = new THREE.Group();
    this.group.userData.vocabWord = wordData.word;
    this.mesh = null;
    this.label = null;
    this.labelVisible = false;
    this.glowTime = Math.random() * Math.PI * 2; // random phase offset
    this.learned = false;
    this._highlighted = false;
    this.collisionBox = null;

    // Position the group
    this.group.position.set(
      wordData.position.x,
      wordData.position.y,
      wordData.position.z
    );
    if (wordData.rotation) {
      this.group.rotation.y = wordData.rotation;
    }
  }

  async load(assetLoader) {
    if (this.wordData.model) {
      try {
        const model = await assetLoader.loadModel(
          `/models/bedroom/${this.wordData.model}`
        );
        this.mesh = model.scene;
        this.mesh.scale.setScalar(this.wordData.scale || 1);
        this.mesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        this.group.add(this.mesh);
      } catch {
        this.createPlaceholder();
      }
    } else {
      // No GLB model — use geometric or generic placeholder
      this.createPlaceholder();
    }

    // Add invisible hit box for reliable click/hover detection
    this.addHitBox();
    // Compute real collision bounds (not inflated)
    this.computeCollisionBox();

    this.createLabel();
  }

  addHitBox() {
    if (!this.mesh) return;

    // Zero out group transform temporarily so setFromObject gives local-space bounds
    const savedPos = this.group.position.clone();
    const savedRot = this.group.rotation.clone();
    this.group.position.set(0, 0, 0);
    this.group.rotation.set(0, 0, 0);
    this.group.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(this.mesh);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Restore group transform
    this.group.position.copy(savedPos);
    this.group.rotation.copy(savedRot);
    this.group.updateMatrixWorld(true);

    // Clickable padding — add 0.3 units around mesh, cap at 1.5 max per axis
    size.x = Math.min(size.x + 0.3, Math.max(size.x, 1.5));
    size.y = Math.min(size.y + 0.3, Math.max(size.y, 1.5));
    size.z = Math.min(size.z + 0.3, Math.max(size.z, 1.5));

    const hitGeo = new THREE.BoxGeometry(size.x, size.y, size.z);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitBox = new THREE.Mesh(hitGeo, hitMat);
    this.hitBox.position.copy(center); // already in local space
    this.group.add(this.hitBox);
  }

  computeCollisionBox() {
    if (!this.mesh) { this.collisionBox = null; return; }
    // Use actual mesh bounds in world space
    const box = new THREE.Box3().setFromObject(this.mesh);
    this.collisionBox = {
      minX: box.min.x, maxX: box.max.x,
      minY: box.min.y, maxY: box.max.y,
      minZ: box.min.z, maxZ: box.max.z,
    };
  }

  createPlaceholder() {
    // Try word-specific geometric models first
    const builder = GEOMETRIC_MODELS[this.wordData.word];
    if (builder) {
      this.mesh = builder();
      this.mesh.castShadow = true;
      this.group.add(this.mesh);
      return;
    }

    // Generic fallback cube
    const colors = [0xff6b9d, 0xc084fc, 0x60a5fa, 0x2dd4bf, 0xfbbf24, 0xfb923c, 0x4ade80, 0xa78bfa];
    const colorIndex = Math.abs(this.wordData.word.charCodeAt(0)) % colors.length;

    const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const mat = new THREE.MeshStandardMaterial({
      color: colors[colorIndex],
      roughness: 0.5,
      metalness: 0.1,
      emissive: colors[colorIndex],
      emissiveIntensity: 0.1,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.castShadow = true;
    this.mesh.position.y = 0.25;
    this.group.add(this.mesh);
  }

  createLabel() {
    const div = document.createElement('div');
    div.className = 'vocab-label';
    div.textContent = this.wordData.spanish;

    this.label = new CSS2DObject(div);
    this.label.position.set(0, 1.2, 0);
    this.label.visible = false;
    this.group.add(this.label);
  }

  showLabel() {
    this.labelVisible = true;
    this.learned = true;
    // Only actually display if global labels toggle is on
    if (this.label) {
      this.label.visible = !!this.game._labelsVisible;
    }
  }

  setLabelDisplay(visible) {
    if (!this.label) return;
    // Only show if this object has been learned AND global toggle is on
    this.label.visible = visible && this.labelVisible;
  }

  setHighlight(on) {
    this._highlighted = on;
    if (!this.mesh) return;
    this.mesh.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (mat.emissive) {
          if (on) {
            mat.emissive.setHex(0xffffff);
            mat.emissiveIntensity = 0.6;
          } else {
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      });
    });
  }

  bounce() {
    if (!this.mesh) return;
    const startY = this.mesh.position.y;
    new Tween(this.mesh.position, tweenGroup)
      .to({ y: startY + 0.3 }, 200)
      .easing(Easing.Quadratic.Out)
      .chain(
        new Tween(this.mesh.position, tweenGroup)
          .to({ y: startY }, 200)
          .easing(Easing.Bounce.Out)
      )
      .start();
  }

  update(delta) {
    if (this.learned || !this.mesh || this._highlighted) return;

    // Pulsing glow for untapped objects
    this.glowTime += delta * GLOW_PULSE_SPEED;
    const intensity = (Math.sin(this.glowTime) * 0.5 + 0.5) * GLOW_INTENSITY;

    this.mesh.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        child.material.emissive.setHex(GLOW_COLOR);
        child.material.emissiveIntensity = intensity;
      }
    });
  }

  dispose() {
    if (this.label) {
      this.label.element.remove();
    }
    this.group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
