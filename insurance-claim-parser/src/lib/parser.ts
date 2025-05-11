import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';


export async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Node.js Buffer

  if (file.type === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }


  if (
    file.type ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  // Fallback for .txt and others
  return new TextDecoder().decode(arrayBuffer);
}
