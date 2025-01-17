import { parseWithLLM } from '@/lib/openaiPrompt';

// Mock OpenAI response
jest.mock('openai', () => {
  class MockOpenAI {
    chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  questions: [
                    {
                      questionStem: "Test question?",
                      answerChoices: [
                        "A. First choice",
                        "B. Second choice",
                        "C. Third choice",
                        "D. Fourth choice"
                      ],
                      correctAnswer: "B",
                      rationale: "Test rationale"
                    }
                  ]
                })
              }
            }
          ]
        })
      }
    };
  }
  return { OpenAI: MockOpenAI };
});

describe('parseWithLLM', () => {
  const mockApiKey = 'test-api-key';
  
  it('should successfully parse valid NCLEX questions', async () => {
    const testInput = `
      Test question?
      A. First choice
      B. Second choice
      C. Third choice
      D. Fourth choice
      Answer: B
      Rationale: Test rationale
    `;

    const result = await parseWithLLM(testInput, mockApiKey);

    expect(result.success).toBe(true);
    expect(result.questions).toBeDefined();
    expect(result.questions?.length).toBe(1);

    const question = result.questions?.[0];
    expect(question).toMatchObject({
      questionStem: expect.any(String),
      answerChoices: expect.arrayContaining([
        expect.stringMatching(/^[A-D]\./),
        expect.stringMatching(/^[A-D]\./)
      ]),
      correctAnswer: expect.stringMatching(/^[A-D]$/),
      rationale: expect.any(String)
    });
  });

  it('should handle empty input', async () => {
    const result = await parseWithLLM('', mockApiKey);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should validate question structure', async () => {
    // Mock invalid OpenAI response
    const { OpenAI } = require('openai');
    jest.spyOn(OpenAI.prototype.chat.completions, 'create')
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                questions: [
                  {
                    // Missing required fields
                    questionStem: "Test question?"
                  }
                ]
              })
            }
          }
        ]
      });

    const result = await parseWithLLM('test question', mockApiKey);
    expect(result.success).toBe(false);
    expect(result.error).toContain('missing required fields');
  });

  it('should handle malformed JSON response', async () => {
    // Mock invalid JSON response
    const { OpenAI } = require('openai');
    jest.spyOn(OpenAI.prototype.chat.completions, 'create')
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'invalid json'
            }
          }
        ]
      });

    const result = await parseWithLLM('test question', mockApiKey);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
}); 