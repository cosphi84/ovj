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
    value: number;
    onChange: (value: number | null) => void;
}

export function Category({value, onChange}: CategoryProps) {
    /*
    const [categories, setCategories] = React.useState<CategoryItem[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        async function fetchCategories() {
            try {
                setLoading(true);

                const response = await fetch(apiUrl("/api/categories"));

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
    */
    return (
        <Select
            value={value}
            onValueChange={onChange}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select category"/>
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectItem value={1}>Over Job to TC</SelectItem>
                    <SelectItem value={2}>Request Job to TC</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}