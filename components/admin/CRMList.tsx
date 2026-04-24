"use client";

import { useState } from "react";
import { 
    Users, Search, UserPlus, Mail, Phone, 
    MoreHorizontal, Filter, MessageSquare, Tag,
    MapPin, Smartphone, Pencil, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { deleteCustomer } from "@/app/admin/crm/actions";
import { cn } from "@/lib/utils";
import { CustomerModal } from "./CustomerModal";

interface Props {
    initialCustomers: any[];
}

export function CRMList({ initialCustomers }: Props) {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any>(null);

    const filtered = initialCustomers.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
        (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
    );

    const handleEdit = (customer: any) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-4 bg-background border rounded-2xl p-2 px-4 shadow-sm flex-grow w-full sm:w-auto">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input 
                        placeholder="Search by name, phone, email or address..." 
                        className="flex-grow bg-transparent border-none outline-none text-sm h-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="hidden sm:block h-4 w-px bg-border mx-2" />
                    <Button variant="ghost" size="sm" className="hidden sm:flex rounded-xl text-xs gap-2">
                        <Filter className="w-3 h-3" />
                        Filters
                    </Button>
                </div>
                <Button onClick={handleAdd} className="bg-business-primary hover:bg-business-primary/90 rounded-2xl gap-2 w-full sm:w-auto py-6 sm:py-2 shadow-lg shadow-business-primary/20">
                    <UserPlus className="w-4 h-4" />
                    Add Customer
                </Button>
            </div>

            {/* Table */}
            <div className="bg-background border rounded-3xl overflow-hidden shadow-sm">
                {filtered.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p>{search ? "No results matching your search." : "No customers found."}</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-muted/30 border-b text-left text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider">Contact & Address</th>
                                <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider hidden md:table-cell text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider hidden lg:table-cell">Added On</th>
                                <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map((customer: any) => (
                                <tr key={customer.id} className="group hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-business-primary/10 flex items-center justify-center text-business-primary font-bold shadow-inner">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-zinc-900 leading-none">{customer.name}</p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {customer.tags?.map((tag: string) => (
                                                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-600 font-bold uppercase tracking-tight">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                                            <Phone className="w-3 h-3 text-zinc-400" />
                                            {customer.phone}
                                            {customer.whatsapp && customer.whatsapp !== customer.phone && (
                                                <Badge variant="ghost" className="h-4 px-1.5 text-[9px] bg-green-500/5 text-green-600 border border-green-500/10">
                                                    <Smartphone className="w-2.5 h-2.5 mr-1" /> WA: {customer.whatsapp}
                                                </Badge>
                                            )}
                                        </div>
                                        {customer.email && (
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Mail className="w-3 h-3 text-zinc-400" />
                                                {customer.email}
                                            </div>
                                        )}
                                        {customer.address && (
                                            <div className="flex items-center gap-2 text-xs text-zinc-500 italic max-w-[200px] truncate">
                                                <MapPin className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                                                {customer.address}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell text-center">
                                        <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-[9px] font-black uppercase tracking-widest px-2">
                                            Active
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-zinc-500 hidden lg:table-cell">
                                        {new Date(customer.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                size="icon" 
                                                variant="outline" 
                                                onClick={() => handleEdit(customer)}
                                                className="h-8 w-8 rounded-xl border-zinc-200 hover:border-business-primary hover:text-business-primary"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <form action={deleteCustomer}>
                                                <input type="hidden" name="id" value={customer.id} />
                                                <Button type="submit" size="icon" variant="outline" className="h-8 w-8 rounded-xl border-zinc-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <CustomerModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                customer={editingCustomer} 
            />
        </div>
    );
}
