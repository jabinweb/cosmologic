import { createElement } from 'react';
import { Image } from "@/components/ui/image";

export function parseContent(htmlContent: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const elements: JSX.Element[] = [];
  let key = 0;

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      
      if (element.tagName === 'P') {
        const img = element.querySelector('img');
        if (img) {
          elements.push(
            <Image
              key={key++}
              src={img.src}
              alt={img.alt || 'Forum image'}
              className="rounded-lg my-4 max-h-[500px] object-contain"
              width={800}
              height={500}
            />
          );
        } else {
          elements.push(
            createElement('p', { key: key++, className: 'mb-4' }, element.textContent)
          );
        }
      } else {
        elements.push(
          createElement(element.tagName.toLowerCase(), {
            key: key++,
            className: 'mb-4',
            dangerouslySetInnerHTML: { __html: element.innerHTML }
          })
        );
      }
    }
  });

  return elements;
}
