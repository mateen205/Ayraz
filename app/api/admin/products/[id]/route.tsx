import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

   const [products]: any = await pool.query(
  "SELECT * FROM products WHERE id=? AND active=1",
  [id]
);

    if (products.length === 0) {
      return NextResponse.json(
        { message: "Product not found" },
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const onSale =
      body.sale_price &&
      Number(body.sale_price) > 0
        ? 1
        : 0;

    await pool.query(
      `
      UPDATE products
      SET
        name=?,
        price=?,
        sale_price=?,
        on_sale=?,
        stock=?,
        description=?,
        active=?,
        sold_out=?,
        image1=?,
        image2=?,
        image3=?
      WHERE id=?
      `,
      [
        body.name,
        body.price,
        body.sale_price || null,
        onSale,
        body.stock,
        body.description || "",
        body.active ? 1 : 0,
        body.sold_out ? 1 : 0,
        body.image1 || "",
        body.image2 || "",
        body.image3 || "",
        id,
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const [rows]: any = await pool.query(
      "SELECT active FROM products WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    const newStatus = rows[0].active ? 0 : 1;

    await pool.query(
      "UPDATE products SET active=? WHERE id=?",
      [newStatus, id]
    );

    return NextResponse.json({
      success: true,
      active: newStatus,
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