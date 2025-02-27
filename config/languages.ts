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
    defaultCode: `// Welcome to JavaScript playground
console.log("Hello, World!");

function greet(name) {
  return \`Hello, \${name}!\`;
}

const result = greet("Space Cadet");
console.log(result);`,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: 'ts',
    defaultCode: `// Welcome to TypeScript playground
interface Spacecraft {
  name: string;
  speed: number;
}

function launch(spacecraft: Spacecraft): void {
  console.log(\`\${spacecraft.name} launching at \${spacecraft.speed} km/s!\`);
}

const rocket: Spacecraft = {
  name: "Cosmos Explorer",
  speed: 25000
};

launch(rocket);`,
  },
  {
    id: 'html',
    name: 'HTML',
    extension: 'html',
    defaultCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Web Page</title>
  <style>
    body { font-family: sans-serif; }
    .title { color: purple; }
  </style>
</head>
<body>
  <h1 class="title">Hello, Space!</h1>
  <p>Welcome to my web page</p>
  <script>
    console.log("Page loaded!");
  </script>
</body>
</html>`,
  },
];
