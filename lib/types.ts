export interface NCLEXQuestion {
  questionNumber: number;
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