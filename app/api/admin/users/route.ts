import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        id,
        name,
        email,
        email_verified,
        created_at
      FROM customers
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.error("Users API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load users.",
      },
      { status: 500 }
    );
  }
}