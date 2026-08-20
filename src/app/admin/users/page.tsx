"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { UserProfile } from "@/interface/user";
import { Capitalize } from "@/lib/format-helper";
import { ApiUrlUser } from "@/schema/user";
import { use, useEffect, useState } from "react";

export default function UsersAdminPage() {
    const [users, setUser] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchUsers(){
            setLoading(true);
            try{
                const resp = await fetch(ApiUrlUser);
                const datas = await resp.json();
                setUser(datas);
            } catch (error){
                toast.add({
                    title: "Error fetch users data",
                    type: "error",
                    description: `${error}`
                });
            }
            setLoading(false);
        }

        fetchUsers();
    }, []);

    if (loading) return "<h1>Loading .... </h1>";
    return (
        <Card className="min-h-screen bg-gray-50">
            <CardHeader>
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                </div>
            </nav>
            </CardHeader>
            <CardContent className="max-w-7xl mx-auto px-4 py-8">
                <Table className="w-full border-collapse border border-gray-300">
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{ Capitalize(user.name)}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            user.active
                                                ? "bg-green-500 text-white hover:bg-green-500"
                                                : "bg-red-500 text-white hover:bg-red-500"
                                        }
                                    >
                                        {user.active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant={"default"}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
