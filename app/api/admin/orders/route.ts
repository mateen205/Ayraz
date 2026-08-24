import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [orders]: any = await pool.query(`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `);

    return NextResponse.json(orders);

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