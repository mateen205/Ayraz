import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        id,
        name,
        min_quantity,
        discount_percent,
        active,
        applies_to_all
      FROM product_offers
      WHERE active = 1
      ORDER BY min_quantity ASC
    `);

    return NextResponse.json({
      success: true,
      offers: rows,
    });
  } catch (error) {
    console.error("Offers API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load offers.",
      },
      { status: 500 }
    );
  }
}