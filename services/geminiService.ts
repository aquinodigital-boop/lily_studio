
import { GoogleGenAI } from "@google/genai";
import { AppConfig, AspectRatio } from "../types";

const FORMAT_MAP: Record<string, { apiRatio: string; targetSize?: { width: number; height: number } }> = {
  [AspectRatio.VERTICAL]: { apiRatio: '9:16' },
  [AspectRatio.HORIZONTAL]: { apiRatio: '16:9' },
  [AspectRatio.SQUARE]: { apiRatio: '1:1' },
  [AspectRatio.BANNER_DESKTOP]: { apiRatio: '21:9', targetSize: { width: 1920, height: 400 } },
  [AspectRatio.BANNER_MOBILE]: { apiRatio: '3:2', targetSize: { width: 600, height: 400 } },
};

const resizeToExactPixels = (dataUrl: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas não suportado'));

      // Cover: preenche todo o canvas mantendo proporção e cortando o excedente
      const srcRatio = img.width / img.height;
      const dstRatio = width / height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (srcRatio > dstRatio) {
        sw = img.height * dstRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / dstRatio;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Falha ao carregar imagem para redimensionar'));
    img.src = dataUrl;
  });
};

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
  const format = FORMAT_MAP[config.aspectRatio] ?? { apiRatio: config.aspectRatio };
  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: { parts },
      config: {
        seed: config.seed,
        imageConfig: {
          aspectRatio: format.apiRatio,
        },
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        const dataUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        if (format.targetSize) {
          return await resizeToExactPixels(dataUrl, format.targetSize.width, format.targetSize.height);
        }
        return dataUrl;
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
