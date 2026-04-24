import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price in Indian Rupees */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Build a WhatsApp wa.me URL */
export function whatsappUrl(phone: string, message?: string): string {
  const number = phone.replace(/\D/g, "");
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Build a tel: link from a phone number */
export function telUrl(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
