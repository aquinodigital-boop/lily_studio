
import { GoogleGenAI } from "@google/genai";
import { AppConfig, ModelType } from "../types";

export const generateImage = async (
  config: AppConfig,
  primaryImage: File | null,
  secondaryImage: File | null
): Promise<string> => {


  // 2. Inicialização
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error("Chave API não configurada. Verifique o arquivo .env.local");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 3. Preparação das partes multimodais
  const parts: any[] = [];

  if (primaryImage) {
    try {
      const b64 = await fileToBase64(primaryImage);
      parts.push({
        inlineData: {
          mimeType: primaryImage.type,
          data: b64,
        },
      });
    } catch (e) {
      console.error("Erro no processamento da imagem primária");
    }
  }

  if (secondaryImage) {
    try {
      const b64 = await fileToBase64(secondaryImage);
      parts.push({
        inlineData: {
          mimeType: secondaryImage.type,
          data: b64,
        },
      });
    } catch (e) {
      console.error("Erro no processamento da imagem secundária");
    }
  }

  const finalPrompt = `${config.prompt}${config.negativePrompt ? ` | Evitar: ${config.negativePrompt}` : ''}`;
  parts.push({ text: finalPrompt });

  // 4. Execução da Geração
  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: { parts },
      config: {
        seed: config.seed,
        imageConfig: {
          aspectRatio: config.aspectRatio,
          ...(config.model === ModelType.PRO ? { imageSize: '1K' } : {})
        },
        ...(config.model === ModelType.PRO ? { tools: [{ google_search: {} }] } : {})
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      }
    }
    throw new Error("O modelo não devolveu uma imagem. Tente mudar o prompt.");
  } catch (error: any) {
    if (error.message?.includes("API key")) {
      throw new Error("Chave API inválida ou expirada.");
    }
    throw new Error(error.message || "Falha na conexão com o servidor de IA.");
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
  });
};
