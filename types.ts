
export enum ModelType {
  FLASH = 'gemini-2.5-flash-image',          // Nano Banana 1
  PRO = 'gemini-3.1-flash-image-preview',    // Nano Banana 2 (pago, exige billing)
}

export enum AspectRatio {
  VERTICAL = '9:16',
  HORIZONTAL = '16:9',
  SQUARE = '1:1',
  BANNER_DESKTOP = '1920x400',
  BANNER_MOBILE = '600x400',
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  timestamp: number;
  seed?: number;
}

export interface AppConfig {
  prompt: string;
  negativePrompt: string;
  model: ModelType;
  aspectRatio: AspectRatio;
  seed?: number;
}
