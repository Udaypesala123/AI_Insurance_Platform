'use client';

import React from 'react';
import { INSUREDS as insureds } from '@/lib/insureds';

export type Result = {
  fileName: string;
  extractedName: string;
  matchedId: string | null;
  confidence: number | null;
  needsManualMatch?: boolean;
};

type Props = {
  results: Result[];
  onManualSelect: (index: number, internalId: string) => void;
};

export default function ResultsTable({ results, onManualSelect }: Props) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Results:</h2>
      <table className="w-full text-sm border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border-b">File name</th>
            <th className="p-2 border-b">Extracted insured</th>
            <th className="p-2 border-b">Matching internalID</th>
            <th className="p-2 border-b">Confidence</th>
            <th className="p-2 border-b">Manual Match</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx}>
              <td className="p-2 border-b">{r.fileName}</td>
              <td className="p-2 border-b">{r.extractedName}</td>
              <td className="p-2 border-b">{r.matchedId ?? 'No match'}</td>
              <td className="p-2 border-b">
                {r.confidence !== null ? (
                  <div>
                    <div className="text-sm mb-1">{r.confidence}%</div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div
                        className={`h-2 rounded ${
                          r.confidence >= 80
                            ? 'bg-green-500'
                            : r.confidence >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${r.confidence}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td className="p-2 border-b">
                {r.confidence !== null && r.confidence >= 80 ? (
                  <span className="text-gray-500 italic">Auto-matched</span>
                ) : (
                  <select
                    value={r.matchedId ?? ''}
                    onChange={e => onManualSelect(idx, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="" disabled>Select match</option>
                    {insureds.map(ins => (
                      <option key={ins.internalId} value={ins.internalId}>
                        {ins.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
