import { OpenAI } from 'openai';
import { NCLEXQuestion, ParseResponse } from './types';

const SYSTEM_PROMPT = `You are an expert NCLEX question parser. Parse the provided nursing questions into a structured format.
Return a JSON object with a "questions" array containing objects with these exact fields:
{
  "questions": [
    {
      "questionStem": "The complete question text",
      "answerChoices": ["A. First choice", "B. Second choice", ...],
      "correctAnswer": "A", // Just the letter
      "rationale": "The explanation"
    },
    // ... more questions
  ]
}`;

const EXAMPLE_OUTPUT = {
  questions: [{
    questionStem: "A client in active labor is receiving oxytocin (Pitocin) for induction. The nurse notices that the fetal heart rate (FHR) has dropped to 90 beats per minute. What is the nurse's priority action?",
    answerChoices: [
      "A. Stop the oxytocin infusion immediately",
      "B. Reposition the client to her left side",
      "C. Administer oxygen at 10 L/min via face mask",
      "D. Call the healthcare provider"
    ],
    correctAnswer: "A",
    rationale: "The priority action is to stop the oxytocin infusion immediately when fetal distress is noted (FHR < 110). This action will help prevent further compromise to the fetus."
  }]
};

export async function parseWithLLM(text: string, apiKey: string): Promise<ParseResponse> {
  try {
    console.log('[PARSE-LLM] Initializing OpenAI client...');
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('[PARSE-LLM] Sending parse request to OpenAI...');
    console.log('[PARSE-LLM] Input text sample:', text.slice(0, 100) + '...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: SYSTEM_PROMPT 
        },
        {
          role: "user",
          content: `Here's an example of the exact output format I need:\n${JSON.stringify(EXAMPLE_OUTPUT, null, 2)}\n\nPlease parse these questions in the same format:\n\n${text}`
        }
      ],
      temperature: 0.1, // Low temperature for consistent formatting
      response_format: { type: "json_object" }
    });

    const result = response.choices[0]?.message?.content;
    
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    console.log('[PARSE-LLM] Raw response:', result);

    const parsed = JSON.parse(result);
    console.log('[PARSE-LLM] Parsed response structure:', Object.keys(parsed));
    
    if (!Array.isArray(parsed.questions)) {
      console.error('[PARSE-LLM] Invalid response structure. Expected "questions" array, got:', typeof parsed.questions);
      throw new Error('Response is not in the expected format - missing questions array');
    }

    // Validate each question's structure
    parsed.questions.forEach((q: any, idx: number) => {
      if (!q.questionStem || !Array.isArray(q.answerChoices) || !q.correctAnswer || !q.rationale) {
        console.error(`[PARSE-LLM] Question ${idx} is missing required fields:`, q);
        throw new Error(`Question ${idx} is missing required fields`);
      }
    });

    console.log(`[PARSE-LLM] Successfully parsed ${parsed.questions.length} questions`);
    
    return {
      success: true,
      questions: parsed.questions
    };

  } catch (error) {
    console.error('[PARSE-LLM] Error:', error);
    if (error instanceof Error) {
      console.error('[PARSE-LLM] Error details:', error.message);
      console.error('[PARSE-LLM] Error stack:', error.stack);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse questions'
    };
  }
} 