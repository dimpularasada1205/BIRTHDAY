export type ScreenType =
  | 'pin'
  | 'wishes'
  | 'candle'
  | 'menu'
  | 'memories'
  | 'reasons'
  | 'envelopes'
  | 'gift'
  | 'letter';

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotation?: number; // slight polaroid tilt for realistic look
}

export interface LoveReason {
  id: string;
  number: number;
  title: string;
  description: string;
  iconName: string;
}

export interface OpenWhenEnvelope {
  id: string;
  title: string; // e.g. "Open when you're sad"
  subtitle: string;
  previewIcon: string;
  message: string;
  accentColor: string;
}

export interface LoveLetterContent {
  recipient: string;
  greeting: string;
  paragraphs: string[];
  signoff: string;
  sender: string;
}
