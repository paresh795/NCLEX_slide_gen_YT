import { NextResponse } from 'next/server';
import { parseWithLLM } from '@/lib/openaiPrompt';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const apiKey = request.headers.get('x-api-key');

    if (!text) {
      console.log('[API] Error: No text provided');
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      console.log('[API] Error: No API key provided');
      return NextResponse.json(
        { error: 'Please provide your OpenAI API key in the settings' },
        { status: 401 }
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