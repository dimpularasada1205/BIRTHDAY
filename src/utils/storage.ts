import { MemoryPhoto, LoveReason, OpenWhenEnvelope, LoveLetterContent } from '../types.ts';

// Default curated romantic vector/gradient art for the memories placeholders
// so it looks magnificent immediately without broken external images!
export const DEFAULT_MEMORIES: MemoryPhoto[] = [
  {
    id: 'mem-1',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23701a75"/><stop offset="50%" stop-color="%23be185d"/><stop offset="100%" stop-color="%23f59e0b"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g1)"/><circle cx="300" cy="380" r="140" fill="%23fde047" opacity="0.85"/><ellipse cx="300" cy="460" rx="220" ry="80" fill="%234a044e" opacity="0.6"/><path d="M260,370 Q280,330 300,370 Q320,330 340,370 Q300,420 260,370 Z" fill="%23ffffff" opacity="0.95"/><text x="300" y="520" text-anchor="middle" fill="%23fff1f2" font-family="sans-serif" font-size="24" font-weight="600">The sunset we watched together 🌅</text></svg>',
    caption: 'Our first unforgettable sunset walk by the sea 🌅',
    date: 'Magic Moments',
    rotation: -2,
  },
  {
    id: 'mem-2',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234c0519"/><stop offset="50%" stop-color="%239f1239"/><stop offset="100%" stop-color="%23fb7185"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g2)"/><circle cx="240" cy="280" r="70" fill="%23fff1f2" opacity="0.3"/><circle cx="360" cy="280" r="70" fill="%23fff1f2" opacity="0.3"/><path d="M260,250 C260,210 340,210 340,250 C340,290 260,340 300,360 C340,340 260,290 260,250 Z" fill="%23f43f5e" opacity="0.8"/><text x="300" y="470" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="24" font-weight="600">Endless late-night cafe talks ☕</text></svg>',
    caption: 'That cozy rainy afternoon over warm coffee & laughs ☕',
    date: 'Sweet Memories',
    rotation: 2.5,
  },
  {
    id: 'mem-3',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="60%" stop-color="%233b0764"/><stop offset="100%" stop-color="%23701a75"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g3)"/><g fill="%23fde047"><circle cx="150" cy="120" r="4"/><circle cx="450" cy="180" r="5"/><circle cx="380" cy="90" r="3"/><circle cx="210" cy="220" r="4"/><circle cx="480" cy="320" r="3"/></g><circle cx="300" cy="280" r="90" fill="%23fef08a" opacity="0.85"/><text x="300" y="470" text-anchor="middle" fill="%23fdf2f8" font-family="sans-serif" font-size="24" font-weight="600">Stargazing together under the night sky ✨</text></svg>',
    caption: 'Counting stars and making wishes together ✨',
    date: 'Under The Stars',
    rotation: -1.5,
  },
  {
    id: 'mem-4',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23831843"/><stop offset="50%" stop-color="%23db2777"/><stop offset="100%" stop-color="%23f472b6"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g4)"/><circle cx="300" cy="270" r="110" fill="%23fce7f3" opacity="0.3"/><path d="M260,260 A25,25 0 0,0 300,285 A25,25 0 0,0 340,260 Q340,310 300,340 Q260,310 260,260 Z" fill="%23ffffff" /><text x="300" y="460" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="24" font-weight="600">Every silly selfie that made us laugh 📸</text></svg>',
    caption: 'When we could not stop giggling for no reason at all 📸',
    date: 'Pure Happiness',
    rotation: 1.8,
  },
  {
    id: 'mem-5',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23581c87"/><stop offset="50%" stop-color="%237e22ce"/><stop offset="100%" stop-color="%23e879f9"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g5)"/><circle cx="300" cy="270" r="100" fill="%23fae8ff" opacity="0.25"/><polygon points="300,180 325,245 395,245 338,285 360,350 300,310 240,350 262,285 205,245 275,245" fill="%23fef08a" opacity="0.9"/><text x="300" y="460" text-anchor="middle" fill="%23fdf4ff" font-family="sans-serif" font-size="24" font-weight="600">Our scenic road trip adventure 🚗</text></svg>',
    caption: 'Singing songs off-key on the road trip 🚗🎶',
    date: 'Adventure Days',
    rotation: -2.2,
  },
  {
    id: 'mem-6',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%233b0764"/><stop offset="50%" stop-color="%239333ea"/><stop offset="100%" stop-color="%23c084fc"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g6)"/><circle cx="300" cy="270" r="90" fill="%23fff" opacity="0.2"/><circle cx="250" cy="230" r="18" fill="%23fde047" opacity="0.9"/><circle cx="350" cy="230" r="18" fill="%23fde047" opacity="0.9"/><circle cx="300" cy="300" r="24" fill="%23fde047" opacity="0.9"/><text x="300" y="460" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="24" font-weight="600">Dinner under glowing fairy lights 🕯️</text></svg>',
    caption: 'Fairy lights, sweet smiles, and your hand in mine 🕯️',
    date: 'Date Nights',
    rotation: 2.1,
  },
  {
    id: 'mem-7',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23831843"/><stop offset="50%" stop-color="%23be123c"/><stop offset="100%" stop-color="%23fb7185"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g7)"/><circle cx="300" cy="270" r="120" fill="%23ffe4e6" opacity="0.25"/><path d="M240,240 Q300,180 360,240 Q300,340 240,240 Z" fill="%23f43f5e" /><text x="300" y="460" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="24" font-weight="600">The day my heart chose you ❤️</text></svg>',
    caption: 'The moment I knew you were my safe place ❤️',
    date: 'Forever Memory',
    rotation: -1.2,
  },
  {
    id: 'mem-8',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234a044e"/><stop offset="50%" stop-color="%23a21caf"/><stop offset="100%" stop-color="%23f472b6"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g8)"/><circle cx="300" cy="270" r="105" fill="%23fdf4ff" opacity="0.3"/><path d="M270,230 L330,230 L340,310 L260,310 Z" fill="%23fde047" opacity="0.8"/><text x="300" y="460" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="24" font-weight="600">Celebrating Hari today and always 🎉</text></svg>',
    caption: 'Today is Hari’s day! Celebrating you with all my heart 🎉',
    date: 'Birthday Boy',
    rotation: 1.5,
  },
];

export const DEFAULT_REASONS: LoveReason[] = [
  {
    id: 'reason-1',
    number: 1,
    title: 'Your Contagious Smile',
    description: 'Your smile always makes my day better, no matter how tiring or cloudy it gets. One look at you and everything feels warm.',
    iconName: 'Smile',
  },
  {
    id: 'reason-2',
    number: 2,
    title: 'The Way You Make Moments Special',
    description: 'The way you make ordinary moments feel like something straight out of a movie. Even sitting in traffic or grocery shopping with you is an adventure.',
    iconName: 'Sparkles',
  },
  {
    id: 'reason-3',
    number: 3,
    title: 'Your Care & Kindness',
    description: 'Your gentle care and kindness towards everyone and everything. You have the softest, most genuine heart I have ever known.',
    iconName: 'HeartHandshake',
  },
  {
    id: 'reason-4',
    number: 4,
    title: 'The Happiness You Bring',
    description: 'The pure, unfiltered happiness you bring into my life every single second. My favorite sound in the world is your laughter.',
    iconName: 'Sun',
  },
  {
    id: 'reason-5',
    number: 5,
    title: 'Simply Being Yourself',
    description: 'Simply being yourself, Hari. Unapologetic, passionate, hilarious, and thoughtful. Never change because you are absolutely perfect to me.',
    iconName: 'Heart',
  },
];

export const DEFAULT_ENVELOPES: OpenWhenEnvelope[] = [
  {
    id: 'env-1',
    title: "Open when you're sad 🌧️",
    subtitle: 'A warm comforting hug in words',
    previewIcon: 'CloudRain',
    accentColor: '#9333ea',
    message: `My dear Hari,\n\nI wish I could wrap my arms around you right now and take away whatever is weighing on your mind.\n\nPlease remember that bad days don't define you, and tough moments always pass. You are stronger and more resilient than you know, and you never have to carry anything alone.\n\nTake a deep breath. Drink some water, rest your shoulders, and remember that I believe in you with my whole heart.\n\nYou are deeply, infinitely loved. Always. ❤️`,
  },
  {
    id: 'env-2',
    title: 'Open when you miss me 💭',
    subtitle: 'When we are miles or minutes apart',
    previewIcon: 'Heart',
    accentColor: '#db2777',
    message: `Hey Hari,\n\nIf you're reading this, I probably miss you just as much or even more right now!\n\nClose your eyes for three seconds and imagine me right beside you, holding your hand and leaning on your shoulder. Distance or busy schedules can't change how close you are to my heart.\n\nWhenever you miss me, send me a text or listen to our favorite song. I'm always just one thought away from you.\n\nSending you a thousand warm hugs right this second! 💗`,
  },
  {
    id: 'env-3',
    title: 'Open when you need a smile 😊',
    subtitle: 'A quick dose of silly happiness',
    previewIcon: 'Smile',
    accentColor: '#eab308',
    message: `Hello handsome!\n\nQuick reminder: You have the most adorable smile and the most precious laugh in the entire universe! 🌟\n\nDid you know that every time you chuckle, angels do a little happy dance? (Okay maybe I made that up, but my heart definitely skips a beat!)\n\nWhatever is happening today, you've got this. Keep that gorgeous smile on your face because it's literally my sunshine.\n\nNow smile for me right now! I know you're smiling! 😄✨`,
  },
  {
    id: 'env-4',
    title: 'Open when you want to feel loved 💖',
    subtitle: 'A reminder of how cherished you are',
    previewIcon: 'Sparkles',
    accentColor: '#e11d48',
    message: `Hari,\n\nIn case nobody told you today: you are treasured beyond measure.\n\nYou bring so much warmth, comfort, and joy into my world. Having you as my partner is one of the greatest blessings I could ever ask for.\n\nI love your voice, I love your thoughts, I love your goofy jokes, and I love the person you are becoming every day.\n\nNever doubt how important you are to me. You are my home, my favorite human, and my happy place.\n\nAlways yours, completely and endlessly. ❤️`,
  },
];

export const DEFAULT_LETTER: LoveLetterContent = {
  recipient: 'Hari',
  greeting: 'My Dearest Hari,',
  paragraphs: [
    'Happiest Birthday to the most special person in my life! ❤️',
    "I don't know if words can ever explain how much you mean to me, but I want you to know how grateful I am to have you in my life.",
    'Your smile, your presence and all the little moments we share mean more to me than you know.',
    "I wish you endless happiness, success, good health and everything you've ever dreamed of.",
    'No matter how many birthdays come and go, I hope I always get to celebrate your special days and create beautiful memories with you.',
    'Thank you for being you. You are one of my favourite parts of life.',
    'Happy Birthday once again, Hari! ❤️',
  ],
  signoff: 'With all my love,',
  sender: 'Yours always. 💗',
};

// Storage keys
const STORAGE_KEYS = {
  MEMORIES: 'hari_bday_memories',
  REASONS: 'hari_bday_reasons',
  ENVELOPES: 'hari_bday_envelopes',
  LETTER: 'hari_bday_letter',
  PROGRESS: 'hari_bday_progress',
};

import { persistAllMemories, fetchAllMemories } from './firebase.ts';

export function getStoredMemories(): MemoryPhoto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    return raw ? JSON.parse(raw) : DEFAULT_MEMORIES;
  } catch {
    return DEFAULT_MEMORIES;
  }
}

export function saveStoredMemories(memories: MemoryPhoto[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    // Asynchronously synchronize with persistent database & storage
    persistAllMemories(memories).catch((err) => {
      console.warn('Background cloud sync error:', err);
    });
  } catch (e) {
    console.error('Storage error', e);
  }
}

export async function syncCloudMemories(): Promise<MemoryPhoto[]> {
  try {
    const cloud = await fetchAllMemories();
    if (cloud && cloud.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(cloud));
      return cloud;
    }
  } catch (e) {
    console.warn('Failed to fetch from cloud:', e);
  }
  return getStoredMemories();
}

export function getStoredReasons(): LoveReason[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REASONS);
    return raw ? JSON.parse(raw) : DEFAULT_REASONS;
  } catch {
    return DEFAULT_REASONS;
  }
}

export function saveStoredReasons(reasons: LoveReason[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REASONS, JSON.stringify(reasons));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function getStoredEnvelopes(): OpenWhenEnvelope[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENVELOPES);
    return raw ? JSON.parse(raw) : DEFAULT_ENVELOPES;
  } catch {
    return DEFAULT_ENVELOPES;
  }
}

export function saveStoredEnvelopes(envelopes: OpenWhenEnvelope[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ENVELOPES, JSON.stringify(envelopes));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function getStoredLetter(): LoveLetterContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LETTER);
    return raw ? JSON.parse(raw) : DEFAULT_LETTER;
  } catch {
    return DEFAULT_LETTER;
  }
}

export function saveStoredLetter(letter: LoveLetterContent) {
  try {
    localStorage.setItem(STORAGE_KEYS.LETTER, JSON.stringify(letter));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function resetAllToDefaults() {
  localStorage.removeItem(STORAGE_KEYS.MEMORIES);
  localStorage.removeItem(STORAGE_KEYS.REASONS);
  localStorage.removeItem(STORAGE_KEYS.ENVELOPES);
  localStorage.removeItem(STORAGE_KEYS.LETTER);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
}
