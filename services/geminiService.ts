import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, Question, Difficulty, MindMapNode } from "../types";

// Initialize with env variable if available, otherwise check local storage
let internalApiKey = process.env.API_KEY || '';

if (!internalApiKey && typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('biomaster_gemini_key');
    if (stored) internalApiKey = stored;
  } catch (e) {
    // Ignore local storage errors
  }
}

export const setApiKey = (key: string) => {
  internalApiKey = key;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('biomaster_gemini_key', key);
    } catch (e) {
      console.warn('Failed to save API key to local storage');
    }
  }
};

export const hasApiKey = () => !!internalApiKey;

const getClient = () => {
  if (!internalApiKey) {
    throw new Error("API Key is missing. Please enter your API Key in Settings.");
  }
  return new GoogleGenAI({ apiKey: internalApiKey });
};

export const generateMCQ = async (
  content: string,
  difficulty: Difficulty,
  count: number
): Promise<Question[]> => {
  const ai = getClient();
  
  const systemPrompt = `You are an expert biology professor. Create a multiple choice test based EXACTLY and ONLY on the provided reference notes. 
  Do not introduce outside information unless it is general common knowledge required to understand the context.
  Create ${count} questions. Difficulty level: ${difficulty}.
  Return the response in a structured JSON object with a 'questions' array.`;

  // Using a root object is often more stable than a root array for strict schemas
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            text: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ['id', 'text', 'options', 'correctAnswerIndex'],
        },
      }
    },
    required: ['questions']
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Reference Content:\n${content}\n\nTask: Generate ${count} ${difficulty} level MCQs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: systemPrompt,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned from API");
    
    const parsed = JSON.parse(jsonText);
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
       throw new Error("Invalid format returned");
    }
    return parsed.questions as Question[];
  } catch (error) {
    console.error("MCQ Generation Error:", error);
    throw error;
  }
};

export const generateMindMap = async (content: string): Promise<MindMapNode> => {
  const ai = getClient();
  
  // NOTE: We are intentionally NOT using responseSchema here because recursive schemas (children containing children) 
  // can cause validation errors with the current API version. We rely on the prompt and JSON mode.

  const systemPrompt = `You are an expert biology tutor. Analyze the provided notes and create a detailed, hierarchical mind map structure.
  
  The Output must be a valid JSON object representing the root node.
  Structure:
  {
    "id": "root",
    "label": "Main Topic",
    "details": "Brief summary",
    "children": [
      { "id": "1", "label": "Subtopic", "details": "definition", "children": [...] }
    ]
  }

  Rules:
  1. Break down complex topics into sub-nodes.
  2. Keep labels concise (2-5 words).
  3. Use 'details' for definitions or key facts (1-2 sentences).
  4. Ensure the depth is at least 3 levels (Root -> Concept -> Details -> Examples).
  5. Cover ALL major points in the text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Notes to map:\n${content}`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: systemPrompt,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned from API");
    return JSON.parse(jsonText) as MindMapNode;
  } catch (error) {
    console.error("MindMap Generation Error:", error);
    // Fallback node
    return {
      id: "error",
      label: "Error generating map",
      details: "Please check your API key or try again.",
      children: []
    };
  }
};

export const generateExplanation = async (content: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the following biology notes in a structured, easy-to-read study guide format. Use Markdown. Highlight key terms.
      
      Notes:
      ${content}`,
      config: {
        systemInstruction: "You are a helpful study tutor. Summarize and explain the provided notes clearly.",
      },
    });
    return response.text || "Failed to generate explanation.";
  } catch (error) {
    console.error("Explanation Error:", error);
    return "Error generating explanation.";
  }
};

export const generateDiagram = async (topic: string): Promise<string | null> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: `A clean, professional medical illustration of ${topic}. White background, educational textbook style, high detail. IMPORTANT: Do not include any text, labels, arrows, or writing on the image. Purely visual anatomical representation.` }]
      },
      config: {
        // Only 1 image
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};