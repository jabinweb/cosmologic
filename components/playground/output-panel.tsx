'use client';

interface OutputPanelProps {
  output: string[];
  error?: string;
}

export function OutputPanel({ output, error }: OutputPanelProps) {
  return (
    <div className="h-full bg-gray-900 text-white p-4 rounded-lg overflow-auto">
      <div className="font-mono text-sm">
        <div className="text-gray-400 mb-2">Console Output:</div>
        {output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {error && (
          <div className="text-red-400 mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
