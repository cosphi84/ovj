"use client"

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { UserProfile } from "@/interface/user";
import { apiUrl } from "@/lib/api";
import { toast } from "./ui/toast";

interface UserSelectProps {
    value?: number;
    onChange: (value: number) => void;
}

export default function UsersSelect({ value, onChange}: UserSelectProps){
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try{
                const respons = await fetch(apiUrl("/api/users"));
                const users = await respons.json();
                setUsers(users);
            }catch(error)
            {
                toast.add({
                    title: "Ups, error",
                    type: "error",
                    description: `Error on users loading: ${error}`
                })
            }finally{
                setLoading(false);
            }
        }
        fetchUser()
    }, []);

    return (
        <Select
            onValueChange={(val) => onChange(val ? Number(val) : 0)}
            defaultValue={value}
            items={users.map((usr) => ({
                value: String(usr.id),
                label: usr.name,
            }))}>
            <SelectTrigger>
                <SelectValue placeholder="Select User" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {loading ? (
                        <SelectItem value="">Loading...</SelectItem>
                    ) : ( 
                        users.map((usr) => (
                            <SelectItem key={usr.id} value={String(usr.id)}>
                                {usr.name}
                            </SelectItem>
                        ))
                    )} 
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}