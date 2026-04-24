import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border bg-background">
            <Skeleton className="aspect-video w-full" />
            <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-full mt-4 rounded-xl" />
            </div>
        </div>
    );
}

export function ServicesGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-3">
                    <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
                    <Skeleton className="h-5 w-96 mx-auto rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(count)].map((_, i) => (
                        <ServiceCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function GalleryGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-3">
                    <Skeleton className="h-10 w-52 mx-auto rounded-xl" />
                    <Skeleton className="h-5 w-80 mx-auto rounded-xl" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(count)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-xl" />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="rounded-2xl border overflow-hidden bg-background">
            <div className="bg-muted/50 px-6 py-4">
                <Skeleton className="h-4 w-48 rounded" />
            </div>
            <div className="divide-y">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-4 w-40 rounded" />
                            <Skeleton className="h-4 w-24 rounded hidden md:block" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AdminStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border bg-background p-6 flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-12 rounded" />
                        <Skeleton className="h-3 w-20 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
