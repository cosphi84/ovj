"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CategoryItem {
    id: number;
    name: string;
}

interface CategoryProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function Category({
                             value,
                             onChange,
                             disabled = false,
                         }: CategoryProps) {
    const [categories, setCategories] = React.useState<CategoryItem[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        async function fetchCategories() {
            try {
                setLoading(true);

                const response = await fetch("/api/categories");

                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }

                const data: CategoryItem[] = await response.json();

                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return (
        <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled || loading}
        >
            <SelectTrigger>
                <SelectValue
                    placeholder={
                        loading
                            ? "Loading categories..."
                            : "Select category"
                    }
                />
            </SelectTrigger>

            <SelectContent>
                {categories.map((category) => (
                    <SelectItem
                        key={category.id}
                        value={String(category.id)}
                    >
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}