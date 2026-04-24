"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    id: string;
    slug: string;
    title: string;
    price: number | null;
    thumbnail_url: string | null;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    wishlist: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    addToWishlist: (item: CartItem) => void;
    removeFromWishlist: (id: string) => void;
    itemCount: number;
    wishlistCount: number;
    totalPrice: number;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (open: boolean) => void;
    activeTab: "cart" | "wishlist";
    setActiveTab: (tab: "cart" | "wishlist") => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<CartItem[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"cart" | "wishlist">("cart");

    // Load from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        const savedWish = localStorage.getItem("wishlist");
        if (savedCart) try { setItems(JSON.parse(savedCart)); } catch (e) { console.error(e); }
        if (savedWish) try { setWishlist(JSON.parse(savedWish)); } catch (e) { console.error(e); }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = (newItem: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === newItem.id);
            if (existing) {
                return prev.map(i => i.id === newItem.id 
                    ? { ...i, quantity: i.quantity + 1 } 
                    : i
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(i => {
            if (i.id === id) {
                const newQty = Math.max(1, i.quantity + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }));
    };

    const clearCart = () => setItems([]);

    const addToWishlist = (newItem: CartItem) => {
        setWishlist(prev => {
            if (prev.find(i => i.id === newItem.id)) return prev;
            return [...prev, newItem];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(prev => prev.filter(i => i.id !== id));
    };

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;
    const totalPrice = items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            items, wishlist, addToCart, removeFromCart, updateQuantity, clearCart, 
            addToWishlist, removeFromWishlist,
            itemCount, wishlistCount, totalPrice,
            isDrawerOpen, setIsDrawerOpen, activeTab, setActiveTab
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
