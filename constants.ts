
import { AppConfig, ModelType, AspectRatio } from "./types";

export const DEFAULT_CONFIG: AppConfig = {
  prompt: '',
  negativePrompt: '',
  model: ModelType.FLASH, // Nano Banana 1 (grátis) como padrão
  aspectRatio: AspectRatio.SQUARE,
};
