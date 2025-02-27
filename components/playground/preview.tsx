'use client';

declare global {
  interface Window {
    ts: {
      transpile: (code: string) => string;
    };
  }
}

interface PreviewProps {
  code: string;
  language?: string;
}

export function Preview({ code, language = 'javascript' }: PreviewProps) {
  const getPreviewContent = () => {
    switch (language) {
      case 'html':
        return code;
      case 'javascript':
      case 'typescript':
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: sans-serif; padding: 20px; }
              </style>
            </head>
            <body>
              <div id="app"></div>
              <script type="text/javascript">
                ${language === 'typescript' ? window.ts.transpile(code) : code}
              </script>
            </body>
          </html>
        `;
      default:
        return '<p>Preview not available for this language</p>';
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border rounded-lg overflow-hidden">
      <div className="p-2 bg-gray-100 dark:bg-gray-900 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">Preview</h3>
        <span className="text-xs text-muted-foreground">{language.toUpperCase()}</span>
      </div>
      <iframe
        className="w-full h-[calc(100%-2.5rem)]"
        srcDoc={getPreviewContent()}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
