import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// get User by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id, 10);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "Invalid User ID" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                active: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to fetch user:", error);

        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id, 10);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "Invalid User ID" },
                { status: 400 }
            );
        }

        const { name, email, password, active } = await request.json();

        // Validasi field wajib
        if (!name || !email || typeof active !== "boolean") {
            return NextResponse.json(
                { error: "Name, email, and Active are required" },
                { status: 400 }
            );
        }

        // Data yang selalu di-update
        const data: {
            name: string;
            email: string;
            active: boolean;
            password?: string;
        } = {
            name,
            email,
            active,
        };

        // Password hanya di-update jika diisi
        if (password && password.trim() !== "") {
            data.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                active: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Failed to update user:", error);

        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}