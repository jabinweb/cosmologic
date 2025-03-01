export interface PlaygroundExample {
  name: string;
  description: string;
  code: string;
}

export interface PlaygroundLanguage {
  id: string;
  name: string;
  extension: string;
  examples: PlaygroundExample[];
  defaultCode: string;
}

export interface PlaygroundConfig {
  languages: Record<string, PlaygroundLanguage>;
}

export const PLAYGROUND_CONFIG: PlaygroundConfig = {
  languages: {
    javascript: {
      id: 'javascript',
      name: 'JavaScript',
      extension: 'js',
      defaultCode: `// Create a greeting...`, // Your default code here
      examples: [
        {
          name: 'Basic Example',
          description: 'Simple DOM manipulation',
          code: `// Create a greeting
function createGreeting(name) {
  const greeting = document.createElement('h1');
  greeting.textContent = \`Hello, \${name}!\`;
  document.getElementById('app').appendChild(greeting);

  const btn = document.createElement('button');
  btn.textContent = 'Click me';
  btn.onclick = () => alert('Button clicked!');
  document.getElementById('app').appendChild(btn);
}

createGreeting('Space Cadet');`
        },
        {
          name: 'Animation Example',
          description: 'Simple animation with JavaScript',
          code: `// Create an animated box
const box = document.createElement('div');
box.style.cssText = \`
  width: 100px;
  height: 100px;
  background: purple;
  position: relative;
  left: 0;
\`;
document.getElementById('app').appendChild(box);

let position = 0;
let direction = 1;

function animate() {
  position += direction;
  if (position > 200) direction = -1;
  if (position < 0) direction = 1;
  box.style.left = position + 'px';
  requestAnimationFrame(animate);
}

animate();`
        }
      ]
    },
    html: {
      id: 'html',
      name: 'HTML',
      extension: 'html',
      defaultCode: `<!DOCTYPE html>...`, // Your default code here
      examples: [
        {
          name: 'Basic Layout',
          description: 'Simple responsive layout',
          code: `<!DOCTYPE html>
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
    button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="title">Hello, Space!</h1>
    <p>This is a sample HTML page.</p>
    <button onclick="alert('Clicked!')">Click me</button>
  </div>
</body>
</html>`
        },
        {
          name: 'Card Component',
          description: 'Styled card component',
          code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    .card {
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      padding: 1rem;
      max-width: 300px;
      margin: 2rem auto;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .card-image {
      width: 100%;
      height: 150px;
      background: #f3f4f6;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .card-text {
      color: #4b5563;
      margin-bottom: 1rem;
    }
    .card-button {
      width: 100%;
      padding: 0.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-image"></div>
    <h2 class="card-title">Card Title</h2>
    <p class="card-text">This is a sample card component with some text content.</p>
    <button class="card-button">Learn More</button>
  </div>
</body>
</html>`
        }
      ]
    }
  }
};
