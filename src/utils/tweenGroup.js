import { Group } from '@tweenjs/tween.js';

// Shared tween group — workaround for tween.js v25 mainGroup not working
// with Vite's pre-bundled ESM. All tweens must use this group explicitly.
export const tweenGroup = new Group();
