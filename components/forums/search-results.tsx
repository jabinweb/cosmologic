import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface SearchResultsProps {
  results: {
    topics: Array<any>;
    posts: Array<any>;
  };
}

export function SearchResults({ results }: SearchResultsProps) {
  if (!results.topics.length && !results.posts.length) {
    return (
      <div className="text-center py-8">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {results.topics.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Topics</h2>
          <div className="space-y-4">
            {results.topics.map((topic) => (
              <Card key={topic.id} className="p-4">
                <Link 
                  href={`/forums/${topic.forum.slug}/${topic.id}`}
                  className="text-lg font-medium hover:underline"
                >
                  {topic.title}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">
                  in {topic.forum.name} • {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {results.posts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          <div className="space-y-4">
            {results.posts.map((post) => (
              <Card key={post.id} className="p-4">
                <Link 
                  href={`/forums/${post.topic.forum.slug}/${post.topic.id}`}
                  className="block"
                >
                  <div className="text-sm text-muted-foreground mb-2">
                    In reply to: {post.topic.title}
                  </div>
                  <p className="line-clamp-2">{post.content}</p>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
