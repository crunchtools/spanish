import * as THREE from 'three';

export class TapToMove {
  constructor(game) {
    this.game = game;
    this.room = null;
    this.raycaster = new THREE.Raycaster();
    this.isMoving = false;

    this.onPointerUp = this.onPointerUp.bind(this);
    this.game.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
  }

  setRoom(room) {
    this.room = room;
  }

  onPointerUp(event) {
    if (!this.room || this.isMoving) return;
    if (this.game.swipeLook.isSwiping) return;
    if (this.game.objectInteraction.justInteracted) return;

    // Check if tap hit a waypoint arrow
    const pointer = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(pointer, this.game.camera);

    // Check waypoint arrows first
    const arrowMeshes = this.room.getWaypointArrows().map((a) => a.mesh);
    const arrowHits = this.raycaster.intersectObjects(arrowMeshes, true);
    if (arrowHits.length > 0) {
      const hitArrow = this.room.getWaypointArrows().find(
        (a) => a.mesh === arrowHits[0].object || a.mesh === arrowHits[0].object.parent
      );
      if (hitArrow) {
        this.moveToWaypoint(hitArrow.waypointData);
        return;
      }
    }

    // Check floor tap — find nearest waypoint
    const floor = this.room.getFloor();
    if (!floor) return;

    const floorHits = this.raycaster.intersectObject(floor);
    if (floorHits.length > 0) {
      const hitPoint = floorHits[0].point;
      const nearest = this.findNearestWaypoint(hitPoint);
      if (nearest) {
        this.moveToWaypoint(nearest);
      }
    }
  }

  findNearestWaypoint(point) {
    if (!this.room) return null;
    const waypoints = this.room.roomData.waypoints;
    let closest = null;
    let closestDist = Infinity;

    waypoints.forEach((wp) => {
      const dx = wp.x - point.x;
      const dz = wp.z - point.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        closest = wp;
      }
    });

    return closest;
  }

  moveToWaypoint(wp) {
    const player = this.game.playerCharacter;
    if (!player) return;

    this.isMoving = true;

    // Walk the character to the waypoint
    player.walkTo(wp.x, wp.z);

    // Wait for the walk tween to finish
    const checkDone = () => {
      if (!player.isWalking) {
        this.isMoving = false;
      } else {
        requestAnimationFrame(checkDone);
      }
    };
    requestAnimationFrame(checkDone);
  }

  dispose() {
    this.game.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);
  }
}
