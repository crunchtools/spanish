import * as THREE from 'three';
import { ROOM_WIDTH, ROOM_DEPTH, ROOM_HEIGHT } from '../../utils/constants.js';
import { VocabObject } from '../../objects/VocabObject.js';
import { WaypointArrow } from '../../objects/WaypointArrow.js';
import { GuideModel } from '../../objects/GuideModel.js';
import { AssetLoader } from '../../systems/AssetLoader.js';

export class RoomBase {
  constructor(game, roomData) {
    this.game = game;
    this.roomData = roomData;
    this.scene = new THREE.Scene();
    this.vocabObjects = [];
    this.waypointArrows = [];
    this.guide = null;
    this.assetLoader = new AssetLoader();
    this.floor = null;
  }

  async load() {
    this.buildRoom();
    this.addLighting();
    this.addWaypoints();
    this.addGuide();
    await this.addVocabObjects();
  }

  buildRoom() {
    const w = ROOM_WIDTH;
    const d = ROOM_DEPTH;
    const h = ROOM_HEIGHT;

    // Floor
    const floorGeo = new THREE.PlaneGeometry(w, d);
    const floorMat = new THREE.MeshStandardMaterial({
      color: this.roomData.floorColor,
      roughness: 0.8,
      metalness: 0.1,
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.floor.name = 'floor';
    this.scene.add(this.floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: this.roomData.wallColor,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
    backWall.position.set(0, h / 2, -d / 2);
    this.scene.add(backWall);

    // Front wall
    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat.clone());
    frontWall.position.set(0, h / 2, d / 2);
    frontWall.rotation.y = Math.PI;
    this.scene.add(frontWall);

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(d, h), wallMat.clone());
    leftWall.position.set(-w / 2, h / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    this.scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(d, h), wallMat.clone());
    rightWall.position.set(w / 2, h / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    this.scene.add(rightWall);

    // Ceiling
    const ceilGeo = new THREE.PlaneGeometry(w, d);
    const ceilMat = new THREE.MeshStandardMaterial({
      color: this.roomData.ceilingColor,
      roughness: 1,
      metalness: 0,
    });
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = h;
    this.scene.add(ceiling);
  }

  addLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, this.roomData.ambientIntensity);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, this.roomData.directionalIntensity);
    directional.position.set(2, 2.5, 1);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 1024;
    directional.shadow.mapSize.height = 1024;
    directional.shadow.camera.near = 0.1;
    directional.shadow.camera.far = 10;
    this.scene.add(directional);

    // Warm fill light from opposite side
    const fill = new THREE.DirectionalLight(0xffeedd, 0.4);
    fill.position.set(-2, 2, -1);
    this.scene.add(fill);

    // Overhead point light for even room coverage
    const overhead = new THREE.PointLight(0xfff5e6, 0.5, 10);
    overhead.position.set(0, 2.8, 0);
    this.scene.add(overhead);
  }

  addWaypoints() {
    this.roomData.waypoints.forEach((wp) => {
      const arrow = new WaypointArrow(wp, this.game);
      this.scene.add(arrow.mesh);
      this.waypointArrows.push(arrow);
    });
  }

  addGuide() {
    // Guide disabled for now — will return in a later room
    // this.guide = new GuideModel(this.roomData.guide, this.game);
    // this.scene.add(this.guide.sprite);
  }

  async addVocabObjects() {
    const loadPromises = this.roomData.words.map(async (wordData) => {
      const vocabObj = new VocabObject(wordData, this.game);
      await vocabObj.load(this.assetLoader);
      this.scene.add(vocabObj.group);
      this.vocabObjects.push(vocabObj);
    });
    await Promise.all(loadPromises);
  }

  update(delta) {
    this.vocabObjects.forEach((obj) => obj.update(delta));
    this.waypointArrows.forEach((arrow) => arrow.update(delta));
    if (this.guide) {
      this.guide.update(delta);
    }
  }

  getSpawnPoint() {
    // Spawn at center of room so camera has room behind the character
    const center = this.roomData.waypoints.find((wp) => wp.label === 'center');
    return center || this.roomData.waypoints[0] || { x: 0, z: 0 };
  }

  getFloor() {
    return this.floor;
  }

  getVocabObjects() {
    return this.vocabObjects;
  }

  getWaypointArrows() {
    return this.waypointArrows;
  }

  dispose() {
    this.vocabObjects.forEach((obj) => obj.dispose());
    this.waypointArrows.forEach((arrow) => arrow.dispose());
    if (this.guide) this.guide.dispose();
    this.scene.traverse((child) => {
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
