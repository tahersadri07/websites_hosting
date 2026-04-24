import { AdminTableSkeleton } from "@/components/ui/skeletons";

export default function ServicesLoading() {
    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-32 bg-muted rounded-xl animate-pulse" />
                    <div className="h-4 w-56 bg-muted rounded-xl animate-pulse" />
                </div>
                <div className="h-9 w-32 bg-muted rounded-xl animate-pulse" />
            </div>
            <AdminTableSkeleton rows={5} />
        </div>
    );
}
