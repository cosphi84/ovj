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

const CATEGORY_OPTIONS = [
    { value: 1, label: "Over Job to TC" },
    { value: 2, label: "Request Job to TC" },
];

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
            } 
            setLoading(false);
        }
        fetchCategories();
        console.log("Categories fetched:", categories);
    }, [categories]);
    
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
                    {CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}