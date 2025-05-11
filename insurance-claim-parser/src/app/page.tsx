'use client';

import { useState } from 'react';
import Dropzone from '@/components/Dropzone';
import ResultsTable from '@/components/ResultsTable';
import { extractText } from '@/lib/parser';
import { getInsuredName } from '@/lib/llm';
import { matchInsured, normalizeName, similarity } from '@/lib/match';
import { INSUREDS } from '@/lib/insureds';

export type Result = {
  fileName: string;
  extractedName: string;
  matchedId: string | null;
  confidence: number | null;
  needsManualMatch?: boolean;
};

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const extractTextViaApi = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/parse', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to parse file ${file.name}`);
    }

    const data = await res.json();
    return data.text;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const newResults: Result[] = [];

    for (const file of selectedFiles) {
      try {
        const text = await extractTextViaApi(file);
        const extracted = await getInsuredName(text);
        const match = matchInsured(extracted);

        newResults.push({
          fileName: file.name,
          extractedName: extracted,
          matchedId: match.internalId,
          confidence: Math.round(match.confidence * 100),
          needsManualMatch: match.needsManualMatch,
        });
      } catch (err) {
        console.error('Error processing file:', file.name, err);
        newResults.push({
          fileName: file.name,
          extractedName: 'Error',
          matchedId: null,
          confidence: null,
        });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  const handleManualSelect = (index: number, internalId: string) => {
    const insured = INSUREDS.find(ins => ins.internalId === internalId);
    if (!insured) return;

    const extracted = results[index].extractedName;
    const similarityScore = similarity(
      normalizeName(extracted),
      normalizeName(insured.name)
    );

    setResults(prev =>
      prev.map((res, i) =>
        i === index
          ? {
              ...res,
              matchedId: internalId,
              confidence: Math.round(similarityScore * 100),
              needsManualMatch: false,
            }
          : res
      )
    );
  };

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-xl font-semibold mb-6">Insurance Claim Parser</h1>

      <Dropzone onFilesSelected={handleFiles} />

      {selectedFiles.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      )}

      {results.length > 0 && (
        <ResultsTable results={results} onManualSelect={handleManualSelect} />
      )}
    </main>
  );
}

