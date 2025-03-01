import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
const aiModel = 'gemini-2.0-flash';

function cleanJsonResponse(text: string): string {
  // Remove markdown formatting and get only JSON content
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return '[]';
  }
  return jsonMatch[0];
}

export async function generateLearningPath(assessmentData: any) {
  const model = genAI.getGenerativeModel({ model: aiModel });

  const prompt = `
    Based on the following student assessment data, create a personalized learning path:
    Grade Level: ${assessmentData.basicInfo.gradeLevel}
    Age: ${assessmentData.basicInfo.age}
    Learning Styles: ${assessmentData.preferences.learningStyles.join(', ')}
    Areas of Interest: ${assessmentData.goals.areasOfInterest.join(', ')}
    Immediate Goals: ${assessmentData.goals.immediateGoals.join(', ')}

    Please provide:
    1. Recommended topics sequence
    2. Estimated completion time per topic
    3. Learning milestones
    4. Practice exercises types
    5. Assessment methods
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function getPersonalizedTips(assessment: any, topic: string) {
  const model = genAI.getGenerativeModel({ model: aiModel });
  
  const prompt = `
    Given a student with:
    - Learning styles: ${assessment.preferences.learningStyles.join(', ')}
    - Study time: ${assessment.preferences.studyTime.daysPerWeek} days per week
    - Pace preference: ${assessment.preferences.pacePreference}
    
    Provide 3 personalized learning tips for studying ${topic}.
    Return only a JSON array of objects with 'id', 'content', and 'type' properties.
    Example format: [{"id":"1","content":"tip text","type":"study"}]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const cleanJson = cleanJsonResponse(response.text());
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return [
      {
        id: "default",
        content: "Focus on understanding core concepts first",
        type: "study"
      }
    ];
  }
}

export async function getAIRecommendedCourses(assessment: any) {
  const model = genAI.getGenerativeModel({ model: aiModel });
  
  const prompt = `
    Based on this student profile:
    - Grade Level: ${assessment.basicInfo.gradeLevel}
    - Learning Styles: ${assessment.preferences.learningStyles.join(', ')}
    - Areas of Interest: ${assessment.goals.areasOfInterest.join(', ')}
    - Goals: ${assessment.goals.immediateGoals.join(', ')}

    Generate 5 course recommendations in JSON format.
    Each course must have these exact properties:
    - id: string (unique number as string)
    - name: string
    - description: string
    - level: string (beginner/intermediate/advanced)
    - tags: string[] (array of strings)
    - instructor: { name: string, avatar: null }

    Example: [{
      "id": "1",
      "name": "Introduction to Physics",
      "description": "Learn basic physics concepts",
      "level": "beginner",
      "tags": ["physics", "science"],
      "instructor": { "name": "Dr. Smith", "avatar": null }
    }]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const cleanJson = cleanJsonResponse(response.text());
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Failed to generate course recommendations:', error);
    return [];
  }
}
