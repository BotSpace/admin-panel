import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const TemplateCardSkeleton = () => {
  return (
    <Card className="flex h-full flex-col overflow-hidden bg-card">
      {/* Preview area */}
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border-b border-border/50 bg-muted">
        <Skeleton className="absolute right-3 top-3 h-5 w-12 rounded-full" />
      </div>

      <CardHeader className="pb-4">
        <CardTitle>
          <Skeleton className="h-5 w-32 rounded-md" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="mt-2 h-4 w-full rounded-md" />
          <Skeleton className="mt-1 h-4 w-3/4 rounded-md" />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <ul className="space-y-2">
          {[...Array(4)].map((_, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Skeleton className="h-3 w-24 rounded-md" />
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-3 w-10 rounded-md" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </CardFooter>
    </Card>
  );
};
