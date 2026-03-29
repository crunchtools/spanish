// Room and vocabulary data extracted from the original app.js
// Waypoint positions and model filenames added for 3D scene

export const rooms = {
  bedroom: {
    name: 'Mi Cuarto',
    nameEn: 'My Bedroom',
    icon: '\u{1F6CF}\uFE0F', // bed emoji
    guide: 'estrella',
    guideEmoji: '\u{1F984}', // unicorn
    guideName: 'Estrella',
    floorColor: 0xc7a882,
    wallColor: 0xe0e7ff,
    ceilingColor: 0xf5f3ff,
    ambientIntensity: 0.9,
    directionalIntensity: 0.6,
    // 3-5 preset waypoints for tap-to-move navigation
    // Coordinates are in Three.js world space (x, y=1.2 eye height, z)
    waypoints: [
      { x: 0, z: 3, label: 'doorway' },
      { x: -2, z: 0, label: 'left-wall' },
      { x: 2, z: 0, label: 'right-wall' },
      { x: 0, z: -1, label: 'center' },
      { x: 0, z: -3, label: 'far-wall' },
    ],
    words: [
      // --- BACK WALL AREA ---
      // Bed — back-left
      { emoji: '\u{1F6CF}\uFE0F', spanish: 'la cama', english: 'bed', word: 'cama',
        model: 'bed.glb', position: { x: -2.7, y: 0, z: -1.5 }, rotation: 0, scale: 1.8 },
      // Pillow — on top of bed at head end
      { emoji: '\u{1F4AD}', spanish: 'la almohada', english: 'pillow', word: 'almohada',
        position: { x: -1.5, y: 0.45, z: -3.0 }, rotation: 0, scale: 1 },
      // Lamp — behind bed on right
      { emoji: '\u{1F4A1}', spanish: 'la lámpara', english: 'lamp', word: 'lámpara',
        position: { x: 0.8, y: 0, z: -3.0 }, rotation: 0, scale: 1 },
      // Nightstand — left side of bed
      { emoji: '', image: '/images/mesita.png', spanish: 'la mesita de noche', english: 'nightstand', word: 'mesita',
        position: { x: -3.1, y: 0, z: -3.1 }, rotation: Math.PI / 4, scale: 1 },
      // Bookshelf — back-right corner
      { emoji: '\u{1F4DA}', spanish: 'el libro', english: 'book', word: 'libro',
        position: { x: 2.8, y: 0, z: -3.0 }, rotation: 0, scale: 1 },

      // --- RIGHT WALL ---
      // Window
      { emoji: '\u{1FA9F}', spanish: 'la ventana', english: 'window', word: 'ventana',
        model: 'window.glb', position: { x: 3.45, y: 0.8, z: -1 }, rotation: -Math.PI / 2, scale: 0.8 },
      // Desk — against right wall
      { emoji: '\u{1F4BB}', spanish: 'el escritorio', english: 'desk', word: 'escritorio',
        position: { x: 3.0, y: 0, z: 1.0 }, rotation: -Math.PI / 2, scale: 1 },
      // Chair — at the desk
      { emoji: '\u{1FA91}', spanish: 'la silla', english: 'chair', word: 'silla',
        position: { x: 2.2, y: 0, z: 1.0 }, rotation: Math.PI / 2, scale: 1 },
      // Mirror — on wall above desk
      { emoji: '\u{1FA9E}', spanish: 'el espejo', english: 'mirror', word: 'espejo',
        position: { x: 3.3, y: 1.5, z: 1.0 }, rotation: -Math.PI / 2, scale: 1 },

      // --- LEFT WALL ---
      // Clock
      { emoji: '\u{23F0}', spanish: 'el reloj', english: 'clock', word: 'reloj',
        position: { x: -3.2, y: 1.8, z: 0 }, rotation: Math.PI / 2, scale: 0.8 },
      // Closet — against left wall
      { emoji: '\u{1F6AA}', spanish: 'el armario', english: 'closet', word: 'armario',
        position: { x: -3.2, y: 0, z: 1.5 }, rotation: Math.PI / 2, scale: 1 },

      // --- FRONT WALL (DOOR AREA) ---
      // Door
      { emoji: '\u{1F6AA}', spanish: 'la puerta', english: 'door', word: 'puerta',
        model: 'door.glb', position: { x: 0, y: 0, z: 3.3 }, rotation: Math.PI, scale: 1.5 },
      // Backpack — on floor near door
      { emoji: '\u{1F392}', spanish: 'la mochila', english: 'backpack', word: 'mochila',
        position: { x: 1.5, y: 0, z: 2.8 }, rotation: -0.3, scale: 1 },
      // Shoes — near door
      { emoji: '\u{1F45F}', spanish: 'los zapatos', english: 'shoes', word: 'zapatos',
        position: { x: -1.2, y: 0, z: 2.8 }, rotation: 0.1, scale: 1 },
      // Teddy bear — front-left corner facing out
      { emoji: '\u{1F9F8}', spanish: 'el oso de peluche', english: 'teddy bear', word: 'oso de peluche',
        position: { x: -2.5, y: 0, z: 2.5 }, rotation: Math.PI * 3 / 4, scale: 1 },

      // --- CENTER ---
      // Rug — big, in the middle
      { emoji: '\u{1F7E5}', spanish: 'la alfombra', english: 'rug', word: 'alfombra',
        position: { x: 0, y: 0, z: 0 }, rotation: 0, scale: 1 },
      // Cat — on the rug
      { emoji: '\u{1F431}', spanish: 'el gato', english: 'cat', word: 'gato',
        position: { x: 0.3, y: 0, z: 0.2 }, rotation: -0.3, scale: 1 },
    ],
  },
};

export const guides = {
  estrella: {
    name: 'Estrella',
    emoji: '\u{1F984}',
    color: '#c084fc',
    greetings: [
      "¡Hola! I'm Estrella! Let's learn about things in your bedroom! Tap on the items to learn their names in Spanish!",
      "Welcome back! Ready to learn more words? Tap the items to explore!",
      "¡Buenas! Let's practice! Tap any item you want to learn about!",
    ],
  },
  gatito: {
    name: 'Gatito',
    emoji: '\u{1F431}',
    color: '#fb923c',
    greetings: [
      "¡Miau! I'm Gatito! Let's cook up some Spanish words in the kitchen!",
      "Meow! Ready to learn kitchen words? ¡Vamos!",
    ],
  },
  luna: {
    name: 'Luna',
    emoji: '\u{1F9DC}\u200D\u2640\uFE0F',
    color: '#60a5fa',
    greetings: [
      "¡Hola! I'm Luna! Let's explore the garden together!",
      "The garden is full of wonderful things to learn! ¡Vamos!",
    ],
  },
  zippy: {
    name: 'Zippy',
    emoji: '\u{1F47E}',
    color: '#4ade80',
    greetings: [
      "Beep boop! I'm Zippy! Let's learn space words! ¡Al espacio!",
      "Ready for a cosmic Spanish adventure? ¡Despegamos!",
    ],
  },
};

export const jokes = [
  {
    setup: 'Knock knock!',
    who: "Who's there?",
    punchSetup: 'Agua.',
    punchWho: 'Agua who?',
    punchline: "Agua-n tell you a joke in Spanish! \u{1F4A7}\u{1F604}",
  },
  {
    setup: 'Knock knock!',
    who: "Who's there?",
    punchSetup: 'Taco.',
    punchWho: 'Taco who?',
    punchline: "Taco-bout learning Spanish \u2014 it's fun! \u{1F32E}\u{1F602}",
  },
  {
    setup: 'Knock knock!',
    who: "Who's there?",
    punchSetup: 'Nacho.',
    punchWho: 'Nacho who?',
    punchline: 'Nacho average Spanish class! \u{1F9C0}\u{1F606}',
  },
  {
    setup: 'Knock knock!',
    who: "Who's there?",
    punchSetup: 'Gato.',
    punchWho: 'Gato who?',
    punchline: 'Gato go learn more Spanish words! \u{1F431}\u{1F604}',
  },
  {
    setup: 'Knock knock!',
    who: "Who's there?",
    punchSetup: 'Casa.',
    punchWho: 'Casa who?',
    punchline: 'Casa-nova word every day keeps boredom away! \u{1F3E0}\u{1F602}',
  },
];

export const encouragements = [
  '¡Muy bien!',
  '¡Excelente!',
  '¡Perfecto!',
  '¡Genial!',
  '¡Increíble!',
  '¡Fantástico!',
  '¡Bravo!',
];
