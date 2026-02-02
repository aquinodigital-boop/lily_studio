
import { AppConfig, ModelType, AspectRatio } from "./types";

export const DEFAULT_CONFIG: AppConfig = {
  prompt: '',
  negativePrompt: '',
  model: ModelType.PRO, // Definido como PRO por padrão
  aspectRatio: AspectRatio.SQUARE,
};
