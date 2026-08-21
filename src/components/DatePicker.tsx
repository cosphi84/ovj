"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
}

export function DatePicker({
    value,
    onChange,
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger
                render={
                <Button
                    variant="outline"
                    data-empty={!value}
                    className="w-full justify-start text-left font-normal"
                />
               }>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value
                        ? value.toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        : "Pilih tanggal"}
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    );
}