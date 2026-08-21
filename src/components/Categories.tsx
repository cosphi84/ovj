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
import { toast } from "./ui/toast";

interface CategoryProps {
    value: number;
    onChange: (value: number) => void;
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
                toast.add({
                    title: "Ups, error",
                    type: "error",
                    description: `Error on category loading: ${error}`
                })
            }finally{
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    
    return (
        <Select
            onValueChange={(val) => onChange(val ? Number(val) : 0)}
            defaultValue={value}
            items={categories.map((category) => ({
                value: String(category.id),
                label: category.name,
            }))}>
            <SelectTrigger>
                <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {loading ? (
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