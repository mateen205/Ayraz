import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [products]: any = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id=?
      `,
      [id]
    );

    if (products.length === 0) {
      return NextResponse.json(
        { message: "Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products[0]);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );

  }
}