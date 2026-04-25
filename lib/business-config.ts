export type BusinessType = "product" | "service";

export interface BusinessConfig {
    plural: string;
    singular: string;
    urlPath: string;
}

export function getBusinessConfig(type: BusinessType | string | null | undefined): BusinessConfig {
    // Default to 'product' if null/undefined or invalid
    const normalizedType = type === "service" ? "service" : "product";

    if (normalizedType === "service") {
        return {
            plural: "Services",
            singular: "Service",
            urlPath: "services",
        };
    }

    return {
        plural: "Products",
        singular: "Product",
        urlPath: "products",
    };
}
