import * as THREE from 'three';
import { ARROW_COLOR, ARROW_HOVER_COLOR, ARROW_SIZE } from '../utils/constants.js';

export class WaypointArrow {
  constructor(waypointData, game) {
    this.waypointData = waypointData;
    this.game = game;
    this.time = Math.random() * Math.PI * 2;

    // Create arrow shape — flat chevron on the floor
    const shape = new THREE.Shape();
    const s = ARROW_SIZE;
    shape.moveTo(0, s);
    shape.lineTo(s * 0.6, 0);
    shape.lineTo(s * 0.2, 0);
    shape.lineTo(0, s * 0.5);
    shape.lineTo(-s * 0.2, 0);
    shape.lineTo(-s * 0.6, 0);
    shape.lineTo(0, s);

    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshStandardMaterial({
      color: ARROW_COLOR,
      emissive: ARROW_COLOR,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2; // lay flat on floor
    this.mesh.position.set(waypointData.x, 0.02, waypointData.z);
    this.mesh.name = 'waypoint-arrow';
  }

  update(delta) {
    this.time += delta * 2;
    // Gentle bob and pulse
    this.mesh.position.y = 0.02 + Math.sin(this.time) * 0.02;
    this.mesh.material.opacity = 0.5 + Math.sin(this.time * 1.5) * 0.2;
    this.mesh.material.emissiveIntensity = 0.2 + Math.sin(this.time) * 0.15;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
