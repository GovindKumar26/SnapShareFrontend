import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

/**
 * PostSkeleton - Loading placeholder for PostCard
 */
export default function PostSkeleton() {
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      {/* Header skeleton */}
      <CardHeader className="flex flex-row items-center space-y-0 pb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar skeleton */}
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <div className="flex flex-col space-y-2">
            {/* Username skeleton */}
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            {/* Time skeleton */}
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardHeader>

      {/* Image skeleton */}
      <div className="w-full h-80 bg-muted animate-pulse" />

      {/* Content skeleton */}
      <CardContent className="pt-4">
        {/* Title skeleton */}
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-3" />
        {/* Caption skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>

      {/* Footer skeleton */}
      <CardFooter className="flex flex-col items-start space-y-3 pt-0">
        {/* Like count skeleton */}
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />

        {/* Action buttons skeleton */}
        <div className="flex items-center space-x-4 w-full border-t pt-3">
          <div className="h-9 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-9 flex-1 bg-muted animate-pulse rounded" />
        </div>
      </CardFooter>
    </Card>
  );
}
