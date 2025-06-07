import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Delete the token cookie
    cookies().delete("token");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sign-out error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
