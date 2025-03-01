import { Suspense } from 'react';
import { SearchResults } from "@/components/forums/search-results";
import { searchForums } from "@/lib/actions/forum";

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q;
  const results = await searchForums(query);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-6">
        Showing results for "{query}"
      </p>
      <Suspense fallback={<div>Searching...</div>}>
        <SearchResults results={results} />
      </Suspense>
    </div>
  );
}
