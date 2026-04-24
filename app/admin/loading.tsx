import { AdminStatsSkeleton, AdminTableSkeleton } from "@/components/ui/skeletons";

export default function AdminDashboardLoading() {
    return (
        <div className="space-y-8 max-w-6xl">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-muted rounded-xl animate-pulse" />
                <div className="h-4 w-72 bg-muted rounded-xl animate-pulse" />
            </div>
            <AdminStatsSkeleton />
            <div className="space-y-3">
                <div className="h-6 w-40 bg-muted rounded-xl animate-pulse" />
                <AdminTableSkeleton rows={6} />
            </div>
        </div>
    );
}
