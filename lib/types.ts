export interface NCLEXQuestion {
  questionStem: string;
  answerChoices: string[];
  correctAnswer: string;
  rationale: string;
}

export interface ParseResponse {
  success: boolean;
  questions?: NCLEXQuestion[];
  error?: string;
} 