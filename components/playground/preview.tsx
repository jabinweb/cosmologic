'use client';

interface PreviewProps {
  code: string;
  language?: string;
}

export function Preview({ code, language = 'javascript' }: PreviewProps) {
  // Add debug logging
  console.log('Preview language:', language);
  console.log('Preview code:', code);

  const getPreviewContent = () => {
    const baseStyles = `
      <style>
        body { 
          font-family: system-ui, sans-serif;
          padding: 1rem;
          margin: 0;
          line-height: 1.5;
        }
        .error { 
          color: #ef4444;
          padding: 0.75rem;
          margin: 0.5rem 0;
          border: 1px solid #ef4444;
          border-radius: 0.375rem;
          background: #fee2e2;
        }
        #app {
          min-height: 100px;
        }
      </style>
    `;

    // Improved HTML handling
    if (language === 'html') {
      // If it's already a complete HTML document, use it as is
      if (code.trim().toLowerCase().startsWith('<!doctype html>')) {
        return code;
      }
      // Otherwise, wrap it with the base template
      return `
        <!DOCTYPE html>
        <html>
          <head>
            ${baseStyles}
          </head>
          <body>
            ${code}
          </body>
        </html>
      `;
    }

    // For JavaScript
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${baseStyles}
        </head>
        <body>
          <div id="app"></div>
          <script>
            window.onerror = function(msg, url, line, col, error) {
              const errorDiv = document.createElement('div');
              errorDiv.className = 'error';
              errorDiv.textContent = \`Error: \${msg}\nLine: \${line}:\${col}\`;
              document.body.appendChild(errorDiv);
              return false;
            };
            try {
              ${code}
            } catch (error) {
              const errorDiv = document.createElement('div');
              errorDiv.className = 'error';
              errorDiv.textContent = error.message;
              document.body.appendChild(errorDiv);
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border rounded-lg overflow-hidden">
      <div className="p-2 bg-gray-100 dark:bg-gray-900 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">Preview</h3>
        <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">
          {language.toUpperCase()}
        </span>
      </div>
      <iframe
        className="w-full h-[calc(100%-2.5rem)]"
        srcDoc={getPreviewContent()}
        sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
        onError={(e) => console.error('iframe error:', e)}
      />
    </div>
  );
}
