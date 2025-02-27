import { Playground } from '@/components/playground/playground';
import { FullscreenProvider } from '@/context/fullscreen-context';

const INITIAL_CODE = `// Welcome to the CodeSpace playground!
// Try writing some code here

function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Space Cadet");
`;

export default function PlaygroundPage() {
  return (
    <FullscreenProvider>
      <div className="container mx-auto py-6 space-y-4">
        <h1 className="text-2xl font-bold">Interactive Playground</h1>
        <div className="relative mb-8">
          <Playground initialCode={INITIAL_CODE} />
        </div>
      </div>
    </FullscreenProvider>
  );
}
