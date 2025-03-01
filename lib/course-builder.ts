import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);

function cleanJsonResponse(text: string): string {
  try {
    // Remove markdown formatting and get only JSON content
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    return jsonMatch[0];
  } catch (error) {
    console.error('Failed to clean JSON response:', error);
    // Return a default course structure
    return JSON.stringify({
      modules: [{
        id: "default",
        title: "Getting Started",
        description: "Introduction to the topic",
        duration: "30 minutes",
        activities: [],
        milestones: []
      }],
      gamification: {
        achievements: [],
        challenges: []
      }
    });
  }
}

interface InterModuleActivity {
  type: 'quiz' | 'challenge';
  title: string;
  description: string;
  points: number;
  content: any;
}

export async function buildCourse(topic: string, level: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Create an engaging learning path for ${topic} at ${level} level with interactive elements between modules.
    Return ONLY a JSON object with this structure:
    {
      "id": string,
      "modules": [{
        "id": string,
        "title": string,
        "description": string,
        "order": number,
        "activities": [{
          "id": string,
          "type": "concept" | "interactive" | "exercise" | "project",
          "title": string,
          "content": {
            "explanation": string,
            "examples": string[],
            "interactiveElements": [...]
          }
        }],
        "completionActivity": {
          "type": "quiz" | "challenge",
          "title": string,
          "description": string,
          "points": number,
          "content": {
            "questions": [{
              "question": string,
              "options": string[],
              "correctAnswer": number
            }]
          }
        }
      }],
      "gamification": {
        "achievements": [],
        "levelSystem": {
          "levels": [{
            "level": number,
            "xpRequired": number,
            "rewards": string[]
          }]
        }
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanJson = cleanJsonResponse(response.text());
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Course generation failed:', error);
    // Return default course structure on error
    return {
      modules: [{
        id: "default",
        title: "Getting Started",
        description: "Introduction to " + topic,
        duration: "30 minutes",
        activities: [],
        milestones: []
      }],
      gamification: {
        achievements: [],
        challenges: []
      }
    };
  }
}
