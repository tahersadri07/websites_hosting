import { ServicesGridSkeleton } from "@/components/ui/skeletons";

export default function HomeLoading() {
    return (
        <>
            {/* Hero skeleton */}
            <div className="min-h-[90vh] flex items-center justify-center">
                <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
                    <div className="h-20 w-3/4 bg-muted rounded-2xl animate-pulse mx-auto" />
                    <div className="h-6 w-1/2 bg-muted rounded-xl animate-pulse mx-auto" />
                    <div className="flex gap-4 justify-center">
                        <div className="h-14 w-48 bg-muted rounded-full animate-pulse" />
                        <div className="h-14 w-36 bg-muted rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
            <ServicesGridSkeleton count={3} />
        </>
    );
}
