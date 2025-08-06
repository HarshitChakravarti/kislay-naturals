import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Details Skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="pt-4">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
          
          <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  )
}
