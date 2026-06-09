
import { AppConfig, ModelType, AspectRatio } from "./types";

export const DEFAULT_CONFIG: AppConfig = {
  prompt: '',
  negativePrompt: '',
  model: ModelType.FLASH, // Nano Banana 1 (mais econômico) como padrão
  aspectRatio: AspectRatio.SQUARE,
};
