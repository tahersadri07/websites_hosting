"use client";

import { useState } from "react";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, 
    DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertCustomer } from "@/app/admin/crm/actions";
import { UserPlus, Save, X } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    customer?: any;
}

export function CustomerModal({ isOpen, onClose, customer }: Props) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        // Form action will handle the actual submission, but we can close the modal
        // since it's a server action. For better UX, we might want to use a transition.
    };

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-xl rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
                <form action={upsertCustomer} onSubmit={() => onClose()}>
                    <DialogHeader className="bg-business-primary p-8 text-white">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <UserPlus className="w-6 h-6" />
                            {customer ? "Edit Customer" : "Add New Customer"}
                        </DialogTitle>
                        <DialogDescription className="text-white/80">
                            Fill in the details below to manage your customer relationship.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto">
                        <input type="hidden" name="id" value={customer?.id || ""} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input id="name" name="name" defaultValue={customer?.name} placeholder="e.g. John Doe" required className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input id="phone" name="phone" defaultValue={customer?.phone} placeholder="e.g. +91 9876543210" required className="h-11 rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                <Input id="whatsapp" name="whatsapp" defaultValue={customer?.whatsapp || customer?.phone} placeholder="e.g. Same as phone" className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" defaultValue={customer?.email} placeholder="e.g. john@example.com" className="h-11 rounded-xl" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Physical Address</Label>
                            <Input id="address" name="address" defaultValue={customer?.address} placeholder="e.g. Flat 101, Star Heights, Mumbai" className="h-11 rounded-xl" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input id="tags" name="tags" defaultValue={customer?.tags?.join(", ")} placeholder="e.g. VIP, Loyal, In-Store" className="h-11 rounded-xl" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Private Notes</Label>
                            <Textarea id="notes" name="notes" defaultValue={customer?.notes} placeholder="Any specific preferences or history..." rows={3} className="rounded-xl resize-none" />
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-muted/30 border-t flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-business-primary hover:bg-business-primary/90 rounded-xl px-8 shadow-lg shadow-business-primary/20">
                            <Save className="w-4 h-4 mr-2" />
                            {customer ? "Update Customer" : "Save Customer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
