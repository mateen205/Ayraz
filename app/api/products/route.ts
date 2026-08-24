import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const [products]: any = await pool.query(`
      SELECT *
      FROM products
      WHERE active = 1
      ORDER BY created_at DESC
    `);

    return NextResponse.json(products);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );

  }
}