'use client';

import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode, language]);

  const getEditorLanguage = (lang: string) => {
    switch (lang) {
      case 'html':
        return 'html';
      case 'javascript':
        return 'javascript';
      default:
        return 'javascript';
    }
  };

  const handleEditorChange = (value: string = '') => {
    setCode(value);
    onChange?.(value);
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        language={getEditorLanguage(language)}
        value={code}
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
          tabSize: 2,
        }}
      />
    </div>
  );
}
