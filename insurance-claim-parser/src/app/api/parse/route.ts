import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

const pdfParse = require('pdf-parse/lib/pdf-parse');
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('No valid file received:', file);
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
    }

    const fileName = file.name || 'unknown';
    const fileType = file.type || 'unknown';
    console.log(`Received file: ${fileName} | Type: ${fileType}`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = '';

    if (fileType === 'application/pdf') {
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const parsed = await mammoth.extractRawText({ buffer });
      text = parsed.value;
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      try {
        text = new TextDecoder().decode(buffer);
      } catch (decodeErr) {
        console.error(`Failed to decode .txt file ${fileName}`, decodeErr);
        return NextResponse.json({ error: 'Failed to decode .txt file' }, { status: 500 });
      }
    } else {
      console.warn('⚠ Unsupported file type:', fileType);
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    console.log(`Parsed file "${fileName}" successfully. Text length: ${text.length}`);
    return NextResponse.json({ text });
  } catch (err) {
    console.error('API /parse failed:', err);
    return NextResponse.json({ error: 'Failed to parse file', details: String(err) }, { status: 500 });
  }
}
