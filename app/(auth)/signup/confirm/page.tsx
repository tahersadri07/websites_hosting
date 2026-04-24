import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function ConfirmPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="bg-background/80 backdrop-blur-xl border rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-business-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MailCheck className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-3">Check your email</h1>
                <p className="text-muted-foreground text-sm mb-6">
                    We sent a confirmation link to your email address. Click the link to activate your account, then come back to sign in.
                </p>
                <Link
                    href="/login"
                    className="inline-block w-full h-12 rounded-xl font-bold text-base bg-business-primary text-white hover:bg-business-primary/90 shadow-lg flex items-center justify-center transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
}
