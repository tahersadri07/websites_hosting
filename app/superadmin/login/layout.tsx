export default function SuperAdminLoginLayout({ children }: { children: React.ReactNode }) {
    // No auth guard, no sidebar — clean fullscreen layout for login
    return <>{children}</>;
}
