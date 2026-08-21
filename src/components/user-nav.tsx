"use client";


import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserNav = () => {
    return (
        <nav className="bg-white shadow rounded-lg">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">TC OverJob Request</h1>
                <div className="flex gap-4">
                    <Button variant="link">
                        <Link href="/request">
                            Submit Request
                        </Link>
                    </Button>
                    <Button variant="link">
                        <Link href="/admin/login">
                            Login
                        </Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default UserNav;