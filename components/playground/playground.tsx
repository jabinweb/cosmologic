'use client';

import { useState, useEffect } from 'react';
import Split from 'react-split';
import { CodeEditor } from './code-editor';
import { OutputPanel } from './output-panel';
import { Preview } from './preview';
import { PlaygroundControls } from './playground-controls';
import { PLAYGROUND_CONFIG } from '@/config/playground-config';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/context/fullscreen-context';

interface PlaygroundProps {
  initialLanguage?: string;
  height?: string;
  showFullscreen?: boolean;
}

export function Playground({ 
  initialLanguage = 'javascript',
  height = 'h-[calc(100vh-12rem)]',
  showFullscreen = true
}: PlaygroundProps) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);

  useEffect(() => {
    // Set initial language and code
    const langConfig = PLAYGROUND_CONFIG.languages[initialLanguage];
    if (langConfig) {
      setCurrentLanguage(langConfig.id);
      setCode(langConfig.defaultCode);
    }
  }, [initialLanguage]); // Changed dependency

  useEffect(() => {
    // Reset any overflow styles when component unmounts or fullscreen changes
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const runCode = async () => {
    setOutput([]);
    setError(undefined);

    // Skip execution for HTML
    if (currentLanguage === 'html') {
      return;
    }

    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const consoleLogs: string[] = [];
      
      if (iframe.contentWindow) {
        (iframe.contentWindow as Window & typeof globalThis).console.log = (...args: any[]) => {
          consoleLogs.push(args.join(' '));
        };

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = `
          try {
            ${code}
          } catch (error) {
            console.error(error.message);
          }
        `;

        iframe.contentWindow.document.body.appendChild(script);
        setOutput(consoleLogs);
      }

      document.body.removeChild(iframe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const resetCode = () => {
    const langConfig = PLAYGROUND_CONFIG.languages[currentLanguage];
    setCode(langConfig ? langConfig.defaultCode : '');
    setOutput([]);
    setError(undefined);
  };

  const handleLanguageChange = (newLanguage: string) => {
    const langConfig = PLAYGROUND_CONFIG.languages[newLanguage];
    if (langConfig) {
      setCurrentLanguage(newLanguage);
      setCode(langConfig.defaultCode);
      setOutput([]);
      setError(undefined);
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : height + ' relative'} min-h-[700px]`}>
      <div className="flex justify-between items-center gap-2 p-2 border-b">
        <PlaygroundControls
          language={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onExampleChange={setCode}
          onRun={runCode}
          onReset={resetCode}
        />
        {showFullscreen && (
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Main content */}
      <div className="h-[calc(100%-3rem)] border">
        <Split
          className="split horizontal"
          sizes={[45, 55]}
          minSize={300}
          maxSize={800}
          gutterSize={8}
          direction="horizontal"
        >
          <div className="h-full">
            <CodeEditor
              initialCode={code}
              language={currentLanguage}
              onChange={setCode}
            />
          </div>
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
                <Preview 
                  code={code} 
                  language={currentLanguage} // Make sure this prop is being passed
                />
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
