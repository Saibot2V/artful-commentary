import { GoogleGenerativeAI } from "@google/generative-ai";

interface Point {
  point: [number, number];
  label: string;
}

interface AnalysisResponse {
  answer: string;
  points?: Point[];
}

export const analyzeImage = async (
  apiKey: string,
  modelName: string,
  systemMessage: string,
  base64Image: string,
  message: string,
  isPointMode: boolean
): Promise<AnalysisResponse> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  // Extract base64 data
  const base64Data = base64Image.split(',')[1];

  // Prepare the prompt based on mode
  let prompt = message;
  if (isPointMode) {
    prompt = `Answer the following question and point to relevant items in the image: '${message}'
    Provide the answer in JSON format as follows:
    {
      "answer": "...",
      "points": [{"point": [y, x], "label": "..."}],
    }
    The points are in [y, x] format normalized to 0-1000.`;
  }

  // Create chat session with configuration
  const chat = model.startChat({
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
    history: systemMessage ? [
      {
        role: "user",
        parts: [{ text: systemMessage }],
      }
    ] : [],
  });

  // Send message with image
  const result = await chat.sendMessage([
    {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg"
      }
    },
    { text: prompt }
  ]);

  const responseText = await result.response.text();

  if (isPointMode) {
    // Clean the response text by removing markdown code block markers
    let cleanResponse = responseText.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.substring(7);
    }
    if (cleanResponse.endsWith('```')) {
      cleanResponse = cleanResponse.substring(0, cleanResponse.length - 3);
    }

    try {
      const parsedResponse = JSON.parse(cleanResponse) as AnalysisResponse;
      return parsedResponse;
    } catch (error) {
      console.error("Failed to parse points response:", error);
      throw new Error("Could not parse points from response");
    }
  }

  return { answer: responseText };
};