import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[420px] mb-8">
          <Skeleton className="col-span-2 row-span-2" />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <Skeleton className="sm:hidden w-full aspect-[4/3] rounded-xl mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex gap-6 py-4 border-y">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-28" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Separator />
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
