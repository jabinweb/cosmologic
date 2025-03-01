import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);

interface ProjectSubmission {
  code: string;
  explanation: string;
}

interface EvaluationResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export async function evaluateProject(
  projectData: any, 
  submission: ProjectSubmission
): Promise<EvaluationResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Evaluate this project submission:
    
    Project Requirements:
    ${projectData.requirements.join('\n')}
    
    Rubric:
    ${projectData.rubric.map(r => `${r.criterion}: ${r.points} points`).join('\n')}
    
    Student Submission:
    Code:
    ${submission.code}
    
    Explanation:
    ${submission.explanation}
    
    Provide evaluation in this JSON format:
    {
      "score": number (0-100),
      "feedback": "detailed feedback string",
      "strengths": ["array of strong points"],
      "improvements": ["array of areas to improve"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const evaluation = JSON.parse(response.text());

    // Ensure the evaluation matches our expected format
    return {
      score: Math.min(100, Math.max(0, evaluation.score)), // Clamp between 0-100
      feedback: evaluation.feedback || "No feedback provided",
      strengths: evaluation.strengths || [],
      improvements: evaluation.improvements || []
    };
  } catch (error) {
    console.error('Project evaluation failed:', error);
    return {
      score: 0,
      feedback: "Evaluation failed. Please try again.",
      strengths: [],
      improvements: ["Unable to evaluate submission"]
    };
  }
}
