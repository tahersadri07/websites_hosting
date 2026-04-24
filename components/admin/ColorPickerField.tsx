"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ColorPickerField({
    id,
    name,
    label,
    defaultValue,
}: {
    id: string;
    name: string;
    label: string;
    defaultValue: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-2">
            <Label htmlFor={`${id}_text`}>{label}</Label>
            <div className="flex items-center space-x-3">
                <input
                    type="color"
                    defaultValue={defaultValue}
                    className="w-12 h-11 rounded-xl border cursor-pointer p-1 flex-shrink-0"
                    onChange={(e) => {
                        if (inputRef.current) inputRef.current.value = e.target.value;
                    }}
                />
                <Input
                    ref={inputRef}
                    id={`${id}_text`}
                    name={name}
                    defaultValue={defaultValue}
                    className="h-11 rounded-xl font-mono"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
}
