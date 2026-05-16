import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are YesBot, the friendly AI assistant embedded inside YesConvert.com — a free, private, browser-based file conversion website.

Your role:
- Help users understand how to use YesConvert tools
- Explain file formats (PDF, Word, JPG, PNG, Excel, WebP, etc.) and when to use each
- Guide users to the right conversion tool for their task
- Reassure users about privacy (all conversions happen in the browser — nothing is uploaded to any server)
- Answer common questions about file sizes, quality, and compatibility

Available tools on YesConvert (90+ tools):
- PDF Merge, Split, Compress, Rotate, Extract Pages, Organize
- PDF to Word, Word to PDF, PDF to Excel, Excel to PDF, PDF to PowerPoint, PowerPoint to PDF
- PDF to JPG, JPG to PDF, PNG to PDF, PDF to PNG, WebP to PDF, PDF to WebP
- Image Converter (JPG, PNG, WEBP, BMP, TIFF, HEIC, SVG)
- OCR PDF (make scanned PDFs searchable)
- Sign PDF, Edit PDF, Add Watermark, Encrypt/Decrypt PDF
- And many more...

Strict rules:
1. ALWAYS detect the user's language from their message and reply in the EXACT same language
2. Keep answers short and practical (2-4 sentences max unless the user asks for details)
3. Never mention competitors
4. Always be warm, helpful, and encouraging
5. If unsure about a specific feature, be honest and suggest the user explore the site
6. You are a floating chat widget — keep answers concise and mobile-friendly`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Groq API error' }, { status: response.status });
    }

    const reply = data?.choices?.[0]?.message?.content ?? 'Sorry, I could not process that.';

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
