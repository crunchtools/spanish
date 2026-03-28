import * as THREE from 'three';

/**
 * Builds a Roblox/Minecraft-style block character from box geometries.
 * Returns a THREE.Group that can be added to any scene.
 */

const HAIR_BUILDERS = {
  short(color) {
    const geo = new THREE.BoxGeometry(0.42, 0.15, 0.42);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.075;
    return mesh;
  },

  long(color) {
    const group = new THREE.Group();
    // Top
    const topGeo = new THREE.BoxGeometry(0.42, 0.12, 0.42);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
    const top = new THREE.Mesh(topGeo, mat);
    top.position.y = 0.06;
    group.add(top);
    // Back drape
    const backGeo = new THREE.BoxGeometry(0.42, 0.45, 0.1);
    const back = new THREE.Mesh(backGeo, mat.clone());
    back.position.set(0, -0.15, -0.18);
    group.add(back);
    return group;
  },

  ponytail(color) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
    // Top cap
    const topGeo = new THREE.BoxGeometry(0.42, 0.12, 0.42);
    const top = new THREE.Mesh(topGeo, mat);
    top.position.y = 0.06;
    group.add(top);
    // Ponytail
    const tailGeo = new THREE.BoxGeometry(0.12, 0.35, 0.12);
    const tail = new THREE.Mesh(tailGeo, mat.clone());
    tail.position.set(0, -0.1, -0.22);
    group.add(tail);
    return group;
  },

  curly(color) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
    // Larger, puffier top
    const topGeo = new THREE.BoxGeometry(0.48, 0.2, 0.48);
    const top = new THREE.Mesh(topGeo, mat);
    top.position.y = 0.08;
    group.add(top);
    // Side puffs
    const puffGeo = new THREE.BoxGeometry(0.1, 0.2, 0.3);
    const leftPuff = new THREE.Mesh(puffGeo, mat.clone());
    leftPuff.position.set(-0.25, -0.05, 0);
    group.add(leftPuff);
    const rightPuff = new THREE.Mesh(puffGeo.clone(), mat.clone());
    rightPuff.position.set(0.25, -0.05, 0);
    group.add(rightPuff);
    return group;
  },
};

export const DEFAULT_CHARACTER = {
  hair: 'ponytail',
  hairColor: '#8B4513',
  skinColor: '#DEB887',
  shirtColor: '#FF6B9D',
  shirtPattern: 'solid',
  pantsColor: '#60A5FA',
  shoeColor: '#FFFFFF',
};

export class CharacterBuilder {
  /**
   * Create a block character THREE.Group from a config object.
   * @param {object} config - Character customization config
   * @returns {THREE.Group}
   */
  static create(config = {}) {
    const c = { ...DEFAULT_CHARACTER, ...config };
    const group = new THREE.Group();
    group.name = 'player-character';

    const skinMat = new THREE.MeshStandardMaterial({
      color: c.skinColor,
      roughness: 0.7,
      metalness: 0.05,
    });

    // --- Head ---
    const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.45;
    head.castShadow = true;
    head.name = 'head';
    group.add(head);

    // Eyes (small dark boxes on face)
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const eyeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.02);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.09, 1.48, 0.2);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo.clone(), eyeMat.clone());
    rightEye.position.set(0.09, 1.48, 0.2);
    group.add(rightEye);

    // Mouth (small line)
    const mouthGeo = new THREE.BoxGeometry(0.12, 0.03, 0.02);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 1.38, 0.2);
    group.add(mouth);

    // --- Hair ---
    const hairBuilder = HAIR_BUILDERS[c.hair] || HAIR_BUILDERS.short;
    const hair = hairBuilder(c.hairColor);
    hair.position.y = 1.65;
    hair.name = 'hair';
    group.add(hair);

    // --- Torso ---
    const shirtMat = new THREE.MeshStandardMaterial({
      color: c.shirtColor,
      roughness: 0.6,
      metalness: 0.05,
    });
    const torsoGeo = new THREE.BoxGeometry(0.4, 0.5, 0.25);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 1.0;
    torso.castShadow = true;
    torso.name = 'torso';
    group.add(torso);

    // Shirt pattern decoration
    if (c.shirtPattern === 'stripes') {
      const stripeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.6,
        transparent: true,
        opacity: 0.5,
      });
      for (let i = 0; i < 3; i++) {
        const stripeGeo = new THREE.BoxGeometry(0.41, 0.04, 0.01);
        const stripe = new THREE.Mesh(stripeGeo, stripeMat.clone());
        stripe.position.set(0, 0.88 + i * 0.12, 0.13);
        group.add(stripe);
      }
    } else if (c.shirtPattern === 'star') {
      // Simple diamond/star shape on front
      const starMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.5,
        emissive: 0xfbbf24,
        emissiveIntensity: 0.15,
      });
      const starGeo = new THREE.BoxGeometry(0.12, 0.12, 0.01);
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(0, 1.0, 0.13);
      star.rotation.z = Math.PI / 4;
      group.add(star);
    }

    // --- Arms ---
    const armGeo = new THREE.BoxGeometry(0.15, 0.45, 0.15);

    const leftArm = new THREE.Mesh(armGeo, skinMat.clone());
    leftArm.position.set(-0.275, 1.0, 0);
    leftArm.castShadow = true;
    leftArm.name = 'leftArm';
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo.clone(), skinMat.clone());
    rightArm.position.set(0.275, 1.0, 0);
    rightArm.castShadow = true;
    rightArm.name = 'rightArm';
    group.add(rightArm);

    // --- Legs ---
    const pantsMat = new THREE.MeshStandardMaterial({
      color: c.pantsColor,
      roughness: 0.7,
      metalness: 0.05,
    });
    const legGeo = new THREE.BoxGeometry(0.18, 0.4, 0.18);

    // Leg pivots at hip for walk animation
    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.1, 0.75, 0);
    leftLegPivot.name = 'leftLegPivot';
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.y = -0.2; // offset so pivot is at hip
    leftLeg.castShadow = true;
    leftLeg.name = 'leftLeg';
    leftLegPivot.add(leftLeg);
    group.add(leftLegPivot);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.1, 0.75, 0);
    rightLegPivot.name = 'rightLegPivot';
    const rightLeg = new THREE.Mesh(legGeo.clone(), pantsMat.clone());
    rightLeg.position.y = -0.2;
    rightLeg.castShadow = true;
    rightLeg.name = 'rightLeg';
    rightLegPivot.add(rightLeg);
    group.add(rightLegPivot);

    // --- Shoes ---
    const shoeMat = new THREE.MeshStandardMaterial({
      color: c.shoeColor,
      roughness: 0.5,
      metalness: 0.1,
    });
    const shoeGeo = new THREE.BoxGeometry(0.2, 0.08, 0.22);

    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.42, 0.02);
    leftShoe.name = 'leftShoe';
    leftLegPivot.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo.clone(), shoeMat.clone());
    rightShoe.position.set(0, -0.42, 0.02);
    rightShoe.name = 'rightShoe';
    rightLegPivot.add(rightShoe);

    return group;
  }
}
