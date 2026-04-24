"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "./actions";

// ─── Client-side validation schema — mirrors server rules ─────────────────────
const signupSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character (e.g. @, #, !)"),
        confirmPassword: z.string(),
        invite_code: z.string().min(1, "Invite code is required"),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);
    const [showCode, setShowCode]         = useState(false);
    const [isLoading, setIsLoading]       = useState(false);
    const [serverError, setServerError]   = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

    const password = watch("password", "");

    // Live password strength indicators
    const checks = [
        { label: "8+ characters",            pass: password.length >= 8 },
        { label: "Uppercase letter",          pass: /[A-Z]/.test(password) },
        { label: "Number",                    pass: /[0-9]/.test(password) },
        { label: "Special character (@#!…)", pass: /[^A-Za-z0-9]/.test(password) },
    ];

    const onSubmit = async (values: SignupValues) => {
        setIsLoading(true);
        setServerError(null);
        const fd = new FormData();
        fd.append("name",        values.name);
        fd.append("email",       values.email);
        fd.append("password",    values.password);
        fd.append("invite_code", values.invite_code);
        const result = await signup(fd);
        if (result?.error) {
            setServerError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-business-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-business-secondary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <div className="bg-background/80 backdrop-blur-xl border rounded-3xl shadow-2xl p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-business-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">Create Admin Account</h1>
                        <p className="text-muted-foreground mt-2 text-sm">
                            You need an invite code to register.
                        </p>
                    </div>

                    {/* Server error */}
                    {serverError && (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 mb-6">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="signup-name">Full Name</Label>
                            <Input id="signup-name" type="text" placeholder="e.g. Priya Sharma" className="h-12 rounded-xl" {...register("name")} />
                            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <Input id="signup-email" type="email" placeholder="owner@yourbusiness.com" className="h-12 rounded-xl" {...register("email")} />
                            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <div className="relative">
                                <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Strong password" className="h-12 rounded-xl pr-12" {...register("password")} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Live strength indicators */}
                            {password.length > 0 && (
                                <div className="grid grid-cols-2 gap-1 pt-1">
                                    {checks.map((c) => (
                                        <div key={c.label} className={`flex items-center gap-1.5 text-xs transition-colors ${c.pass ? "text-green-600" : "text-muted-foreground"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.pass ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                                            {c.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="signup-confirm">Confirm Password</Label>
                            <div className="relative">
                                <Input id="signup-confirm" type={showConfirm ? "text" : "password"} placeholder="Re-enter password" className="h-12 rounded-xl pr-12" {...register("confirmPassword")} />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Invite Code */}
                        <div className="space-y-2">
                            <Label htmlFor="signup-code" className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-business-primary" />
                                Invite Code
                            </Label>
                            <div className="relative">
                                <Input
                                    id="signup-code"
                                    type={showCode ? "text" : "password"}
                                    placeholder="Enter your invite code"
                                    className="h-12 rounded-xl pr-12 border-business-primary/30 focus:border-business-primary"
                                    {...register("invite_code")}
                                />
                                <button type="button" onClick={() => setShowCode(!showCode)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Contact your site owner to get an invite code.
                            </p>
                            {errors.invite_code && <p className="text-destructive text-xs">{errors.invite_code.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl font-bold text-base bg-business-primary hover:bg-business-primary/90 shadow-lg mt-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Admin Account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-business-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
