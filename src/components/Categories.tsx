"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CategoryProps {
    value: number | null;
    onChange: (value: number | null) => void;
}

const CATEGORY_OPTIONS = [
    { value: 1, label: "Over Job to TC" },
    { value: 2, label: "Request Job to TC" },
];

export function Category({ value, onChange }: CategoryProps) {
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