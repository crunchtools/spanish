/**
 * Release the GPU geometry and material buffers of `root` and every descendant.
 * The objects stay in the scene graph; callers remove them separately.
 * @param {import('three').Object3D} root
 */
export function disposeObject3D(root) {
  root.traverse((child) => {
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
