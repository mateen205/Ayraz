import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [products]: any = await pool.query(`
      SELECT *
      FROM products
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

export async function POST(request: Request) {
  try {

    const body = await request.json();

    // Basic validation

    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        {
          message: "Product name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (Number(body.price) <= 0) {
      return NextResponse.json(
        {
          message: "Price must be greater than 0",
        },
        {
          status: 400,
        }
      );
    }

    const onSale =
      Number(body.sale_price) > 0 ? 1 : 0;

    const active =
      body.active ? 1 : 0;

    await pool.query(
      `
      INSERT INTO products
      (
        id,
        name,
        price,
        sale_price,
        on_sale,
        image1,
        image2,
        image3,
        description,
        stock,
        active
      )
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        body.id,
        body.name,
        body.price,
        body.sale_price || null,
        onSale,
        body.image1,
        body.image2,
        body.image3,
        body.description,
        body.stock,
        active,
      ]
    );

    return NextResponse.json({
      success: true,
    });

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