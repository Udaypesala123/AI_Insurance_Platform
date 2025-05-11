export async function getInsuredName(text: string): Promise<string> {
  const res = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('LLM API Error:', error);
    throw new Error('LLM API failed');
  }

  const data = await res.json();
  return data.name;
}