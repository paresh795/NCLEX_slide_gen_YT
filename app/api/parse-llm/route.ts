import { NextResponse } from 'next/server';
import { parseWithLLM } from '@/lib/openaiPrompt';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      console.log('[API] Error: No text provided');
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('[API] Error: OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('[API] Processing request with text length:', text.length);
    const result = await parseWithLLM(text, apiKey);

    if (!result.success) {
      console.log('[API] Parse failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log('[API] Successfully parsed', result.questions?.length, 'questions');
    return NextResponse.json(result);

  } catch (error) {
    console.error('[API] Unexpected error:', error);
    if (error instanceof Error) {
      console.error('[API] Error details:', error.message);
      console.error('[API] Stack trace:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to parse questions' },
      { status: 500 }
    );
  }
} 