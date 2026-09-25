import { Group } from '@tweenjs/tween.js';

// tween.js v25's mainGroup never ticks under Vite's pre-bundled ESM, so every
// tween must be added to this shared group, which the render loop updates.
export const tweenGroup = new Group();
