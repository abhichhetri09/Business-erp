import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    console.log("Received sign-up request");
    const body = await request.json();
    console.log("Request body:", { ...body, password: "[REDACTED]" });

    // Validate request body
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      console.log("Validation error:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    console.log("Checking for existing user with email:", email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await hash(password, 12);

    // Create user
    console.log("Creating new user...");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "EMPLOYEE", // Added role field
      },
    });
    console.log("User created successfully:", {
      id: user.id,
      email: user.email,
    });

    // Return success without sensitive data
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
