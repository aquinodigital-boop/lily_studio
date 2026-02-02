
export enum ModelType {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview',
}

export enum AspectRatio {
  VERTICAL = '9:16',
  HORIZONTAL = '16:9',
  SQUARE = '1:1',
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
