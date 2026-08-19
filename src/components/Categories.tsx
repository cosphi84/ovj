"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { apiUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import { Category } from "@/interface/category";

interface CategoryProps {
    value: number | null;
    onChange: (value: number | null) => void;
}

export function SelectCategory({ value, onChange }: CategoryProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true);
            try {
                const response = await fetch(apiUrl("/api/categories"));
                const data = await response.json();
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
            value={value !== null ? String(value) : undefined}
            onValueChange={(val) => onChange(val ? Number(val) : null)}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    { loading ? (
                        <SelectItem value="">Loading...</SelectItem>
                    ) : (
                        categories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                                {category.name}
                            </SelectItem>
                        ))
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}