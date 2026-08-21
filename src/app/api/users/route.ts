import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// get All users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { active: true },
      select: { id: true, email: true, name: true, active: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}



// Create User
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return NextResponse.json(
        { error: "Failed to hash password" }, 
        { status: 500 }
      );
    } 

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, active: true },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}