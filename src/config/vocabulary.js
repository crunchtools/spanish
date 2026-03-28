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
      {
        emoji: '\u{1F6CF}\uFE0F',
        spanish: 'la cama',
        english: 'bed',
        word: 'cama',
        model: 'bed.glb',
        position: { x: -2, y: 0, z: -2 },
        rotation: 0,
        scale: 1.8,
      },
      {
        emoji: '\u{1F4A1}',
        spanish: 'la lámpara',
        english: 'lamp',
        word: 'lámpara',
        model: 'lamp.glb',
        position: { x: -0.5, y: 0, z: -2.8 },
        rotation: 0,
        scale: 1.5,
      },
      {
        emoji: '\u{1F6AA}',
        spanish: 'la puerta',
        english: 'door',
        word: 'puerta',
        model: 'door.glb',
        position: { x: 0, y: 0, z: 3.2 },
        rotation: Math.PI,
        scale: 0.7,
      },
      {
        emoji: '\u{1FA9F}',
        spanish: 'la ventana',
        english: 'window',
        word: 'ventana',
        model: 'window.glb',
        position: { x: 3.2, y: 0.8, z: 0 },
        rotation: -Math.PI / 2,
        scale: 0.7,
      },
      {
        emoji: '\u{1F4DA}',
        spanish: 'el libro',
        english: 'book',
        word: 'libro',
        model: 'books.glb',
        position: { x: 2.5, y: 0, z: -2.5 },
        rotation: 0,
        scale: 1.5,
      },
      {
        emoji: '\u{1F9F8}',
        spanish: 'el oso de peluche',
        english: 'teddy bear',
        word: 'oso de peluche',
        model: 'teddy.glb',
        position: { x: -1.5, y: 0.6, z: -2 },
        rotation: 0.3,
        scale: 1.2,
      },
      {
        emoji: '\u{23F0}',
        spanish: 'el reloj',
        english: 'clock',
        word: 'reloj',
        model: 'clock.glb',
        position: { x: -3.2, y: 1.8, z: 0 },
        rotation: Math.PI / 2,
        scale: 0.8,
      },
      {
        emoji: '\u{1F431}',
        spanish: 'el gato',
        english: 'cat',
        word: 'gato',
        model: 'cat.glb',
        position: { x: 1.5, y: 0, z: 1 },
        rotation: -0.5,
        scale: 0.8,
      },
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
