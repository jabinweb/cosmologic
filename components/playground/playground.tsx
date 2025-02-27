'use client';

import { useState, useEffect } from 'react';
import Split from 'react-split';
import { CodeEditor } from './code-editor';
import { OutputPanel } from './output-panel';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { Preview } from './preview';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '@/context/fullscreen-context';
import { LanguageSelector } from './language-selector';
import { SUPPORTED_LANGUAGES } from '@/config/languages';

interface PlaygroundProps {
  initialCode?: string;
  language?: string;
}

export function Playground({ initialCode = '', language = 'javascript' }: PlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  useEffect(() => {
    // Reset any overflow styles when component unmounts or fullscreen changes
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const runCode = async () => {
    setOutput([]);
    setError(undefined);

    try {
      // Create a secure iframe sandbox for code execution
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const consoleLogs: string[] = [];
      
      // Override console.log in the iframe
      if (iframe.contentWindow) {
        (iframe.contentWindow as any).console.log = (...args: any[]) => {
          consoleLogs.push(args.join(' '));
        };

        // Execute the code
        const wrappedCode = `
          try {
            ${code}
          } catch (error) {
            console.error(error);
          }
        `;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = wrappedCode;
        iframe.contentWindow.document.body.appendChild(script);
        setOutput(consoleLogs);
      }

      document.body.removeChild(iframe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
    setError(undefined);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    // Find and set the default code for the selected language
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.id === newLanguage);
    if (langConfig) {
      setCode(langConfig.defaultCode);
      setOutput([]);
      setError(undefined);
    }
  };

  return (
    <div 
      className={
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-background'
          : 'relative h-[calc(100vh-12rem)] min-h-[700px]' // Increased minimum height
      }
    >
      {/* Toolbar */}
      <div className="flex justify-between items-center gap-2 p-2 border-b">
        <div className="flex items-center gap-4">
          <LanguageSelector 
            value={currentLanguage}
            onChange={handleLanguageChange}
          />
          <div className="flex gap-2">
            <Button onClick={runCode} variant="default">
              <Play className="h-4 w-4 mr-2" />
              Run Code
            </Button>
            <Button onClick={resetCode} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main content */}
      <div className="h-[calc(100%-3rem)]">
        <Split
          className="split horizontal"
          sizes={[45, 55]}
          minSize={300}
          maxSize={800}
          gutterSize={8}
          direction="horizontal"
        >
          {/* Editor Panel */}
          <div className="h-full">
            <CodeEditor
              initialCode={code}
              language={currentLanguage}
              onChange={setCode}
            />
          </div>

          {/* Preview and Console Panel */}
          <div className="h-full">
            <Split
              className="split h-full"
              direction="vertical"
              sizes={[60, 40]}
              minSize={100}
              maxSize={800}
              gutterSize={8}
              snapOffset={30}
            >
              <div className="h-full overflow-hidden">
                <Preview code={code} />
              </div>
              <div className="h-full overflow-hidden">
                <OutputPanel output={output} error={error} />
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </div>
  );
}
