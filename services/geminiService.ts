import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, Question, Difficulty, MindMapNode } from "../types";

// NOTE: In a real production app, you should not expose the API key on the client side.
// However, per the prompt instructions, we are using process.env.API_KEY.
const apiKey = process.env.API_KEY || '';

const getClient = () => new GoogleGenAI({ apiKey });

export const generateMCQ = async (
  content: string,
  difficulty: Difficulty,
  count: number
): Promise<Question[]> => {
  const ai = getClient();
  
  const systemPrompt = `You are an expert biology professor. Create a multiple choice test based EXACTLY and ONLY on the provided reference notes. 
  Do not introduce outside information unless it is general common knowledge required to understand the context.
  Create ${count} questions. Difficulty level: ${difficulty}.
  Return the response in a structured JSON format.`;

  const schema: Schema = {
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
    if (!jsonText) throw new Error("No text returned");
    return JSON.parse(jsonText) as Question[];
  } catch (error) {
    console.error("MCQ Generation Error:", error);
    throw error;
  }
};

export const generateMindMap = async (content: string): Promise<MindMapNode> => {
  const ai = getClient();
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      label: { type: Type.STRING },
      details: { type: Type.STRING },
      children: {
        type: Type.ARRAY,
        items: {
           type: Type.OBJECT, // Recursive definition isn't directly supported in simple schema objects this way, but Gemini handles it well with loose object typing for children in prompt instructions or simplified schema.
           // We will define the structure in the prompt strongly.
           properties: {
             id: { type: Type.STRING },
             label: { type: Type.STRING },
             details: { type: Type.STRING },
             children: { type: Type.ARRAY, items: { type: Type.OBJECT } }
           }
        }
      }
    },
    required: ['id', 'label', 'children']
  };

  const systemPrompt = `You are an expert biology tutor. Analyze the provided notes and create a detailed, hierarchical mind map structure.
  
  The Output must be a JSON object representing the root node.
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
        // We skip strict schema validation for recursive types to avoid complex Type definition issues, relying on the prompt and mimeType.
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned");
    return JSON.parse(jsonText) as MindMapNode;
  } catch (error) {
    console.error("MindMap Generation Error:", error);
    // Fallback node
    return {
      id: "error",
      label: "Error generating map",
      details: "Please try again.",
      children: []
    };
  }
};

export const generateExplanation = async (content: string): Promise<string> => {
  // Keeping this for legacy support if needed, but we are moving to MindMap
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
