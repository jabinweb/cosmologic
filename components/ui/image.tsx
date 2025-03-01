'use client';

import NextImage from 'next/image';
import { useState } from 'react';
import { Skeleton } from './skeleton';

interface ImageProps extends React.ComponentProps<typeof NextImage> {
  fallback?: string;
}

export function Image({ className, fallback, alt, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <Skeleton className={className} />
      )}
      <NextImage
        className={className}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        style={{ display: isLoading ? 'none' : 'block' }}
        {...props}
      />
    </>
  );
}
