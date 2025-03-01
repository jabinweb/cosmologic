export interface Language {
  id: string;
  name: string;
  extension: string;
  defaultCode: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    defaultCode: `// JavaScript Example
function createGreeting(name) {
  const greeting = document.createElement('h1');
  greeting.textContent = \`Hello, \${name}!\`;
  document.getElementById('app').appendChild(greeting);

  const btn = document.createElement('button');
  btn.textContent = 'Click me';
  btn.onclick = () => alert('Button clicked!');
  document.getElementById('app').appendChild(btn);
}

createGreeting('Space Cadet');`,
  },
  {
    id: 'html',
    name: 'HTML',
    extension: 'html',
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: system-ui, sans-serif; }
    .container { 
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #f0f0f0;
      border-radius: 8px;
    }
    .title { color: #6366f1; }
    button { 
      padding: 0.5rem 1rem;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
    }
    button:hover {
      background: #4338ca;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="title">Hello, Space!</h1>
    <p>This is a sample HTML page.</p>
    <button onclick="alert('Clicked!')">Click me</button>
  </div>
</body>
</html>`,
  },
];
