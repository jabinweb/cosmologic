'use client';

import Editor from '@monaco-editor/react';
import { useState } from 'react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange?: (value: string) => void;
  theme?: 'light' | 'dark';
}

export function CodeEditor({
  initialCode = '',
  language = 'javascript',
  onChange,
  theme = 'light'
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  const handleEditorChange = (value: string = '') => {
    setCode(value);
    onChange?.(value);
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage={language}
        defaultValue={initialCode}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
